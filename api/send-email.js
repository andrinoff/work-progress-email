import express from 'express';
import cors from 'cors';
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());  // Allow cross-origin calls
app.use(express.json());  // Parse JSON body

app.post('/send-email', (req, res) => {
    const { email } = req.body;

    try {
        const response = emailjs.send(
            "service_6p3ieyw",
            "template_bi3l5ac",
            { email: email },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );
        console.log('Email sent successfully:', response);
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
});