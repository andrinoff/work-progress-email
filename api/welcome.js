import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { apiKey } = req.body;
        try {
        console.log("Fetching email for API key...");
        const emailResponse = await fetch("https://work-progress-backend.vercel.app/api/getEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // If the server *requires* knowing you accept JSON, add this:
                "Accept": "application/json"
            },
            body: JSON.stringify({
                apiKey: apiKey,
                sign: "getEmail"
            })
        });

        console.log("Email fetch response status:", emailResponse.status);

        if (!emailResponse.ok) {
            // Handle HTTP errors (like 401, 403, 404, 500)
            const errorText = await emailResponse.text().catch(() => 'Could not read error body'); // Try to get error details
            console.error("Error fetching email:", emailResponse.status, errorText);
            return; // Stop execution if email fetch fails
        }

        // *** Read the response body as JSON and extract the email property ***
        try {
            // Parse the JSON response
            // Assuming the response looks like: { "email": "user@example.com" }
            console.log(emailResponse)
            const emailData = await emailResponse.json() ;
            console.log(emailData)

            // Extract the email value
            const emailString = emailData.email;
            console.log("Extracted email string from JSON:", emailString);

            if (!emailString) {
                 console.error("Received JSON object without 'email' field or with empty value:", emailData);
                 return;
            }

            // Optional: Basic email format validation (now checking the actual email)
           
             // --- Send Welcome Email ---
         // Ensure emailString was successfully retrieved before proceeding
       

       
        const response = await emailjs.send(
            "service_xw4jmqe",
            "template_tj5g1le",
            {email : emailString},
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY
            }
        );
        res.status(200).json({ success: true, response });
        } catch (jsonError) {
            // Handle cases where the response body isn't valid JSON
            console.error("JSON parsing error:", jsonError);
            // Attempt to log raw text for debugging if JSON parsing fails
            try {
                const rawText = await emailResponse.text();
                console.error("Raw response text that failed JSON parsing:", rawText);
            } catch (textError) {
                console.error("Could not read raw text after JSON parsing failed.", jsonError);
            }
            return;
        }
    } catch (error) {
        // Handle network errors (fetch couldn't reach the server, DNS issues, etc.)
        console.error("Network error fetching email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}