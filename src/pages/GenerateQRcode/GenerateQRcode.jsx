import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { FaDownload } from "react-icons/fa6";
import "./GenerateQRcode.css";
import { GetCall, PostCall } from "../../ApiServices";
import { useLocation } from "react-router";
import { showToast } from "../../main/ToastManager";
import Loader from "../Helper/Loader";
import CommonTable from "../../SeparateCom/CommonTable";
import Pagination from "../../main/Pagination";
import DeleteConfirmation from "../../main/DeleteConfirmation";
import moment from "moment";
import CommonAddButton from "../../SeparateCom/CommonAddButton";

const GenerateQRcode = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("companyId");
  const locationId = queryParams.get("locationId");
  const [ShowdropwornAction, SetShowdropwornAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [qrPerPage, setQrPerPage] = useState(10);
  const [QRvalue, setQRvalue] = useState("");
  const [qrName, setQrName] = useState("");
  const [qrId, setQrId] = useState("");
  const [QRcodeList, setQRCodeList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const qrCodeRef = useRef();
  const ID = locationId !== null ? locationId : companyId;

  const tableHeaders = ["Location Name", "Comapny Name", "QR Code", "Action"];

  const handleGenerateQRCode = async () => {
    setTimeout(() => {
      const qrCodeSVG = qrCodeRef.current.querySelector("svg");
      console.log("qrCodeSVG1");

      if (qrCodeSVG) {
        const svgData = new XMLSerializer().serializeToString(qrCodeSVG);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
        const svgUrl = URL.createObjectURL(svgBlob);

        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pngBase64 = canvas.toDataURL("image/png");
          const formdata = {
            qrValue: QRvalue,
            qrCode: pngBase64,
            qrType: locationId !== null ? "Location" : "Company",
          };
          try {
            setLoading(true);
            const response = await PostCall(`/generateQR/${ID}`, formdata);
            console.log("response", response);
            if (response.status === 200) {
              showToast(response?.data?.message, "success");
              GetAllQRs(ID);
            } else {
              showToast(response?.data?.message, "error");
            }
            setLoading(false);
          } catch (error) {
            console.error("Error:", error);
          }
        };

        img.src = svgUrl;
      }
    }, 0);
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
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
    GetAllQRs(ID);
  };

  const handleAction = (id) => {
    SetShowdropwornAction(ShowdropwornAction === id ? null : id);
  };

  const HandleDeleteQR = async (id, name) => {
    setQrName(name);
    setQrId(id);
    setShowConfirm(true);
  };

  const handlePageChange = (pageNumber) => {
    console.log("pagenumber", pageNumber);
    setCurrentPage(pageNumber);
    // GetAllQRs(ID);
  };

  const handlePerPageChange = (e) => {
    setQrPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleDownloadBase64 = (e, qrURL, locationName, companyName) => {
    e.preventDefault();

    const timestamp = moment().format("YYYYMMDD-HHmmss");
    const fileName = `${locationName}-${companyName}-${timestamp}.png`.replace(
      /\s+/g,
      "_"
    );

    fetch(qrURL)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading QR Code:", error));
  };

  const GetAllQRs = async (id) => {
    try {
      setLoading(true);
      const QRs = await GetCall(
        `/getAllQRCodes/${id}?page=${currentPage}&limit=${qrPerPage}`
      );
      if (QRs?.data?.status === 200) {
        setQRCodeList(QRs?.data?.QRCodes);
        setQRvalue(QRs?.data?.qrValue);
        setTotalPages(QRs?.data?.totalPages);
      } else {
        showToast(QRs?.data?.message, "error");
      }
      setLoading(false);
      // console.log("QRs", QRs);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (ID) {
      GetAllQRs(ID);
    }
  }, [ID, currentPage, qrPerPage]);

  return (
    <div className="qr-generator-container">
      <div className="qr-generator-section">
        <h2>QR Code Generator</h2>
        <div className="generate-qr-button">
          {/* <button onClick={handleGenerateQRCode}>Generate QR Code</button> */}
          <CommonAddButton
            label="Generate QR Code"
            // icon={MdAddBusiness}
            onClick={handleGenerateQRCode}
          />
        </div>
      </div>
      {loading ? (
        <div className="loader-wrapper">
          <Loader />
        </div>
      ) : (
        <>
          <div className="qr-code" ref={qrCodeRef}>
            <QRCode className="location-generated-code" value={QRvalue} />
          </div>
          <CommonTable
            headers={tableHeaders}
            data={QRcodeList.map((qr) => ({
              _id: qr?._id,
              name: qr?.locationName,
              conpanyName: qr?.companyName,
              qrcode: (
                <div
                  className="qr-container"
                  onClick={(event) =>
                    handleDownloadBase64(
                      event,
                      qr.qrURL,
                      qr?.locationName,
                      qr?.companyName
                    )
                  }
                >
                  <img src={qr.qrURL} alt="QR Code" className="qr-image" />
                  <FaDownload className="download-icon" />
                </div>
              ),
            }))}
            actions={{
              ShowdropwornAction,
              actionsList: [{ label: "Delete", onClick: HandleDeleteQR }],
              onAction: handleAction,
            }}
            handleAction={handleAction}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            ShowperPage={qrPerPage}
            OnPerPageChange={handlePerPageChange}
          />
          {showConfirm && (
            <DeleteConfirmation
              name={qrName}
              onConfirm={() => confirmDelete(qrId)}
              onCancel={cancelDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GenerateQRcode;
