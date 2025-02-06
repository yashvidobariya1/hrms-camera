import React from "react";
import "./Pagination.css";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  ShowperPage,
  OnPerPageChange,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  console.log(" paginationcurrentPage", currentPage);

  const handlePerPageChange = (e) => {
    OnPerPageChange(e);
  };
  return (
    <div className="pagination-container">
      <div className="contracts-per-page">
        <select
          value={ShowperPage}
          onChange={handlePerPageChange}
          className="Contract-select-data-input"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="Action-button"
      >
        <MdOutlineArrowBackIos />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? "active" : "pagination-number"}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="Action-button"
      >
        <MdOutlineArrowForwardIos />
      </button>
    </div>
  );
};

export default Pagination;
