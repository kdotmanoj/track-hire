function JobCard({title,company,status}) {
    return (
        <div className="job-card">
            <div>{title}</div>
            <div>{company}</div>
            <div>{status}</div>
        </div>
    )
}

export default JobCard