import { useState, useEffect, Fragment, useContext } from 'react';
import { getProjectDocument, getBeneficiaryDocuments, updateProjectDocument, getBeneficiaryDocument, updateBeneficiariesLast, getBeneficiaries } from "../utils/firebase";
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/button';
import ProjectBeneficiaryItem from '../components/project-beneficiary-item';
import { format } from "date-fns";
import { UserContext } from "../context/user-context";
import FormInput from '../components/form-input';
import { StaticContext } from "../context/static-context";
import FormSelect from '../components/form-select';

const defaultProject = {
    title: "-",
    barangay: [],
    municipality: [],
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
    const { title, barangay, municipality, province, beneficiaries, budget, days, status, startedDate, dailyWage } = project;
    const navigate = useNavigate();
    const [beneficiariesList, setBeneficiariesList = () => []] = useState([]);
    const [allBeneficiaries, setAllBeneficiaries = () => []] = useState([]);
    const [selected, setSelected] = useState([]);
    const [values, setValues] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [category, setCategory] = useState("Unallocated");
    const { basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const [barangays, setBarangays] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [modal, setModal] = useState("");
   
    useEffect(() => {
        const getDoc = async () => {
            const doc = await getProjectDocument(id);
            setProject(doc);
        }
        getDoc();
    }, []);

    useEffect(() => {
        const bars = [];
        municipality.forEach((mun) => {
            switch(mun) {
                case "Basud":
                    bars.push(...basud);
                    break;
                case "Capalonga":
                    bars.push(...capalonga);
                    break;
                case "Daet":
                    bars.push(...daet);
                    break;
                case "Jose Panganiban":
                    bars.push(...jpang);
                    break;
                case "Labo":
                    bars.push(...labo);
                    break;
                case "Mercedes":
                    bars.push(...mercedes);
                    break;
                case "Paracale":
                    bars.push(...paracale);
                    break;
                case "San Lorenzo Ruiz":
                    bars.push(...slr);
                    break;
                case "San Vicente":
                    bars.push(...sv);
                    break;
                case "Sta Elena":
                    bars.push(...se);
                    break;
                case "Talisay":
                    bars.push(...talisay);
                    break;
                case "Vinzons":
                    bars.push(...vinzons);
                    break;
            }
        });
        setBarangays(bars);
    }, [project]);

    useEffect(() => {
        async function getDocs() {
            const bar = [];
            barangay.forEach((b) => {
                bar.push(b.replaceAll(", Basud", "").replaceAll(", Daet", "")
                .replaceAll(", Capalonga", "").replaceAll(", Jose Panganiban", "").replaceAll(", Mercedes", "").replaceAll(", Labo", "")
                .replaceAll(", Paracale", "").replaceAll(", Sta Elena", "").replaceAll(", San Vicente", "").replaceAll(", San Lorenzo Ruiz", "")
                .replaceAll(", Talisay", "").replaceAll(", Vinzons", ""))
            })
            const docs = await getBeneficiaries("approved", municipality.length === 0 ? "All" : municipality, bar.length === 0 ? "All" : bar);
            docs.sort((a, b) => {
                const a1 = a.lastName.toLowerCase().replace(" ", "") + a.firstName.toLowerCase().replace(" ", "");
                const b1 = b.lastName.toLowerCase().replace(" ", "") + b.firstName.toLowerCase().replace(" ", "");

                if ( a1 < b1 ){
                    return -1;
                }
                if ( a1 > b1 ){
                    return 1;
                }

                return 0;
            });
            setAllBeneficiaries(docs);

            console.log(docs);
        };

        if (municipality && barangay) {
            if (status === "pending") {
                getDocs();
                return;
            }
        }
    }, [project]);

    useEffect(() => {
        const yearAgo = new Date();
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);

        var fil = allBeneficiaries.filter((item) => {
            const {last} = item;
            return category === "Unallocated" ? last ? last.toDate() < yearAgo : true : last ? last.toDate() > yearAgo : false;
        })
        
        if (filter !== "All") {
            fil = fil.filter((item) => {return item.barangay === filter});
        }

        
        if (search !== "") {
            fil = fil.filter((item) => {return item.lastName.toLowerCase().includes(search.toLowerCase()) || 
                item.firstName.toLowerCase().includes(search.toLowerCase()) || item.middleName.toLowerCase().includes(search.toLowerCase())});
        }

        setBeneficiariesList(fil);
    }, [search, filter, category, allBeneficiaries]);

    useEffect(() => {
        if (project.selected) {
            project.selected.forEach(async(item, i) => {
                if (!selected.includes(item)) {
                    const doc = await getBeneficiaryDocument(item);
                    if (doc) {
                        selected.push(item);
                        beneficiariesList.push(doc);
                        beneficiariesList.sort((a, b) => {
                            const a1 = a.lastName.toLowerCase().replace(" ", "") + a.firstName.toLowerCase().replace(" ", "");
                            const b1 = b.lastName.toLowerCase().replace(" ", "") + b.firstName.toLowerCase().replace(" ", "");
            
                            if ( a1 < b1 ){
                                return -1;
                            }
                            if ( a1 > b1 ){
                                return 1;
                            }
            
                            return 0;
                        });
                        setBeneficiariesList([...beneficiariesList]);
                    }
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
                setModal("Insufficient beneficiaries, please select more");
                return;
            }

            const res = await updateBeneficiariesLast(selected);
            if (res === "success") {
                const startedDate = new Date();
                const response = await updateProjectDocument(id, {selected, startedDate, status: "ongoing"});
    
                if (response === "success") {
                    setBeneficiariesList(beneficiariesList.filter(beneficiary => selected.includes(beneficiary.id)));
                    setProject({...project, status: "ongoing", startedDate, selected})
                } else {
                    setModal(response);
                }
            } else {
                setModal(res);
            }
            return;
        }

        
        if (status === "ongoing") {
            const finishedDate = new Date();
            const response = await updateProjectDocument(id, {values, finishedDate, status: "finished"});
            if (response === "success") {
                setProject({...project, status: "finished", finishedDate, values})
            } else {
                setModal(response);
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

    const onValueChange = (event) => {
        const { id, value } = event.target;

        values[id] = value;
        setValues([...values]);
    }

    const onDeleteHandler = async() => {
        const res = await updateProjectDocument(project.id, {"status": "deleted"});
        setConfirm(false);
        if (res === "success") {
            navigate("/projects/" + project.status);
        } else {
            setModal(res);
        }
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>
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

            {confirm ? <div className="modal has-text-centered is-active">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <header className="modal-card-head pt-6">
                        <p className="modal-card-title">Would you like to delete project?</p>
                    </header>
                    <footer className="modal-card-foot has-text-centered is-block pb-5">
                        <button className="button" onClick={() => {setConfirm(false)}}>No</button>
                        <button className="button is-success" onClick={onDeleteHandler}>Yes</button>
                    </footer>
                </div>
            </div> : ""}

            {project ? <Fragment>
                <nav className="breadcrumb mb-6">
                    <ul>
                        <li><a onClick={() => {navigate("/")}}>Home</a></li>
                        <li><a onClick={() => {navigate("/projects/" + status)}}>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Projects</a></li>
                        <li className="is-active"><a aria-current="page">{title}</a></li>
                    </ul>
                </nav>

                <h2 className='is-block is-size-4 has-text-weight-bold'>{title}
                {currentUser.data.type === "superadmin" ?
                <div className='is-pulled-right'><Button additionalClasses="block mr-3" type="button" onClick={onEditHandler}>Edit</Button>
                <Button additionalClasses="block is-danger" type="button" onClick={() => {setConfirm(true)}}>Delete</Button></div> : ""}</h2>
                <p className='block'>{barangay + ", " + municipality + ", " + province}</p>
                <div className="mt-3">
                    <span className="icon-text">
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 19c0-3.314-3.134-6-7-6-.807 0-2.103-.293-3-1.235"></path></svg></span> 
                        <span className="has-text-weight-medium mr-4">{status === "pending" ? selected.length + "/" + beneficiaries : beneficiaries}</span> 
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v4M7 6h10m4 8v2a2 2 0 0 1-2 2h-2m4-4c-1.333 0-4 .8-4 4m0 0H7m-4-4v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4"></path><circle cx="12" cy="12" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg></span> 
                        <span className="has-text-weight-medium mr-4">P {parseFloat(budget).toFixed(2)}</span>
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 9V7a2 2 0 0 1 2-2h2M4 9h16m0 0V7a2 2 0 0 0-2-2h-2m0 0V3m0 2H8m0-2v2"></path></svg></span> 
                        <span className="has-text-weight-medium mr-4">{days}</span>
                        <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8c0-1.657-3.134-3-7-3S7 6.343 7 8m14 0v4c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 13.92 7 13.02 7 12V8m14 0c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 9.92 7 9.02 7 8"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12v4c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538s2.866-.199 4-.538c1.813-.542 3-1.442 3-2.462v-1M3 12c0-1.197 1.635-2.23 4-2.711M3 12c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538.695 0 1.366-.043 2-.124"></path></svg></span>
                        <span className="has-text-weight-medium">P {parseFloat(dailyWage).toFixed(2)}</span>
                    </span>

                    {status === "pending" ? <div className='columns mt-6'>
                        <FormSelect options={["Unallocated", "Allocated"]} type="text" required onChange={(e) => {setCategory(e.target.value)}} value={category} label="Category" additionalClasses="column is-4"/>
                        <FormSelect options={["All", ...barangays]} type="text" required id="barangay" onChange={(e) => {setFilter(e.target.value)}} value={filter} label="Barangay" additionalClasses="column is-4"/>
                        <FormInput type="text" id="search" value={search} onChange={(e) => {setSearch(e.target.value)}} label="Search" additionalClasses="column is-4"/></div>
                        
                        : <span className='is-pulled-right'>Date Started: {startedDate ? format(started, "MMM dd, yyyy") : ""}</span>}
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
                <div className='has-text-centered'><Button type="submit" additionalClasses="is-info block mt-6">{status === "pending" ? "Start Project" : status === "ongoing" ? "Finish Project" : "View Payroll"}</Button></div>
                </div>
            </form>
            </Fragment> : ""}
        </div>
    )
}

export default Project;