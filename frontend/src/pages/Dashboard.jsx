import { useState } from "react";
import { useEffect } from "react";
import JobCard from "../components/JobCard";

function Dashboard(){
    
    const [jobs,setJobs] = useState([]);

    useEffect(() => {
        //example how jobs will be populated
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

    return (
        <div className="dashboard-container">
            {jobs.map((job) => {
                return <JobCard key={job.job_id} title={job.job_title} company={job.company_name} status={job.application_status}/>
            })}
        </div>
    )
}

export default Dashboard
