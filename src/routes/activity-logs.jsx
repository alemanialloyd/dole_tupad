import { useContext, useState, useEffect, Fragment } from 'react';
import { getLogs, getUserDocument, getUsers } from "../utils/firebase";
import { useLocation, useNavigate } from 'react-router-dom'
import { format } from "date-fns";

const ActivityLogs = () => {
    const [logs, setLogs = () => []] = useState([]);
    const [page, setPage] = useState(0);
    const [users, setUsers] = useState([]);
    const maxDocs = 20;
    const navigate = useNavigate();

    useEffect(() => {
        async function getDocs() {
            const docs = await getLogs();
            setLogs(docs);
        };
        getDocs();
    }, []);
    
    useEffect(() => {
        async function getDocs() {
            const docs = await getUsers();
            setUsers(docs);
        };
        getDocs();
    }, []);

    const pages = [];
    for (let i = 0; i < logs.length / maxDocs; i++) {
        pages.push(i);
    }

    return (
        <div className='column is-8 is-offset-2  my-6'>

        <nav className="breadcrumb mb-6">
            <ul>
                <li><a onClick={() => {navigate("/")}}>Home</a></li>
                <li className="is-active"><a aria-current="page">Activity Logs</a></li>
            </ul>
        </nav>

        <h2 className='is-size-4 has-text-weight-bold column is-4'>Activity Logs</h2>

        <div className="table-container mt-6">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Activity</th>
                            <th>Date</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {logs.map((log, index) => {
                        if (index >= (page * maxDocs) && index < maxDocs + (page * maxDocs)) {
                            var reg = null;
                            if (log.created) {
                                reg = new Date(1970, 0, 1);
                                reg.setSeconds(log.created.seconds + 28800);
                            }
                            const pos = users.map(a => a.id).indexOf(log.by);
                            return (
                                <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{log.action}</td>
                                <td>{reg ? format(reg, "hh:mma MMM dd, yyyy") : "-"}</td>
                                <td>{pos > -1 ? users[pos].firstName + " " + users[pos].lastName : "Undefined"}</td>
                            </tr>
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

export default ActivityLogs;