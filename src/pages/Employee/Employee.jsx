import React, { useEffect, useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router";
import { GetCall, PostCall } from "../../ApiServices";
// import "./Employee.css";
import Loader from "../Helper/Loader";
import { showToast } from "../../main/ToastManager";
import Pagination from "../../main/Pagination";
import DeleteConfirmation from "../../main/DeleteConfirmation";
import "./Employee.css";
import CommonTable from "../../SeparateCom/CommonTable";
import CommonAddButton from "../../SeparateCom/CommonAddButton";
import { useSelector } from "react-redux";

const Employee = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userInfo.userInfo);
  const [loading, setLoading] = useState(false);
  const [employeesList, setEmployeeList] = useState([]);
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10);
  const [showConfirm, setShowConfirm] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const handleAction = (id) => {
    SetShowdropwornAction(ShowdropwornAction === id ? null : id);
  };

  const handlePageChange = (pageNumber) => {
    console.log("pagenumber", pageNumber);
    setCurrentPage(pageNumber);
    GetEmployees();
  };

  const HandleAddEmployeeList = () => {
    navigate("/employees/addemployee");
  };

  const HandleEditEmployee = async (id) => {
    navigate(`/employees/editemployee/${id}`);
    SetShowdropwornAction(null);
  };

  const HandleDeleteEmployee = async (id, name) => {
    setEmployeeName(name);
    console.log("employename", employeeName);
    setEmployeeId(id);
    console.log("employeeid", employeeId);
    setShowConfirm(true);
  };

  const GetEmployees = async () => {
    try {
      setLoading(true);
      const response = await GetCall(
        `/getAllUsers?page=${currentPage}&limit=${employeesPerPage}`
      );
      console.log("Response:", response);
      if (response?.data?.status === 200) {
        setEmployeeList(response?.data?.users);
        setTotalPages(response?.data?.totalPages);
      }
      setLoading(false);
      // console.log("response", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    GetEmployees();
  }, [currentPage, employeesPerPage]);

  const cancelDelete = () => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
  };

  const confirmDelete = async (id) => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
    try {
      setLoading(true);
      const response = await PostCall(`/deleteUser/${id}`);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        navigate("/employees");
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
    GetEmployees();
  };

  const headers = ["Name", "Position", "Email", "Action"];

  const handlePerPageChange = (e) => {
    setEmployeesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };
  const actions = [
    {
      label: "Edit",
      onClick: (id) => HandleEditEmployee(id),
    },
    {
      label: "Delete",
      onClick: HandleDeleteEmployee,
    }
  ];

  return (
    <div className="employee-list-container">
      <div className="employeelist-flex">
        <div className="employeelist-title">
          <h2>Employee List</h2>
        </div>
        <div className="employeelist-action">
          {user?.role != "Superadmin" && (
            <CommonAddButton
              label="Add Employee"
              onClick={HandleAddEmployeeList}
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
            // data={currentData}
            data={employeesList.map((employee) => ({
              _id: employee._id,
              name: employee?.personalDetails.firstName,
              position: employee?.jobDetails.jobTitle,
              email: employee?.personalDetails.email,
            }))}
            actions={{
              ShowdropwornAction,
              onAction: handleAction,
              actionsList: actions,
            }}
            handleAction={handleAction}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ShowperPage={employeesPerPage}
            OnPerPageChange={handlePerPageChange}
          />

          {showConfirm && (
            <DeleteConfirmation
              name={employeeName}
              onConfirm={() => confirmDelete(employeeId)}
              onCancel={cancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Employee;
