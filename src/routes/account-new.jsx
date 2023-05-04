import { useContext, useEffect, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../context/user-context";
import { createAuthUserWithEmailAndPassword, createLog, createUserDocument, signInUserWithEmailAndPassword, signOutUser } from '../utils/firebase';

const defaultFormFields = {
    firstName: '',
    lastName: '',
    middleName: '',
    extensionName: '',
    birthDate: '',
    gender: 'Select',
    civilStatus: 'Select',
    age: '',
    emailAddress: '',
    contactNumber: '',
    type: 'admin',
    password: 'doletupad',
    status: 'active'
}

const AccountNew = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { firstName, lastName, middleName, extensionName, birthDate, gender, civilStatus, age, emailAddress, contactNumber, password } = formFields;
    const [modal, setModal] = useState("");

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { id, value } = event.target;

        if (id === "birthDate") {
            var today = new Date();
            var birthDate = new Date(value);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            setFormFields({...formFields, [id]: value, "age": age});
            return;
        }

        setFormFields({...formFields, [id]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (gender === "Select") {
            setModal("Select sex");
            return;
        } else if (civilStatus === "Select") {
            setModal("Select civil status");
            return;
        }

        try {
            const ema = currentUser.data.emailAddress;
            const pas = currentUser.data.password;

            const { user } = await createAuthUserWithEmailAndPassword(emailAddress, password);
            await createUserDocument(user, formFields);
            
            await signInUserWithEmailAndPassword(ema, pas);
            
            const log = {"action": "Created new admin account", "id": user.uid, "type" : "admin", "by" : currentUser.uid}
            await createLog(log);

            navigate("/accounts");
        } catch (error) {
            if (error.code == "auth/email-already-in-use") {
                setModal("Email address already in use");
                return;
            }

            setModal("signup error:", error.message);
        }
    }

    return (
        <div className='column is-8 is-offset-2 my-6'>
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

            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li className="is-active"><a aria-current="page">New Account</a></li>
                </ul>
            </nav>

            <h2 className='is-size-4 has-text-weight-bold'>New Account</h2>
            <p className='block'>Fill out required fields.</p>
            <form onSubmit={handleSubmit}>
                <div className='columns is-multiline'>
                    <FormInput type="text" required id="firstName" value={firstName} onChange={handleChange} label="First Name *" additionalClasses="column is-6"/>
                    <FormInput type="text" required id="lastName" value={lastName} onChange={handleChange} label="Last Name *" additionalClasses="column is-6"/>
                    <FormInput type="text" id="middleName" value={middleName} onChange={handleChange} label="Middle Name" additionalClasses="column is-6"/>
                    <FormInput type="text" id="extensionName" value={extensionName} onChange={handleChange} label="Name Extension" additionalClasses="column is-6"/>
                    <FormSelect options={["Male", "Female"]} type="text" required id="gender" onChange={handleChange} value={gender} label="Sex/Gender *" additionalClasses="column is-6"/>
                    <FormSelect options={["Single", "Married", "Widowed", "Separated", "Others"]} type="text" required id="civilStatus" onChange={handleChange} value={civilStatus} label="Civil Status *" additionalClasses="column is-6"/>
                    <FormInput type="date" required id="birthDate" value={birthDate} onChange={handleChange} label="Date of Birth *" additionalClasses="column is-6"/>
                    <FormInput type="number" disabled required id="age" value={age} onChange={handleChange} label="Age" additionalClasses="column is-6"/>
                    <FormInput type="email" required id="emailAddress" value={emailAddress} onChange={handleChange} label="Email Address *" additionalClasses="column is-6"/>
                    <FormInput type="tel" id="contactNumber" value={contactNumber} onChange={handleChange} label="Contact Number" additionalClasses="column is-6"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Create</Button>
                </form>
        </div>
    )
}

export default AccountNew;