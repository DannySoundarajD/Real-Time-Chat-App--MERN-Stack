export const baseUrl = "http://localhost:5000/api"

export const postRequest = async (url, body) => {
    
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body, // Ensure body is JSON string
        });

        const data = await response.json();

        if (!response.ok) {
            let message;

            if (data?.message) {
                message = data.message
            } else {
                message = data;
            }

            return {error: true, message }
        }

        return data;
    } 


    export const getRequest = async (url) => {
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP Error ${response.status}: ${errorText}`);
                return { error: `HTTP Error ${response.status}` };
            }
    
            return await response.json(); // Parse JSON response
        } catch (error) {
            console.error("Network error:", error);
            return { error: error.message }; // Return the error in a consistent format
        }
    };
    