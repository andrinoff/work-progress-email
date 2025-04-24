import express from 'express';
import cors from 'cors';
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();
console.log("STARTED SERVER");
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
app.post('/send-weekly', (req, res) => {
    const {
            email,
            date_monday,
            time_monday,
            date_tuesday,
            time_tuesday,
            date_wednesday,
            time_wednesday,
            date_thursday,
            time_thursday,
            date_friday,
            time_friday,
            date_saturday,
            time_saturday,
            date_sunday,
            time_sunday
        } = req.body;
    
        const templateParams = {
            email,
            date_monday,
            time_monday,
            date_tuesday,
            time_tuesday,
            date_wednesday,
            time_wednesday,
            date_thursday,
            time_thursday,
            date_friday,
            time_friday,
            date_saturday,
            time_saturday,
            date_sunday,
            time_sunday
        };
    
        try {
            const response = emailjs.send(
                "service_6p3ieyw",
                "template_n7l9kav",
                templateParams,
                {
                    publicKey: process.env.EMAILJS_PUBLIC_KEY,
                    privateKey: process.env.EMAILJS_PRIVATE_KEY
                }
            );
            res.status(200).json({ success: true, response });
        } catch (error) {
            console.error('Error in /send-weekly:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
);