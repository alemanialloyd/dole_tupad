import { format } from "date-fns";
import {useNavigate} from 'react-router-dom';
import Button from "./button";

const BeneficiaryProjectItem = ({ index, project, additionalClasses, type, uid }) => {
    const { title, status, startedDate, finishedDate, barangay, municipality, dailyWage, selected, values } = project;
    const navigate = useNavigate();
    const pos = selected.indexOf(uid);

    const onClickHandler = () => {
        navigate("/projects/" + project.id)
    }

    return (
        <tr className={additionalClasses ? additionalClasses : ""}>
            <td>{index}</td>
            <td>{title}</td>
            <td>{startedDate ? format(startedDate.toDate(), "MMM dd, yyyy") : "-"}</td>
            <td>{values ? values[pos] : ""}</td>
            <td>{dailyWage}</td>
            <td>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()}</td>
            <td>{finishedDate ? format(finishedDate.toDate(), "MMM dd, yyyy") : "-"}</td>
            {type !== "beneficiary" ? <td><Button type="button" onClick={onClickHandler}>Details</Button></td> : ""}
        </tr>
    );
}

export default BeneficiaryProjectItem;