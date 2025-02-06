import React, { useState, useEffect } from "react";
import Loader from "../Helper/Loader";
import { PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
import { useLocation, useNavigate } from "react-router";
import "./AddLeaves.css";

const AddLeaves = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get("jobId");
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [leaveTypes, setLeaveTypes] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  console.log(currentDate);
  const [formData, setformData] = useState({
    selectionDuration: "Full-Day",
    startDate: "",
    endDate: "",
    leaveType: "",
    reasonOfLeave: "",
    jobTitle: "Tester",
  });
  const durationType = [
    { value: "Full-Day", label: "Full Day" },
    { value: "Multiple", label: "Multiple Days" },
    { value: "First-Half", label: "First Half" },
    { value: "Second-Half", label: "Second Half" },
  ];

  const getAllowLeaveCount = async () => {
    try {
      const response = await PostCall("/getAllowLeaveCount", {
        jobId: jobId,
      });
      if (response?.data?.status === 200) {
        setLeaveTypes(response?.data.leaveCount);
        console.log("response", response?.data.leaveCount);
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  useEffect(() => {
    getAllowLeaveCount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = "Leave type is required";
    }

    if (!formData.reasonOfLeave) {
      newErrors.reasonOfLeave = "Reason of Leave is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "start Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end - start;
      const days = timeDiff / (1000 * 3600 * 24) + 1;
      setCalculatedDays(days);
    }
  }, [formData.startDate, formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const { selectionDuration, startDate, endDate, leaveType, reasonOfLeave } =
      formData;

    let leaveDays = 0;
    let newformdata = {};

    if (leaveType === "Sick" && leaveTypes.Sick < calculatedDays) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        leaveType: `Your leave is only ${leaveTypes.Sick} days available for Sick leave.`,
      }));
      return;
    }

    if (leaveType === "Causal" && leaveTypes.Causal < calculatedDays) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        leaveType: `Your leave is only ${leaveTypes.Causal} days available for Causal leave.`,
      }));
      return;
    }

    if (selectionDuration === "Multiple" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      leaveDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
      console.log("leave day", leaveDays);

      newformdata = {
        leaveType,
        startDate,
        endDate,
        jobTitle: "Tester",
        jobId,
        reasonOfLeave,
        selectionDuration: "Multiple",
        leaveDays: leaveDays.toString(),
      };
    } else if (
      selectionDuration === "Full-Day" ||
      selectionDuration === "First-Half" ||
      selectionDuration === "Second-Half"
    ) {
      leaveDays = selectionDuration === "Full-Day" ? 1 : 0.5;
      setCalculatedDays(leaveDays);

      newformdata = {
        leaveType,
        selectionDuration,
        startDate,
        leaveDays: leaveDays,
        reasonOfLeave,
        jobId,
      };
    }

    console.log("submit data", newformdata);

    try {
      setLoading(true);
      let response;
      response = await PostCall("/leaveRequest", newformdata);
      if (response?.data?.status === 200) {
        showToast(response?.data?.message, "success");
        navigate("/leaves");
      } else {
        showToast(response?.data?.message, "error-text");
      }
      setLoading(false);
    } catch (error) {
      console.log("error-text", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="Addleave-container">
      <div className="Addleave-step-content">
        <form onSubmit={handleSubmit} className="addleave-flex">
          {/* <div> */}
          <div className="addleave-input-container date-group">
            <label className="label">Leave Type*</label>
            <select
              className="addleave-input"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Leave Type
              </option>
              {Object.keys(leaveTypes).map((leaveType) => (
                <option key={leaveType} value={leaveType}>
                  {leaveType} ({leaveTypes[leaveType]})
                </option>
              ))}
            </select>
            {errors.leaveType && (
              <div className="error-text">{errors.leaveType}</div>
            )}
          </div>

          <div className="addleave-input-container">
            <label className="label">Select Duration*</label>
            <div className="addleave-radio-flex">
              {durationType.map((option) => (
                <div className="pension-contract" key={option.value}>
                  <input
                    type="radio"
                    name="selectionDuration"
                    value={option.value}
                    checked={formData.selectionDuration === option.value}
                    onChange={handleChange}
                  />
                  <label>{option.label}</label>
                </div>
              ))}
            </div>
            {errors.selectionDuration && (
              <div className="error-text">{errors.selectionDuration}</div>
            )}
          </div>
          {/* </div> */}

          <div className="addleave-input-container">
            {formData.selectionDuration === "Multiple" ? (
              <div className="date-input-flex">
                <div className="date-group">
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    className="addleave-input"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={currentDate}
                  />
                  {errors.startDate && (
                    <div className="error-text">{errors.startDate}</div>
                  )}
                </div>
                <div className="date-group">
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    className="addleave-input"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={currentDate}
                  />
                </div>
              </div>
            ) : (
              <div className="date-group">
                <label className="label">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="addleave-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={currentDate}
                />
                {errors.startDate && (
                  <div className="error-text">{errors.startDate}</div>
                )}
              </div>
            )}
            {calculatedDays > 0 && (
              <div className="addleave-input-container ">
                <div className="calculated-days">
                  {calculatedDays} day{calculatedDays > 1 ? "s" : ""} Selected
                </div>
              </div>
            )}
          </div>

          <div className="addleave-input-container">
            <label className="label">Leave Of Absence*</label>
            <textarea
              type="text"
              rows="4"
              cols="2"
              name="reasonOfLeave"
              className="addleave-input-flex"
              placeholder="Enter reason of leave"
              value={formData.reasonOfLeave}
              onChange={handleChange}
            />
            {errors.reasonOfLeave && (
              <div className="error-text">{errors.reasonOfLeave}</div>
            )}
          </div>

          <button type="submit" className="leave-save-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeaves;
