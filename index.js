const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://viji:123@cluster1.zh3tah9.mongodb.net/passkey").then(function () {
    console.log("DB Connected")
}).catch(function () {
    console.log("Fail to Connect DB")
})

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", function (req, res) {
    var msg = req.body.msg
    var emailList = req.body.emailList
    credential.find().then(function (data) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });

        new Promise(async function (resolve, reject) {
            try {
                for (i = 0; i < emailList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "vg111viji@gmail.com",
                            to: emailList[i],
                            subject: "A Message From Bulkmail App",
                            text: msg,
                        },

                    )
                    console.log("Email sent to: " + emailList[i])

                }
                resolve("Success")

            }
            catch (error) {
                reject("Failed")
            }

        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })




    }).catch(function (error) {
        console.log(error)
    })


})



app.listen(5000, function () {
    console.log("Server Started....")
})