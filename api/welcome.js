import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email } = req.body;

    try {
        const response = await emailjs.send(
            "service_6p3ieyw",
            "template_bi3l5ac",
            { email },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );
        res.status(200).json({ success: true, response });
    } catch (error) {
        console.error('Error in /api/server:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}