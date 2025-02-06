import React, { useState, useEffect } from "react";
import CommonTable from "../../SeparateCom/CommonTable";
import Pagination from "../../main/Pagination";
import { GetCall, PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
import Loader from "../Helper/Loader";
import "./LeaveRequest.css";
import ApproveRejectConfirmation from "../../main/ApproveRejectConfirmation";

const LeavesRequest = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [leavePerPage, setleavePerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionType, setActionType] = useState("");
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const headers = [
    "Employee",
    "Leave Date",
    "Duration",
    "Leave status",
    "Leave Type",
    "Paid",
    "Action",
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    GetLeave(pageNumber);
  };

  const GetLeave = async () => {
    try {
      setLoading(true);
      const response = await GetCall("/getAllLeaveRequest");
      if (response?.data?.status === 200) {
        setLeaveList(response?.data?.allLeaveRequests);
        setTotalPages(response?.data?.totalPages);
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleLeavePerPageChange = (e) => {
    setleavePerPage(parseInt(e.target.value));
  };

  useEffect(() => {
    GetLeave();
  }, [currentPage, leavePerPage]);

  const handleAction = (id) => {
    SetShowdropwornAction((prev) => (prev === id ? null : id));
  };

  const handleApproveSubmit = async (id) => {
    const data = { approvalReason: approvalReason };
    try {
      setLoading(true);
      const response = await PostCall(`/leaveRequestApprove/${id}`, data);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        GetLeave();
        setShowConfirm(false);
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      showToast("Failed to approve leave", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async (id) => {
    if (!rejectionReason) {
      setErrors({ rejectionReason: "Rejection reason is required!" });
      return;
    }
    const data = { rejectionReason: rejectionReason };
    try {
      setLoading(true);
      const response = await PostCall(`/leaveRequestReject/${id}`, data);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        GetLeave();
        setShowConfirm(false);
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      showToast("Failed to reject leave", "error");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setEmployeeName("");
    setEmployeeId("");
    setApprovalReason("");
    setRejectionReason("");
    setShowConfirm(false);
    setActionType("");
  };

  const HandleApprove = (id, userName) => {
    setEmployeeName(userName);
    setEmployeeId(id);
    setActionType("approve");
    setShowConfirm(true);
  };

  const HandleReject = (id, userName) => {
    setEmployeeName(userName);
    setEmployeeId(id);
    setActionType("reject");
    setShowConfirm(true);
  };

  const leaveActions = [
    {
      label: "Approve",
      onClick: HandleApprove,
    },
    {
      label: "Reject",
      onClick: HandleReject,
    },
  ];

  return (
    <div className="leave-list-container">
      <div className="leavelist-flex">
        <div className="leavelist-title">
          <h2>Leave Request</h2>
        </div>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <Loader />
        </div>
      ) : (
        <>
          <CommonTable
            headers={headers}
            data={leaveList.map((leave) => ({
              _id: leave._id,
              userName: leave.userName,
              startDate: leave.startDate,
              slectionDuration: leave.slectionDuration,
              status: leave.status,
              leaveType: leave.leaveType,
              isPaidLeave: leave.isPaidLeave === true ? "Pending" : "Unpaid",
            }))}
            actions={{
              ShowdropwornAction,
              actionsList: leaveActions,
              onAction: handleAction,
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            handleAction={handleAction}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ShowperPage={leavePerPage}
            OnPerPageChange={handleLeavePerPageChange}
          />
        </>
      )}
      {showConfirm && actionType === "approve" && (
        <ApproveRejectConfirmation
          title={`Approve Leave Request`}
          message={`Are you sure you want to approve the leave request for ${employeeName}?`}
          placeholder="Enter Reason for approval"
          reason={approvalReason}
          setReason={setApprovalReason}
          onSubmit={() => handleApproveSubmit(employeeId)}
          onCancel={handleCancel}
          error={errors?.approvalReason}
        />
      )}

      {showConfirm && actionType === "reject" && (
        <ApproveRejectConfirmation
          title={`Reject Leave Request`}
          message={`Are you sure you want to reject the leave request for ${employeeName}?`}
          placeholder="Enter Reason for rejection"
          reason={rejectionReason}
          setReason={setRejectionReason}
          onSubmit={() => handleRejectSubmit(employeeId)}
          onCancel={handleCancel}
          error={errors?.rejectionReason}
        />
      )}
    </div>
  );
};

export default LeavesRequest;
