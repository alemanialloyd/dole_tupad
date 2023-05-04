import { useState, useEffect, useContext } from 'react';
import { UserContext } from "../context/user-context";
import { getBeneficiaryDocument, getBeneficiaryProjectDocuments, updateBeneficiaryDocument } from "../utils/firebase";
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/button';
import BeneficiaryProjectItem from '../components/beneficiary-project-item';

const defaultProject = {
    barangay: "-",
    municipality: "-",
    province: "-",
    lastName: "",
    firstName: "",
    middleName: "",
}

const Beneficiary = () => {
    const { currentUser } = useContext(UserContext);
    const { id } = useParams();
    const [beneficiary, setBeneficiary] = useState(defaultProject);
    const { lastName, firstName, middleName, barangay, municipality, province } = beneficiary;
    const navigate = useNavigate();
    const [projects, setProjects = () => []] = useState([]);
    const [confirm, setConfirm] = useState(false);
    const [modal, setModal] = useState("");

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getBeneficiaryDocument(id);
            setBeneficiary(doc);
        }
        getDoc();
    }, []);

    useEffect(() => {
        const getDocs = async () => {
            const docs = await getBeneficiaryProjectDocuments(id);
            setProjects(docs);
        }
        getDocs();
    }, []);

    const onEditHandler = () => {
        navigate("/beneficiaries/" + id + "/edit")
    }

    const onDeleteHandler = async() => {
        const res = await updateBeneficiaryDocument(beneficiary.id, {"status": "deleted"});
        setConfirm(false);
        if (res === "success") {
            navigate("/beneficiaries/approved");
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
                        <p className="modal-card-title">Would you like to delete beneficiary?</p>
                    </header>
                    <footer className="modal-card-foot has-text-centered is-block pb-5">
                        <button className="button" onClick={() => {setConfirm(false)}}>No</button>
                        <button className="button is-success" onClick={onDeleteHandler}>Yes</button>
                    </footer>
                </div>
            </div> : ""}

            {currentUser.data.type !== "beneficiary" ?
                        <nav className="breadcrumb mb-6">
                        <ul>
                            <li><a onClick={() => {navigate("/")}}>Home</a></li>
                            <li><a onClick={() => {navigate("/beneficiaries/approved")}}>Beneficiaries</a></li>
                            <li className="is-active"><a aria-current="page">{lastName + ", " + firstName + " " + middleName.charAt(0)}</a></li>
                        </ul>
                    </nav>
            : ""}

            <h2 className='is-block is-size-4 has-text-weight-bold'>{lastName + ", " + firstName + " " + middleName.charAt(0)}
            {currentUser.data.type !== "beneficiary" ? 
            <div className='is-pulled-right'><Button additionalClasses="block mr-3" type="button" onClick={onEditHandler}>Edit</Button>
            <Button additionalClasses="block is-danger" type="button" onClick={() => {setConfirm(true)}}>Delete</Button></div> : ""}</h2>
            <p className='block'>{barangay + ", " + municipality + ", " + province}</p>

            {projects.length > 0 ? <div className="table-container mt-6">
                <table className="table is-fullwidth is-hoverable is-borderless">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Project Title</th>
                            <th>Status</th>
                            <th>Started Date</th>
                            <th>Finished Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {projects.map((project, index) => {
                        return (
                            <BeneficiaryProjectItem key={project.id} project={project} index={index + 1}/>
                        )
                    })}
                    </tbody>
                </table>
            </div> : <p className='has-text-centered' style={{marginTop: 200 + "px"}}>{"No projects"}</p>
            }
        </div>
    )
}

export default Beneficiary;