import { format } from "date-fns";
import FormInput from "./form-input";

const PayrollItem = ({ index, beneficiary, dailyWage, value }) => {
    const { lastName, firstName, middleName, municipality, barangay, province, idNumber } = beneficiary;

    const total = parseFloat(dailyWage, 10) * parseInt(value);

    return (
        <tr>
            <td>{index}</td>
            <td>{idNumber}</td>
            <td>{lastName}</td>
            <td>{firstName}</td>
            <td>{middleName}</td>
            <td>{barangay + ", " + municipality + ", " + province}</td>
            <td className="has-text-right">P {parseInt(dailyWage).toLocaleString()}</td>
            <td className="has-text-right">{value}</td>
            <td className="has-text-right">P {total.toLocaleString()}</td>
            <td className="no-border-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td className="no-border-left">{index}</td>
        </tr>
    );
}

export default PayrollItem;