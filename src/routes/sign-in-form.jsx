import { signInWithGooglePopup, signInWithGoogleRedirect, auth, signInUserWithEmailAndPassword, createLog } from '../utils/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import {useNavigate} from 'react-router-dom';

const defaultFormFields = {
    email: '',
    password: '',
}

const SignInForm = () => {
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password} = formFields;
    const [modal, setModal] = useState("");

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { id, value } = event.target;

        setFormFields({...formFields, [id]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { user } = await signInUserWithEmailAndPassword(email, password);
            resetFormFields();
            
            const log = {"action": "User signed in", "id": user.uid, "type" : "account", "by" : user.uid}
            await createLog(log);

            navigate('/');
        } catch (error) {
            switch(error.code) {
                case "auth/wrong-password":
                    setModal("Incorrect password");
                    break;
                case "auth/user-not-found":
                    setModal("User not found");
                    break;
                default:
                    console.log("Sign in failed: ", error.message);
            }
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
                    <h2 className='is-size-2 has-text-weight-bold mt-6'>Sign in</h2>
                <p className='block'>Type in your email address & password</p>
                    <form onSubmit={handleSubmit}>
                        <FormInput type="email" required id="email" value={email} onChange={handleChange} label="Email Address" additionalClasses="block"/>
                        <FormInput type="password" required id="password" value={password} onChange={handleChange} label="Password" additionalClasses="block"/> 
                        <Button type="submit" additionalClasses="is-fullwidth is-info block">Sign in</Button>
                        <Button type="button" additionalClasses="is-fullwidth block" onClick={() => {navigate("/forgot-password")}}>Forgot Password</Button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default SignInForm;