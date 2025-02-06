import React, { useState, useEffect, useRef } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import Loader from "../Helper/Loader";
import "../EmploymentContract/EmploymentContract.css";
import CommonTable from "../../SeparateCom/CommonTable";
import { GetCall, PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
import DeleteConfirmation from "../../main/DeleteConfirmation";
import Pagination from "../../main/Pagination";
import moment from "moment";
import CommonAddButton from "../../SeparateCom/CommonAddButton";

const EmploymentContract = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contractName: "",
    contract: "",
    contractFileName: "no file chosen",
  });
  const [contractList, setContractList] = useState([]);
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractsPerPage, setContractsPerPage] = useState(10);
  const [error, setError] = useState({});
  const [CompanyIddata, setCompanyIddata] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [contractName, setContractName] = useState("");
  const [contractId, setcontractId] = useState("");
  const allowedFileTypes = [
    "application/pdf",
    "text/html",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const [totalPages, setTotalPages] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!allowedFileTypes.includes(file?.type)) {
      setError((prevErrors) => ({
        ...prevErrors,
        contract: "Please upload a valid contract file (PDF, Word, or Text).",
      }));
      return;
    } else {
      setError((prevErrors) => ({
        ...prevErrors,
        contract: null,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          contractFileName: file.name,
          contract: reader.result,
        });
        console.log("contractdata", formData);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!selectedCompany) {
      newErrors.companyName = "company Name is required";
    }

    if (contractId) {
      newErrors.contractId = "Company name is required";
    }

    if (!formData.contractName) {
      newErrors.contractName = "Contract name is required";
    }

    if (!formData.contract) {
      newErrors.contract = "Contract file is required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    if (validate()) {
      const data = {
        ...formData,
        companyId: selectedCompany,
      };
      console.log("data", data);
      try {
        let response;
        if (contractId) {
          response = await PostCall(`/updateContract/${contractId}`, data);
          console.log("update", data);
        } else {
          response = await PostCall("/addContract", data);
          console.log("data add", data);
        }

        if (response?.data?.status === 200) {
          showToast(response?.data?.message, "success");
          await getContracts();
          setFormData({
            contractName: "",
            contract: "",
            contractFileName: "no file chosen",
            companyName: "",
          });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setcontractId("");
          setSelectedCompany("");
        } else {
          showToast(response?.data?.message, "error");
        }
      } catch (error) {
        showToast("An error occurred while processing your request.", "error");
      }
    }
  };

  const getContracts = async (currentPage) => {
    try {
      setLoading(true);
      const response = await GetCall(
        `/getAllContract?page=${currentPage}&limit=${contractsPerPage}`
      );

      if (response?.data?.status === 200) {
        setContractList(response?.data?.contracts);
        setTotalPages(response?.data?.totalPages);
        console.log("data pagination", response?.data);
        console.log("contractsPerPage", contractsPerPage);
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      setLoading(false);
      showToast("An error occurred while fetching contracts.", "error");
    }
  };

  const handleNameChange = (event) => {
    setFormData({
      ...formData,
      contractName: event.target.value,
    });
  };

  const getCompanyId = async () => {
    try {
      setLoading(true);
      const response = await GetCall("/getAllCompany");
      console.log("get compny details", response);
      if (response?.data?.status === 200) {
        setCompanyIddata(response?.data.companies);
        console.log("allcomany", response?.data.companies);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    console.log("companyid", event.target.value);
  };

  const tableHeaders = [
    "Contract Name",
    "File name",
    "Company",
    "Uploaded By",
    "Updated Date",
    "Action",
  ];

  const handlePageChange = (pageNumber) => {
    // console.log("Page number", pageNumber);
    setCurrentPage(pageNumber);
    getContracts(pageNumber);
  };

  const handleContractPerPageChange = (e) => {
    setContractsPerPage(e.target.value);
  };

  const HandleEditcontract = async (id) => {
    setcontractId(id);
    console.log("edit", formData);

    try {
      const response = await GetCall(`/getContract/${id}`);
      if (response?.data?.status === 200) {
        setFormData(response?.data?.contract);
        setSelectedCompany(response?.data?.contract.companyId || "");
      } else {
        showToast(
          response?.data?.message || "Failed to fetch contract",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching contract data:", error);
      showToast("Error fetching contract data.", "error");
    }
  };

  const HandleDeletecontract = (id, name) => {
    setContractName(name);
    setcontractId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
  };

  const confirmDelete = async (id) => {
    setShowConfirm(false);
    SetShowdropwornAction(null);
    try {
      const response = await PostCall(`/deleteContract/${id}`);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        setContractList(contractList.filter((contract) => contract._id !== id));
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      showToast("An error occurred while deleting the contract.", "error");
    }
  };

  const HandleDownload = async (id) => {
    try {
      const response = await GetCall(`/getContract/${id}`);
      if (response?.data?.status === 200) {
        const fileUrl = response?.data?.contract?.contract;
        const contractName =
          response?.data?.contract?.contractName || "contract";

        if (fileUrl) {
          const res = await fetch(fileUrl);
          const blob = await res.blob();
          const link = document.createElement("a");
          const objectURL = URL.createObjectURL(blob);
          link.href = objectURL;
          link.download = `${contractName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(objectURL);
        } else {
          showToast("Contract file not available.", "error");
        }
      } else {
        showToast(
          response?.data?.message || "Failed to fetch contract",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching contract data:", error);
      showToast("Error fetching contract data.", "error");
    }
  };

  const ContractActions = [
    { label: "Edit", onClick: HandleEditcontract },
    { label: "Delete", onClick: HandleDeletecontract },
    { label: "Download", onClick: HandleDownload },
  ];

  const handleAction = (id) => {
    SetShowdropwornAction((prev) => (prev === id ? null : id));
  };

  const cancelEdit = () => {
    setFormData({
      contractName: "",
      contract: "",
      contractFileName: "no file chosen",
    });
    setcontractId("");
    setSelectedCompany("");
  };

  useEffect(() => {
    getCompanyId();
  }, []);

  useEffect(() => {
    getContracts();
  }, [currentPage, contractsPerPage]);

  return (
    <div className="employee-contract-list-container">
      <div className="employee-main-container">
        <div className="employeecontract-flex">
          <div className="employeecontract-title">
            <h2>Employee Contract</h2>
          </div>

          <div className="employeecontract-title">
            <div className="Employee-flex-file-action">
              <div className="Employeecontract-input">
                <select
                  name="companyName"
                  className="employee-contract-input"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                >
                  <option value="" disabled>
                    Select Company
                  </option>
                  {CompanyIddata.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.companyDetails.businessName}
                    </option>
                  ))}
                </select>
                {error.companyName && (
                  <p className="error-text">{error.companyName}</p>
                )}
              </div>

              <div className="Employeecontract-input">
                <input
                  type="text"
                  placeholder="Enter contract Name"
                  className="employee-contract-input"
                  value={formData.contractName}
                  onChange={handleNameChange}
                />
                {error.contractName && (
                  <p className="error-text">{error.contractName}</p>
                )}
              </div>

              <div className="Employeecontract-input ">
                <div className="file-contract">
                  <label
                    htmlFor="file-upload"
                    className="contract-custom-file-upload"
                  >
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    accept={allowedFileTypes}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    multiple
                  />
                  {formData.contractFileName && (
                    <p className="contract-fileupload-name">
                      {formData.contractFileName}
                    </p>
                  )}
                </div>

                {error.contract && (
                  <p className="error-text">{error.contract}</p>
                )}
              </div>

              <div className="employeecontract-upload">
                <CommonAddButton
                  label={contractId ? "Update" : "Upload"}
                  icon={AiOutlineUpload}
                  onClick={handleUpload}
                />

                {contractId && (
                  <button onClick={cancelEdit} className="cancel-edit-btn">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <h5>
          Use following place holder in contract template: 'EMPLOYEE_NAME,
          EMPLOYER_NAME, JOB_START_DATE, JOB_TITLE, WEEKLY_HOURS, ANNUAL_SALARY,
          HOLIDAY_CALENDAR, WORK_LOCATION'
        </h5>
      </div>

      {loading ? (
        <div className="loader-wrapper">
          <Loader />
        </div>
      ) : (
        <>
          <CommonTable
            headers={tableHeaders}
            data={contractList.map((contract) => ({
              _id: contract._id,
              name: contract?.contractName,
              contractFileName: contract?.contractFileName,
              companyName: contract?.companyName,
              uploadBy: contract.uploadBy,
              createdAt: moment(contract.createdAt).format("DD/MM/YYYY"),
            }))}
            actions={{
              ShowdropwornAction,
              actionsList: ContractActions,
              onAction: handleAction,
            }}
            handleAction={handleAction}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ShowperPage={contractsPerPage}
            OnPerPageChange={handleContractPerPageChange}
          />

          {showConfirm && (
            <DeleteConfirmation
              name={contractName}
              onConfirm={() => confirmDelete(contractId)}
              onCancel={cancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EmploymentContract;
