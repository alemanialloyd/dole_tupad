import { useContext, useState, useEffect } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate, useParams} from 'react-router-dom';
import { StaticContext } from "../context/static-context";
import { getBeneficiaryDocument, updateBeneficiaryDocument } from '../utils/firebase';

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
    occupationOthers: ''
}

const BeneficiaryEdit = () => {
    const { id } = useParams();
    const { municipalities, bicol, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const navigate = useNavigate();

    const [barangays, setbarangays] = useState([]);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { firstName, lastName, middleName, extensionName, birthDate, gender, civilStatus, age, emailAddress, contactNumber, province, municipality, barangay, district,
        beneficiaryType, beneficiaryTypeOthers, idType, idTypeOthers, dependentName, interested, skillsTraining, skillsTrainingOthers, occupation, occupationOthers, idNumber} = formFields;
    
    useEffect(() => {
        const getDoc = async () => {
            const doc = await getBeneficiaryDocument(id);
            setFormFields(doc);
        }
        getDoc();
    }, []);

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
            alert("Select sex");
            return;
        } else if (civilStatus === "Select") {
            alert("Select civil status");
            return;
        } else if (municipality === "Select") {
            alert("Select municipality");
            return;
        } else if (barangay === "Select") {
            alert("Select barangay");
            return;
        } else if (occupation === "Select") {
            alert("Select occupation");
            return;
        } else if (idType === "Select") {
            alert("Select type of id");
            return;
        } else if (beneficiaryType === "Select") {
            alert("Select type of beneficiary");
            return;
        } else if (interested === "Select") {
            alert("Select interested in skills/training");
            return;
        } else if (interested === "Yes" && skillsTraining === "Select") {
            alert("Select skills/training");
            return;
        }

        const response = await updateBeneficiaryDocument(id, formFields);
        if (response === "success") {
            navigate("/beneficiaries/" + id);
        } else {
            alert(response);
        }
    }

    return (
        <div className='column is-8 is-offset-2 my-6'>
            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li><a onClick={() => {navigate("/beneficiaries")}}>Beneficiaries</a></li>
                    <li><a onClick={() => {navigate("/beneficiaries/" + id)}}>{lastName + ", " + firstName + " " + middleName.charAt(0)}</a></li>
                    <li className="is-active"><a aria-current="page">Edit</a></li>
                </ul>
            </nav>

            <h2 className='is-size-4 has-text-weight-bold'>Edit Beneficiary</h2>
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
                    <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province" additionalClasses="column is-6"/>
                    <FormSelect options={municipalities} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-6"/>
                    <FormSelect options={barangays} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-6"/>
                    <FormInput disabled type="text" id="district" value={district} onChange={handleChange} label="District" additionalClasses="column is-6"/>
                    <FormSelect options={["Barangay Health Worker", "Barangay Tanod", "Crop Grower", "Fisherfolk", "Homebased Worker", "Laborer", "Livestock/Poultry Raiser", "Small Transport Driver", "Transport Worker", "Vendor", "Others"]} type="text" required id="occupation" onChange={handleChange} value={occupation} label="Occupation" additionalClasses={`${occupation === "Others" || occupation === "Crop Grower" || occupation === "Homebased Worker" || occupation === "Laborer" ? "is-2" : "is-6"} column`}/>
                    {occupation === "Others" || occupation === "Crop Grower" || occupation === "Homebased Worker" || occupation === "Laborer" ? <FormInput type="text" required id="occupationOthers" value={occupationOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput type="text" required id="dependentName" value={dependentName} onChange={handleChange} label="Dependent Name" additionalClasses="column is-6"/>
                    <FormSelect options={["SSS", "Voter's ID", "Others"]} type="text" required id="idType" onChange={handleChange} value={idType} label="Type of ID" additionalClasses={`${idType === "Others" ? "is-2" : "is-6"} column`}/>
                    {idType === "Others" ? <FormInput type="text" required id="idTypeOthers" value={idTypeOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput type="text" required id="idNumber" value={idNumber} onChange={handleChange} label="ID Number" additionalClasses="column is-6"/>
                    <FormSelect options={["Underemployed/Self-Employed", "PWD", "Senior Citizen", "Former Rebels", "Former Violent Extremist Groups", "Indigenous People", "Others"]} type="text" required id="beneficiaryType" onChange={handleChange} value={beneficiaryType} label="Type of Beneficiary" additionalClasses={`${beneficiaryType === "Others" ? "is-2" : "is-6"} column`}/>
                    {beneficiaryType === "Others" ? <FormInput type="text" required id="beneficiaryTypeOthers" value={beneficiaryTypeOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormSelect options={["Yes", "No"]} type="text" required id="interested" onChange={handleChange} value={interested} label="Interested in Skills/Training?" additionalClasses="column is-6"/>
                    <FormSelect disabled={interested !== "Yes"} required={interested === "Yes"} options={["Agriculture Crops Production", "Aquaculture", "Automative", "Construction", "Cooking", "Customer Services", "Electrical and Electronics", "Food Processing", "Furniture Making", "Garments and Textiles", "Housekeeping", "Information and Communication Technology", "Tourism", "Welding", "Others"]} type="text" id="skillsTraining" onChange={handleChange} value={skillsTraining} label="Skills Training" additionalClasses={`${skillsTraining === "Others" ? "is-2" : "is-6"} column`}/>
                    {skillsTraining === "Others" ? <FormInput type="text" required id="skillsTrainingOthers" value={skillsTrainingOthers} onChange={handleChange} label="Please Specify" additionalClasses="column is-4"/> : ""}
                    <FormInput required type="email" id="emailAddress" value={emailAddress} onChange={handleChange} label="Email Address" additionalClasses="column is-6"/>
                    <FormInput required type="tel" id="contactNumber" value={contactNumber} onChange={handleChange} label="Contact Number" additionalClasses="column is-6"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Save</Button>
                </form>
        </div>
    )
}

export default BeneficiaryEdit;