import React from "react";
import { useLocation } from "react-router-dom";
import "./Subheader.css";
import { BsDot } from "react-icons/bs";
const Subheader = () => {
  const location = useLocation();
  const formatPageName = (pathname) => {
    const PathName = {
      dashboard: "Dashboard",
      settings: "Settings",
      addCompany: "Add Company",
      editcompany: "Update Company",
      contact: "Contact",
      employees: "Employees",
      addemployee: "Add Employee",
      addlocation: "Add Location",
      editemployee: "Update Employee",
      profile: "Profile",
      changepassword: "Change Password",
      employmentcontract: "Employment Contract",
      location: "Location",
      editlocation: "Update Location",
      templates: "Templates",
      loggedinuser: "Logged In User",
      leaves: "Leaves",
      holidays: "Holidays",
      absencereport: "Absence Report",
      clockin: "Clock In",
      viewhours: "View Hours",
      timesheetreport: "Time Sheet Report",
      job: "Job",
      candidate: "Candidate",
      generateqrcode: "Generate QRcode",
      addleaves: "Add leaves",
      leavesrequest: "Leave Request",
    };

    const idPattern = /^[a-fA-F0-9]{24}$/;

    const PathArray = pathname
      .split("/")
      .filter(Boolean)
      .filter((path) => !idPattern.test(path));

    return PathArray.map((path, index) => (
      <React.Fragment key={index}>
        <span key={index} className="breadcrumb-item">
          {PathName[path] || path}
        </span>
        {index < PathArray.length - 1 && <BsDot className="breadcrumb-icon" />}
      </React.Fragment>
    ));
  };

  const currentPageName = formatPageName(location.pathname);

  return (
    <section className="subheader-section">
      <div className="home-subheader-content">
        <p className="page-title">{currentPageName}</p>
      </div>
    </section>
  );
};

export default Subheader;
