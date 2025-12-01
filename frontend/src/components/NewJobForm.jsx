import { useEffect, useState } from "react"

function NewJobForm ({closeModal, fetchJobs, editData}){
    const [title,setTitle] = useState("");
    const [company,setCompany] = useState("");

    useEffect(() => {
        if(editData){
            setTitle(editData.job_title);
            setCompany(editData.company_name);
        }else{
            setTitle("");
            setCompany("");
        }
    },[editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobData = {
            job_title: title,
            company_name: company
        }
        const url = editData ? `http://localhost:5000/jobs/${editData.job_id}` : `http://localhost:5000/jobs`;
        const currentMethod = editData ? "PUT" : "POST";
        
        const response = await fetch(url,{
            method: currentMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jobData)
        });

        setTitle("");
        setCompany("");
        closeModal();
        fetchJobs();
    }
    return (
        <div className="modal-content">
            <form onSubmit={handleSubmit}>
                <label htmlFor="job-title">Job Title</label>
                <input type="text" id="job-title" name="job-title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <label htmlFor="company">Company</label>
                <input type="text" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)}/>
                <button type="submit">Submit</button>
                <button onClick={closeModal}>Cancel</button>
            </form>
        </div>
    )
}

export default NewJobForm