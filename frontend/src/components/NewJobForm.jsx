import { useEffect, useState } from "react"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

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
                <Label htmlFor="job-title">Job Title</Label>
                <Input type="text" id="job-title" name="job-title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Label htmlFor="company">Company</Label>
                <Input type="text" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)}/>
                <Button type="submit">Submit</Button>
                <Button type="button" onClick={closeModal}>Cancel</Button>
            </form>
        </div>
    )
}

export default NewJobForm