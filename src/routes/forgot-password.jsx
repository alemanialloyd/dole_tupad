import { signInWithGooglePopup, signInWithGoogleRedirect, auth, signInUserWithEmailAndPassword, resetPassword, createLog } from '../utils/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useEffect, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import {useNavigate} from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleChange = (event) => {
        const { value } = event.target;
        setEmail(value);
    }

    const handleSubmit = async(event) => {
        event.preventDefault();

        await resetPassword(email);
        setEmail("");
        alert("email sent");
    }

    return (
        <div className='column'>
            <div className='columns mt-6'>
                <div className='column is-4 is-offset-4 mt-6'>
                    <h2 className='is-size-2 has-text-weight-bold mt-6'>Forgot Password</h2>
                <p className='block'>Type in your email address. We will send you an email containing your password reset link.</p>
                    <form onSubmit={handleSubmit}>
                        <FormInput type="email" required id="email" value={email} onChange={handleChange} label="Email Address" additionalClasses="block"/>
                        <Button type="submit" additionalClasses="is-fullwidth is-info block">Submit</Button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;