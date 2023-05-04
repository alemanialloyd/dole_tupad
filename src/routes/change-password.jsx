import { signInWithGooglePopup, signInWithGoogleRedirect, auth, signInUserWithEmailAndPassword, resetPassword, updateUserPassword, createLog } from '../utils/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../context/user-context";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modal, setModal] = useState("");
    const { currentUser } = useContext(UserContext);

    const handleSubmit = async(event) => {
        event.preventDefault();

        if (password.length < 6) {
            setModal("Password should be at least 6 characters");
            return;
        } else if (confirmPassword !== password) {
            setModal("Password mismatch");
            return;
        }

        const res = await updateUserPassword(password);
        setModal(res);
        if (res === "success") {
            const log = {"action": "User updated password", "id": currentUser.uid, "type" : "account", "by" : currentUser.uid}
            await createLog(log);

            setPassword("");
            setConfirmPassword("");
        }
    }

    return (
        <div className='column'>
            <div className='columns mt-6'>
            {modal !== "" ? <div className="modal has-text-centered is-active">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <header className="modal-card-head pt-6">
                        <p className="modal-card-title">{modal}</p>
                    </header>
                    <footer className="modal-card-foot has-text-centered is-block pb-5">
                        <button className="button" onClick={() => {setModal("")}}>OK</button>
                    </footer>
                </div>
            </div> : ""}

                <div className='column is-4 is-offset-4 mt-6'>
                    <h2 className='is-size-2 has-text-weight-bold mt-6'>Change Password</h2>
                <p className='block'>Type new password.</p>
                    <form onSubmit={handleSubmit}>
                        <FormInput type="password" required id="password" value={password} onChange={(e)=> {setPassword(e.target.value)}} label="Password" additionalClasses="block"/>
                        <FormInput type="password" required id="confirmPassword" value={confirmPassword} onChange={(e)=> {setConfirmPassword(e.target.value)}} label="Confirm Password" additionalClasses="block"/>
                        <Button type="submit" additionalClasses="is-fullwidth is-info block">Submit</Button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;