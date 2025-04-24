import express from 'express';
import cors from 'cors';
import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());  // Allow cross-origin calls
app.use(express.json());  // Parse JSON body

app.post('/send-email', async (req, res) => {
    const { email } = req.body;

    try {
        const response = await emailjs.send(
            "service_6p3ieyw",
            "template_bi3l5ac",
            { email: email },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error in /send-email:', error);
        res.status(500).json({ success: false, error });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`EmailJS Proxy Server running on port ${PORT}`);
});