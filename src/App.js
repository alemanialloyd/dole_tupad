import './App.css';
import 'bulma/css/bulma.min.css';
import { useContext, useState } from 'react';
import { UserContext } from './context/user-context';
import { Routes, Route } from "react-router-dom";
import Navigation from "./routes/navigation";
import SignInForm from './routes/sign-in-form';
import AccountNew from './routes/account-new';
import ProjectNew from './routes/project-new';
import BeneficiaryNew from './routes/beneficiary-new';
import Beneficiaries from './routes/beneficiaries';
import Projects from './routes/projects';
import Project from './routes/project';
import Beneficiary from './routes/beneficiary';
import BeneficiaryEdit from './routes/beneficiary-edit';
import ProjectEdit from './routes/project-edit';
import Home from './routes/home';
import Payroll from './routes/payroll';
import Accounts from './routes/accounts';
import AccountEdit from './routes/account-edit';
import AllProjects from './routes/projects-all';
import ProjectsApply from './routes/projects-apply';
import ForApproval from './routes/beneficiaries-for-approval';
import ForgotPassword from './routes/forgot-password';
import Register from './routes/register';
import ChangePassword from './routes/change-password';
import AccountDeleted from './routes/account-deleted';
import SummaryReport from './routes/summary-report';
import ActivityLogs from './routes/activity-logs';
import BeneficiariesDisapproved from './routes/beneficiaries-disapproved';

function App() {
  const { currentUser } = useContext(UserContext);
  
  return (
    <Routes>
      <Route path="/" element={<Navigation/>}>
        <Route index element={currentUser ? currentUser.data.type !== "beneficiary" ? <AllProjects/> : currentUser.data.status === "approved" ? <Beneficiary/> : <Home/> : <Home/>}/>
        <Route path="/register" element={currentUser ? "" : <Register/>}/>
        <Route path="/signin" element={currentUser ? "" : <SignInForm/>}/>
        <Route path="/change-password" element={currentUser ? <ChangePassword/> : ""}/>
        <Route path="/forgot-password" element={currentUser ? "" : <ForgotPassword/>}/>
        <Route path="/accounts" element={currentUser ? currentUser.data.type === "superadmin" ? <Accounts/> : "" : ""}/>
        <Route path="/accounts/new" element={currentUser ? currentUser.data.type === "superadmin" ? <AccountNew/> : "" : ""}/>
        <Route path="/accounts/:id/edit" element={currentUser ? currentUser.data.type === "superadmin" ? <AccountEdit/> : "" : ""}/>
        <Route path="/projects" element={currentUser && currentUser.data.type === "beneficiary" ? <ProjectsApply/> : ""}/>
        <Route path="/projects/:id" element={currentUser ? <Project/> : ""}/>
        <Route path="/projects/:id/edit" element={currentUser ? currentUser.data.type === "superadmin" ? <ProjectEdit/> : "" : ""}/>
        <Route path="/projects/ongoing" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <Projects/> : ""}/>
        <Route path="/projects/finished" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <Projects/> : ""}/>
        <Route path="/projects/pending" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <Projects/> : ""}/>
        <Route path="/projects/new" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <ProjectNew/> : ""}/>
        <Route path="/beneficiaries/approved" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <Beneficiaries/> : ""}/>
        <Route path="/beneficiaries/:id" element={currentUser ? <Beneficiary/> : ""}/>
        <Route path="/beneficiaries/:id/edit" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <BeneficiaryEdit/> : ""}/>
        <Route path="/beneficiaries/new" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <BeneficiaryNew/> : ""}/>
        <Route path="/beneficiaries/for-approval" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <ForApproval/> : ""}/>
        <Route path="/beneficiaries/disapproved" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <BeneficiariesDisapproved/> : ""}/>
        <Route path="/activity-logs" element={currentUser ? currentUser.data.type === "superadmin" ? <ActivityLogs/> : "" : ""}/>
        <Route path="/account-deleted" element={<AccountDeleted/>}/>
      </Route>
        <Route path="/payroll/:id" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <Payroll/> : ""}/>
        <Route path="/summary-report" element={currentUser ? currentUser.data.type === "beneficiary" ? "" : <SummaryReport/> : ""}/>
    </Routes>
  );
}

export default App;
