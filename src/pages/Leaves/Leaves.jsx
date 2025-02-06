import React, { useState, useEffect } from "react";
import CommonTable from "../../SeparateCom/CommonTable";
import Pagination from "../../main/Pagination";
import { MdAddBusiness } from "react-icons/md";
import { useNavigate } from "react-router";
import { GetCall, PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
import Loader from "../Helper/Loader";
import "./Leaves.css";
import CommonAddButton from "../../SeparateCom/CommonAddButton";
import { useSelector } from "react-redux";
import JobTitleForm from "../../SeparateCom/RoleSelect";

const Leaves = () => {
  const [leaveList, setLeaveList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [leavePerPage, setleavePerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [openJobTitleModal, setOpenJobTitleModal] = useState(false);
  const [JobTitledata, setJobTitledata] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const userRole = useSelector((state) => state.userInfo.userInfo.role);
  const navigate = useNavigate();
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
    console.log("Page number", pageNumber);
    setCurrentPage(pageNumber);
    // GetLeave(pageNumber);
  };

  const GetLeave = async (pageNumber = currentPage) => {
    try {
      console.log("select jobtitle", selectedJobId);
      setLoading(true);
      const response = await PostCall(
        `/getAllOwnLeaves?page=${pageNumber}&limit=${leavePerPage}`,
        { jobId: selectedJobId }
      );

      if (response?.data?.status === 200) {
        setLeaveList(response?.data?.allLeaves);
        setTotalPages(response?.data?.totalPages);
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePopupClose = () => {
    setOpenJobTitleModal(true);
  };

  const handleJobTitleSelect = (selectedTitle) => {
    console.log("selecttitle", selectedTitle);
    setSelectedJobId(selectedTitle);
    setOpenJobTitleModal(true);
  };

  const HandleAddLeaveList = () => {
    navigate(`/leaves/addleaves?jobId=${selectedJobId}`);
  };

  const HandleAddLeaveReq = () => {
    navigate("/leaves/leavesrequest");
  };

  const handleAction = (id) => {
    SetShowdropwornAction((prev) => (prev === id ? null : id));
  };

  const HandleEditLeave = async (id) => {
    navigate(`/leave/editleave/${id}`);
    SetShowdropwornAction(null);
  };

  const leaveActions = [{ label: "Edit", onClick: HandleEditLeave }];

  const handleLeavePerPageChange = (e) => {
    setleavePerPage(parseInt(e.target.value));
  };

  const Getjobtitledata = async () => {
    try {
      const response = await GetCall("/getUserJobTitles");
      if (response?.data?.status === 200) {
        const { multipleJobTitle, jobTitles } = response?.data;
        console.log("response", response?.data);
        setJobTitledata(jobTitles);
        if (multipleJobTitle) {
          setOpenJobTitleModal(false);
        } else {
          setSelectedJobId(jobTitles[0]?.jobId);
          setOpenJobTitleModal(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    Getjobtitledata();
  }, []);

  useEffect(() => {
    if (openJobTitleModal && selectedJobId) {
      GetLeave();
    }
  }, [openJobTitleModal, currentPage, leavePerPage, selectedJobId]);

  return (
    <>
      {!openJobTitleModal && JobTitledata.length > 1 && (
        <JobTitleForm
          onClose={handlePopupClose}
          jobTitledata={JobTitledata}
          onJobTitleSelect={handleJobTitleSelect}
        />
      )}

      <div className="leave-list-container">
        <div className="leavelist-flex">
          <div className="leavelist-title">
            <h2>Leave</h2>
          </div>
          <div className="leavelist-action">
            {(userRole === "Employee" ||
              userRole === "Administrator" ||
              userRole === "Manager") && (
              <CommonAddButton
                label="Add Leave"
                icon={MdAddBusiness}
                onClick={HandleAddLeaveList}
              />
            )}
            {(userRole === "Superadmin" ||
              userRole === "Administrator" ||
              userRole === "Manager") && (
              <CommonAddButton
                label="Leave requests"
                icon={MdAddBusiness}
                onClick={HandleAddLeaveReq}
              />
            )}
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
      </div>
    </>
  );
};

export default Leaves;
