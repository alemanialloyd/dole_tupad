import Button from "./button";
import {useNavigate} from 'react-router-dom';

const ProjectItem = ({text, project, additionalClasses}) => {
    const { title, barangay, municipality, province, beneficiaries, budget, days } = project;
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate('/projects/' + project.id);
      }

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    return (
        <div className={`${additionalClasses ? additionalClasses : ""} mt-4`}>
            <div className="card columns py-6 is-vcentered" style={{height: 350 + "px"}}>
                <div className="card-content column">
                    <div className="content has-text-centered px-4 py-4">
                            <h1 className='is-size-3'>{title}</h1>
                            {barangay + ", " + municipality + ", " + province}
                            <div className="mt-3">
                                <span className="icon-text">
                                    <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 19c0-3.314-3.134-6-7-6-.807 0-2.103-.293-3-1.235"></path></svg></span> 
                                    <span className="has-text-weight-medium mr-3">{beneficiaries}</span> 
                                    <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10V8a2 2 0 0 1 2-2h2m-4 4c1.333 0 4-.8 4-4m-4 4v4m18-4V8a2 2 0 0 0-2-2h-2m4 4c-1.333 0-4-.8-4-4m4 4v4M7 6h10m4 8v2a2 2 0 0 1-2 2h-2m4-4c-1.333 0-4 .8-4 4m0 0H7m-4-4v2a2 2 0 0 0 2 2h2m-4-4c1.333 0 4 .8 4 4"></path><circle cx="12" cy="12" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle></svg></span> 
                                    <span className="has-text-weight-medium mr-3">{kFormatter(parseFloat(budget, 10))}</span>
                                    <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 9V7a2 2 0 0 1 2-2h2M4 9h16m0 0V7a2 2 0 0 0-2-2h-2m0 0V3m0 2H8m0-2v2"></path></svg></span> 
                                    <span className="has-text-weight-medium">{days}</span>
                                </span>
                            </div>
                            <Button additionalClasses="mt-5" type="button" onClick={onClickHandler}>{text}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectItem;