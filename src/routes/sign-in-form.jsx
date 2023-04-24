import { signInWithGooglePopup, signInWithGoogleRedirect, auth, signInUserWithEmailAndPassword } from '../utils/firebase';
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
    console.log("Signin");
    const navigate = useNavigate();
    
    // Google redirect login
    useEffect(() => {
        const getResponse = async () => {
            await getRedirectResult(auth);
        }
        getResponse();
    }, []);

    // Google popup login
    const logGoogleUser = async () => {
        await signInWithGooglePopup();
    }

    
    // Email and Password login
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password} = formFields;

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
            await signInUserWithEmailAndPassword(email, password);
            resetFormFields();
            
            navigate('/');
        } catch (error) {
            switch(error.code) {
                case "auth/wrong-password":
                    alert("Incorrect password");
                    break;
                case "auth/user-not-found":
                    alert("User not found");
                    break;
                default:
                    console.log("Sign in failed: ", error.message);
            }
        }
    }

    return (
        <div className='column'>
            <div className='columns mt-6'>
                <div className='column is-4 is-offset-4 mt-6'>
                    <h2 className='is-size-2 has-text-weight-bold mt-6'>Sign in</h2>
                <p className='block'>Type in your email address & password</p>
                    <form onSubmit={handleSubmit}>
                        <FormInput type="email" required id="email" value={email} onChange={handleChange} label="Email Address" additionalClasses="block"/>
                        <FormInput type="password" required id="password" value={password} onChange={handleChange} label="Password" additionalClasses="block"/> 
                        <Button type="submit" additionalClasses="is-fullwidth is-info block">Sign in</Button>
                        </form>
                </div>
            </div>
        </div>
    )
}

export default SignInForm;