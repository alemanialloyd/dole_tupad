import BeneficiaryItem from "../components/beneficiary-item"
import { useContext, useState, useEffect } from 'react';
import { createLog, getBeneficiaryDocuments, updateBeneficiaryDocument } from "../utils/firebase";
import { StaticContext } from "../context/static-context";
import FormSelect from "../components/form-select";
import {useLocation, useNavigate} from 'react-router-dom';
import FormInput from "../components/form-input";

const defaultFormFields = {
    province: 'Camarines Norte',
    municipality: 'All',
    barangay: 'All',
}

const ForApproval = () => {
    const { municipalities, basud, capalonga, daet, jpang, labo, mercedes, paracale, slr, sv, se, talisay, vinzons } = useContext(StaticContext);
    const [beneficiaries, setBeneficiaries = () => []] = useState([]);
    const [allBeneficiaries, setAllBeneficiaries = () => []] = useState([]);
    const [barangays, setbarangays] = useState([]);
    const [search, setSearch] = useState("");
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {province, municipality, barangay} = formFields;
    const navigate = useNavigate();
    const location = useLocation();
    const [modal, setModal] = useState("");
    const [lnDir, setLnDir] = useState("asc");
    const [fnDir, setFnDir] = useState("asc");
    const [sort, setSort] = useState(0);
    const [filter, setFilter] = useState("");
    const [modalFilter, setModalFilter] = useState(0);

    useEffect(() => {
        async function getDocs() {
            const docs = await getBeneficiaryDocuments("for-approval", municipality, barangay);
            setAllBeneficiaries(docs);
        };
        getDocs();
    }, [formFields]);

    useEffect(() => {
        const res = allBeneficiaries.filter((item) => {return item.lastName.toLowerCase().includes(search.toLowerCase()) || 
            item.firstName.toLowerCase().includes(search.toLowerCase()) || item.middleName.toLowerCase().includes(search.toLowerCase())});

        if (filter !== "") {
            res = res.filter((item) => {return item.lastName.toLowerCase().substring(0, 1) === filter});
        }

        res.sort((a, b) => {
            const a1 = sort === 0 ? lnDir === "desc" ? a.lastName.toLowerCase() : b.lastName.toLowerCase() : fnDir === "desc" ? a.firstName.toLowerCase() : b.firstName.toLowerCase();
            const b1 = sort === 0 ? lnDir === "desc" ? b.lastName.toLowerCase() : a.lastName.toLowerCase() : fnDir === "desc" ? b.firstName.toLowerCase() : a.firstName.toLowerCase();

            if ( a1 < b1 ){
                return 1;
            }
            if ( a1 > b1 ){
                return -1;
            }

            return 0;
        });

        setBeneficiaries(res);
    }, [search, allBeneficiaries]);


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

    const handleSearch = (event) => {
        const { value } = event.target;

        setSearch(value);
    }

    const handleApprove = async(id, status) => {
        const res = await updateBeneficiaryDocument(id, {"status": status});

        if (res === "success") {
            const log = {"action": "Admin " + status + " an account", "id": id, "type" : "beneficiary"}
            await createLog(log);

            setAllBeneficiaries(allBeneficiaries.filter((item) => {return id !== item.id}));
        } else {
            setModal(res);
        }
    }

    const onClickHandler = (e) => {
        const value = e.target.value;

        setModalFilter(0);
        if (value === "Clear") {
            setFilter("");
            return;
        }

        setFilter(value.toLowerCase());
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

            {modalFilter === 1 ? <div className="modal is-active is-white">
  <div className="modal-background"></div>
    <div className="column is-6">
        <div className="columns is-multiline">
            <div className="column is-12 is-size-3 has-text-centered has-text-black mb-6">Filter</div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="A">A</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="B">B</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="C">C</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="D">D</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="E">E</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="F">F</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="G">G</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="H">H</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="I">I</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="J">J</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="K">K</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="L">L</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="M">M</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="N">N</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="O">O</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="P">P</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="Q">Q</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="R">R</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="S">S</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="T">T</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="U">U</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="V">V</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="W">W</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="X">X</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="Y">Y</button></div>
            <div className="column is-1"><button className="button" onClick={onClickHandler} value="Z">Z</button></div>
            <div className="column is-2"><button className="button" onClick={onClickHandler} value="Clear">Clear</button></div>
        </div>
    </div>
  <button className="modal-close is-large" aria-label="close" onClick={() => {setModalFilter(0)}}></button>
</div> : ""}

            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li className="is-active"><a aria-current="page">For Approval</a></li>
                </ul>
            </nav>

        <div className="columns is-vcentered">
            <h2 className='is-size-4 has-text-weight-bold column is-4'>For Approval</h2>
            <FormSelect options={["Camarines Norte"]} type="text" required id="province" onChange={handleChange} value={province} label="Province" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...municipalities]} type="text" required id="municipality" onChange={handleChange} value={municipality} label="Municipality" additionalClasses="column is-2"/>
            <FormSelect options={["All", ...barangays]} type="text" required id="barangay" onChange={handleChange} value={barangay} label="Barangay" additionalClasses="column is-2"/>
            <FormInput type="text" id="search" value={search} onChange={handleSearch} label="Search" additionalClasses="column is-2"/>
        </div>    

            <div className="table-container mt-6">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th className="is-selectable" onClick={() => {setLnDir(lnDir === "asc" ? "desc" : "asc"); setSort(0)}}><p className="icon-text">Last Name <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={lnDir === "desc" ? "m12 19 6-6m-6 6-6-6m6 6V5" : "m12 5 6 6m-6-6-6 6m6-6v14"}></path></svg></span></p></th>
                            <th className="is-selectable" onClick={() => {setFnDir(fnDir === "asc" ? "desc" : "asc"); setSort(1)}}><p className="icon-text">First Name <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={fnDir === "desc" ? "m12 19 6-6m-6 6-6-6m6 6V5" : "m12 5 6 6m-6-6-6 6m6-6v14"}></path></svg></span></p></th>
                            <th>Middle Name</th>
                            <th>Date of Birth</th>
                            <th>Province</th>
                            <th>Municipality</th>
                            <th>Barangay</th>
                            <th>Registered Date</th>
                            <th>
                            <button className="button is-pulled-right" onClick={() => {setModalFilter(1)}}>
                            <span className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" d="M18 4H6c-1.105 0-2.026.91-1.753 1.98a8.018 8.018 0 0 0 4.298 5.238c.823.394 1.455 1.168 1.455 2.08v6.084a1 1 0 0 0 1.447.894l2-1a1 1 0 0 0 .553-.894v-5.084c0-.912.632-1.686 1.454-2.08a8.017 8.017 0 0 0 4.3-5.238C20.025 4.91 19.103 4 18 4z"></path></svg>
                            </span>
                            </button>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {beneficiaries.map((beneficiary, index) => {
                        return (
                            <BeneficiaryItem key={beneficiary.id} beneficiary={beneficiary} index={index + 1} handleApprove={handleApprove} created={beneficiary.created}/>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ForApproval;