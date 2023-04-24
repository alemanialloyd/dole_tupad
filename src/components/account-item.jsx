import Button from "./button";
import {useNavigate} from 'react-router-dom';

const AccountItem = ({account, additionalClasses}) => {
    const { firstName, lastName, middleName, id, emailAddress } = account;
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate('/accounts/' + id + '/edit');
      }

    return (
        <div className={`${additionalClasses ? additionalClasses : ""} mt-4`}>
            <div className="card columns py-6 is-vcentered" style={{height: 350 + "px"}}>
                <div className="card-content column">
                    <div className="content has-text-centered px-4 py-4">
                            <h1 className='is-size-3'>{lastName + ", " + firstName + " " + middleName.charAt(0)}</h1>
                            <p>{emailAddress}</p>
                            <Button additionalClasses="mt-5" type="button" onClick={onClickHandler}>Edit</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountItem;