import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import JobCard from "../components/JobCard";
import NewJobForm from "../components/NewJobForm";

function Dashboard(){
    
    const [jobs,setJobs] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [editData,setEditData] = useState(null);

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
    const handleEdit = (id) => {
        const target = jobs.find(job => job.job_id == id);
        setEditData(target);
        setShowModal(true);
    }   
    const handleDelete = async (id) => {
        try{
            const response = await fetch(`http://localhost:5000/jobs/${id}`, {
                method : "DELETE",
            })

            if(response.ok){
                fetchJobs();
            }
            else{
                console.error("Error");
            }
        }
        catch(error){
            console.error("Couldn't delete the job",error);
        }
    }   
    useEffect(() => {

        fetchJobs();
    },[])

    const close = () => {
        setShowModal(false)
    }

    return (
        <div>
            <Button onClick={() => {
                setEditData(null);
                setShowModal(true)
            }}>Add Job</Button>
            <div className="dashboard-container">
                {jobs.map((job) => {
                    return <JobCard key={job.job_id} id={job.job_id} title={job.job_title} company={job.company_name} status={job.application_status} deleteJob={handleDelete} editJob={handleEdit}/>
                })}
            </div>
            
            {showModal && <div className="modal-overlay"><NewJobForm closeModal={close} fetchJobs={fetchJobs} editData={editData}/></div>}
        </div>
    )
}

export default Dashboard
