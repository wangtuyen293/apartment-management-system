import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import User from '../models/User.js';
import Apartment from '../models/Apartment.js';
import Contract from '../models/Contract.js';

export const depositContract = async (req, res) => {
    try {
        const { userId, date } = req.body;
        const { apartmentId } = req.params;

        const dateObj = new Date(date);

        const daypick = String(dateObj.getDate()).padStart(2, '0');
        const monthpick = String(dateObj.getMonth() + 1).padStart(2, '0');
        const yearpick = dateObj.getFullYear();

        const formattedDate = `${daypick}/${monthpick}/${yearpick}`;

        if (!userId || !apartmentId) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const [user, apartment] = await Promise.all([
            User.findById(userId),
            Apartment.findById(apartmentId)
        ]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }

        const inputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', 'hopdongcoc.pdf');

        if (!fs.existsSync(inputPath)) {
            return res.status(400).json({ message: "Template contract not found" });
        }

        const inputPdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(inputPdfBytes);
        const page = pdfDoc.getPages()[0];
        const page2 = pdfDoc.getPages()[1];

        const today = new Date();

        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        page.drawText(String(day), {
            x: 135,
            y: 516,
            size: 11,
        });

        page.drawText(String(month), {
            x: 180,
            y: 516,
            size: 11,
        });

        page.drawText(String(year), {
            x: 220,
            y: 516,
            size: 11,
        });


        page.drawText(`${user.name || ''}`, {
            x: 95,
            y: 440,
            size: 11,
        });
        page.drawText(`${user.phoneNumber || ''}`, {
            x: 125,
            y: 428,
            size: 11,
        });
        page.drawText(`${user.email || ''}`, {
            x: 240,
            y: 428,
            size: 11,
        });
        page.drawText(`${apartment.apartment_number || ''}`, {
            x: 380,
            y: 215,
            size: 11,
        });

        page.drawText(String(formattedDate), {
            x: 350,
            y: 202,
            size: 8,
        });

        page2.drawText(String(formattedDate), {
            x: 280,
            y: 710,
            size: 8,
        });

        page2.drawText(String(formattedDate), {
            x: 160,
            y: 685,
            size: 8,
        });

        page2.drawText(String(formattedDate), {
            x: 125,
            y: 564,
            size: 8,
        });

        page2.drawText(String(formattedDate), {
            x: 260,
            y: 552,
            size: 8,
        });

        const fileName = `hopdongcoc_${user.username}_${apartment.apartment_number}_pending.pdf`;
        const outputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', fileName);
        const pdfBytes = await pdfDoc.save();

        await fs.promises.writeFile(outputPath, pdfBytes);

        const contractPath = `/resources/${fileName}`;
        console.log('Generated contractPath:', contractPath);

        res.status(200).json({
            message: 'Contract generated successfully',
            contractPath: contractPath,
            fileName: fileName
        });

    } catch (error) {
        console.error('Error in depositContract:', error);
        res.status(500).json({
            message: 'Error generating contract',
            error: error.message
        });
    }
};

export const getContractFile = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(process.cwd(), 'src', 'controllers', 'resources', fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Contract file not found" });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Error serving contract file:', error);
        res.status(500).json({
            message: 'Error serving contract file',
            error: error.message
        });
    }
};

export const signDepositContract = async (req, res) => {
    try {
        const { userId, signature } = req.body;
        const { apartmentId } = req.params;

        if (!userId || !apartmentId) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const [user, apartment] = await Promise.all([
            User.findById(userId),
            Apartment.findById(apartmentId)
        ]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!apartment) {
            return res.status(404).json({ message: "Apartment not found" });
        }

        const inputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', `hopdongcoc_${user.username}_${apartment.apartment_number}_pending.pdf`);

        if (!fs.existsSync(inputPath)) {
            return res.status(400).json({ message: "Template contract not found" });
        }

        const inputPdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(inputPdfBytes);
        const page = pdfDoc.getPages()[1];

        const signatureImageBytes = Buffer.from(signature.split(',')[1], 'base64');
        const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

        page.drawImage(signatureImage, {
            x: 60,
            y: 240,
            width: 100,
            height: 50,
        });

        const fileName = `hopdongcoc_${user.username}_${apartment.apartment_number}_signed.pdf`;
        const outputPath = path.join(process.cwd(), 'src', 'controllers', 'resources', fileName);
        const pdfBytes = await pdfDoc.save();

        await fs.promises.writeFile(outputPath, pdfBytes);

        const contractPath = `/resources/${fileName}`;

        const signedContract = new Contract({
            user: userId,
            apartment: apartmentId,
            contractPath: contractPath,
            fileName: fileName
        });
        await signedContract.save();

        const updatedApartment = await Apartment.updateOne(
            { _id: apartmentId },
            {
                $set: {
                    status: "Đã cọc",
                },
            }
        );

        if (updatedApartment.modifiedCount === 0) {
            return res.status(400).json({ message: "Failed to update apartment" });
        }

        console.log('Generated contractPath:', contractPath);

        res.status(200).json({
            message: 'Contract generated and saved successfully',
            contractPath: contractPath,
            fileName: fileName,
            contractId: signedContract._id
        });

    } catch (error) {
        console.error('Error in depositContract:', error);
        res.status(500).json({
            message: 'Error generating contract',
            error: error.message
        });
    }
};