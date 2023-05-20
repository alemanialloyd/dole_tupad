import Button from "./button";

const AvailableProjectItem = ({project, additionalClasses, uid, onClickHandler}) => {
    const { title, barangay, municipality, province, beneficiaries, budget, days, dailyWage, district, status, type, applicants } = project;

    return (
        <div className={`${additionalClasses ? additionalClasses : ""} mt-4`}>
            <div className="card columns py-6 is-vcentered" style={{height: 350 + "px"}}>
                <div className="card-content column">
                    <div className="content has-text-centered px-4 py-4">
                        <span className={`tag ${type === "special" ? "is-link" : "is-primary"}`}>{type === "special" ? "Special" : "Regular"}</span>
                        <h1 className='is-size-3'>{title}</h1>
                        {barangay.length > 0 ? barangay.join(" - ") : municipality.length > 0 ? municipality.join(", ") : district}
                        <div className="mt-3">
                            <span className="icon-text">
                                <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 19c0-3.314-3.134-6-7-6-.807 0-2.103-.293-3-1.235"></path></svg></span> 
                                <span className="has-text-weight-medium mr-4">{beneficiaries}</span> 
                                <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M4 9V7a2 2 0 0 1 2-2h2M4 9h16m0 0V7a2 2 0 0 0-2-2h-2m0 0V3m0 2H8m0-2v2"></path></svg></span> 
                                <span className="has-text-weight-medium mr-4">{days}</span>
                                
                                <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 8c0-1.657-3.134-3-7-3S7 6.343 7 8m14 0v4c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 13.92 7 13.02 7 12V8m14 0c0 1.02-1.186 1.92-3 2.462-1.134.34-2.513.538-4 .538s-2.866-.199-4-.538C8.187 9.92 7 9.02 7 8"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12v4c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538s2.866-.199 4-.538c1.813-.542 3-1.442 3-2.462v-1M3 12c0-1.197 1.635-2.23 4-2.711M3 12c0 1.02 1.187 1.92 3 2.462 1.134.34 2.513.538 4 .538.695 0 1.366-.043 2-.124"></path></svg></span>
                                <span className="has-text-weight-medium">P {parseFloat(dailyWage).toFixed(2)}</span>
                            </span>
                        </div>
                        <Button additionalClasses={`mt-5 ${applicants ? applicants.includes(uid) ? "is-danger" : "is-success" : "is-success"}`} type="button" onClick={() => {onClickHandler(project.id, applicants ? applicants.includes(uid) ? "remove" : "add" : "add")}}>{applicants ? applicants.includes(uid) ? "Cancel" : "Apply" : "Apply"}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvailableProjectItem;