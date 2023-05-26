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

const Profile = () => {
    const { currentUser } = useContext(UserContext);
    const { id } = useParams();
    const [beneficiary, setBeneficiary] = useState(defaultProject);
    const { lastName, firstName, middleName, barangay, municipality, province } = beneficiary;
    const navigate = useNavigate();

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getBeneficiaryDocument(currentUser.uid);
            setBeneficiary(doc);
        }
        getDoc();
    }, []);

    return (
        <div className='column is-8 is-offset-2  my-6'>

            {currentUser && currentUser.data && currentUser.data.type !== "beneficiary" ?
                        <nav className="breadcrumb mb-6">
                        <ul>
                            <li><a onClick={() => {navigate("/")}}>Home</a></li>
                            <li><a onClick={() => {navigate("/beneficiaries/approved")}}>Beneficiaries</a></li>
                            <li className="is-active"><a aria-current="page">{lastName + ", " + firstName + " " + middleName.charAt(0)}</a></li>
                        </ul>
                    </nav>
            : ""}

            <h2 className='is-block is-size-4 has-text-weight-bold'>{lastName + ", " + firstName + " " + middleName.charAt(0)}</h2>
            <p className='block'>{barangay + ", " + municipality + ", " + province}</p>

            {currentUser && currentUser.data && currentUser.data.type === "beneficiary" && currentUser.uid === id ? <div className={`notification py-5 mt-5 ${currentUser.data.status === "for-approval" ? "is-warning" : currentUser.data.status === "approved" ? "is-success" : "is-danger"}`}>
                Account Status : <span className='has-text-weight-bold'>{currentUser && currentUser.data && currentUser.data.status === "for-approval" ? "For Approval" : currentUser && currentUser.data && currentUser.data.status === "approved" ? "Approved" : "Disapproved"}</span>
                </div> : ""}

            <div className="columns is-multiline mt-6">
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
        </div>
    )
}

export default Profile;