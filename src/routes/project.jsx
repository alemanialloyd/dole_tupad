import { useState, useEffect, Fragment, useContext } from 'react';
import { getProjectDocument, getBeneficiaryDocuments, updateProjectDocument, getBeneficiaryDocument } from "../utils/firebase";
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/button';
import ProjectBeneficiaryItem from '../components/project-beneficiary-item';
import { format } from "date-fns";
import { UserContext } from "../context/user-context";
import FormInput from '../components/form-input';

const defaultProject = {
    title: "-",
    barangay: "-",
    municipality: "-",
    province: "-",
    beneficiaries: "0",
    budget: "0",
    days: "0",
    status: "",
}

const Project = () => {
    const { currentUser } = useContext(UserContext);
    const { id } = useParams();
    const [project, setProject] = useState(defaultProject);
    const { title, barangay, municipality, province, beneficiaries, budget, days, status, startedDate } = project;
    const navigate = useNavigate();
    const [beneficiariesList, setBeneficiariesList = () => []] = useState([]);
    const [selected, setSelected] = useState([]);
    const [values, setValues] = useState([]);
    const [dailyWage, setDailyWage] = useState("");

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getProjectDocument(id);
            setProject(doc);
        }
        getDoc();
    }, []);

    useEffect(() => {
        async function getDocs() {
            const docs = await getBeneficiaryDocuments(municipality, barangay);
            setBeneficiariesList(docs);
        };

        if (municipality && barangay) {
            if (status === "pending") {
                getDocs();
                return;
            }
        }
    }, [project]);

    useEffect(() => {
        if (project.selected) {
            project.selected.forEach(async(item, i) => {
                if (!selected.includes(item)) {
                    const doc = await getBeneficiaryDocument(item);
                    selected.push(item);
                    beneficiariesList.push(doc);
                    setBeneficiariesList([...beneficiariesList]);
                }
            });
        }
    }, [project]);

    const onAddHandler = (id) => {
        if (status !== "pending") {
            return;
        }

        if (selected.includes(id)) {
            setSelected(selected.filter((sel) => {return sel !== id}));
            return;
        }

        
        if (selected.length === parseInt(beneficiaries)) {
            return;
        }
        setSelected([...selected, id]);
    }

    const onEditHandler = () => {
        navigate("/projects/" + id + "/edit")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (status === "pending") {
            if (selected.length < parseInt(beneficiaries)) {
                alert("insufficient beneficiaries");
                return;
            }

            const startedDate = new Date();
            const response = await updateProjectDocument(id, {selected, startedDate, status: "ongoing"});

            if (response === "success") {
                setBeneficiariesList(beneficiariesList.filter(beneficiary => selected.includes(beneficiary.id)));
                setProject({...project, status: "ongoing", startedDate, selected})
            } else {
                alert(response);
            }
            return;
        }

        
        if (status === "ongoing") {
            const finishedDate = new Date();
            const response = await updateProjectDocument(id, {values, dailyWage, finishedDate, status: "finished"});
            if (response === "success") {
                setProject({...project, status: "finished", dailyWage, finishedDate, values})
            } else {
                alert(response);
            }
            return;
        }

        navigate("/payroll/" + id);
    }

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    var started;

    try {
        started = startedDate.toDate();
    } catch (err) {
        started = startedDate;
    }

    if (project && project.selected && values.length === 0) {
        if (project.values) {
            setValues(project.values);
            return;
        }
        const defaultValues = [];
        project.selected.forEach(() => {
            defaultValues.push("");
        });
        setValues(defaultValues);
    }

    if (project && project.dailyWage && dailyWage === "") {
        setDailyWage(project.dailyWage);
    }

    const onValueChange = (event) => {
        const { id, value } = event.target;

        values[id] = value;
        setValues([...values]);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>
            {project ? <Fragment>
                <nav className="breadcrumb mb-6">
                    <ul>
                        <li><a onClick={() => {navigate("/")}}>Home</a></li>
                        <li><a onClick={() => {navigate("/projects/" + status)}}>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Projects</a></li>
                        <li className="is-active"><a aria-current="page">{title}</a></li>
                    </ul>
                </nav>

                <h2 className='is-block is-size-4 has-text-weight-bold'>{title}
                {currentUser.data.type === "superadmin" ? <Button additionalClasses="block is-pulled-right" type="button" onClick={onEditHandler}>Edit</Button> : ""}</h2>
                <p className='block'>{barangay + ", " + municipality + ", " + province}</p>
                <div className="mt-3">
                    <span className="icon-text">
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 19c0-3.314-3.134-6-7-6-.807 0-2.103-.293-3-1.235"></path></svg></span> 
                        <span className="has-text-weight-medium mr-3">{status === "pending" ? selected.length + "/" + beneficiaries : beneficiaries}</span> 
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v4M7 6h10m4 8v2a2 2 0 0 1-2 2h-2m4-4c-1.333 0-4 .8-4 4m0 0H7m-4-4v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4"></path><circle cx="12" cy="12" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg></span> 
                        <span className="has-text-weight-medium mr-3">{kFormatter(parseFloat(budget, 10))}</span>
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 9V7a2 2 0 0 1 2-2h2M4 9h16m0 0V7a2 2 0 0 0-2-2h-2m0 0V3m0 2H8m0-2v2"></path></svg></span> 
                        <span className="has-text-weight-medium">{days}</span>
                    </span>

                    {status === "pending" ? "" : <span className='is-pulled-right'>Date Started: {startedDate ? format(started, "MMM dd, yyyy") : ""}</span>}
                </div>
       
       
                <form onSubmit={handleSubmit}>
                <div className="table-container mt-6">
                <table className={`table is-fullwidth is-hoverable is-borderless ${status === "pending" ? "is-selectable" : ""}`}>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                            <th>Address</th>
                            <th>{status === "pending" ? "" : "Days Present"}</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {beneficiariesList.map((beneficiary, index) => {
                        return (
                            <ProjectBeneficiaryItem onValueChange={onValueChange} value={values[index]} project={project} additionalClasses={selected.includes(beneficiary.id) ? "is-active" : ""} onAddHandler={onAddHandler} key={beneficiary.id} beneficiary={beneficiary} index={index}/>
                        )
                    })}
                    </tbody>
                </table>
                {status === "ongoing" || status === "finished" ? <FormInput disabled={status === "finished"} type="number" required value={dailyWage} onChange={(e) => {setDailyWage(e.target.value)}} label="Daily Wage" additionalClasses="column is-4 is-offset-4"/> : ""}
                <div className='has-text-centered'><Button type="submit" additionalClasses="is-info block mt-6">{status === "pending" ? "Start Project" : status === "ongoing" ? "Finish Project" : "View Payroll"}</Button></div>
                </div>
            </form>
            </Fragment> : ""}
        </div>
    )
}

export default Project;