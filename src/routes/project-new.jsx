import { useContext, useState, useEffect } from 'react';
import FormInput from '../components/form-input';
import Button from '../components/button';
import FormSelect from '../components/form-select';
import {useNavigate} from 'react-router-dom';
import { StaticContext } from "../context/static-context";
import { UserContext } from "../context/user-context";
import { createLog, createProjectDocument, getValues, updateValues } from '../utils/firebase';

const defaultFormFields = {
    province: 'Camarines Norte',
    municipality: [],
    barangay: [],
    district: 'Select',
    title: '',
    beneficiaries: '',
    budget: '',
    days: '',
    status: 'pending',
    dailyWage: '',
    max: 0,
    applicants: []
}

const ProjectNew = () => {
    const { currentUser } = useContext(UserContext);
    const { municipalities, bicol, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, tagalog, talisay, vinzons } = useContext(StaticContext);
    const navigate = useNavigate();
    const [defaultDailyWage, setDefaultDailyWage] = useState(0);
    const [formFields, setFormFields] = useState({...defaultFormFields, "type": currentUser.data.type === "superadmin" ? "special" : "regular"});
    const { province, municipality, barangay, district, title, beneficiaries, budget, days, dailyWage, max, type } = formFields;
    const [modal, setModal] = useState("");
    const [muns, setMuns] = useState([]);

    useEffect(() => {
        const getDoc = async () => {
            const value = await getValues("DailyWage");
            setDefaultDailyWage(value);

            setFormFields({...formFields, "dailyWage": value.toString()});
        }
        getDoc();
    }, []);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { id, value } = event.target;

        // if (id === "municipality") {
        //     var dis = "1st District"
        //     if (bicol.includes(value)) {
        //         dis = "2nd District"
        //     }

        //     switch(value) {
        //         case "Basud":
        //             setbarangays(basud);
        //             break;
        //         case "Capalonga":
        //             setbarangays(capalonga);
        //             break;
        //         case "Daet":
        //             setbarangays(daet);
        //             break;
        //         case "Jose Panganiban":
        //             setbarangays(jpang);
        //             break;
        //         case "Labo":
        //             setbarangays(labo);
        //             break;
        //         case "Mercedes":
        //             setbarangays(mercedes);
        //             break;
        //         case "Paracale":
        //             setbarangays(paracale);
        //             break;
        //         case "San Lorenzo Ruiz":
        //             setbarangays(slr);
        //             break;
        //         case "San Vicente":
        //             setbarangays(sv);
        //             break;
        //         case "Sta Elena":
        //             setbarangays(se);
        //             break;
        //         case "Talisay":
        //             setbarangays(talisay);
        //             break;
        //         case "Vinzons":
        //             setbarangays(vinzons);
        //             break;
        //         default:
        //             setbarangays([]);
        //     }

        //     setFormFields({...formFields, "district": dis, "barangay": "Select", [id]: value});
        //     return;
        // }

        if (id === "district") {
            setMuns(value === "1st District" ? tagalog : bicol);
            setFormFields({...formFields, [id]: value, "municipality": [], "barangay": []});
            return;
        }

        setFormFields({...formFields, [id]: value});
    }

    const b = parseFloat(budget);
    const d = parseInt(days);
    const w = parseFloat(dailyWage);
    
    if (b && d && w) {
        for (let i = Math.floor(budget / (d * w)); i > 0; i--) {
            const tot = (i * 356) + (d * w * i);
            if (tot <= b) {
                if (max !== i) {
                    setFormFields({...formFields, "max": parseInt(i)});
                }
                break;
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (district === "District") {
            setModal("Select district");
            return;
        }
        // else if (municipality.length === 0) {
        //     setModal("Select municipality");
        //     return;
        // } else if (barangay.length === 0) {
        //     setModal("Select barangay");
        //     return;
        // }

        if (defaultDailyWage !== w) {
            const resp = await updateValues("DailyWage", w);
            if (resp === "success") {
                createProject();
            } else {
                setModal(resp);
            }
            return;
        }

        createProject();
    }

    const createProject = async () => {
        const response = await createProjectDocument({...formFields, "municipality": municipality.length === 0 ? muns : municipality});
        if (!response.includes("error")) {
            const log = {"action": "Created a new project", "id": response, "type" : "project", "by" : currentUser.uid}
            await createLog(log);

            navigate("/projects/" + response);
        } else {
            setModal(response);
        }
    }

    const onChangeHandler = (field, text) => {
        if (field === "municipality") {
            const existing = municipality.includes(text);

            setFormFields({...formFields, "municipality": existing ? municipality.filter(item => item !== text) : [...municipality, text], "barangay": []});
        }

        if (field === "barangay") {
            const existing = barangay.includes(text);

            setFormFields({...formFields, "barangay": existing ? barangay.filter(item => item !== text) : [...barangay, text]});
        }
    }

    return (
        <div className='column is-8 is-offset-2 my-6'>
            {modal !== "" ? <div className="modal custom-modal has-text-centered is-active">
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
                    <li className="is-active"><a aria-current="page">New Project</a></li>
                </ul>
            </nav>

            <h2 className='is-size-4 has-text-weight-bold'>New Project</h2>
            <p className='block'>Fill out required fields.</p>
            <form onSubmit={handleSubmit}>
                <div className='columns is-multiline'>
                    <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province *" additionalClasses="column is-6"/>
                    <FormSelect options={["1st District", "2nd District"]} type="text" required id="district" onChange={handleChange} value={district} label="District *" additionalClasses="column is-6"/>
                    {/* <FormSelect options={municipalities} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-6"/> */}
                    {/* <FormSelect options={barangays} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-6"/> */}
                    
                    <div className="dropdown column is-6">
                            <label>Municipality</label>
                        <div className="dropdown-trigger">
                            <button type='button' className="button is-fullwidth">
                                <span className='ellipsize'>{municipality.length === 0 ? "Select" : municipality.join(", ")}</span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                            {muns.map((item, index) => {
                                return (
                                    <div className="dropdown-item" key={index} tabIndex={index}>
                                        <label className="checkbox is-block py-2 is-size-6">
                                            <input type="checkbox" checked={municipality.includes(item)} onChange={() => {onChangeHandler("municipality", item)}}/>
                                            <span className='ml-4'>{item}</span>
                                        </label>
                                    </div>
                                )
                            })}
                            </div>
                        </div>
                    </div>

                    <div className="dropdown column is-6">
                            <label>Barangay</label>
                        <div className="dropdown-trigger">
                            <button type='button' className="button is-fullwidth">
                                <span className='ellipsize'>{barangay.length === 0 ? "Select" : barangay.join(", ").replaceAll(", Basud", "").replaceAll(", Daet", "")
                                .replaceAll(", Capalonga", "").replaceAll(", Jose Panganiban", "").replaceAll(", Mercedes", "").replaceAll(", Labo", "")
                                .replaceAll(", Paracale", "").replaceAll(", Sta Elena", "").replaceAll(", San Vicente", "").replaceAll(", San Lorenzo Ruiz", "")
                                .replaceAll(", Talisay", "").replaceAll(", Vinzons", "")}</span>
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                            {municipality.map((item, index) => {
                                var bar = item === "Basud" ? basud : item === "Capalonga" ? capalonga : item === "Daet" ? daet :
                                item === "Jose Panganiban" ? jpang : item === "Labo" ? labo : item === "Mercedes" ? mercedes : item === "Paracale" ? paracale :
                                item === "San Lorenzo Ruiz" ? slr : item === "San Vicente" ? sv : item === "Sta Elena" ? se : item === "Talisay" ? talisay : 
                                item === "Vinzons" ? vinzons : [];

                                return (
                                    <div className="dropdown-item is-size-6" key={item} tabIndex={index}>
                                        <span className='has-text-weight-medium py-3 is-block'>{item}</span>
                                    
                                    {bar.map((bara, index) => {
                                    return (
                                        <div key={index}>
                                            <label className="checkbox is-block py-2 px-4">
                                                <input type="checkbox" checked={barangay.includes(bara + ", " + item)} onChange={() => {onChangeHandler("barangay", bara + ", " + item)}}/>
                                                <span className='ml-4'>{bara}</span>
                                            </label>
                                        </div>
                                    )
                                })}</div>
                                );
                            })}
                            </div>
                        </div>
                    </div>

                    <FormInput type="text" required id="title" value={title} onChange={handleChange} label="Project Title *" additionalClasses="column is-6"/>
                    <FormInput type="number" step="0.01" required id="budget" value={budget} onChange={handleChange} label="Total Budget *" additionalClasses="column is-6"/>
                    <FormInput type="number" min="10" max="30" required id="days" value={days} onChange={handleChange} label="Number of Days *" additionalClasses="column is-4"/>
                    <FormInput type="number" step="0.01" required id="dailyWage" value={dailyWage} onChange={handleChange} label="Daily Wage *" additionalClasses="column is-4"/>
                    <FormInput type="number" required id="beneficiaries" value={beneficiaries} max={max} min="1" onChange={handleChange} label={`Number of Beneficiaries (max = ${max}) *`} additionalClasses="column is-4"/>
                </div>
                <Button type="submit" additionalClasses="is-info block">Create</Button>
                </form>
        </div>
    )
}

export default ProjectNew;