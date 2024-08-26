const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and other credentials
    optionsSuccessStatus: 204 // For legacy browsers
}));

app.use(express.json());

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("Fail to Connect DB"));

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendemail", async (req, res) => {
    try {
        const { msg, emailList } = req.body;
        const data = await credential.find();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        for (let i = 0; i < emailList.length; i++) {
            await transporter.sendMail({
                from: data[0].toJSON().user,
                to: emailList[i],
                subject: "A Message From Bulkmail App",
                text: msg,
            });
            console.log("Email sent to: " + emailList[i]);
        }

        res.send(true);
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).send(false);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
