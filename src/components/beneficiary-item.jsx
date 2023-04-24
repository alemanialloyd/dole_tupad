import { format } from "date-fns";
import Button from "./button";
import {useNavigate} from 'react-router-dom';

const BeneficiaryItem = ({ beneficiary, index }) => {
    const { lastName, firstName, middleName, birthDate, province, municipality, barangay } = beneficiary;
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate('/beneficiaries/' + beneficiary.id);
      }

    return (
        <tr>
            <td>{index}</td>
            <td>{lastName}</td>
            <td>{firstName}</td>
            <td>{middleName}</td>
            <td>{format(new Date(birthDate), "MMM dd, yyyy")}</td>
            <td>{province}</td>
            <td>{municipality}</td>
            <td>{barangay}</td>
            <td><Button type="button" onClick={onClickHandler}>Details</Button></td>
        </tr>
    );
}

export default BeneficiaryItem;