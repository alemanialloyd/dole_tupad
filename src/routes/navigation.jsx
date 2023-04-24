import logo from '../logo.png';
import { Fragment, useContext, useState } from "react";
import { UserContext } from "../context/user-context";
import { signOutUser } from "../utils/firebase";
import {useNavigate} from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { Outlet } from "react-router-dom";

const Navigation = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [toggle, setToggle] = useState(false);

  const signOutHandler = () => {
    signOutUser();
    navigate('/');
  }

  const onMenuToggle = () => {
    setToggle(!toggle);
  }

  const onNavigate = (link) => {
    navigate(link);
    setToggle(false);
  }

  return (
    <Fragment>
          <nav className="navbar py-2" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item" onClick={() => onNavigate("/")}>
      <img src={logo}/>
      <h1 className="is-size-5 ml-5">
        DOLE - TUPAD Program Camarines Norte
        </h1>
    </a>

    <a onClick={onMenuToggle} role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  {currentUser ? <div id="navbarBasicExample" className={`navbar-menu ${toggle ? "is-active" : ""}`}>
    <div className="navbar-end">
    <a className="navbar-item">
      </a>

      {currentUser.data.type === "superadmin" ?
      <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link is-arrowless">
        Accounts
      </a>

      <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" onClick={() => onNavigate("/accounts")}>
            View Accounts
          </a>
          <hr className="navbar-divider"/>
        <a className="navbar-item" onClick={() => onNavigate("/accounts/new")}>
          New Account
        </a>
      </div>
    </div> : ""}

    <div className="navbar-item has-dropdown is-hoverable">
      <a className="navbar-link is-arrowless">
        Beneficiaries
      </a>

      <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" onClick={() => onNavigate("/beneficiaries")}>
            View Beneficiaries
          </a>
          <hr className="navbar-divider"/>
        <a className="navbar-item" onClick={() => onNavigate("/beneficiaries/new")}>
          New Beneficiary
        </a>
      </div>
    </div>

      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link is-arrowless">
          Projects
        </a>

        <div className="navbar-dropdown is-boxed">
          <a className="navbar-item" onClick={() => onNavigate("/projects/ongoing")}>
            Ongoing
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/projects/finished")}>
            Finished
          </a>
          <a className="navbar-item" onClick={() => onNavigate("/projects/pending")}>
            Pending
          </a>
          
          {currentUser.data.type === "superadmin" ? <Fragment>
          <hr className="navbar-divider"/>
          <a className="navbar-item" onClick={() => onNavigate("/projects/new")}>
            New Project
          </a>
          </Fragment> : ""}
        </div>
      </div>

      <div className="navbar-item">
        <div className="buttons">
          <a className="button is-info" onClick={signOutHandler}>
            Sign out
          </a>
        </div>
      </div>
    </div>
  </div> : <div id="navbarBasicExample" className={`navbar-menu ${toggle ? "is-active" : ""}`}>
      <div className="navbar-end">
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
