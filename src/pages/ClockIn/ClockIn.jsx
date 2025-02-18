import React, { useState, useEffect } from "react";
import { GetCall, PostCall } from "../../ApiServices";
import { showToast } from "../../main/ToastManager";
import moment from "moment";
import "./ClockIn.css";
import { BsHourglassSplit } from "react-icons/bs";
import Loader from "../Helper/Loader";
import { Html5QrcodeScanner } from "html5-qrcode";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import JobTitleForm from "../../SeparateCom/RoleSelect";
import CommonTable from "../../SeparateCom/CommonTable";

const CheckIn = () => {
  const userId = useSelector((state) => state.userInfo.userInfo._id);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timerOn, setTimerOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [openJobTitleModal, setOpenJobTitleModal] = useState(false);
  const [JobTitledata, setJobTitledata] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [totalWorkingTime, setTotalWorkingTime] = useState("0h 0m 0s");
  const [location, setLocation] = useState({ lat: null, long: null });
  const [setScanResult] = useState("");
  const [isScannerVisible, setIsScannerVisible] = useState(true);

  // const scanner = () => {
  //   return new Promise((resolve, reject) => {
  //     setIsScannerVisible(true);

  //     setTimeout(() => {
  //       navigator.permissions
  //         .query({ name: "camera" })
  //         .then((permissionStatus) => {
  //           console.log("Camera permission state: ", permissionStatus.state);
  //           if (permissionStatus.state === "granted") {
  //             const scannerInstance = new Html5QrcodeScanner(
  //               "scanner-visible",
  //               {
  //                 qrbox: { width: 300, height: 300 },
  //                 fps: 10,
  //               }
  //             );

  //             const success = (result) => {
  //               setScanResult(result);
  //               setIsScannerVisible(false);
  //               scannerInstance.clear();
  //               resolve(result);
  //             };

  //             scannerInstance.render(success);
  //           } else {
  //             const errorMessage =
  //               "Camera permission is required to scan QR code.";
  //             showToast(errorMessage, "error");
  //             reject(new Error(errorMessage));
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("Error checking camera permission:", err);
  //           showToast(
  //             "An error occurred while checking camera permissions.",
  //             "error"
  //           );
  //           reject(err);
  //         });
  //     }, 0);
  //   });
  // };

  const scanner = () => {
    return new Promise((resolve, reject) => {
      setIsScannerVisible(true);

      setTimeout(() => {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            // console.log("Camera access granted.");
            const scannerInstance = new Html5QrcodeScanner("scanner-visible", {
              qrbox: { width: 300, height: 300 },
              fps: 10,
            });

            const success = (result) => {
              setScanResult(result);
              setIsScannerVisible(false);
              scannerInstance.clear();
              resolve(result);
            };

            scannerInstance.render(success);
          })
          .catch((err) => {
            console.error("Camera access error:", err);
            showToast("Camera access is required to scan QR codes.", "error");
            reject(err);
          });
      }, 0);
    });
  };

  const handleClockIn = async () => {
    if (!location.lat || !location.long) {
      showToast(
        "Unable to fetch your location. Please check your location settings."
      );
      return;
    }

    try {
      let scanResult = "";
      if (isMobile) {
        try {
          scanResult = await scanner();
          // console.log("scanresult", scanResult);
        } catch (error) {
          console.error("Scanner error", error.message);
          return;
        }
      } else {
        // console.log("only mobile device detected.", scanResult);
      }

      const body = {
        userId,
        location: {
          latitude: location.lat,
          longitude: location.long,
        },
        jobId: selectedJobId,
        qrData: scanResult,
      };
      // console.log("body", body);
      setLoading(true);
      const response = await PostCall(`/clockIn`, body);
      if (response?.data?.status === 200) {
        const { timesheet } = response.data;
        const now = moment();
        setStartTime(now);
        setEndTime(null);
        setElapsedTime(0);
        startTimer(now);
        setTimeSheetData(timesheet.clockinTime);
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error during clock-in process:", error);
      showToast("Failed to clock in. Please try again.", "error");
    }
  };

  const handleClockOut = async () => {
    if (!location.lat || !location.long) {
      showToast(
        "Unable to fetch your location. Please check your location settings.",
        "error"
      );
      return;
    }

    const body = {
      userId,
      location: {
        latitude: location.lat,
        longitude: location.long,
      },
      jobId: selectedJobId,
    };
    const response = await PostCall(`/clockOut`, body);
    try {
      setLoading(true);
      if (response?.data?.status === 200) {
        const { timesheet } = response?.data;
        setElapsedTime(0);
        clearInterval(timerInterval);
        setTimerInterval(null);
        setTimeSheetData(timesheet.clockinTime);
        setTotalWorkingTime(timesheet.totalHours);

        setStartTime(null);
        localStorage.removeItem("startTime");
        localStorage.removeItem("elapsedTime");

        showToast(response?.data?.message, "success");
      } else {
        showToast(response?.data?.message, "error");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error clocking out:", error);
      showToast(response?.data?.message);
    }
  };

  const handlePopupClose = () => {
    setOpenJobTitleModal(true);
  };

  const handleJobTitleSelect = (selectedTitle) => {
    // console.log("selecttitle", selectedTitle);
    setSelectedJobId(selectedTitle);
    setOpenJobTitleModal(true);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const Getjobtitledata = async () => {
    try {
      setLoading(true);
      const response = await GetCall("/getUserJobTitles");
      if (response?.data?.status === 200) {
        const { multipleJobTitle, jobTitles } = response?.data;
        setJobTitledata(jobTitles);
        if (multipleJobTitle) {
          setOpenJobTitleModal(false);
        } else {
          setSelectedJobId(jobTitles[0]?.jobId);
          setOpenJobTitleModal(true);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTimesheet = async () => {
    try {
      setLoading(true);
      const response = await PostCall(`/getOwnTodaysTimesheet`, {
        jobId: selectedJobId,
      });
      if (response?.data?.status === 200) {
        setTimeSheetData(response?.data?.timesheet?.clockinTime);
        setTimerOn(response?.data?.timesheet?.isTimerOn);
        setTotalWorkingTime(response?.data?.timesheet?.totalHours);
      } else {
        if (response?.data?.message !== "Record is not found!") {
          showToast(response?.data?.message, "error");
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching timesheet:", error);
    }
  };

  const startTimer = (start) => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start.getTime()) / 1000));
    }, 1000);
    setTimerInterval(interval);
  };

  useEffect(() => {
    // console.log("ismobile==>", isMobile);
    const savedStartTime = localStorage.getItem("startTime");
    const savedElapsedTime = localStorage.getItem("elapsedTime");
    const savedTotalWorkingTime =
      Number(localStorage.getItem("totalWorkingTime")) || 0;

    if (savedStartTime) {
      const savedTime = moment(savedStartTime);
      const currentElapsed =
        Math.floor((Date.now() - savedTime.getTime()) / 1000) +
        Number(savedElapsedTime || 0);
      setStartTime(savedTime);
      setElapsedTime(currentElapsed);
      startTimer(savedTime);
    }
    setTotalWorkingTime(savedTotalWorkingTime);

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setLocation({
    //       lat: position.coords.latitude,
    //       long: position.coords.longitude,
    //     });
    //   },
    //   (error) => {
    //     console.error("Error fetching location:");
    //     showToast(error, "error");
    //   }
    // );

    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      console.log(result);
      if (result.state === "denied") {
        showToast(
          "Please enable location permission in your browser settings.",
          "error"
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
            showToast(
              "Unable to fetch location. Please check your location settings.",
              "error"
            );
          }
        );
      }
    });
    // fetchTimesheet();
    Getjobtitledata();
  }, []);

  useEffect(() => {
    if (openJobTitleModal && selectedJobId) {
      fetchTimesheet();
    }
  }, [openJobTitleModal, selectedJobId]);

  useEffect(() => {
    if (startTime) {
      localStorage.setItem("startTime", startTime);
      localStorage.setItem("elapsedTime", elapsedTime);
      localStorage.setItem("totalWorkingTime", totalWorkingTime);
    } else {
      localStorage.removeItem("startTime");
    }
  }, [startTime, elapsedTime, totalWorkingTime]);

  // useEffect(() => {
  //   console.log("timerOn state updated:", timerOn);
  // }, [timerOn]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!openJobTitleModal && JobTitledata.length > 1 && (
        <JobTitleForm
          onClose={handlePopupClose}
          jobTitledata={JobTitledata}
          onJobTitleSelect={handleJobTitleSelect}
        />
      )}
      <h1 className="clock-in-h1">{moment().format("llll")}</h1>

      {isMobile && isScannerVisible && <div id="scanner-visible"></div>}

      <div className="button-container">
        <button onClick={handleClockIn} className="clock-in-btn">
          Clock In
        </button>
        <span className="timer">Timer: {formatTime(elapsedTime)}</span>
        <button onClick={handleClockOut} className="clock-out-btn">
          Clock Out
        </button>
      </div>
      {timeSheetData?.length > 0 ? (
        <div className="total-working-time">
          Total Working Time: <b>{totalWorkingTime}</b>
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <div className="loader-wrapper">
          <Loader />
        </div>
      ) : timeSheetData?.length > 0 ? (
        <CommonTable
          headers={["ClockIn Time", "ClockOut Time", "Working Time"]}
          data={timeSheetData.map((timeSheet) => ({
            _id: timeSheet._id,
            clockin: moment(timeSheet.clockIn).format("L LTS"),
            clockout: timeSheet.clockOut ? (
              moment(timeSheet.clockOut).format("L LTS")
            ) : (
              <b className="active">Active</b>
            ),
            workingTime:
              timeSheet.totalTiming !== "0" ? (
                timeSheet.totalTiming
              ) : (
                <BsHourglassSplit />
              ),
          }))}
        />
      ) : (
        <div className="no-data-wrapper"></div>
      )}
    </div>
  );
};

export default CheckIn;
