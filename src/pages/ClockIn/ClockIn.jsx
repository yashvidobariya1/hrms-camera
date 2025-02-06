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

const CheckIn = () => {
  const userId = useSelector((state) => state.userInfo.userInfo._id);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timerOn, setTimerOn] = useState(false);
  const [loading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [totalWorkingTime, setTotalWorkingTime] = useState("0h 0m 0s");
  const [location, setLocation] = useState({ lat: null, long: null });
  const [setScanResult] = useState("");
  const [isScannerVisible, setIsScannerVisible] = useState(true);

  useEffect(() => {
    console.log("ismobile==>", isMobile);
    const savedStartTime = localStorage.getItem("startTime");
    const savedElapsedTime = localStorage.getItem("elapsedTime");
    const savedTotalWorkingTime =
      Number(localStorage.getItem("totalWorkingTime")) || 0;

    if (savedStartTime) {
      const savedTime = new Date(savedStartTime);
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

    // const fetchTimesheet = async () => {
    //   const response = await GetCall(`/getOwnTimesheet`);
    //   try {
    //     if (response?.data?.status === 200) {
    //       setTimeSheetData(response?.data?.timesheet?.clockinTime);
    //       setTimerOn(response?.data?.timesheet?.isTimerOn);
    //       setTotalWorkingTime(response?.data?.timesheet?.totalHours);
    //     } else {
    //       if (response?.data?.message !== "Record is not found!") {
    //         showToast(response?.data?.message, "error");
    //       }
    //     }
    //   } catch (error) {
    //     showToast(response?.data?.message, "error");
    //   }
    // };
    // fetchTimesheet();
  }, []);

  useEffect(() => {
    if (startTime) {
      localStorage.setItem("startTime", startTime);
      localStorage.setItem("elapsedTime", elapsedTime);
      localStorage.setItem("totalWorkingTime", totalWorkingTime);
    } else {
      localStorage.removeItem("startTime");
    }
  }, [startTime, elapsedTime, totalWorkingTime]);

  useEffect(() => {
    console.log("timerOn state updated:", timerOn);
  }, [timerOn]);

  const startTimer = (start) => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start.getTime()) / 1000));
    }, 1000);
    setTimerInterval(interval);
  };

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
          // .getUserMedia({ video: true })
          .getUserMedia({ video: { facingMode: "environment" } })
          .then((stream) => {
            console.log("Camera access granted.");
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
      showToast("Unable to fetch your location. Please try again.");
      return;
    }

    // console.log("location/..", location.lat, location.long);
    // const body = {
    //   userId,
    //   location: {
    //     latitude: location.lat,
    //     longitude: location.long,
    //   },
    // };
    // const response = await PostCall(`/clockIn`, body);
    try {
      let scanResult = "";
      if (isMobile) {
        try {
          scanResult = await scanner();
          console.log("scanresult", scanResult);
        } catch (error) {
          console.error("Scanner error", error.message);
          return;
        }
      } else {
        console.log("only mobile device detected.", scanResult);
      }

      const body = {
        userId,
        location: {
          latitude: location.lat,
          longitude: location.long,
        },
        qrData: scanResult,
      };
      console.log("body", body);
      const response = await PostCall(`/clockIn`, body);
      if (response.data.status === 200) {
        const { timesheet } = response.data;
        const now = new Date();
        setStartTime(now);
        setEndTime(null);
        setElapsedTime(0);
        startTimer(now);
        setTimeSheetData(timesheet.clockinTime);
      } else {
        showToast(response.data.message, "error");
      }
    } catch (error) {
      console.error("Error during clock-in process:", error);
      showToast("Failed to clock in. Please try again.", "error");
    }
  };

  const handleClockOut = async () => {
    if (!location.lat || !location.long) {
      showToast("Unable to fetch your location. Please try again.", "error");
      return;
    }

    const body = {
      userId,
      location: {
        latitude: location.lat,
        longitude: location.long,
      },
    };
    const response = await PostCall(`/clockOut`, body);
    try {
      if (response.data.status === 200) {
        const { timesheet } = response?.data;
        clearInterval(timerInterval);
        setTimerInterval(null);
        setTimeSheetData(timesheet.clockinTime);
        setTotalWorkingTime(timesheet.totalHours);

        setStartTime(null);
        setElapsedTime(0);
        localStorage.removeItem("startTime");
        localStorage.removeItem("elapsedTime");

        showToast(response?.data?.message, "success");
      } else {
        showToast(response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error clocking out:", error);
      showToast(response?.data?.message);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#555" }}>
        {moment().format("llll")}
      </h2>

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
        <table className="location-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Working Time</th>
            </tr>
          </thead>
          <tbody>
            {timeSheetData?.map((entry, index) => (
              <tr key={index}>
                <td>{moment(entry.clockIn).format("L LTS")}</td>
                <td>
                  {entry.clockOut ? (
                    moment(entry.clockOut).format("L LTS")
                  ) : (
                    <b className="active">Active</b>
                  )}
                </td>
                <td>
                  {entry.totalTiming !== "0" ? (
                    entry.totalTiming
                  ) : (
                    <BsHourglassSplit />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-data-wrapper"></div>
      )}
    </div>
  );
};

export default CheckIn;
