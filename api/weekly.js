import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

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
        const response = await emailjs.send(
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
        console.error('Error in /api/weekly:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}