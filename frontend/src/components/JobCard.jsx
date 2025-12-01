function JobCard({id,title,company,status,deleteJob,editJob}) {
    return (
        <div className="job-card">
            <div>{title}</div>
            <div>{company}</div>
            <div>{status}</div>
            <button className="border p-2" onClick={() => {editJob(id)}}>Edit</button>
            <button className="border p-2" onClick={() => {deleteJob(id)}}>Delete</button>
        </div>
    )
}

export default JobCard