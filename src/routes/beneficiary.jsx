import { useState, useEffect, useContext, Fragment } from 'react';
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
    const [modalDetails, setModalDetails] = useState(false);

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getBeneficiaryDocument(id ? id : currentUser.uid);
            setBeneficiary(doc);
        }
        getDoc();
    }, []);

    useEffect(() => {
        const getDocs = async () => {
            const docs = await getBeneficiaryProjectDocuments(id ? id : currentUser.uid);
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


        {modalDetails ? <div className="modal is-active">
                <div className="modal-background"></div>
                <div className="modal-content" style={{width: 900 + "px"}}>
                    <header className="modal-card-head">
                        <p className="modal-card-title">{beneficiary.lastName + ", " + beneficiary.firstName}</p>
                    </header>
                    <section class="modal-card-body">
                        <div className="columns is-multiline">
                            <div className="column is-6"><label>First Name:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.firstName}</p></div>
                            <div className="column is-6"><label>Last Name:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.lastName}</p></div>
                            <div className="column is-6"><label>Middle Name:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.middleName ? beneficiary.middleName : "-"}</p></div>
                            <div className="column is-6"><label>Name Extension:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.extensionName ? beneficiary.extensionName : "-"}</p></div>
                            <div className="column is-6"><label>Sex/Gender:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.gender}</p></div>
                            <div className="column is-6"><label>Civil Status:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.civilStatus}</p></div>
                            <div className="column is-6"><label>Date of Birth:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.birthDate}</p></div>
                            <div className="column is-6"><label>Address:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.barangay + ", " + beneficiary.municipality + ", " + beneficiary.province}</p></div>
                            <div className="column is-6"><label>Occupation:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.occupationOthers ? beneficiary.occupation + " - " + beneficiary.occupationOthers : beneficiary.occupation}</p></div>
                            <div className="column is-6"><label>Dependent Name:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.dependentName}</p></div>
                            <div className="column is-6"><label>Type of ID:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.idTypeOthers ? beneficiary.idType + " - " + beneficiary.idTypeOthers : beneficiary.idType}</p></div>
                            <div className="column is-6"><label>Type of Beneficiary:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.beneficiaryTypeOthers ? beneficiary.beneficiaryType + " - " + beneficiary.beneficiaryTypeOthers : beneficiary.beneficiaryType}</p></div>
                            <div className="column is-6"><label>Skills/Training:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.interested === "Yes" ? beneficiary.skillsTrainingOthers ? beneficiary.skillsTraining + " - " + beneficiary.skillsTrainingOthers : beneficiary.skillsTraining : "No"}</p></div>
                            <div className="column is-6"><label>Email Address:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.emailAddress}</p></div>
                            <div className="column is-6"><label>Contact:</label> <p className="has-text-weight-medium is-size-5">{beneficiary.contactNumber}</p></div>
                        </div>
                    </section>
                    <footer className="modal-card-foot has-text-centered is-block">
                        <button className="button" onClick={() => {setModalDetails(false);}}>OK</button>
                    </footer>
                </div>
            </div> : ""}
            
            {confirm ? <div className="modal custom-modal has-text-centered is-active">
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

            {currentUser && currentUser.data && currentUser.data.type !== "beneficiary" ?
                        <nav className="breadcrumb mb-6">
                        <ul>
                            <li><a onClick={() => {navigate("/")}}>Home</a></li>
                            <li><a onClick={() => {navigate("/beneficiaries/approved")}}>Beneficiaries</a></li>
                            <li className="is-active"><a aria-current="page">{lastName + ", " + firstName + " " + middleName.charAt(0)}</a></li>
                        </ul>
                    </nav>
            : ""}

            <h2 className='is-block is-size-4 has-text-weight-bold'>{lastName + ", " + firstName + " " + middleName.charAt(0)}
            <div className='is-pulled-right'>
            <Button additionalClasses="block" type="button" onClick={() => {setModalDetails(true)}}>Details</Button>
            {currentUser && currentUser.data && currentUser.data.type !== "beneficiary" ? <Fragment>
            <Button additionalClasses="block mx-3" type="button" onClick={onEditHandler}>Edit</Button>
            <Button additionalClasses="block is-danger" type="button" onClick={() => {setConfirm(true)}}>Delete</Button>
            </Fragment>: ""}</div></h2>
            <p className='block'>{barangay + ", " + municipality + ", " + province}</p>

            {currentUser && currentUser.data && currentUser.data.type === "beneficiary" && currentUser.uid === id ? <div className={`notification py-5 mt-5 ${currentUser.data.status === "for-approval" ? "is-warning" : currentUser.data.status === "approved" ? "is-success" : "is-danger"}`}>
                Account Status : <span className='has-text-weight-bold'>{currentUser && currentUser.data && currentUser.data.status === "for-approval" ? "For Approval" : currentUser && currentUser.data && currentUser.data.status === "approved" ? "Approved" : "Disapproved"}</span>
                </div> : ""}

            {projects.length > 0 ? <div className="table-container mt-6">
                <table className="table is-fullwidth is-hoverable is-borderless">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Project Title</th>
                            <th>Started Date</th>
                            <th>Attendance</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Finished Date</th>
                            {currentUser && currentUser.data && currentUser.data.type !== "beneficiary" ? <th></th> : ""}
                        </tr>
                    </thead>
                    
                    <tbody>
                        {projects.map((project, index) => {
                        return (
                            <BeneficiaryProjectItem uid={currentUser.uid} key={project.id} project={project} index={index + 1} type={currentUser && currentUser.data && currentUser.data.type ? currentUser.data.type : ""}/>
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