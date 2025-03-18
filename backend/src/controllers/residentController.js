import Apartment from '../models/Apartment.js';
import User from '../models/User.js';
import CustomerRequest from '../models/CustomerRequest.js';
import nodemailer from "nodemailer";
import "dotenv/config";
import ElectronFee from '../models/electronFee.js';
import WaterFee from '../models/waterFee.js';
import ManageFee from '../models/manageFee.js';
import Bill from '../models/Bill.js';
import Contract from '../models/Contract.js';

const getCustomerDeposit = async (req, res) => {
    try {
        const users = await CustomerRequest.find({ status: "Đã cọc" })
            .populate('userId apartment_id');

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        const bills = await Promise.all(
            users.map(user =>
                Bill.findOne({
                    apartment_id: user.apartment_id._id,
                    typeOfPaid: "Deposit"
                })
            )
        );

        const contract = await Promise.all(
            users.map(user =>
                Contract.findOne({
                    apartment: user.apartment_id._id
                })
            )
        )

        return res.status(200).json({
            users,
            bills,
            contract
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};


const getCustomerViewApartment = async (req, res) => {
    try {
        const users = await CustomerRequest.find({ status: "Khách hẹn xem" }).populate('userId apartment_id');

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        return res.status(200).json(users);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const getCustomerRequestRentApartment = async (req, res) => {
    try {
        const users = await CustomerRequest.find({ status: "Đang xét duyệt" });

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        const customerView = [];

        for (const user of users) {
            const username = await User.findById(user.userId);
            const apartment = await Apartment.findById(user.apartment_id);

            customerView.push({
                _id: user._id,
                username: username ? username.name : 'Unknown',
                apartment: apartment ? apartment.apartmentNumber : 'Unknown',
                phoneNumber: username.phoneNumber,
                status: user.status,
                date: user.date,
                contractMonths: user.contractMonths,
            });
        }

        return res.status(200).json(customerView);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

const ApproveViewApartment = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await CustomerRequest.findById(requestId);
        const user = await User.findById(request.userId);
        const apartment = await Apartment.findById(request.apartment_id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Hẹn lịch xem căn hộ",
            text: `Cảm ơn bạn đã đồng ý tham quan căn hộ của chúng tôi vào ngày ${request.date}, ở căn hộ số ${apartment.apartment_number}. Rất mong được phục vụ bạn.`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Hẹn lịch xem căn hộ</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            padding: 25px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 25px;
                            padding-bottom: 15px;
                            border-bottom: 2px solid #f0f0f0;
                        }
                        .logo {
                            max-width: 150px;
                            margin-bottom: 15px;
                        }
                        h1 {
                            color: #2c3e50;
                            font-size: 24px;
                            margin: 0;
                        }
                        .content {
                            padding: 15px 0;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #e74c3c;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 25px;
                            padding-top: 15px;
                            border-top: 2px solid #f0f0f0;
                            font-size: 14px;
                            color: #7f8c8d;
                        }
                        .button {
                            display: inline-block;
                            background-color: #3498db;
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin-top: 15px;
                        }
                        .details {
                            background-color: #f9f9f9;
                            border-left: 4px solid #3498db;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <!-- <img src="logo.png" alt="Logo" class="logo"> -->
                            <h1>Xác Nhận Lịch Hẹn</h1>
                        </div>
                        
                        <div class="content">
                            <p>Kính gửi Quý khách,</p>
                            
                            <p>Cảm ơn bạn đã đặt lịch tham quan căn hộ của chúng tôi. Chúng tôi xin xác nhận thông tin lịch hẹn như sau:</p>
                            
                            <div class="details">
                                <p><strong>Ngày tham quan:</strong> <span class="highlight">${request.date}</span></p>
                                <p><strong>Căn hộ số:</strong> <span class="highlight">${apartment.apartment_number}</span></p>
                            </div>
                            
                            <p>Vui lòng đến đúng giờ để đảm bảo trải nghiệm tham quan tốt nhất. Nhân viên tư vấn của chúng tôi sẽ đón tiếp và hướng dẫn bạn.</p>
                            
                            <p>Nếu bạn cần thay đổi lịch hẹn hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                            
                        </div>
                        
                        <div class="footer">
                            <p>Trân trọng,</p>
                            <p>Đội ngũ Dịch vụ Khách hàng</p>
                            <p>© 2025 ApaMan</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Approve for view successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const RejectViewApartment = async (req, res) => {
    try {
        const { requestId } = req.body;
        console.log(requestId)
        const request = await CustomerRequest.findById(requestId);
        const user = await User.findById(request.userId);
        const apartment = await Apartment.findById(request.apartment_id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Hẹn lịch xem căn hộ",
            text: `Cảm ơn bạn đã đồng ý tham quan căn hộ của chúng tôi vào ngày ${request.date}, ở căn hộ số ${apartment.apartment_number}. Rất mong được phục vụ bạn.`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Hẹn lịch xem căn hộ</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 8px;
                            padding: 25px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 25px;
                            padding-bottom: 15px;
                            border-bottom: 2px solid #f0f0f0;
                        }
                        .logo {
                            max-width: 150px;
                            margin-bottom: 15px;
                        }
                        h1 {
                            color: #2c3e50;
                            font-size: 24px;
                            margin: 0;
                        }
                        .content {
                            padding: 15px 0;
                        }
                        .highlight {
                            font-weight: bold;
                            color: #e74c3c;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 25px;
                            padding-top: 15px;
                            border-top: 2px solid #f0f0f0;
                            font-size: 14px;
                            color: #7f8c8d;
                        }
                        .button {
                            display: inline-block;
                            background-color: #3498db;
                            color: white;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin-top: 15px;
                        }
                        .details {
                            background-color: #f9f9f9;
                            border-left: 4px solid #3498db;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <!-- <img src="logo.png" alt="Logo" class="logo"> -->
                            <h1>Từ Chối Lịch Hẹn</h1>
                        </div>
                        
                        <div class="content">
                            <p>Kính gửi Quý khách ${user.name},</p>
                            
                            <p>Cảm ơn bạn đã đặt lịch tham quan căn hộ của chúng tôi. Rất tiếc chúng tôi không thể phục vụ bạn vào ngày ${request.date}</p>

                            <p>Rất mong bạn thông cảm và đặt một lịch hẹn vào ngày khác.</p>
                            
                            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                            
                        </div>
                        
                        <div class="footer">
                            <p>Trân trọng,</p>
                            <p>Đội ngũ Dịch vụ Khách hàng</p>
                            <p>© 2025 ApaMan</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        await transporter.sendMail(mailOptions);

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Approve for view successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const ApproveRentApartment = async (req, res) => {
    try {
        console.log(req.body)
        const { requestId, date, duration } = req.body;
        const request = await CustomerRequest.findById(requestId);
        const user = await User.findById(request.userId);
        const apartment = await Apartment.findById(request.apartment_id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        let endDate = new Date(date);
        endDate.setMonth(endDate.getMonth() + duration);


        const updatedApartment = await Apartment.updateOne(
            { _id: request.apartment_id },
            {
                $set: {
                    status: "Đã cho thuê",
                    tenantId: request.userId,
                    startRentDate: date,
                    endRentDate: endDate,
                }
            }
        );
        console.log(updatedApartment)

        if (updatedApartment.nModified === 0) {
            return res.status(400).json({ message: 'Apartment update failed' });
        }


        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Xác Nhận Đồng Ý Thuê Phòng",
            text: `Cảm ơn bạn đã đồng ý thuê phòng của chúng tôi. Hợp đồng thuê phòng số ${apartment.apartment_number} sẽ bắt đầu từ ngày ${request.start_date}. Chúng tôi rất mong được phục vụ bạn.`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác Nhận Thuê Phòng</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 25px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #f0f0f0;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
                h1 {
                    color: #2c3e50;
                    font-size: 24px;
                    margin: 0;
                }
                .content {
                    padding: 15px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #e74c3c;
                }
                .footer {
                    text-align: center;
                    margin-top: 25px;
                    padding-top: 15px;
                    border-top: 2px solid #f0f0f0;
                    font-size: 14px;
                    color: #7f8c8d;
                }
                .button {
                    display: inline-block;
                    background-color: #3498db;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 15px;
                }
                .details {
                    background-color: #f9f9f9;
                    border-left: 4px solid #3498db;
                    padding: 15px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <!-- <img src="logo.png" alt="Logo" class="logo"> -->
                    <h1>Xác Nhận Thuê Phòng</h1>
                </div>
                
                <div class="content">
                    <p>Kính gửi Quý khách,</p>
                    
                    <p>Cảm ơn bạn đã lựa chọn thuê phòng của chúng tôi. Chúng tôi xin xác nhận thông tin thuê phòng như sau:</p>
                    
                    <div class="details">
                        <p><strong>Ngày bắt đầu thuê:</strong> <span class="highlight">${request.date}</span></p>
                        <p><strong>Phòng số:</strong> <span class="highlight">${apartment.apartmentNumber}</span></p>
                        <p><strong>Thời hạn thuê:</strong> <span class="highlight">${request.contractMonths || "Theo hợp đồng"} tháng</span></p>
                    </div>
                    
                    <p>Vui lòng chuẩn bị các giấy tờ cần thiết và thanh toán khoản phí theo thỏa thuận trong hợp đồng. Nhân viên của chúng tôi sẽ liên hệ để hoàn tất thủ tục và bàn giao phòng.</p>
                    
                    <p>Nếu bạn cần thêm thông tin hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hotline.</p>
                    
                </div>
                
                <div class="footer">
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Dịch vụ Khách hàng</p>
                    <p>© 2025 ApaMan</p>
                </div>
            </div>
        </body>
        </html>
        `,
        };

        await transporter.sendMail(mailOptions);

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Apartment rented successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const RejectRentApartment = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await CustomerRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const updatedApartment = await Apartment.updateOne(
            { _id: request.apartment_id },
            {
                $set: {
                    status: "Trống",
                }
            }
        );

        if (updatedApartment.nModified === 0) {
            return res.status(400).json({ message: 'Apartment update failed' });
        }

        const deletedRequest = await CustomerRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(400).json({ message: 'Failed to delete the request' });
        }

        return res.status(200).json({ message: 'Apartment rented successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllResidents = async (req, res) => {
    try {
        const apartments = await Apartment.find({ status: "Đã cho thuê" });

        if (!apartments || apartments.length === 0) {
            return res.status(200).json([]);
        }

        const result = [];

        for (const apartment of apartments) {
            const resident = await User.findById(apartment.user_id).select("name _id");
            const electronFee = await ElectronFee.findOne({ apartment_id: apartment._id });
            const waterFee = await WaterFee.findOne({ apartment_id: apartment._id });
            const managementFee = await ManageFee.findOne({ apartment_id: apartment._id });
            const bill = await Bill.findById(apartment._id).select("status");

            const residentInfo = {
                resident: resident || null,
                apartment: apartment || null,
                fees: {
                    electron_current: electronFee?.amount || null,
                    electron_month: electronFee?.amount_month || null,
                    water_current: waterFee?.amount || null,
                    water_month: waterFee?.amount_month || null,
                    management: managementFee || null
                },
                bill: bill || null,
                day: electronFee?.billing_date || null
            };

            result.push(residentInfo);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateIndex = async (req, res) => {
    try {
        const { apartmentId, electron, water, date } = req.body;

        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }

        const user = await User.findById(apartment.tenantId);
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const electronFee = await ElectronFee.findOne({ apartment_id: apartment._id });
        const waterFee = await WaterFee.findOne({ apartment_id: apartment._id });

        if (!electronFee) {
            const newElectronFee = new ElectronFee({
                amount: Number(electron),
                amount_month: Number(electron),
                billing_date: date,
                user_id: user._id,
                apartment_id: apartment._id,
            });
            await newElectronFee.save();
        } else {
            await ElectronFee.updateOne(
                { _id: electronFee._id },
                {
                    $set: {
                        amount: Number(electron),
                        amount_month: Number(electron) - (electronFee.amount || 0),
                        billing_date: date,
                    },
                }
            );
        }

        if (!waterFee) {
            const newWaterFee = new WaterFee({
                amount: Number(water),
                amount_month: Number(water),
                billing_date: date,
                user_id: user._id,
                apartment_id: apartment._id,
            });
            await newWaterFee.save();
        } else {
            await WaterFee.updateOne(
                { _id: waterFee._id },
                {
                    $set: {
                        amount: Number(water),
                        amount_month: Number(water) - (waterFee.amount || 0),
                        billing_date: date,
                    },
                }
            );
        }

        res.status(200).json({ message: 'Update successful' });
    } catch (error) {
        console.error('Error updating index:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const sendBill = async (req, res) => {
    try {
        const { id } = req.body;
        const apartment = await Apartment.findById(id);
        const electronFee = await ElectronFee.findOne({ apartment_id: id });
        const waterFee = await WaterFee.findOne({ apartment_id: id });
        const user = await User.findById(apartment.tenantId);
        const month = electronFee.billing_date.getMonth() + 1;
        const fee = waterFee.amount_month * 120 + apartment.price + electronFee.amount_month * 350 + 5000;
        const date = new Date();
        const bill = new Bill({
            typeOfPaid: "Living",
            fee: fee,
            billing_date: date,
            status: "Unpaid",
            apartment_id: id,
            user_id: user._id
        });
        await bill.save();

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `Thông báo phí tháng ${month}`,
            text: ``,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thông báo phí tháng ${month}</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 25px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #f0f0f0;
                }
                .logo {
                    max-width: 150px;
                    margin-bottom: 15px;
                }
                h1 {
                    color: #2c3e50;
                    font-size: 24px;
                    margin: 0;
                }
                .content {
                    padding: 15px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #e74c3c;
                }
                .footer {
                    text-align: center;
                    margin-top: 25px;
                    padding-top: 15px;
                    border-top: 2px solid #f0f0f0;
                    font-size: 14px;
                    color: #7f8c8d;
                }
                .button {
                    display: inline-block;
                    background-color: #3498db;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    margin-top: 15px;
                }
                .details {
                    background-color: #f9f9f9;
                    border-left: 4px solid #3498db;
                    padding: 15px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <!-- <img src="logo.png" alt="Logo" class="logo"> -->
                    <h1>Thông báo phí</h1>
                </div>
                
                <div class="content">
                    <p>Kính gửi Quý khách ${user.name},</p>
                    
                    <p>Căn hộ ApaMan xin gửi tới quý khách các khoản phí thanh toán của tháng ${month} như sau:</p>
                    
                    <div class="details">
                        <p><strong>Tiền thuê:</strong> <span class="highlight">${apartment.price} VND</span></p>
                        <p><strong>Tiền điện:</strong> <span class="highlight">${electronFee.amount_month * 350} VND</span></p>
                        <p><strong>Tiền nước:</strong> <span class="highlight">${waterFee.amount_month * 120} VND</span></p>
                        <p><strong>Tiền dịch vụ:</strong> <span class="highlight">5000 VND</span></p>
                        <p><strong>Tổng:</strong> <span class="highlight">${waterFee.amount_month * 120 + apartment.price + electronFee.amount_month * 350 + 5000} VND</span></p>
                        
                    </div>
                    
                    <p>Vui lòng thanh toán trong vòng 5 ngày kể từ khi nhận thông báo này.</p>
                    
                    <p>Nếu bạn cần thêm thông tin hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hotline.</p>
                    
                </div>
                
                <div class="footer">
                    <p>Trân trọng,</p>
                    <p>Đội ngũ Dịch vụ Khách hàng</p>
                    <p>© 2025 ApaMan</p>
                </div>
            </div>
        </body>
        </html>
        `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error('Error updating index:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getBill = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id)
        const bill = await Bill.findOne({
            typeOfPaid: "Deposit",
            apartment_id: id,
        });

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        return res.status(200).json(bill);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


export {
    getCustomerViewApartment, getCustomerRequestRentApartment, ApproveRentApartment, RejectRentApartment,
    ApproveViewApartment, RejectViewApartment, getAllResidents, updateIndex, sendBill, getCustomerDeposit,
    getBill
};