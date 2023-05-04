import { useContext, useState } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate} from 'react-router-dom';
import { StaticContext } from "../context/static-context";
import { checkExistingBeneficiary, createAuthUserWithEmailAndPassword, createBeneficiaryDocument, createUserDocument } from '../utils/firebase';

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
    province: 'Camarines Norte',
    municipality: 'Select',
    barangay: 'Select',
    district: '',
    beneficiaryType: 'Select',
    beneficiaryTypeOthers: '',
    idType: 'Select',
    idTypeOthers: '',
    idNumber: '',
    dependentName: '',
    interested: 'Select',
    skillsTraining: 'Select',
    skillsTrainingOthers: '',
    occupation: 'Select',
    occupationOthers: '',
    status: 'for-approval',
    password: '',
    confirmPassword: '',
    type: 'beneficiary'
}

const Register = () => {
    const { municipalities, bicol, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const navigate = useNavigate();

    const [barangays, setbarangays] = useState([]);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { password, confirmPassword, firstName, lastName, middleName, extensionName, birthDate, gender, civilStatus, age, emailAddress, contactNumber, province, municipality, barangay, district,
        beneficiaryType, beneficiaryTypeOthers, idType, idTypeOthers, dependentName, interested, skillsTraining, skillsTrainingOthers, occupation, occupationOthers, idNumber} = formFields;
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

        if (id === "municipality") {
            var dis = "1st District"
            if (bicol.includes(value)) {
                dis = "2nd District"
            }

            switch(value) {
                case "Basud":
                    setbarangays(basud);
                    break;
                case "Capalonga":
                    setbarangays(capalonga);
                    break;
                case "Daet":
                    setbarangays(daet);
                    break;
                case "Jose Panganiban":
                    setbarangays(jpang);
                    break;
                case "Labo":
                    setbarangays(labo);
                    break;
                case "Mercedes":
                    setbarangays(mercedes);
                    break;
                case "Paracale":
                    setbarangays(paracale);
                    break;
                case "San Lorenzo Ruiz":
                    setbarangays(slr);
                    break;
                case "San Vicente":
                    setbarangays(sv);
                    break;
                case "Sta Elena":
                    setbarangays(se);
                    break;
                case "Talisay":
                    setbarangays(talisay);
                    break;
                case "Vinzons":
                    setbarangays(vinzons);
                    break;
                default:
                    setbarangays([]);
            }

            setFormFields({...formFields, "district": dis, "barangay": "Select", [id]: value});
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
        } else if (municipality === "Select") {
            setModal("Select municipality");
            return;
        } else if (barangay === "Select") {
            setModal("Select barangay");
            return;
        } else if (occupation === "Select") {
            setModal("Select occupation");
            return;
        } else if (idType === "Select") {
            setModal("Select type of id");
            return;
        } else if (beneficiaryType === "Select") {
            setModal("Select type of beneficiary");
            return;
        } else if (interested === "Select") {
            setModal("Select interested in skills/training");
            return;
        } else if (interested === "Yes" && skillsTraining === "Select") {
            setModal("Select skills/training");
            return;
        } else if (password !== confirmPassword) {
            setModal("Password mismatch");
            return;
        } else if (password.length < 6) {
            setModal("Password should be atleast 6 characters");
            return;
        }

        const uid = lastName.toLowerCase().replaceAll(" ", "") + firstName.toLowerCase().replaceAll(" ", "") + birthDate.replaceAll("-", "");
        const existing = await checkExistingBeneficiary(uid);
        if (existing) {
            setModal("Benefeciary exists");
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(emailAddress, password);
            delete formFields.confirmPassword;

            await createUserDocument(user, {...formFields, uid});
            navigate("/beneficiaries/" + user.uid);
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

            <h2 className='is-size-4 has-text-weight-bold'>Register</h2>
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
                    <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province *" additionalClasses="column is-6"/>
                    <FormSelect options={municipalities} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality *" additionalClasses="column is-6"/>
                    <FormSelect options={barangays} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay *" additionalClasses="column is-6"/>
                    <FormInput disabled type="text" id="district" value={district} onChange={handleChange} label="District" additionalClasses="column is-6"/>
                    <FormSelect options={["Barangay Health Worker", "Barangay Tanod", "Crop Grower", "Fisherfolk", "Homebased Worker", "Laborer", "Livestock/Poultry Raiser", "Small Transport Driver", "Transport Worker", "Vendor", "Unemployed", "Others"]} type="text" required id="occupation" onChange={handleChange} value={occupation} label="Occupation *" additionalClasses={`${occupation === "Others" || occupation === "Crop Grower" || occupation === "Homebased Worker" || occupation === "Laborer" ? "is-2" : "is-6"} column`}/>
                    {occupation === "Others" || occupation === "Crop Grower" || occupation === "Homebased Worker" || occupation === "Laborer" ? <FormInput type="text" required id="occupationOthers" value={occupationOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput type="text" required id="dependentName" value={dependentName} onChange={handleChange} label="Dependent Name *" additionalClasses="column is-6"/>
                    <FormSelect options={["Barangay ID", "SSS", "Voter's ID", "Others"]} type="text" required id="idType" onChange={handleChange} value={idType} label="Type of ID *" additionalClasses={`${idType === "Others" ? "is-2" : "is-6"} column`}/>
                    {idType === "Others" ? <FormInput type="text" required id="idTypeOthers" value={idTypeOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput type="text" required id="idNumber" value={idNumber} onChange={handleChange} label="ID Number *" additionalClasses="column is-6"/>
                    <FormSelect options={["Underemployed/Self-Employed", "PWD", "Senior Citizen", "Former Rebels", "Former Violent Extremist Groups", "Indigenous People", "Others"]} type="text" required id="beneficiaryType" onChange={handleChange} value={beneficiaryType} label="Type of Beneficiary *" additionalClasses={`${beneficiaryType === "Others" ? "is-2" : "is-6"} column`}/>
                    {beneficiaryType === "Others" ? <FormInput type="text" required id="beneficiaryTypeOthers" value={beneficiaryTypeOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormSelect options={["Yes", "No"]} type="text" required id="interested" onChange={handleChange} value={interested} label="Interested in Skills/Training? *" additionalClasses="column is-6"/>
                    <FormSelect disabled={interested !== "Yes"} required={interested === "Yes"} options={["Agriculture Crops Production", "Aquaculture", "Automative", "Construction", "Cooking", "Customer Services", "Electrical and Electronics", "Food Processing", "Furniture Making", "Garments and Textiles", "Housekeeping", "Information and Communication Technology", "Tourism", "Welding", "Others"]} type="text" id="skillsTraining" onChange={handleChange} value={skillsTraining} label="Skills Training *" additionalClasses={`${skillsTraining === "Others" ? "is-2" : "is-6"} column`}/>
                    {skillsTraining === "Others" ? <FormInput type="text" required id="skillsTrainingOthers" value={skillsTrainingOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput required type="tel" id="contactNumber" value={contactNumber} onChange={handleChange} label="Contact Number *" additionalClasses="column is-6"/>
                    <FormInput required type="email" id="emailAddress" value={emailAddress} onChange={handleChange} label="Email Address *" additionalClasses="column is-12"/>
                    <FormInput required type="password" id="password" value={password} onChange={handleChange} label="Password *" additionalClasses="column is-6"/>
                    <FormInput required type="password" id="confirmPassword" value={confirmPassword} onChange={handleChange} label="Confirm Password *" additionalClasses="column is-6"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Register</Button>
                </form>
        </div>
    )
}

export default Register;