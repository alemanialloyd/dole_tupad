import { useState, useEffect } from 'react';
import { getProjectDocument, getBeneficiaryDocument } from "../utils/firebase";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/button';
import PayrollItem from '../components/payroll-item';
import logo from '../logo.png';
import html2canvas from 'html2canvas';
import SummaryReportItem from '../components/summary-report-item';

const SummaryReport = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [projects, setProjects = () => []] = useState(state ? state.projects : []);

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
            
            <a className="icon-text" onClick={() => {navigate("/projects/finished")}}>
            <span className="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12 6-6m-6 6 6 6m-6-6h14"></path></svg></span> 
                                    <span className="has-text-weight-medium ml-3">Back</span> 
                                    </a>

            <div id='print' className='mt-6'>
                <p className='has-text-centered has-text-weight-medium'>Republic of the Philippines</p>
                <p className='has-text-centered has-text-weight-medium'>DEPARTMENT OF LABOR AND EMPLOYMENT</p>
                <p className='has-text-centered has-text-weight-medium'>Regional Office No. 5</p>

                <div className="table-container mt-6">
                    <table className="table is-fullwidth is-bordered">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Project Title</th>
                                <th>Date</th>
                                <th>Address</th>
                                <th>Rate per Day</th>
                                <th>No. of Days</th>
                                <th>No. of Beneficiaries</th>
                                <th>Sub Total</th>
                                <th>PPE</th>
                                <th>Insurance</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {projects.map((project, index) => {
                            const {dailyWage, days, beneficiaries} = project;
                                total += (parseInt(dailyWage) * parseInt(days) * parseInt(beneficiaries)) + 356;
                            return (
                                <SummaryReportItem  key={project.id} project={project} index={index + 1}/>
                            )
                        })}
                        </tbody>

                        <tfoot>
                            <tr>
                                <th colSpan="10" className='has-text-centered'></th>
                                <th>P {total.toLocaleString()}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
            </div>
            <div className='has-text-centered'><Button type="button" onClick={onPrintHandler} additionalClasses="is-medium is-info block mt-6">Print</Button></div>
        </div>
    )
}

export default SummaryReport;