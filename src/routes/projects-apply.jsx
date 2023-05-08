import { useContext, useState, useEffect, Fragment } from 'react';
import { getAvailableProjects, updateProjectApplicants } from "../utils/firebase";
import { useNavigate } from 'react-router-dom'
import ProjectItem from "../components/project-item";
import { UserContext } from "../context/user-context";
import AvailableProjectItem from '../components/beneficiary-available-project-item';
import { format } from "date-fns";

const ProjectsApply = () => {
    const { currentUser } = useContext(UserContext);
    const [projects, setProjects = () => []] = useState([]);
    const [page, setPage] = useState(0);
    const maxDocs = 20;
    const [barangays, setbarangays] = useState([]);
    const navigate = useNavigate();
    const [modal, setModal] = useState("");

    useEffect(() => {
        async function getDocs() {
            const docs = await getAvailableProjects(currentUser.data.municipality, currentUser.data.barangay);
            setProjects(docs);
        };
        getDocs();
    }, []);


    const pages = [];
    for (let i = 0; i < projects.length / maxDocs; i++) {
        pages.push(i);
    }

    const onClickHandler = async(id, action) => {
        if (action === "add") {
            const yearAgo = new Date();
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    
            if (currentUser.data.last && currentUser.data.last.toDate() > yearAgo) {
                const nextYear = currentUser.data.last.toDate();
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                setModal("You're not allowed to apply on a project until " + format(nextYear, "MMM dd, yyyy"));
                return;
            }
        }

        const res = await updateProjectApplicants(id, currentUser.uid, action);
    
        if (res === "success") {
            const pos = projects.map(a => a.id).indexOf(id);
            const index = projects[pos]["applicants"].indexOf(currentUser.uid)
            

            if (index > -1) {
                projects[pos]["applicants"].splice(index, 1);
            } else {
                projects[pos]["applicants"].push(currentUser.uid);
            }

            setProjects([...projects]);
            return;
        }
        setModal(res);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>
            {modal !== "" ? <div className="modal custom-modal has-text-centered is-active">
                <div className="modal-background"></div>
                <div className="modal-content">
                    <header className="modal-card-head pt-6">
                        <p className="is-size-4">{modal}</p>
                    </header>
                    <footer className="modal-card-foot has-text-centered is-block pb-5">
                        <button className="button" onClick={() => {setModal("")}}>OK</button>
                    </footer>
                </div>
            </div> : ""}

        {/* <nav className="breadcrumb mb-6">
            <ul>
                <li><a onClick={() => {navigate("/")}}>Home</a></li>
                <li className="is-active"><a aria-current="page">All Projects</a></li>
            </ul>
        </nav> */}

            <h2 className='is-size-4 has-text-weight-bold column is-12'>Projects</h2>
            

            {projects.length > 0 ? 
            <Fragment>
                <div className="mt-6 columns is-multiline">
                {projects.map((project, index) => {
                    if (index >= (page * maxDocs) && index < maxDocs + (page * maxDocs)) {
                        return (
                            <AvailableProjectItem additionalClasses="column is-4" key={project.id} project={project} uid={currentUser.uid} onClickHandler={onClickHandler}/>
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

export default ProjectsApply;