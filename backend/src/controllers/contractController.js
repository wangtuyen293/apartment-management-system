import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import User from '../models/users.js';
import * as fontkit from 'fontkit'; // Import fontkit (no need to register)

export const depositContract = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Define relative path to the resources folder based on the current working directory
        const inputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', 'hopdong.pdf');
        console.log(inputPath); // Debugging output to verify the path

        if (!fs.existsSync(inputPath)) {
            return res.status(400).json({ message: "Template contract not found" });
        }

        const inputPdfBytes = fs.readFileSync(inputPath);

        // Load custom font (replace with the path to a font file that supports Vietnamese characters)
        const fontPath = path.join(process.cwd(), 'src', 'controllers', 'resources', 'arial-unicode-ms.ttf');
        const fontBytes = fs.readFileSync(fontPath);
        const pdfDoc = await PDFDocument.load(inputPdfBytes);

        // Embed the custom font
        const customFont = await pdfDoc.embedFont(fontBytes);

        // Get the first page of the PDF
        const page = pdfDoc.getPages()[0];

        // Use the custom font to add text to the PDF
        page.drawText(`Bên nhận đặt cọc: ${user.name}`, {
            x: 150,
            y: 650,
            size: 12,
            font: customFont, // Use custom font
        });
        page.drawText(`Điện thoại: ${user.phoneNumber}`, {
            x: 150,
            y: 635,
            size: 12,
            font: customFont, // Use custom font
        });
        page.drawText(`Email: ${user.email}`, {
            x: 150,
            y: 620,
            size: 12,
            font: customFont, // Use custom font
        });

        // Save the updated PDF
        const outputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', 'hopdong_da_cap_nhat.pdf');
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);

        // Return the path of the updated contract
        res.status(200).json({
            message: 'Contract updated successfully',
            contractPath: outputPath
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating contract', error: error.message });
    }
}
