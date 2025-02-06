import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./AddLocation.css";
import { GetCall, PostCall } from "../../ApiServices";
import Loader from "../Helper/Loader";
import { showToast } from "../../main/ToastManager";

const AddLocation = () => {
  const navigate = useNavigate();
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const [formData, setFormData] = useState({
    companyName: "",
    companyId: "",
    payeReferenceNumber: "",
    locationName: "",
    address: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    ukviApproved: false,
  });

  const validate = () => {
    let newErrors = {};
    if (!formData.companyId) {
      newErrors.companyId = "Company name is required";
    }
    if (!formData.address) {
      newErrors.address = "Address is required";
    }
    if (!formData.city) {
      newErrors.city = "City is required";
    }
    if (!formData.locationName) {
      newErrors.locationName = "location Name is required";
    }
    if (!formData.postcode) {
      newErrors.postcode = "Postcode is required";
    }
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      console.log("Form Data Submitted:", formData);
      try {
        setLoading(true);
        let response;
        if (id) {
          response = await PostCall(`/updateLocation/${id}`, formData);
        } else {
          response = await PostCall("/addLocation", formData);
        }
        if (response?.data?.status === 200) {
          showToast(response?.data?.message, "success");
          navigate("/location");
        } else {
          showToast(response?.data?.message, "error");
        }
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  // const handleChange = (e) => {
  //   const { name, type, value, checked } = e.target;
  //   const newValue = type === "checkbox" ? checked : value;
  //   console.log(value);
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: newValue,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "companyName") {
      const selectedCompany = companyList.find(
        (company) => company._id === value
      );
      setFormData((prevState) => ({
        ...prevState,
        companyName: selectedCompany?.companyDetails?.businessName || "",
        companyId: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));
    }
  };

  useEffect(() => {
    const GetLocationDetails = async () => {
      try {
        setLoading(true);
        const response = await GetCall(`/getLocation/${id}`);
        if (response?.data?.status === 200) {
          setFormData(response?.data?.location);
        } else {
          showToast(response?.data?.message, "error");
        }
        setLoading(false);
        // console.log("response", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) {
      GetLocationDetails(id);
    }
  }, [id]);

  useEffect(() => {
    const GetAllCompanies = async () => {
      try {
        setLoading(true);
        const response = await GetCall(`/getAllCompany`);
        if (response?.data?.status === 200) {
          setCompanyList(response?.data?.companies);
        } else {
          showToast(response?.data?.message, "error");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    GetAllCompanies();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="Addlocation-container">
        <div className="Addlocation-step-content">
          <div className="addlocation-flex">
            <div className="addlocation-section">
              <div className="addlocation-input-container">
                <label className="label">Company Name*</label>
                <select
                  name="companyName"
                  className="addlocation-input"
                  value={formData?.companyId}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Company*
                  </option>
                  {companyList?.map((company) => {
                    return (
                      <option value={company?._id} key={company?._id}>
                        {company?.companyDetails?.businessName}
                      </option>
                    );
                  })}
                </select>
                {errors?.companyId && (
                  <p className="location-error-text">{errors?.companyId}</p>
                )}
              </div>
              <div className="addlocation-input-container">
                <label className="label">PAYE Reference Number</label>
                <input
                  type="text"
                  name="payeReferenceNumber"
                  value={formData?.payeReferenceNumber}
                  onChange={handleChange}
                  placeholder="Enter PAYE reference number"
                  className="addlocation-input"
                />
              </div>
              <div className="addlocation-input-container">
                <label className="label">Location Name*</label>
                <input
                  type="text"
                  name="locationName"
                  className="addlocation-input"
                  value={formData?.locationName}
                  onChange={handleChange}
                  placeholder="Enter location name"
                />
                {errors?.locationName && (
                  <p className="location-error-text">{errors?.locationName}</p>
                )}
              </div>
            </div>

            <div className="addlocation-section">
              <div className="addlocation-input-container">
                <label className="label">Address*</label>
                <input
                  type="text"
                  name="address"
                  className="addlocation-input"
                  value={formData?.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
                {errors?.address && (
                  <p className="location-error-text">{errors?.address}</p>
                )}
              </div>
              <div className="addlocation-input-container">
                <label className="label">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData?.addressLine2}
                  className="addlocation-input"
                  onChange={handleChange}
                  placeholder="Enter Address Line 2"
                />
              </div>
              <div className="addlocation-input-container">
                <label className="label">City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  className="addlocation-input"
                  onChange={handleChange}
                  placeholder="Enter city"
                />
                {errors?.city && (
                  <p className="location-error-text">{errors?.city}</p>
                )}
              </div>
            </div>

            <div className="addlocation-section">
              <div className="addlocation-input-container">
                <label className="label">Post Code*</label>
                <input
                  type="text"
                  name="postcode"
                  className="addlocation-input"
                  value={formData?.postcode}
                  onChange={handleChange}
                  placeholder="Enter post code"
                />
                {errors?.postcode && (
                  <p className="location-error-text">{errors?.postcode}</p>
                )}
              </div>

              <div className="addlocation-input-container">
                <label className="label">Country*</label>
                <select
                  className="addlocation-input checkbox-country"
                  name="country"
                  value={formData?.country}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select country
                  </option>
                  <option value="UK">UK</option>
                  <option value="USA">USA</option>
                </select>
                {errors?.country && (
                  <p className="location-error-text">{errors?.country}</p>
                )}
              </div>
            </div>

            <div className="location-approval-link">
              <input
                type="checkbox"
                name="ukviApproved"
                checked={formData?.ukviApproved}
                onChange={handleChange}
              />
              <label className="ukvi-label">UKVI approved?</label>
            </div>
            <div className="addlocation-note">
              <p>
                Ensure that the branch location is approved by the Home Office.
                If uncertain, please verify with the original license
                application, if any sponsored migrant employee is assigned to a
                branch not approved by Home office
              </p>
            </div>
            <button type="submit" className="save-button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddLocation;
