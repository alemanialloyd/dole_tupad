import { useContext, useState, useEffect, Fragment } from 'react';
import { getProjectDocuments } from "../utils/firebase";
import { StaticContext } from "../context/static-context";
import FormSelect from "../components/form-select";
import { useLocation, useNavigate } from 'react-router-dom'
import ProjectItem from "../components/project-item";
import Button from '../components/button';

const defaultFormFields = {
    province: 'Camarines Norte',
    municipality: 'All',
    barangay: 'All',
}

const AllProjects = () => {
    const location = useLocation();
    const { municipalities, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const [projects, setProjects = () => []] = useState([]);
    const [page, setPage] = useState(0);
    const maxDocs = 20;
    const [barangays, setbarangays] = useState([]);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {province, municipality, barangay, year} = formFields;
    const navigate = useNavigate();

    useEffect(() => {
        async function getDocs() {
            const docs = await getProjectDocuments("", municipality, barangay);
            setProjects(docs);
        };
        getDocs();
    }, [formFields]);

    const handleChange = (event) => {
        const { id, value } = event.target;

        if (id === "municipality") {
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

            setFormFields({...formFields, "barangay": "All", [id]: value});
            return;
        }

        setFormFields({...formFields, [id]: value});
    }

    const pages = [];
    for (let i = 0; i < projects.length / maxDocs; i++) {
        pages.push(i);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>

        {/* <nav className="breadcrumb mb-6">
            <ul>
                <li><a onClick={() => {navigate("/")}}>Home</a></li>
                <li className="is-active"><a aria-current="page">All Projects</a></li>
            </ul>
        </nav> */}

            <h2 className='is-size-4 has-text-weight-bold column is-12'>All Projects
            <Button additionalClasses="block is-success is-pulled-right" type="button" onClick={() => {navigate("/projects/new")}}>Create New Project</Button></h2>
            
        <div className="columns is-vcentered">
            <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...municipalities]} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...barangays]} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-2"/>
        </div>    

            {projects.length > 0 ? 
            <Fragment>
                <div className="mt-6 columns is-multiline">
                {projects.map((project, index) => {
                    if (index >= (page * maxDocs) && index < maxDocs + (page * maxDocs)) {
                        return (
                            <ProjectItem text={project.status === "pending" ? "Create" : "Details"} additionalClasses="column is-4" key={project.id} project={project} all={true}/>
                        )
                    }
                })}
            </div>
            <nav className="pagination is-right" role="navigation" aria-label="pagination">
                    <ul className="pagination-list">
                        {pages.map((p) => {
                            if (pages.length > 1) {
                                return <li key={p} ><a className={`${page === p ? "is-current" : ""} pagination-link`} onClick={() => {
                                    if (p !== page) {setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' });}
                                }}>{p + 1}</a></li>
                            }}
                        )}
                    </ul>
                </nav>
            </Fragment>

            : <p className='has-text-centered' style={{marginTop: 200 + "px"}}>{"No projects"}</p>
            }
        </div>
    )
}

export default AllProjects;