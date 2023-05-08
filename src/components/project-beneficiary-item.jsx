import { format } from "date-fns";
import FormInput from "./form-input";

const ProjectBeneficiaryItem = ({ index, project, beneficiary, onAddHandler, additionalClasses, value, onValueChange }) => {
    const { lastName, firstName, middleName, birthDate, province, municipality, barangay } = beneficiary;
    const { status, days } = project;

    const onAdd = () => {
        onAddHandler(beneficiary.id);
    }

    return (
        <tr onClick={onAdd} className={additionalClasses ? additionalClasses : ""}>
            <td>{lastName + ", " + firstName + " " + middleName.charAt(0)}</td>
            <td>{format(new Date(birthDate), "MMM dd, yyyy")}</td>
            <td>{barangay + ", " + municipality + ", " + province}</td>
            <td>{status === "pending" ? <input readOnly type="checkbox" checked={additionalClasses ? additionalClasses.includes("is-active") : false}/> : status === "ongoing" ? <FormInput id={index} onChange={(e) => {onValueChange(e)}} min="0" value={value} max={parseInt(days)} required style={{width: 100 + "px"}} type="number"/> : value}</td>
        </tr>
    );
}

export default ProjectBeneficiaryItem;