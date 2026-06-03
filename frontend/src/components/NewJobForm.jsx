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
    const INITIAL_FORM = {
        job_title: "",
        company_name: "",
        salary: "",
        description: "",
        application_status: "",
        date_applied: "",
    };
    
    const [formData,setFormData] = useState(INITIAL_FORM);




    useEffect(() => {
        if(editData){
            setFormData({
                job_title : editData.job_title,
                company_name : editData.company_name,
                salary : editData.salary,
                description : editData.description,
                application_status : editData.application_status,
                date_applied : editData.date_applied?.slice(0,10) ?? ""
            })
        }else{
            setFormData(INITIAL_FORM)
        }
    },[editData]);

    const handleChange = (e) => {
        
        const {name,value} = e.target;
        setFormData(prev => (
            {
                ...prev,
                [name] : name === "salary" && value !== "" ? Number(value) : value
            }
        ))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editData ? `http://localhost:5000/jobs/${editData.job_id}` : `http://localhost:5000/jobs`;
        const currentMethod = editData ? "PUT" : "POST";
        
        const response = await fetch(url,{
            method: currentMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });

        setFormData(INITIAL_FORM)
        closeModal();
        fetchJobs();
    }
    return (
        <div className="modal-content">
            <form onSubmit={handleSubmit}>
                <Label htmlFor="job_title">Job Title</Label>
                <Input type="text" id="job_title" name="job_title" value={formData.job_title} onChange={handleChange}/>
                
                <Label htmlFor="company_name">Company</Label>
                <Input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange}/>

                <Label htmlFor="salary">Salary</Label>
                <Input type="number" id="salary" name="salary" value={formData.salary} onChange={handleChange}/>

                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange}/>

                <Label htmlFor="application_status">Application Status</Label>
                <Select value={formData.application_status} onValueChange ={(value) => setFormData(prev => ({...prev,application_status : value}))} >
                    <SelectTrigger id="application_status">
                        <SelectValue placeholder="Select status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Label htmlFor="date_applied">Date Applied</Label>
                <Input type="date" id="date_applied" name="date_applied" value={formData.date_applied} onChange={handleChange}/>

                <Button type="submit">Submit</Button>
                <Button type="button" onClick={closeModal}>Cancel</Button>
            </form>
        </div>
    )
}

export default NewJobForm