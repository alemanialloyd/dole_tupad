import { format, sub } from "date-fns";

const SummaryReportItem = ({ index, project }) => {
    const { title, startedDate, municipality, barangay, province, dailyWage, days, beneficiaries, district, budget } = project;
    const subtotal = (parseInt(dailyWage) * parseInt(days) * parseInt(beneficiaries));
    const total = subtotal + (356 * beneficiaries);
    const bud = parseFloat(budget);
    const rem = bud - total;

    const ppe = 300 * beneficiaries;
    const ins = 56 * beneficiaries;

    var started = new Date(1970, 0, 1);
    started.setSeconds(startedDate.seconds + 28800);

    return (
        <tr>
            <td>{index}</td>
            <td>{title}</td>
            <td>{startedDate ? format(started, "MMM dd, yyyy") : ""}</td>
            <td>{barangay.length > 0 ? barangay.join(" - ") : municipality.length > 0 ? municipality.join(", ") : district}</td>
            <td className="has-text-right">P {parseFloat(dailyWage).toLocaleString()}</td>
            <td className="has-text-right">{days}</td>
            <td className="has-text-right">{beneficiaries}</td>
            <td className="has-text-right">P {parseFloat(subtotal).toLocaleString()}</td>
            <td className="has-text-right">P {parseFloat(ppe).toLocaleString()}</td>
            <td className="has-text-right">P {parseFloat(ins).toLocaleString()}</td>
            <td className="has-text-right">P {parseFloat(total).toLocaleString()}</td>
            <td className="has-text-right">P {parseFloat(bud).toLocaleString()}</td>
            <td className="has-text-right">P {parseFloat(rem).toLocaleString()}</td>
        </tr>
    );
}

export default SummaryReportItem;