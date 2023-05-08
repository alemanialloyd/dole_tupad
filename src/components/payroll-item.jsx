import { format } from "date-fns";
import FormInput from "./form-input";

const PayrollItem = ({ index, beneficiary, dailyWage, value }) => {
    const { lastName, firstName, middleName, municipality, barangay, province, idNumber, created } = beneficiary;

    const total = parseFloat(dailyWage, 10) * parseInt(value);
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    return (
        <tr>
            <td>{index}</td>
            <td>RO5-CNPO-{created.toDate().getFullYear()}-{zeroPad(created.toDate().getMonth() + 1, 2)}-{zeroPad(idNumber, 4)}</td>
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