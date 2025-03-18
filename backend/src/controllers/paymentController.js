import PayOS from "@payos/node";
import Payment from "../models/Payment.js";
import "dotenv/config";
import User from "../models/User.js";
import Apartment from "../models/Apartment.js";
import Bill from "../models/Bill.js";
import CustomerRequest from "../models/CustomerRequest.js";

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);


const generateOrderCode = async () => {
    let orderCode;
    let isUnique = false;

    while (!isUnique) {
        orderCode = Math.floor(100000 + Math.random() * 900000);
        const existingOrder = await Payment.findOne({ orderCode: orderCode });
        if (!existingOrder) {
            isUnique = true;
        }
    }

    return orderCode;
};

export const depositPayment = async (req, res) => {
    try {
        const { userId, apartmentId } = req.body;

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


        const orderCode = await generateOrderCode();

        const updateBill = await Bill.findOneAndUpdate(
            {
                user_id: userId,
                apartment_id: apartmentId,
                typeOfPaid: "Deposit"
            },
            { $set: { orderCode: orderCode } }
        )

        const order = {
            amount: 10000,
            description: `DEPOSIT${apartment.apartmentNumber}${user.username}`,
            orderCode: orderCode,
            returnUrl: `${process.env.FRONTEND_URL}/success`,
            cancelUrl: `${process.env.FRONTEND_URL}/cancel`
        };

        const paymentLink = await payos.createPaymentLink(order);
        return res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkPaymentStatus = async (req, res) => {
    try {
        const { orderCode, userId } = req.body;
        const paymentInfo = await payos.getPaymentLinkInformation(orderCode);

        const newPayment = new Payment({
            orderCode: paymentInfo.orderCode,
            amount: paymentInfo.amount,
            description: paymentInfo.transactions[0].description,
            user_id: userId,
        });
        await newPayment.save();

        const updateBill = await Bill.findOneAndUpdate(
            { orderCode: orderCode },
            {
                $set: {
                    status: "Paid"
                }
            }
        );

        const request = await CustomerRequest.findOne({
            userId: userId,
            status: "Đã cọc"
        }).populate("apartment_id");

        const updateApartment = await Apartment.findByIdAndUpdate(
            request.apartment_id._id,
            { $set: { status: "Đã cọc" } },
            { new: true }
        );

        return res.status(200).json({ message: "Save success" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllBill = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);
        const bills = await Bill.find({ user_id: id }).populate('apartment_id');
        if (!bills) {
            res.status(404).json({ message: "FInd bill failed" });
        }

        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const BillPayment = async (req, res) => {
    try {
        const { id } = req.body;
        console.log(id);

        if (!id) {
            return res.status(400).json({ message: "Missing required parameters" });
        }

        const bill = await Bill.findById(id).populate('user_id');

        if (!bill) {
            return res.status(400).json({ message: "Can not find bill" });
        }

        const orderCode = await generateOrderCode();

        const addCode = await Bill.findByIdAndUpdate(
            id,
            {
                $set: { orderCode: orderCode },
            }
        )

        const order = {
            amount: bill.fee,
            description: `PAY${bill.typeOfPaid}${bill.user_id.username}`,
            orderCode: orderCode,
            returnUrl: `${process.env.FRONTEND_URL}/success`,
            cancelUrl: `${process.env.FRONTEND_URL}/cancel`
        };

        const paymentLink = await payos.createPaymentLink(order);
        return res.status(200).json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}