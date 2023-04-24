
const FormTextArea = ({ label, additionalClasses, ...otherProps }) => {
    return (
        <div className={`${additionalClasses ? additionalClasses : ""}`}>
        {label && (
            <label>{label}</label>
        )}
        <textarea {...otherProps} className="textarea"/>
        </div>
    );
}

export default FormTextArea;