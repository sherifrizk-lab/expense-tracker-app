
import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
        <code>{children}</code>
    </pre>
);

const HowToUse: React.FC = () => {
    const appsScriptCode = `
function doGet(e) {
  // Return a friendly message for users who visit the URL directly.
  return ContentService
    .createTextOutput("This web app endpoint is for the Gemini Expense Tracker and only accepts POST requests.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // This script must be bound to a spreadsheet to work correctly.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Expenses");
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Expenses");
      sheet.appendRow(["ID", "Date", "Category", "Description", "Amount"]);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Append the new expense data
    sheet.appendRow([
      data.id || new Date().toISOString(),
      data.date,
      data.category,
      data.description,
      data.amount
    ]);
    
    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Expense saved successfully!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`.trim();

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-700 mb-3">2. How to Get Your Web App URL</h3>
            <div className="space-y-4 text-gray-600">
                <p>To connect this app to your Google Sheet, you need to create a script that is <b className="font-semibold">attached to the sheet itself</b>. Follow these steps carefully:</p>
                
                <ol className="list-decimal list-inside space-y-3">
                    <li>
                        First, create a new Google Sheet by visiting <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">sheets.new</a>. You can name it whatever you like (e.g., "My Expenses").
                    </li>
                    <li>
                        In your new spreadsheet, click on the menu item <b className="font-semibold">Extensions</b> &gt; <b className="font-semibold">Apps Script</b>. This will open the script editor in a new tab. This script is now "bound" to your spreadsheet.
                    </li>
                    <li>
                        Delete any existing code in the <code className="bg-gray-200 p-1 rounded">Code.gs</code> file and paste the following code:
                    </li>
                </ol>

                <CodeBlock>{appsScriptCode}</CodeBlock>

                <ol className="list-decimal list-inside space-y-3" start={4}>
                    <li>Save the project (click the floppy disk icon).</li>
                    <li>
                        Click the blue <b className="font-semibold">Deploy</b> button in the top right, then select <b className="font-semibold">New deployment</b>.
                    </li>
                    <li>
                        Click the gear icon next to "Select type" and choose <b className="font-semibold">Web app</b>.
                    </li>
                    <li>
                        In the configuration dialog:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                            <li>Give it a description (e.g., "Expense Tracker API").</li>
                            <li>Leave "Execute as" set to <b className="font-semibold">Me</b>.</li>
                            <li>
                                For "Who has access", you <b className="font-semibold">must</b> select <b className="font-semibold">Anyone</b>. This allows the web app to receive data.
                            </li>
                            <li>Click <b className="font-semibold">Deploy</b>.</li>
                        </ul>
                    </li>
                    <li>
                        Google will ask you to authorize the script. Click <b className="font-semibold">Authorize access</b> and follow the prompts, selecting your Google account. You might see a warning that the app isn't verified; click "Advanced" and then "Go to (your project name)".
                    </li>
                    <li>
                        After deploying, copy the <b className="font-semibold">Web app URL</b>. It will look like <code className="bg-gray-200 p-1 rounded">https://script.google.com/macros/s/.../exec</code>.
                    </li>
                     <li>
                        Paste this URL into the input field in <b className="font-semibold">Step 1</b> above.
                    </li>
                </ol>
                <p className="pt-2">That's it! Your app is now connected. When you save an expense, a sheet named "Expenses" will be created in your spreadsheet if it doesn't already exist, and the data will be added there.</p>
            </div>
        </div>
    );
};

export default HowToUse;
