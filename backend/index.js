const express = require('express');
const pool = require('./database')
const app = express();

app.use(express.json());

app.get('/jobs', async (request,response) => {
    try{
        const [rows] = await pool.query(`SELECT * FROM jobs`);
        response.status(200).json(rows);
    }
    catch(error){
        console.error('Error fetching jobs',error)
        response.status(500).json({error: 'Internal server error'});
    }
})

app.get('/jobs/:id', async (request,response) => {
    const {id} = request.params;
    try{
        const [rows] = await pool.query(`SELECT * FROM jobs WHERE job_id = ?`,[id]);
        if(rows.length == 0){
            return response.status(404).json({error: "Job not found"});
        }
        response.status(200).json(rows);
    }
    catch(error){
        console.error('Error fetching the job',error);
        response.status(500).json({error: 'Internal server error'});
    }
});

app.post('/jobs', async (request,response) => {
    const {
        job_title,
        company_name,
        salary,
        description,
        application_status,
        date_applied
    } = request.body;

    if(!job_title || !company_name){
        return response.status(400).json({error: 'Title and company are required'});
    }

    try{
        const [result] = await pool.query(
            `INSERT INTO jobs (
                job_title,
                company_name,
                salary,description,
                application_status,
                date_applied
            ) VALUES (?,?,?,?,?,?)`,
            [
                job_title,
                company_name,
                salary || null,
                description || null,
                application_status || 'Applied',
                date_applied || null
            ]
        );
        response.status(201).json({message: 'Job added succesfully'});
    }
    catch(error){
        console.error('Error inserting job:', error);
        response.status(500).json({error: 'Internal server error'});
    }
});

app.put('/jobs/:id', async (request,response) => {
    const {id} = request.params;

    const {
        job_title,
        company_name,
        salary,
        description,
        application_status,
        date_applied
    } = request.body;

    try{
        const [result] = await pool.query(
            `UPDATE jobs SET
                job_title = ?,
                company_name = ?,
                salary = ?,
                description = ?,
                application_status = ?,
                date_applied = ?
            WHERE job_id = ?`,
            [
                job_title,
                company_name,
                salary,
                description,
                application_status,
                date_applied,
                id
            ]
        )

        if(result.affectedRows == 0){
            return response.status(404).json({error: "Couldn't find the job"});
        }
        response.status(200).json({message: "Job updated successfully"});
    }
    catch(error){
        console.error('Error updating the job',error);
        response.status(500).json({error: "Internal server error"});
    }
});
app.listen(5000);