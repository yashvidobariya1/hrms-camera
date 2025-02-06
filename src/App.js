// import { useState } from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import Sidebar from "./main/Sidebar";
// import Header from "./main/Header";
// import Subheader from "./main/Subheader";
// import ProtectedRoute from "./main/ProtectedRoute";
// import ToastManager from "./main/ToastManager";
// import Unauthorized from "./pages/Helper/Unauthorized";
// import Login from "./pages/Login/Login";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import Settings from "./pages/Settings/Settings";
// import EmploymentContract from "./pages/EmploymentContract/EmploymentContract";
// import Location from "./pages/Location/Location";
// import AddLocation from "./pages/Location/AddLocation";
// import Templates from "./pages/Templates/Templates";
// import Employee from "./pages/Employee/Employee";
// import AddEmployee from "./pages/Employee/AddEmployee";
// import LoggedInUser from "./pages/LoggedInUser/LoggedInUser";
// import Leaves from "./pages/Leaves/Leaves";
// import Holidays from "./pages/Holidays/Holidays";
// import ClockIn from "./pages/ClockIn/ClockIn";
// import Job from "./pages/Job/Job";
// import Candidate from "./pages/Candidate/Candidate";
// import ChangePassword from "./pages/EmployeeProfile/ChangePassword";
// import Viewhours from "./pages/ViewHours/Viewhours";
// import TimeSheetReport from "./pages/TimeSheetReport/TimeSheetReport";
// import AbsenceReport from "./pages/AbsenceReport/AbsenceReport";
// import AddCompany from "./pages/Settings/AddCompany";
// import Profile from "./pages/EmployeeProfile/Profile";
// import GenerateQRcode from "./pages/GenerateQRcode/GenerateQRcode";
// import AddLeaves from "./pages/Leaves/AddLeaves";
// import LeavesRequest from "./pages/Leaves/LeaveRequest";
// import ShowNotification from "./pages/ShowNotification/ShowNotification";

// function MainLayout({ children }) {
//   const [isCollapsed, setIsCollapsed] = useState([]);
//   return (
//     <div className="main-content">
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       <Subheader isCollapsed={isCollapsed} />
//       <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
//         {children}
//       </div>
//     </div>
//   );
// }

// function App() {
//   return (
//     <>
//       <ToastManager />
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/unauthorized"
//             element={
//               <MainLayout>
//                 <Unauthorized />
//               </MainLayout>
//             }
//           />

//           <Route path="/" element={<Login />} />

//           <Route
//             path="/dashboard"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Dashboard />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/profile"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Profile />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/changepassword"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <ChangePassword />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/settings"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <Settings />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/settings/addCompany"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <AddCompany />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/settings/editcompany/:id"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <AddCompany />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/employmentcontract"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <EmploymentContract />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/location"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <Location />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/location/addlocation"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <AddLocation />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/location/editlocation/:id"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <AddLocation />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/templates"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin"]}>
//                   <Templates />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/employees"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <Employee />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/employees/addemployee"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <AddEmployee />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/employees/editemployee/:id"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <AddEmployee />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/loggedinuser"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <LoggedInUser />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/leaves"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Leaves />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/holidays"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Holidays />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/absencereport"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <AbsenceReport />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/clockin"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Administrator", "Manager", "Employee"]}
//                 >
//                   <ClockIn />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/viewhours"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Viewhours />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/timesheetreport"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <TimeSheetReport />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/job"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <Job />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/candidate"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Superadmin", "Administrator", "Manager"]}
//                 >
//                   <Candidate />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/settings/generateqrcode"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin", "Administrator"]}>
//                   <GenerateQRcode />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/location/generateqrcode"
//             element={
//               <MainLayout>
//                 <ProtectedRoute allowedRoles={["Superadmin", "Administrator"]}>
//                   <GenerateQRcode />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/leaves/addleaves"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={["Administrator", "Manager", "Employee"]}
//                 >
//                   <AddLeaves />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/leaves/leavesrequest"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <LeavesRequest />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/leave/editleave/:id"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <Leaves />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route
//             path="/notification"
//             element={
//               <MainLayout>
//                 <ProtectedRoute
//                   allowedRoles={[
//                     "Superadmin",
//                     "Administrator",
//                     "Manager",
//                     "Employee",
//                   ]}
//                 >
//                   <ShowNotification />
//                 </ProtectedRoute>
//               </MainLayout>
//             }
//           />

//           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;

