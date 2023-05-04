import { useState, useEffect } from 'react';
import { getProjectDocument, getBeneficiaryDocument } from "../utils/firebase";
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/button';
import PayrollItem from '../components/payroll-item';
import logo from '../logo.png';
import html2canvas from 'html2canvas';

const defaultProject = {
    dailyWage: "0",
    values: [],
    selected: [],
}

const Payroll = () => {
    const { id } = useParams();
    const [project, setProject] = useState(defaultProject);
    const { dailyWage, values, selected } = project;
    const navigate = useNavigate();
    const [beneficiariesList, setBeneficiariesList = () => []] = useState([]);

    useEffect(() => {
        const getDoc = async () => {
            const doc = await getProjectDocument(id);
            setProject(doc);
        }
        getDoc();
    }, []);

    useEffect(() => {
        if (beneficiariesList.length > 0) {
            return;
        }
        selected.forEach(async(item, i) => {
            const doc = await getBeneficiaryDocument(item);
            if (doc) {
                beneficiariesList.push(doc);
                beneficiariesList.sort((a, b) => {
                    const a1 = a.lastName.toLowerCase().replace(" ", "") + a.firstName.toLowerCase().replace(" ", "");
                    const b1 = b.lastName.toLowerCase().replace(" ", "") + b.firstName.toLowerCase().replace(" ", "");
                    console.log(a1 + "/" + b1);
    
                    if ( a1 < b1 ){
                        return -1;
                    }
                    if ( a1 > b1 ){
                        return 1;
                    }
    
                    return 0;
                });
                setBeneficiariesList([...beneficiariesList]);
            }
        });
    }, [project]);

    const onPrintHandler = () => {
        var printContents = document.getElementById("print");
    
        html2canvas(printContents, {scale: 3}).then(function(canvas) {
          var myImage = canvas.toDataURL('image/png');
    
          var mywindow = window.open('PRINT');
    
          mywindow.document.write('<html><head><title>' + document.title  + '</title>');
          mywindow.document.write('</head><body >');
          mywindow.document.write('<img src="' + myImage + '" style="width: 100%"/>');
          mywindow.document.write('</body></html>');
      
          setTimeout(() => {
            mywindow.document.close();
            mywindow.focus();
        
            mywindow.print();
            mywindow.close();
          }, 10)
        })
      }

      var total = 0;

    return (
        <div className='column is-12 mt-4'>
            
            <a className="icon-text" onClick={() => {navigate("/projects/" + id)}}>
            <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 6-6m-6 6 6 6m-6-6h14"></path></svg></span> 
                                    <span className="has-text-weight-medium ml-3">Back</span> 
                                    </a>

            <div id='print' className='mt-6'>
                {/* <div className='has-text-centered columns is-vcentered is-centered'>
                    <img src={logo} style={{height: 50 + "px"}}/>
                    <span className='is-size-4 ml-6'>DOLE - TUPAD Payroll System</span>
                </div> */}

                <p className='has-text-centered has-text-weight-medium'>Republic of the Philippines</p>
                <p className='has-text-centered has-text-weight-medium'>DEPARTMENT OF LABOR AND EMPLOYMENT</p>
                <p className='has-text-centered has-text-weight-medium'>Regional Office No. 5</p>

                <p><span style={{width: 200 + "px", display: "inline-block"}}>Province:</span><span className='has-text-weight-medium with-border-bottom'>{project.province}</span></p>
                <p><span style={{width: 200 + "px", display: "inline-block"}}>Municipality:</span><span className='has-text-weight-medium with-border-bottom'>{project.municipality}</span></p>
                <p><span style={{width: 200 + "px", display: "inline-block"}}>Barangay:</span><span className='has-text-weight-medium with-border-bottom'>{project.barangay}</span></p>
                <div className="table-container mt-6">
                    <table className="table is-fullwidth is-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>ID Number</th>
                                <th colSpan="3" className='has-text-centered'>Name of Worker</th>
                                <th className='has-text-centered'>Address</th>
                                <th>Rate per Day</th>
                                <th>No. of Days</th>
                                <th>Earned for the Period</th>
                                <th colSpan="2">Signature</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {beneficiariesList.map((beneficiary, index) => {
                                total += dailyWage * values[index];
                            return (
                                <PayrollItem dailyWage={dailyWage} value={values[index]} key={beneficiary.id} beneficiary={beneficiary} index={index + 1}/>
                            )
                        })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <th colSpan="8" className='has-text-centered'></th>
                                <th>P {total.toLocaleString()}</th>
                                <th colSpan="2"></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div className='column is-4 mt-4'>
                Funds Available:
                        <div className='columns mt-3 mb-6'>
                            <div className='has-text-centered column is-6 is-offset-6'>
                            __________________________________________<br/>
                                Chief Accountant
                                </div>
                        </div>
                </div>
                        
                <div className='columns'>
                    <div className='column is-4'>
                        1. I CERTIFY on my official oath that the above Payroll is correct and that the services have been duly rendered.
                        <div className='columns mt-3 mb-6'>
                            <div className='has-text-centered column is-6 is-offset-6'>
                                __________________________________________<br/>
                                Provincial Head
                                </div>
                        </div>

                        2. Approved payable from appropriation.
                        <div className='columns mt-3'>
                            <div className='has-text-centered column is-6 is-offset-6'>
                            __________________________________________<br/>
                                Regional Director
                                </div>
                        </div>
                    </div>
                        
                    <div className='column is-4 is-offset-4'>
                    3. I CERTIFY on my official oath that I have processed the release of funds for the payment of saliaries of TUPAD beneficiaries and I have depositied the same to the back of ________________________.
                        <div className='columns mt-3 mb-6'>
                            <div className='has-text-centered column is-6 is-offset-6'>
                            __________________________________________<br/>
                                Cashier/Treasurer
                                </div>
                        </div>

                        4. I CERTIFY on my official oath that I have paid to each worker whose names appear above the amount set opposite their name.
                        <div className='columns mt-3'>
                            <div className='has-text-centered column is-6 is-offset-6'>
                            __________________________________________<br/>
                                DOLE Staff
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='has-text-centered'><Button type="button" onClick={onPrintHandler} additionalClasses="is-medium is-info block mt-6">Print</Button></div>
        </div>
    )
}

export default Payroll;