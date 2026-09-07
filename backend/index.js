const express = require('express');
const pool = require('./database');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth')

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}));

app.use(express.json());
app.use('/auth', authRoutes);
const   VALID_STATUSES = ['Applied','Interview','Offer','Rejected'];

app.get('/jobs', authMiddleware, async (req,res) => {
    const user_id = req.userId;
    try{
        const [rows] = await pool.query(`SELECT * FROM jobs WHERE user_id = ?`,[user_id]);
        res.status(200).json(rows);
    }
    catch(error){
        console.error('Error fetching jobs',error)
        res.status(500).json({error: 'Internal server error'});
    }
})

app.get('/jobs/:id',authMiddleware, async (req,res) => {
    const user_id = req.userId;
    const {id} = req.params;
    try{
        const [rows] = await pool.query(`SELECT * FROM jobs WHERE job_id = ? && user_id = ?`,[id,user_id]);
        if(rows.length == 0){
            return res.status(404).json({error: "Job not found"});
        }
        res.status(200).json(rows);
    }
    catch(error){
        console.error('Error fetching the job',error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/jobs',authMiddleware, async (req,res) => {
    const user_id = req.userId;
    const {
        job_title,
        company_name,
        salary,
        description,
        application_status,
        date_applied,
    } = req.body;

    if(!job_title || !company_name){
        return res.status(400).json({error: 'Title and company are required'});
    }

    if(application_status && !VALID_STATUSES.includes(application_status)){
        return res.status(400).json({message : "Invalid application status provided"})
    }

    if(salary && isNaN(Number(salary))){
        return res.status(400).json({ error: "Salary must be a valid number." });
    }

    if (date_applied && isNaN(Date.parse(date_applied))) {
        return res.status(400).json({ error: "Invalid date format for date_applied." });
    }

    try{
        const [result] = await pool.query(
            `INSERT INTO jobs (
                job_title,
                company_name,
                salary,
                description,
                application_status,
                date_applied,
                user_id
            ) VALUES (?,?,?,?,?,?,?)`,
            [
                job_title,
                company_name,
                salary || null,
                description || null,
                application_status || 'Applied',
                date_applied || null,
                user_id
            ]
        );
        res.status(201).json({message: 'Job added succesfully'});
    }
    catch(error){
        console.error('Error inserting job:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.put('/jobs/:id',authMiddleware, async (req,res) => {
    const {id} = req.params;
    const user_id = req.userId;

    const {
        job_title,
        company_name,
        salary,
        description,
        application_status,
        date_applied
    } = req.body;

    if(application_status && !VALID_STATUSES.includes(application_status)){
        return res.status(400).json({message : "Invalid application status provided"})
    }

    if(salary && isNaN(Number(salary))){
        return res.status(400).json({ error: "Salary must be a valid number." });
    }

    if (date_applied && isNaN(Date.parse(date_applied))) {
        return res.status(400).json({ error: "Invalid date format for date_applied." });
    }

    try{
        const [result] = await pool.query(
            `UPDATE jobs SET
                job_title = ?,
                company_name = ?,
                salary = ?,
                description = ?,
                application_status = ?,
                date_applied = ?,
            WHERE job_id = ? AND user_id = ?`,
            [
                job_title,
                company_name,
                salary || null,
                description || null,
                application_status || 'Applied',
                date_applied || null,
                id,
                user_id
            ]
        )

        if(result.affectedRows == 0){
            return res.status(404).json({error: "Couldn't find the job"});
        }
        res.status(200).json({message: "Job updated successfully"});
    }
    catch(error){
        console.error('Error updating the job',error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.delete('/jobs/:id',authMiddleware, async (req, res) => {
    const {id} = req.params;
    const user_id = req.userId;
    try{
        const [result] = await pool.query(`DELETE FROM jobs WHERE job_id = ? && user_id = ?`,[id,user_id]);

        if(result.affectedRows == 0){
            return res.status(404).json({error: "Couldn't find the job"});
        }
        res.status(200).json({message: "Job deleted successfully"});
    }
    catch(error){
        console.error('Error deleting the job', error);
        res.status(500).json({error: "Internal server error"});
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});