import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Sidebar from "./main/Sidebar";
import Header from "./main/Header";
import Subheader from "./main/Subheader";
import ProtectedRoute from "./main/ProtectedRoute";
import ToastManager from "./main/ToastManager";
import Unauthorized from "./pages/Helper/Unauthorized";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import EmploymentContract from "./pages/EmploymentContract/EmploymentContract";
import Location from "./pages/Location/Location";
import AddLocation from "./pages/Location/AddLocation";
import Templates from "./pages/Templates/Templates";
import Employee from "./pages/Employee/Employee";
import AddEmployee from "./pages/Employee/AddEmployee";
import LoggedInUser from "./pages/LoggedInUser/LoggedInUser";
import Leaves from "./pages/Leaves/Leaves";
import Holidays from "./pages/Holidays/Holidays";
import ClockIn from "./pages/ClockIn/ClockIn";
import Job from "./pages/Job/Job";
import Candidate from "./pages/Candidate/Candidate";
import ChangePassword from "./pages/EmployeeProfile/ChangePassword";
import Viewhours from "./pages/ViewHours/Viewhours";
import TimeSheetReport from "./pages/TimeSheetReport/TimeSheetReport";
import AbsenceReport from "./pages/AbsenceReport/AbsenceReport";
import AddCompany from "./pages/Settings/AddCompany";
import Profile from "./pages/EmployeeProfile/Profile";
import GenerateQRcode from "./pages/GenerateQRcode/GenerateQRcode";
import AddLeaves from "./pages/Leaves/AddLeaves";
import LeavesRequest from "./pages/Leaves/LeaveRequest";
import ShowNotification from "./pages/ShowNotification/ShowNotification";
import PublicRoute from "./main/PublicRoute";
import "./App.css";

// Layout wrapper
function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="main-content">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <Subheader isCollapsed={isCollapsed} />
      <div className={`content ${isCollapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}

// Define route configurations
const protectedRoutes = [
  {
    path: "/dashboard",
    component: <Dashboard />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/profile",
    component: <Profile />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/changepassword",
    component: <ChangePassword />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  { path: "/settings", component: <Settings />, roles: ["Superadmin"] },
  {
    path: "/settings/addCompany",
    component: <AddCompany />,
    roles: ["Superadmin"],
  },
  {
    path: "/settings/editcompany/:id",
    component: <AddCompany />,
    roles: ["Superadmin"],
  },
  {
    path: "/employmentcontract",
    component: <EmploymentContract />,
    roles: ["Superadmin"],
  },
  { path: "/location", component: <Location />, roles: ["Superadmin"] },
  {
    path: "/location/addlocation",
    component: <AddLocation />,
    roles: ["Superadmin"],
  },
  {
    path: "/location/editlocation/:id",
    component: <AddLocation />,
    roles: ["Superadmin"],
  },
  { path: "/templates", component: <Templates />, roles: ["Superadmin"] },
  {
    path: "/employees",
    component: <Employee />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/employees/addemployee",
    component: <AddEmployee />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/employees/editemployee/:id",
    component: <AddEmployee />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/loggedinuser",
    component: <LoggedInUser />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/leaves",
    component: <Leaves />,
    roles: ["Administrator", "Manager", "Employee"],
  },
  {
    path: "/leavesrequests",
    component: <LeavesRequest />,
    roles: ["Superadmin"],
  },
  {
    path: "/leaves/addleaves",
    component: <AddLeaves />,
    roles: ["Administrator", "Manager", "Employee"],
  },
  {
    path: "/leaves/leavesrequest",
    component: <LeavesRequest />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/leave/editleave/:id",
    component: <AddLeaves />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/holidays",
    component: <Holidays />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/absencereport",
    component: <AbsenceReport />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/clockin",
    component: <ClockIn />,
    roles: ["Administrator", "Manager", "Employee"],
  },
  {
    path: "/viewhours",
    component: <Viewhours />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/timesheetreport",
    component: <TimeSheetReport />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
  {
    path: "/job",
    component: <Job />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/candidate",
    component: <Candidate />,
    roles: ["Superadmin", "Administrator", "Manager"],
  },
  {
    path: "/settings/generateqrcode",
    component: <GenerateQRcode />,
    roles: ["Superadmin", "Administrator"],
  },
  {
    path: "/location/generateqrcode",
    component: <GenerateQRcode />,
    roles: ["Superadmin", "Administrator"],
  },
  {
    path: "/notification",
    component: <ShowNotification />,
    roles: ["Superadmin", "Administrator", "Manager", "Employee"],
  },
];

const App = () => {
  return (
    <>
      <ToastManager />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/unauthorized"
            element={
              <MainLayout>
                <Unauthorized />
              </MainLayout>
            }
          />

          {protectedRoutes.map(({ path, component, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                <MainLayout>
                  <ProtectedRoute allowedRoles={roles}>
                    {component}
                  </ProtectedRoute>
                </MainLayout>
              }
            />
          ))}

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
