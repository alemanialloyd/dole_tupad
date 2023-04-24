
const FormInput = ({ label, additionalClasses, ...otherProps }) => {
    return (
        <div className={`${additionalClasses ? additionalClasses : ""}`}>
        {label && (
            <label>{label}</label>
        )}
        <input {...otherProps} className="input"/>
        </div>
    );
}

export default FormInput;