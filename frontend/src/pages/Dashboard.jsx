import { useState } from "react";
import { useEffect } from "react";
import JobCard from "../components/JobCard";
import NewJobForm from "../components/NewJobForm";

function Dashboard(){
    
    const [jobs,setJobs] = useState([]);
    const [showModal,setShowModal] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try{
                const response = await fetch('http://localhost:5000/jobs');
                const data = await response.json();
                
                setJobs(data);
            }
            catch(error){
                console.error("Error fetching jobs",error);
            }
        }

        fetchJobs();
    },[])

    const close = () => {
        setShowModal(false)
    }

    return (
        <div>
            <button onClick={() => {setShowModal(true)}}>Add Job</button>
            <div className="dashboard-container">
                {jobs.map((job) => {
                    return <JobCard key={job.job_id} title={job.job_title} company={job.company_name} status={job.application_status}/>
                })}
            </div>
            
            {showModal && <div className="modal-overlay"><NewJobForm closeModal={close} /></div>}
        </div>
    )
}

export default Dashboard
