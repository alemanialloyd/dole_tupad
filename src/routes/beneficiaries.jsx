import BeneficiaryItem from "../components/beneficiary-item"
import { useContext, useState, useEffect } from 'react';
import { getBeneficiaryDocuments } from "../utils/firebase";
import { StaticContext } from "../context/static-context";
import FormSelect from "../components/form-select";
import {useNavigate} from 'react-router-dom';

const defaultFormFields = {
    province: 'Camarines Norte',
    municipality: 'All',
    barangay: 'All',
}

const Beneficiaries = () => {
    const { municipalities, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const [beneficiaries, setBeneficiaries = () => []] = useState([]);
    const [page, setPage] = useState(0);
    const maxDocs = 20;
    const [barangays, setbarangays] = useState([]);
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {province, municipality, barangay} = formFields;
    const navigate = useNavigate();

    useEffect(() => {
        async function getDocs() {
            const docs = await getBeneficiaryDocuments(municipality, barangay);
            setBeneficiaries(docs);
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
    for (let i = 0; i < beneficiaries.length / maxDocs; i++) {
        pages.push(i);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>
            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li className="is-active"><a aria-current="page">Beneficiaries</a></li>
                </ul>
            </nav>

        <div className="columns is-vcentered">
            <h2 className='is-size-4 has-text-weight-bold column is-6'>Beneficiaries</h2>
            <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...municipalities]} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...barangays]} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-2"/>
        </div>    

            <div className="table-container mt-6">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Middle Name</th>
                            <th>Date of Birth</th>
                            <th>Province</th>
                            <th>Municipality</th>
                            <th>Barangay</th>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {beneficiaries.map((beneficiary, index) => {
                        if (index >= (page * maxDocs) && index < maxDocs + (page * maxDocs)) {
                            return (
                                <BeneficiaryItem key={beneficiary.id} beneficiary={beneficiary} index={index + 1}/>
                            )
                        }
                    })}
                    </tbody>
                </table>
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
        </div>
    )
}

export default Beneficiaries;