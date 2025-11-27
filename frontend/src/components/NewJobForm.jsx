function NewJobForm ({closeModal}){
    return (
        <div className="modal-content">
            <form action="">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" id="job-title"/>
                <label htmlFor="company">Company</label>
                <input type="text" id="company"/>
                <button>Submit</button>
                <button onClick={closeModal}>Cancel</button>
            </form>
        </div>
    )
}

export default NewJobForm