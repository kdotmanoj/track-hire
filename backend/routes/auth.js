const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const pool = require("../database");

router.post("/register", async (req,res) => {
    const {user_name , email, password} = req.body;

    if (!user_name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    try {
        await pool.query(
            `INSERT INTO users (user_name,email,password_hash) VALUES (?,?,?)`,
            [user_name,email,hashedPassword]
        );
        
        res.status(201).json({message : "User registered successfully"})
    } catch (error) {
        if(error.code == "ER_DUP_ENTRY"){
            return res.status(409).json({ error: 'Email already in use' });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/login", async (req,res) => {
    const {email,password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?` , [email]);
    
        if(rows.length == 0){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const user = rows[0];
        const isMatch = await bcrypt.compare(password,user.password_hash);
    
        if(!isMatch){
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    
        const token = jwt.sign({
            id : user.user_id
        },process.env.JWT_SECRET);
    
        res.status(200).json({
            token,
            message : 'Logged in successfully'
        });
        
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router