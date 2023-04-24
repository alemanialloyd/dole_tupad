import { format } from "date-fns";
import FormInput from "./form-input";

const PayrollItem = ({ index, beneficiary, dailyWage, value }) => {
    const { lastName, firstName, middleName } = beneficiary;

    const total = parseFloat(dailyWage, 10) * parseInt(value);

    return (
        <tr>
            <td>{index}</td>
            <td>{lastName + ", " + firstName + " " + middleName.charAt(0)}</td>
            <td>P {parseInt(dailyWage).toLocaleString()}</td>
            <td>{value}</td>
            <td>P {total.toLocaleString()}</td>
            <td>P 0.00</td>
            <td>P {total.toLocaleString()}</td>
            <td>_____________________________</td>
            <td>{index}</td>
        </tr>
    );
}

export default PayrollItem;