import logo from '../logo.png';
import { Fragment, useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import { createLog, signOutUser } from "../utils/firebase";
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { Outlet } from "react-router-dom";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [modalSignOut, setModalSignOut] = useState("");

  const signOutHandler = async() => {
    const log = {"action": "User signed out", "id": currentUser.uid, "type" : "account", "by" : currentUser.uid}
    await createLog(log);

    setModalSignOut("");
    signOutUser();
    navigate('/signin');
  }

  const onMenuToggle = () => {
    setToggle(!toggle);
  }

  const onNavigate = (link) => {
    navigate(link);
    setToggle(false);
  }

  if (currentUser && currentUser.data&& currentUser.data.status == "deleted") {
    signOutUser();
    navigate('/account-deleted');
  }

  return (
    <Fragment>
                  {modalSignOut !== "" ? <div className="modal custom-modal has-text-centered is-active">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <header className="modal-card-head pt-6">
                        <p className="modal-card-title">{modalSignOut}</p>
                    </header>
                    <footer className="modal-card-foot has-text-centered is-block pb-5">
                        <button className="button" onClick={() => setModalSignOut("")}>No</button>
                        <button className="button is-success" onClick={signOutHandler}>Yes</button>
                    </footer>
                </div>
            </div> : ""}

          <nav className="navbar py-2" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item" onClick={() => onNavigate("/")}>
      <img src={logo}/>
      <h1 className="is-size-5 ml-5">
        DOLE - TUPAD<br/>
        <small>Camarines Norte</small>
        </h1>
    </a>

    <a onClick={onMenuToggle} role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  {currentUser ? <div id="navbarBasicExample" className={`navbar-menu ${toggle ? "is-active" : ""}`}>
    <div className="navbar-start">

      {currentUser.data.type === "superadmin" ?
      <a className="navbar-item" onClick={() => onNavigate("/accounts")}>
        Accounts
      </a> : ""}

    {currentUser.data.type !== "beneficiary" ? 
    <Fragment>
      <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link is-arrowless">
        Beneficiaries
      </a>

      <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" onClick={() => onNavigate("/beneficiaries/for-approval")}>
            For Approval
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/beneficiaries/approved")}>
            Approved
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/beneficiaries/disapproved")}>
            Disapproved
          </a>
      </div>
    </div>

      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link is-arrowless" onClick={() => onNavigate("/")}>
          Projects
        </a>

        <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" onClick={() => onNavigate("/projects/pending")}>
            Pending
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/projects/ongoing")}>
            Ongoing
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/projects/finished")}>
            Finished
          </a>
        </div>
      </div>
    </Fragment> : 
    <Fragment>
      <div className="navbar-item has-dropdown is-hoverable">
    <a className="navbar-link is-arrowless">
      Projects
    </a>

    <div className="navbar-dropdown is-boxed">
    <a className="navbar-item" onClick={() => onNavigate("/")}>
        Available
      </a>
      <a className="navbar-item" onClick={() => onNavigate("/projects/ongoing")}>
        Ongoing
      </a>
      <a className="navbar-item" onClick={() => onNavigate("/projects/finished")}>
        Finished
      </a>
    </div>
  </div>
  <a className="navbar-item" onClick={() => onNavigate("/profile")}>
            Profile
          </a>
          </Fragment>
          }

          <a className="navbar-item" onClick={() => onNavigate("/change-password")}>
            Change Password
          </a>

          {currentUser.data.type === "superadmin" ? <a className="navbar-item" onClick={() => onNavigate("/activity-logs")}>
            Activity Logs
          </a> : ""}
    </div>

    <div className="navbar-end">
      
    <div className="navbar-item has-text-weight-medium is-size-5">{currentUser.data.type === "superadmin" ? "Super Admin" : currentUser.data.firstName + " " + currentUser.data.lastName}</div>
    <div className="navbar-item">
        <div className="buttons">
          <a className="button is-info" onClick={() => setModalSignOut("Are you sure you want to sign out?")}>
            Sign out
          </a>
        </div>
      </div>
    </div>
  </div> : <div id="navbarBasicExample" className={`navbar-menu ${toggle ? "is-active" : ""}`}>
      <div className="navbar-end">
        <a className="navbar-item" onClick={() => onNavigate("/register")}>
            Register
          </a>
      <div className="navbar-item">
        <div className="buttons">
          <a className="button is-info" onClick={() => onNavigate("/signin")}>
            Sign in
          </a>
        </div>
      </div>
      </div></div>}
</nav>
          <Outlet/>
    </Fragment>
  )
}

export default Navigation;
