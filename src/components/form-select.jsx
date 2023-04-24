
const FormSelect = ({ label, options, additionalClasses, ...otherProps }) => {
    return (
        <div className={`${additionalClasses ? additionalClasses : ""} select`}>
                {label && (
                    <label>{label}</label>
                )}
            <select {...otherProps}>
                <option disabled>Select</option>
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        </div>
    );
}

export default FormSelect;