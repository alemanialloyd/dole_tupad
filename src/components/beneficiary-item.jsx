import { format } from "date-fns";
import Button from "./button";
import {useNavigate} from 'react-router-dom';
import { Fragment } from "react";

const BeneficiaryItem = ({ beneficiary, index, handleApprove, created }) => {
    const { lastName, firstName, middleName, birthDate, province, municipality, barangay, id } = beneficiary;
    const navigate = useNavigate();

    var reg = null;
    if (created) {
        reg = new Date(1970, 0, 1);
        reg.setSeconds(created.seconds + 28800);
    }

    const onClickHandler = () => {
        if (handleApprove) {
            handleApprove(id, "details");
            return;
        }
        navigate('/beneficiaries/' + beneficiary.id);
      }

    return (
        <tr>
            <td>{index}</td>
            <td>{lastName}</td>
            <td>{firstName}</td>
            <td>{middleName}</td>
            <td>{format(new Date(birthDate), "MMM dd, yyyy")}</td>
            <td>{barangay + ", " + municipality + ", " + province}</td>
            {reg ?
                <td>{format(reg, "hh:mm MMM dd, yyyy")}</td> : ""
            }
            <td className="has-text-centered">
            {handleApprove ? <Fragment>
                <Button type="button" additionalClasses="is-success is-fullwidth"  onClick={()=> {handleApprove(id, "approved")}}>Approve</Button>
                <Button type="button" additionalClasses="is-fullwidth is-danger my-3" onClick={()=> {handleApprove(id, "disapproved")}}>Disapprove</Button>
            </Fragment> : ""}
            <Button type="button" onClick={onClickHandler} additionalClasses="is-fullwidth">Details</Button>
            </td>
        </tr>
    );
}

export default BeneficiaryItem;