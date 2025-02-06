import React, { useEffect, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
// import { IoMdPersonAdd } from "react-icons/io";
import { useNavigate } from "react-router";
import { GetCall, PostCall } from "../../ApiServices";
import "./Settings.css";
import Loader from "../Helper/Loader";
import { showToast } from "../../main/ToastManager";
import { MdAddBusiness } from "react-icons/md";
import DeleteConfirmation from "../../main/DeleteConfirmation";
import CommonTable from "../../SeparateCom/CommonTable";
import Pagination from "../../main/Pagination";
import CommonAddButton from "../../SeparateCom/CommonAddButton";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companiesPerPage, setCompaniesPerPage] = useState(10);

  const totalPages = Math.ceil(companyList.length / companiesPerPage);
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentData = companyList.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const handlePageChange = (pageNumber) => {
    console.log("pagenumber", pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleAction = (id) => {
    SetShowdropwornAction(ShowdropwornAction === id ? null : id);
  };

  const HandleAddCompanyList = () => {
    navigate("/settings/addCompany");
  };

  const HandleEditCompany = async (id) => {
    navigate(`/settings/editcompany/${id}`);
    SetShowdropwornAction(null);
  };

  const HandleAddEmployee = async (id) => {
    navigate(`/employees/addemployee?companyId=${id}`);
    SetShowdropwornAction(null);
  };

  const HandleDeleteCompany = async (id, name) => {
    setCompanyName(name);
    setCompanyId(id);
    setShowConfirm(true);
  };

  // const handlePerPageChange = (e) => {
  //   setCompaniesPerPage(parseInt(e.target.value, 10));
  //   setCurrentPage(1);
  // };

  const GetCompnies = async () => {
    try {
      setLoading(true);
      const response = await GetCall("/getallcompany");
      if (response?.data?.status === 200) {
        setCompanyList(response?.data?.companies);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
  };

  const confirmDelete = async (id) => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
    try {
      setLoading(true);
      const response = await PostCall(`/deleteCompany/${id}`);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        navigate("/settings");
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
    GetCompnies();
  };

  useEffect(() => {
    GetCompnies();
  }, []);

  const tableHeaders = ["Business Name", "Company Code", "City", "Action"];

  const handleSettingPerPageChange = (e) => {
    setCompaniesPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // const HandleGenerateQrCode = (id) => {
  //   navigate(`/settings/generateqrcode?companyId=${id}`);
  // };

  const settingactions = [
    { label: "Edit", onClick: HandleEditCompany },
    { label: "Delete", onClick: HandleDeleteCompany },
    { label: "Add Employee", onClick: HandleAddEmployee },
    // { label: "QRCode", onClick: HandleGenerateQrCode },
  ];

  return (
    <div className="company-list-container">
      <div className="companylist-flex">
        <div className="companylist-title">
          <h2>Company List</h2>
        </div>
        <div className="companylist-action">
          <CommonAddButton
            label="Add Company"
            icon={MdAddBusiness}
            onClick={HandleAddCompanyList}
          />
        </div>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <Loader />
        </div>
      ) : (
        <>
          <CommonTable
            headers={tableHeaders}
            data={currentData.map((company) => ({
              _id: company._id,
              name: company?.companyDetails?.businessName,
              CompanyCode: company?.companyDetails?.companyCode,
              City: company?.companyDetails?.city,
            }))}
            actions={{
              ShowdropwornAction,
              actionsList: settingactions,
              onAction: handleAction,
            }}
            // currentPage={currentPage}
            // totalPages={totalPages}
            // onPageChange={handlePageChange}
            // ShowperPage={companiesPerPage}
            // OnPerPageChange={handleSettingPerPageChange}
            handleAction={handleAction}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ShowperPage={companiesPerPage}
            OnPerPageChange={handleSettingPerPageChange}
          />
          {showConfirm && (
            <DeleteConfirmation
              name={companyName}
              onConfirm={() => confirmDelete(companyId)}
              onCancel={cancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Settings;
