const express = require('express');
const pool = require('./database')
const app = express();

app.use(express.json());

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

app.listen(5000);