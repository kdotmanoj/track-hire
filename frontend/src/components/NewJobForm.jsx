import { useEffect, useState } from "react"
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function NewJobForm ({closeModal, fetchJobs, editData}){
    const [title,setTitle] = useState("");
    const [company,setCompany] = useState("");
    const [salary,setSalary] = useState("");
    const [description,setDescription] = useState("");
    const [applicationStatus,setApplicationStatus] = useState("");
    const [dateApplied,setDateApplied] = useState("");




    useEffect(() => {
        if(editData){
            setTitle(editData.job_title);
            setCompany(editData.company_name);
            setSalary(editData.salary);
            setDescription(editData.description);
            setApplicationStatus(editData.application_status);
            setDateApplied(editData.date_applied?.slice(0,10));
        }else{
            setTitle("");
            setCompany("");
            setSalary("");
            setDescription("");
            setApplicationStatus("");
            setDateApplied("");
        }
    },[editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobData = {
            job_title: title,
            company_name: company,
            salary: salary,
            description: description,
            application_status: applicationStatus,
            date_applied: dateApplied
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
        setSalary("");
        setDescription("");
        setApplicationStatus("");
        setDateApplied("");
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

                <Label htmlFor="salary">Salary</Label>
                <Input type="number" id="salary" name="salary" value={salary} onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))}/>

                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)}/>

                <Label htmlFor="application-status">Application Status</Label>
                <Select value={applicationStatus} onValueChange={setApplicationStatus}>
                    <SelectTrigger id="application-status">
                        <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Label htmlFor="date-applied">Date Applied</Label>
                <Input type="date" id="date-applied" name="date-applied" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)}/>

                <Button type="submit">Submit</Button>
                <Button type="button" onClick={closeModal}>Cancel</Button>
            </form>
        </div>
    )
}

export default NewJobForm