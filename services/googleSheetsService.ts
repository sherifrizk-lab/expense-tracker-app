import { Expense } from '../types';

/**
 * Saves an expense to a Google Sheet via a Google Apps Script Web App.
 * This makes a real POST request to the provided web app URL.
 * 
 * @param expense The expense data to save.
 * @param url The Google Apps Script Web App URL.
 * @returns A promise that resolves with a success message or rejects with an error.
 */
export const saveExpense = async (expense: Expense, url: string): Promise<{ message: string }> => {
    if (!url || !url.startsWith('https://script.google.com/macros/s/')) {
        throw new Error('Invalid or missing Google Sheets Web App URL. Please check the URL in Step 1.');
    }

    try {
        // A standard CORS request is made to the Google Apps Script.
        // This allows us to read the response and provide accurate feedback.
        const response = await fetch(url, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                // Sending as text/plain avoids a CORS preflight request, which Apps Script can struggle with.
                'Content-Type': 'text/plain;charset=utf-8',
            },
            // The Apps Script will parse this stringified JSON from e.postData.contents
            body: JSON.stringify(expense),
        });

        if (!response.ok) {
            // This handles underlying HTTP errors (e.g., 404 Not Found, 500 Internal Server Error).
            throw new Error(`Network error: The script endpoint returned status ${response.status}. Please check the URL and script deployment.`);
        }

        const result = await response.json();

        if (result.status === 'error') {
            // This handles application-level errors returned by our Apps Script logic.
            // e.g., permission issues, sheet not found, etc.
            throw new Error(`Google Sheets script error: ${result.message}`);
        }

        // Use the actual success message returned from the script.
        return { message: result.message || `Expense saved successfully!` };

    } catch (error) {
        console.error('Error saving expense:', error);
        // This catches network errors (e.g., no internet) or errors thrown above.
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unknown error occurred while sending expense data.');
    }
};