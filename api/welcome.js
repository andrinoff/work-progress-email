import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { apiKey } = req.body;
        try {
        console.log("Fetching email for API key...");
        const emailResponse = await fetch("https://work-progress-backend.vercel.app/api/server", {
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
            vscode.window.showErrorMessage(`Failed to get email. Server responded with ${emailResponse.status}: ${errorText}`);
            console.error("Error fetching email:", emailResponse.status, errorText);
            return; // Stop execution if email fetch fails
        }

        // *** Read the response body as JSON and extract the email property ***
        try {
            // Parse the JSON response
            // Assuming the response looks like: { "email": "user@example.com" }
            const emailData = await emailResponse.json() ;

            // Extract the email value
            emailString = emailData.email;
            console.log("Extracted email string from JSON:", emailString);

            if (!emailString) {
                 vscode.window.showErrorMessage('Received JSON, but the email field was missing or empty.');
                 console.error("Received JSON object without 'email' field or with empty value:", emailData);
                 return;
            }

            // Optional: Basic email format validation (now checking the actual email)
            if (!emailString.includes('@')) {
                vscode.window.showWarningMessage(`Received potentially invalid email format: ${emailString}`);
                // Decide if you want to proceed or return here based on your requirements
            }

        } catch (jsonError) {
            // Handle cases where the response body isn't valid JSON
            vscode.window.showErrorMessage(`Failed to parse email response as JSON: ${jsonError.message || jsonError}`);
            console.error("JSON parsing error:", jsonError);
            // Attempt to log raw text for debugging if JSON parsing fails
            try {
                const rawText = await emailResponse.text();
                console.error("Raw response text that failed JSON parsing:", rawText);
            } catch (textError) {
                console.error("Could not read raw text after JSON parsing failed.");
            }
            return;
        }

    } catch (error) {
        // Handle network errors (fetch couldn't reach the server, DNS issues, etc.)
        vscode.window.showErrorMessage(`Network error while fetching email: ${error.message || error}`);
        console.error("Network error fetching email:", error);
        return; // Stop execution on network error
    }


    // --- Send Welcome Email ---
    // Ensure emailString was successfully retrieved before proceeding
    if (!emailString) {
        // This check is slightly redundant due to checks above, but good for safety
        console.error("Cannot send welcome email because emailString is missing or invalid.");
        vscode.window.showErrorMessage("Could not proceed: Email address was not obtained.");
        return;
    }

    try {
        const response = await emailjs.send(
            "service_6p3ieyw",
            "template_bi3l5ac",
            { emailString },
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