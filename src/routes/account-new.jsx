import { useEffect, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate} from 'react-router-dom';
import { createAuthUserWithEmailAndPassword, createUserDocument, signOutUser } from '../utils/firebase';

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
    type: 'admin'
}

const AccountNew = () => {
    const navigate = useNavigate();

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { firstName, lastName, middleName, extensionName, birthDate, gender, civilStatus, age, emailAddress, contactNumber } = formFields;

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
            alert("Select sex");
            return;
        } else if (civilStatus === "Select") {
            alert("Select civil status");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(emailAddress, "doletupad");

            await createUserDocument(user, formFields);

            signOutUser();
            navigate('/');
        } catch (error) {
            if (error.code == "auth/email-already-in-use") {
                alert("Email address already in use");
                return;
            }

            alert("signup error:", error.message);
        }
    }

    return (
        <div className='column is-8 is-offset-2 my-6'>
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
                    <FormInput type="text" required id="firstName" value={firstName} onChange={handleChange} label="First Name" additionalClasses="column is-6"/>
                    <FormInput type="text" required id="lastName" value={lastName} onChange={handleChange} label="Last Name" additionalClasses="column is-6"/>
                    <FormInput type="text" id="middleName" value={middleName} onChange={handleChange} label="Middle Name" additionalClasses="column is-6"/>
                    <FormInput type="text" id="extensionName" value={extensionName} onChange={handleChange} label="Name Extension" additionalClasses="column is-6"/>
                    <FormSelect options={["Male", "Female"]} type="text" required id="gender" onChange={handleChange} value={gender} label="Sex/Gender" additionalClasses="column is-6"/>
                    <FormSelect options={["Single", "Married", "Widowed", "Separated", "Others"]} type="text" required id="civilStatus" onChange={handleChange} value={civilStatus} label="Civil Status" additionalClasses="column is-6"/>
                    <FormInput type="date" required id="birthDate" value={birthDate} onChange={handleChange} label="Date of Birth" additionalClasses="column is-6"/>
                    <FormInput type="number" disabled required id="age" value={age} onChange={handleChange} label="Age" additionalClasses="column is-6"/>
                    <FormInput type="email" id="emailAddress" value={emailAddress} onChange={handleChange} label="Email Address" additionalClasses="column is-6"/>
                    <FormInput type="tel" id="contactNumber" value={contactNumber} onChange={handleChange} label="Contact Number" additionalClasses="column is-6"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Create</Button>
                </form>
        </div>
    )
}

export default AccountNew;