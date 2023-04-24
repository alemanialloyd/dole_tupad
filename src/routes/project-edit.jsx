import { useContext, useState, useEffect } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate, useParams} from 'react-router-dom';
import { StaticContext } from "../context/static-context";
import { getProjectDocument, updateProjectDocument } from '../utils/firebase';

const defaultFormFields = {
    province: 'Camarines Norte',
    municipality: 'Select',
    barangay: 'Select',
    district: '',
    title: '',
    beneficiaries: '',
    budget: '',
    days: '',
    status: 'pending'
}

const ProjectEdit = () => {
    const { id } = useParams();
    const { municipalities, bicol, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const navigate = useNavigate();

    const [barangays, setbarangays] = useState([]);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { province, municipality, barangay, district, title, beneficiaries, budget, days, status } = formFields;

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getProjectDocument(id);
            setFormFields(doc);
        }
        getDoc();
    }, []);

    const handleChange = (event) => {
        const { id, value } = event.target;

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

        if (municipality === "Select") {
            alert("Select municipality");
            return;
        } else if (barangay === "Select") {
            alert("Select barangay");
            return;
        }

        const response = await updateProjectDocument(id, formFields);
        if (response === "success") {
            navigate("/projects/" + id);
        } else {
            alert(response);
        }
    }

    return (
        <div className='column is-8 is-offset-2 my-6'>
            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li><a onClick={() => {navigate("/projects/" + status)}}>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Projects</a></li>
                    <li><a onClick={() => {navigate("/projects/" + id)}}>{title}</a></li>
                    <li className="is-active"><a aria-current="page">Edit</a></li>
                </ul>
            </nav>

            <h2 className='is-size-4 has-text-weight-bold'>Edit Project</h2>
            <p className='block'>Fill out required fields.</p>
            <form onSubmit={handleSubmit}>
                <div className='columns is-multiline'>
                    <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province" additionalClasses="column is-6"/>
                    <FormSelect options={municipalities} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-6"/>
                    <FormSelect options={barangays} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-6"/>
                    <FormInput disabled type="text" id="district" value={district} onChange={handleChange} label="District" additionalClasses="column is-6"/>
                    
                    <FormInput type="text" required id="title" value={title} onChange={handleChange} label="Project Title" additionalClasses="column is-9"/>
                    <FormInput disabled={status !== "pending"} type="number" required id="beneficiaries" value={beneficiaries} onChange={handleChange} label="Number of Beneficiaries" additionalClasses="column is-3"/>
                    <FormInput type="number" required id="budget" value={budget} onChange={handleChange} label="Total Budget" additionalClasses="column is-9"/>
                    <FormInput type="number" required id="days" value={days} onChange={handleChange} label="Number of Days" additionalClasses="column is-3"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Save</Button>
                </form>
        </div>
    )
}

export default ProjectEdit;