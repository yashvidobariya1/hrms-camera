import React, { useState } from "react";
import CommonTable from "../../SeparateCom/CommonTable";
import Pagination from "../../main/Pagination";
import "./TimeSheetReport.css";

const TimeSheetReport = () => {
  const headers = ["Clock/In", "Clock/out", "Filename"];
  const employeesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = headers.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(headers.length / employeesPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const data = [
    {
      TemplateName: "Template 1",
      Type: "Doc",
      Filename: "report_template_1.docx",
    },
    {
      TemplateName: "Template 2",
      Type: "Pdf",
      Filename: "invoice_template_2.xlsx",
    },
    {
      TemplateName: "Template 3",
      Type: "pdf",
      Filename: "letter_template_3.pdf",
    },
  ];

  const handlePerPageChange = (e) => {
    // setLocationPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div className="timesheet-list-container">
      <div className="timesheet-flex">
        <div className="timesheet-title">
          <h2>Time Sheet Report</h2>
        </div>
      </div>
      <CommonTable headers={headers} data={data} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        OnPerPageChange={handlePerPageChange}
      />
    </div>
  );
};

export default TimeSheetReport;
