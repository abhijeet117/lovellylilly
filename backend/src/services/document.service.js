const fs = require("fs");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const xlsx = require("xlsx");

exports.parseDocument = async (filePath, mimeType) => {
    try {
        let text = "";

        if (mimeType === "application/pdf") {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            text = data.text;
        } 
        else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const result = await mammoth.extractRawText({ path: filePath });
            text = result.value;
        } 
        else if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const workbook = xlsx.readFile(filePath);
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                text += xlsx.utils.sheet_to_csv(sheet) + "\n";
            });
        } 
        else if (mimeType === "text/plain") {
            text = fs.readFileSync(filePath, "utf-8");
        } 
        else {
            throw new Error("Unsupported document type for parsing");
        }

        return text.trim();
    } catch (error) {
        console.error("Document Parsing Error:", error);
        throw error;
    }
};
