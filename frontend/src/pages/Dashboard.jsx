import { useState } from "react";
import { useEffect } from "react";
import JobCard from "../components/JobCard";

function Dashboard(){
    
    const [jobs,setJobs] = useState([]);

    useEffect(() => {
        //example how jobs will be populated
        setJobs([
            {
                "job_id": 1,
                "job_title": "Frontend Developer",
                "company_name": "TechCorp",
                "salary": "85000.00",
                "description": "React.js based web app development",
                "application_status": "Interview Scheduled",
                "date_applied": "2025-08-05T18:30:00.000Z"
            },
            {
                "job_id": 3,
                "job_title": "AI Engineer",
                "company_name": "Meta",
                "salary": "18900000.00",
                "description": "Crazy pay",
                "application_status": "OA Scheduled",
                "date_applied": "2025-08-18T18:30:00.000Z"
            }
        ]);
    },[])

    return (
        <div>
            {jobs.map((job) => {
                return <JobCard key={job.job_id} title={job.job_title} company={job.company_name} status={job.application_status}/>
            })}
        </div>
    )
}

export default Dashboard
