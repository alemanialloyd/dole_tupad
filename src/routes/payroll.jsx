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
            beneficiariesList.push(doc);
            setBeneficiariesList([...beneficiariesList]);
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
                <div className='has-text-centered columns is-vcentered is-centered'>
                    <img src={logo} style={{height: 50 + "px"}}/>
                    <span className='is-size-4 ml-6'>DOLE - TUPAD Payroll System</span>
                </div>
                <div className="table-container mt-6">
                    <table className="table is-fullwidth is-bordered is-size-5">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Beneficiary Name</th>
                                <th>Daily Wage</th>
                                <th>Number of Days</th>
                                <th>Gross Amount</th>
                                <th>Less Deduction</th>
                                <th>Net Amount</th>
                                <th>Signature</th>
                                <th>No.</th>
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
                                <th colSpan="4" className='has-text-centered'>Total</th>
                                <th>P {total.toLocaleString()}</th>
                                <th>P 0.00</th>
                                <th>P {total.toLocaleString()}</th>
                                <th colSpan="2"></th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className='columns is-size-5 mt-6'>
                    <div className='column is-5 is-offset-1'>
                        Reviewed by:
                        <div className='columns mt-3 mb-6'>
                            <div className='has-text-centered column is-4'>
                                _____________________________<br/>
                                Designation
                                </div>

                                <div className='has-text-centered column is-3'>
                                ______________<br/>
                                Date
                            </div>
                        </div>

                        Approved by:
                        <div className='columns mt-3'>
                            <div className='has-text-centered column is-4'>
                                _____________________________<br/>
                                Designation
                                </div>

                                <div className='has-text-centered column is-3'>
                                ______________<br/>
                                Date
                            </div>
                        </div>
                    </div>
                        
                    <div className='column is-5 is-offset-2'>
                    Certified Funds Available:
                        <div className='columns mt-3 mb-6'>
                            <div className='has-text-centered column is-4'>
                                _____________________________<br/>
                                Designation
                                </div>

                                <div className='has-text-centered column is-3'>
                                ______________<br/>
                                Date
                            </div>
                        </div>

                        Disbursing Officer:
                        <div className='columns mt-3'>
                            <div className='has-text-centered column is-4'>
                                _____________________________<br/>
                                Designation
                                </div>

                                <div className='has-text-centered column is-3'>
                                ______________<br/>
                                Date
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