import './App.css';
import 'bulma/css/bulma.min.css';
import { useContext } from 'react';
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

function App() {
  const { currentUser } = useContext(UserContext);
  return (
    
    <Routes>
      <Route path="/" element={<Navigation/>}>
        <Route index element={<Home/>}/>
        <Route path="/signin" element={currentUser ? "" : <SignInForm/>}/>
        <Route path="/accounts" element={currentUser ? currentUser.data.type === "superadmin" ? <Accounts/> : "" : ""}/>
        <Route path="/accounts/new" element={currentUser ? currentUser.data.type === "superadmin" ? <AccountNew/> : "" : ""}/>
        <Route path="/accounts/:id/edit" element={currentUser ? currentUser.data.type === "superadmin" ? <AccountEdit/> : "" : ""}/>
        <Route path="/projects/:id" element={currentUser ? <Project/> : ""}/>
        <Route path="/projects/:id/edit" element={currentUser ? currentUser.data.type === "superadmin" ? <ProjectEdit/> : "" : ""}/>
        <Route path="/projects/ongoing" element={currentUser ? <Projects/> : ""}/>
        <Route path="/projects/finished" element={currentUser ? <Projects/> : ""}/>
        <Route path="/projects/pending" element={currentUser ? <Projects/> : ""}/>
        <Route path="/projects/new" element={currentUser ? currentUser.data.type === "superadmin" ? <ProjectNew/> : "" : ""}/>
        <Route path="/beneficiaries" element={currentUser ? <Beneficiaries/> : ""}/>
        <Route path="/beneficiaries/:id" element={currentUser ? <Beneficiary/> : ""}/>
        <Route path="/beneficiaries/:id/edit" element={currentUser ? <BeneficiaryEdit/> : ""}/>
        <Route path="/beneficiaries/new" element={currentUser ? <BeneficiaryNew/> : ""}/>
      </Route>
        <Route path="/payroll/:id" element={currentUser ? <Payroll/> : ""}/>
    </Routes>
  );
}

export default App;
