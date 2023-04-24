import { format } from "date-fns";
import {useNavigate} from 'react-router-dom';
import Button from "./button";

const BeneficiaryProjectItem = ({ index, project, additionalClasses }) => {
    const { title, status, startedDate, finishedDate } = project;
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate("/projects/" + project.id)
    }

    return (
        <tr className={additionalClasses ? additionalClasses : ""}>
            <td>{index}</td>
            <td>{title}</td>
            <td>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()}</td>
            <td>{startedDate ? format(startedDate.toDate(), "MMM dd, yyyy") : "-"}</td>
            <td>{finishedDate ? format(finishedDate.toDate(), "MMM dd, yyyy") : "-"}</td>
            <td><Button type="button" onClick={onClickHandler}>Details</Button></td>
        </tr>
    );
}

export default BeneficiaryProjectItem;