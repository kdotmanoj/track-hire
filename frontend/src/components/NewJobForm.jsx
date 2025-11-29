import { useState } from "react"

function NewJobForm ({closeModal, fetchJobs}){
    const [title,setTitle] = useState("");
    const [company,setCompany] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobData = {
            job_title: title,
            company_name: company
        }
        const response = await fetch("http://localhost:5000/jobs",{
            method: "POST",
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