import { format, sub } from "date-fns";

const SummaryReportItem = ({ index, project }) => {
    const { title, startedDate, municipality, barangay, province, dailyWage, days, beneficiaries } = project;
    const subtotal = (parseInt(dailyWage) * parseInt(days) * parseInt(beneficiaries));
    const total = subtotal + (356 * beneficiaries);

    var started = new Date(1970, 0, 1);
    started.setSeconds(startedDate.seconds);

    return (
        <tr>
            <td>{index}</td>
            <td>{title}</td>
            <td>{startedDate ? format(started, "MMM dd, yyyy") : ""}</td>
            <td>{barangay + ", " + municipality + ", " + province}</td>
            <td>P {parseInt(dailyWage).toLocaleString()}</td>
            <td>{days}</td>
            <td>{beneficiaries}</td>
            <td>P {parseInt(subtotal).toLocaleString()}</td>
            <td>P 300.00</td>
            <td>P 56.00</td>
            <td>P {parseInt(total).toLocaleString()}</td>
        </tr>
    );
}

export default SummaryReportItem;