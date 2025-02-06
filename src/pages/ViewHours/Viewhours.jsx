import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Viewhours.css";
import { GetCall } from "../../ApiServices";

const Viewhours = () => {
  const localizer = momentLocalizer(moment);
  const [AlltimesheetList, setAlltimesheetList] = useState([]);
  const [calendarHeight, setCalendarHeight] = useState(700);
  const [view, setView] = useState("month");

  const getAlltimesheet = async () => {
    try {
      const response = await GetCall("/getOwnAllTimesheet");
      if (response?.data?.status === 200) {
        setAlltimesheetList(response?.data.timesheets);
        console.log("response", response?.data.timesheets);
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  const customEventRenderer = ({ event }) => {
    return (
      <>
        <div className="Overtime-div">
          <span>{event.title}</span>
        </div>
        {event.overtime && event.overtime !== "0h 0m 0s" && (
          <div className="overtime-label" style={{ display: "block" }}>
            {event.overtime} Hours Overtime
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    getAlltimesheet();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCalendarHeight(450);
      } else {
        setCalendarHeight(700);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="View-hour-main">
      <div className="viewhour-content">
        <div className="viewhour-section">
          <h2>Working Hours</h2>
          <div className="indicate-color">
            <p>
              <span className="color-box black-box"></span>Total Hour
            </p>
            <p>
              <span className="color-box green-box"></span>Overtime
            </p>
          </div>
        </div>
        <Calendar
          className="Calender-container"
          localizer={localizer}
          events={AlltimesheetList.flatMap((timesheet) => {
            // {
            //   console.log("event", events);
            // }
            if (view === "month") {
              return [
                {
                  title: `${timesheet.totalHours} total Hours`,
                  start: timesheet.clockinTime?.[0]?.clockIn
                    ? moment(timesheet.clockinTime[0].clockIn).toDate()
                    : null,
                  end: timesheet.clockinTime?.[0]?.clockOut
                    ? moment(timesheet.clockinTime[0].clockOut).toDate()
                    : null,
                  overtime: timesheet.overTime,
                },
              ];
            }

            if (view === "week" || view === "day") {
              return (
                timesheet.clockinTime?.map((clock) => {
                  const eventStart = clock.clockIn
                    ? moment(clock.clockIn).toDate()
                    : null;
                  const eventEnd = clock.clockOut
                    ? moment(clock.clockOut).toDate()
                    : null;

                  const clockInFormatted = clock.clockIn
                    ? moment(clock.clockIn).format("hh:mm A")
                    : "";
                  const clockOutFormatted = clock.clockOut
                    ? moment(clock.clockOut).format("hh:mm A")
                    : "";
                  const duration =
                    clock.clockIn && clock.clockOut
                      ? moment.duration(
                          moment(clock.clockOut).diff(moment(clock.clockIn))
                        )
                      : null;

                  const totalDuration = duration
                    ? `${Math.floor(
                        duration.asHours()
                      )}h ${duration.minutes()}m`
                    : "0h 0m";

                  return {
                    title: (
                      <div>
                        <div>{`${clockInFormatted} - ${clockOutFormatted}`}</div>
                        <div>{totalDuration} Total Hours</div>
                      </div>
                    ),
                    start: eventStart,
                    end: eventEnd,
                    overtime: timesheet.overTime,
                  };
                }) || []
              );
            }
          })}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          tooltipAccessor="tooltip"
          components={{
            event: customEventRenderer,
          }}
          onView={(newView) => setView(newView)}
        />
      </div>
    </div>
  );
};

export default Viewhours;
