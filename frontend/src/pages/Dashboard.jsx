import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import JobCard from "../components/JobCard";
import NewJobForm from "../components/NewJobForm";

function Dashboard(){
    
    const [jobs,setJobs] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [editData,setEditData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobs = async () => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await fetch('http://localhost:5000/jobs');
            if(!response.ok) throw new Error(` Server returned ${response.status}`);
            const data = await response.json();
            
            setJobs(data);
        }
        catch(err){
            setError(err.message)
        }
        finally{
            setIsLoading(false)
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

    if(isLoading){
        return <div>Loading your job...</div>
    }
    if(error){
        return <div>Error : {error}</div>
    }
    return (
        <div>
            <Button onClick={() => {
                setEditData(null);
                setShowModal(true)
            }}>Add Job</Button>
            <div className="dashboard-container">
                {jobs.map((job) => {
                    return <JobCard key={job.job_id} id={job.job_id} title={job.job_title} company={job.company_name} status={job.application_status} salary={job.salary} deleteJob={handleDelete} editJob={handleEdit}/>
                })}
            </div>
            
            {showModal && <div className="modal-overlay"><NewJobForm closeModal={close} fetchJobs={fetchJobs} editData={editData}/></div>}
        </div>
    )
}

export default Dashboard
