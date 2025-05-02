const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const cors = require('cors');
// Add more strict CORS handling for development
const corsOptions = {
    origin: '*',  // Allow all origins for testing
    methods: 'GET, POST',  // Allow only the necessary methods
    allowedHeaders: 'Content-Type',  // Allow only required headers
};

app.use(cors(corsOptions)); // Apply the CORS middleware


const upload = multer({ storage: multer.memoryStorage() });
app.post('/merge_pdfs', upload.array('pdfs'), async (req, res) => {
    try {
        console.log("Received files: ", req.files); // Log uploaded files

        if (!req.files || req.files.length === 0) {
            console.log("No files received");
            return res.status(400).send({ error: 'No files received' });
        }

        const pdfDoc = await PDFDocument.create();

        // Merge all uploaded PDFs
        for (const file of req.files) {
            const pdfBytes = file.buffer;
            console.log(`Merging file: ${file.originalname}`); // Log each file
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => pdfDoc.addPage(page));
        }

        const mergedPdfBytes = await pdfDoc.save();
        res.contentType('application/pdf');
        res.send(mergedPdfBytes);  // Return merged PDF as response

    } catch (err) {
        console.error("Error during PDF merging: ", err); // Log the error
        res.status(500).send({ error: `Failed to merge PDFs: ${err.message}` });
    }
});


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
