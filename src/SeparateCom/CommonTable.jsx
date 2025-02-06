import React, { useCallback, useState, useEffect, useRef } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import "../SeparateCom/CommonTable.css";

const CommonTable = ({ headers, data, actions, handleAction }) => {
  const showActionColumn = headers.includes("Action");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const dropdownRefs = useRef({});

  const getStatusColor = (status) => {
    if (status === "Pending") return "Pending";
    if (status === "Rejected") return "Rejected";
    if (status === "Approved") return "Approved";
    return "gray";
  };

  const getPaidLeaveColor = (isPaidLeave) => {
    return isPaidLeave === "Pending" ? "green" : "red";
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (
        isDropdownOpen !== null &&
        dropdownRefs.current[isDropdownOpen] &&
        !dropdownRefs.current[isDropdownOpen].contains(event.target)
      ) {
        setIsDropdownOpen(null);
      }
    },
    [isDropdownOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleDropdownToggle = (id) => {
    setIsDropdownOpen(isDropdownOpen === id ? null : id);
  };

  return (
    <div className="table-container">
      <table className="common-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, i) => (
            <tr key={i}>
              {Object.keys(item).map((key, index) => {
                if (
                  key !== "_id" &&
                  key !== "status" &&
                  key !== "isPaidLeave"
                ) {
                  return <td key={index}>{item[key]}</td>;
                }
                if (key === "status") {
                  return (
                    <td key={index}>
                      <span
                        className={`status-circle ${getStatusColor(item[key])}`}
                      ></span>
                      {item[key]}
                    </td>
                  );
                }
                if (key === "isPaidLeave") {
                  return (
                    <td key={index}>
                      <span
                        className={`paid-leave-status ${getPaidLeaveColor(
                          item[key]
                        )}`}
                      >
                        {item[key]}
                      </span>
                    </td>
                  );
                }
                return null;
              })}
              {showActionColumn && (
                <td>
                  <div
                    className="dropdown-container"
                    ref={(el) => (dropdownRefs.current[item?._id] = el)}
                  >
                    <SlOptionsVertical
                      onClick={() => {
                        handleAction(item?._id, item?.employeeName);
                        handleDropdownToggle(item?._id);
                      }}
                    />

                    {isDropdownOpen === item?._id && (
                      <div className="dropdown-menu">
                        {actions?.actionsList.map((action, id1) => (
                          <button
                            disabled={
                              item.status && action.label
                                ? item.status.startsWith(action.label)
                                : false
                            }
                            key={id1}
                            onClick={() =>
                              action.onClick(item?._id, item?.name)
                            }
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;
