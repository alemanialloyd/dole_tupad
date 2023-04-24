import AccountItem from "../components/account-item"
import { useState, useEffect, Fragment } from 'react';
import { getAccountDocuments } from "../utils/firebase";
import {useNavigate} from 'react-router-dom';

const Accounts = () => {
    const [accounts, setAccounts = () => []] = useState([]);
    const [page, setPage] = useState(0);
    const maxDocs = 20;
    const navigate = useNavigate();

    useEffect(() => {
        async function getDocs() {
            const docs = await getAccountDocuments();
            setAccounts(docs);
        };
        getDocs();
    }, []);

    const pages = [];
    for (let i = 0; i < accounts.length / maxDocs; i++) {
        pages.push(i);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>
            <nav className="breadcrumb mb-6">
                <ul>
                    <li><a onClick={() => {navigate("/")}}>Home</a></li>
                    <li className="is-active"><a aria-current="page">Accounts</a></li>
                </ul>
            </nav>

            <h2 className='is-size-4 has-text-weight-bold column is-6'>Accounts</h2>  

            {accounts.length > 0 ?
            <Fragment>
                <div className="columns is-multiline mt-6">
                    {accounts.map((account, index) => {
                        if (index >= (page * maxDocs) && index < maxDocs + (page * maxDocs)) {
                            return (
                                <AccountItem key={account.id} account={account} additionalClasses="column is-4"/>
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
                </Fragment> : <p className='has-text-centered' style={{marginTop: 200 + "px"}}>No accounts</p>}
        </div>
    )
}

export default Accounts;