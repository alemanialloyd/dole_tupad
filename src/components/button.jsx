const Button = ({ children, buttonType, additionalClasses, ...otherProps }) => {
    return <button className={`button ${additionalClasses ? additionalClasses : ""}`} {...otherProps}>{children}</button>
}

export default Button;