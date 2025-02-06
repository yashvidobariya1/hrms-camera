import React from "react";
import { FaUsers } from "react-icons/fa6";
// import { RxDashboard } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { TbContract } from "react-icons/tb";
import { TiLocationOutline } from "react-icons/ti";
import { RiBookletLine } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";
import { FaUmbrellaBeach } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { TbClockHour7 } from "react-icons/tb";
import { LiaHourglassStartSolid } from "react-icons/lia";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { GrWorkshop } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";

export const SidebarData = [
  {
    section: "Company",
    items: [
      // {
      //   title: "Dashboard",
      //   icon: <RxDashboard />,
      //   link: "/dashboard",
      //   allowedRoles: ["Superadmin", "Administrator", "Manager", "Employee"],
      // },
      {
        title: "Settings",
        icon: <IoSettingsOutline />,
        link: "/settings",
        allowedRoles: ["Superadmin"],
      },
      {
        title: "Employment Contract",
        icon: <TbContract />,
        link: "/employmentcontract",
        allowedRoles: ["Superadmin"],
      },
      {
        title: "Location",
        icon: <TiLocationOutline />,
        link: "/location",
        allowedRoles: ["Superadmin"],
      },
      {
        title: "Templates",
        icon: <RiBookletLine />,
        link: "/templates",
        allowedRoles: ["Superadmin"],
      },
    ],
  },
  {
    section: "Employee",
    items: [
      {
        title: "View Employees",
        icon: <FaUserGroup />,
        link: "/employees",
        allowedRoles: ["Superadmin", "Administrator", "Manager"],
      },
      {
        title: "Logged In User",
        icon: <FaUsers />,
        link: "/loggedinuser",
        allowedRoles: ["Superadmin", "Administrator", "Manager"],
      },
    ],
  },
  {
    section: "Absence Management",
    items: [
      {
        title: "Leaves",
        icon: <HiMiniArrowLeftStartOnRectangle />,
        link: "/leaves",
        allowedRoles: ["Administrator", "Manager", "Employee"],
      },
      {
        title: "Leave Requests",
        icon: <HiMiniArrowLeftStartOnRectangle />,
        link: "/leavesrequests",
        allowedRoles: ["Superadmin"],
      },
      {
        title: "Holidays",
        icon: <FaUmbrellaBeach />,
        link: "/holidays",
        allowedRoles: ["Superadmin", "Administrator", "Manager", "Employee"],
      },
      {
        title: "Absence Report",
        icon: <TbReportSearch />,
        link: "/absencereport",
        allowedRoles: ["Superadmin", "Administrator", "Manager"],
      },
    ],
  },
  {
    section: "Timesheet Management",
    items: [
      {
        title: "Clock In",
        icon: <TbClockHour7 />,
        link: "/clockin",
        allowedRoles: ["Administrator", "Manager", "Employee"],
      },
      {
        title: "View Hours",
        icon: <LiaHourglassStartSolid />,
        link: "/viewhours",
        allowedRoles: ["Superadmin", "Administrator", "Manager", "Employee"],
      },
      {
        title: "Timesheet Report",
        icon: <BiSolidSpreadsheet />,
        link: "/timesheetreport",
        allowedRoles: ["Superadmin", "Administrator", "Manager", "Employee"],
      },
    ],
  },
  {
    section: "Recruitment Management",
    items: [
      {
        title: "Job",
        icon: <GrWorkshop />,
        link: "/job",
        allowedRoles: ["Superadmin", "Administrator", "Manager"],
      },
      {
        title: "Candidate",
        icon: <FaRegUser />,
        link: "/candidate",
        allowedRoles: ["Superadmin", "Administrator", "Manager"],
      },
    ],
  },
];
