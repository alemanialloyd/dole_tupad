import { useState, useEffect } from 'react';
import { getBeneficiaryDocument, getBeneficiaryProjectDocuments } from "../utils/firebase";
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
    const { id } = useParams();
    const [beneficiary, setBeneficiary] = useState(defaultProject);
    const { lastName, firstName, middleName, barangay, municipality, province } = beneficiary;
    const navigate = useNavigate();
    const [projects, setProjects = () => []] = useState([]);

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

    return (
        <div className='column is-8 is-offset-2  my-6'>
            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li><a onClick={() => {navigate("/beneficiaries")}}>Beneficiaries</a></li>
                    <li className="is-active"><a aria-current="page">{lastName + ", " + firstName + " " + middleName.charAt(0)}</a></li>
                </ul>
            </nav>

            <h2 className='is-block is-size-4 has-text-weight-bold'>{lastName + ", " + firstName + " " + middleName.charAt(0)}
            <Button additionalClasses="block is-pulled-right" type="button" onClick={onEditHandler}>Edit</Button></h2>
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