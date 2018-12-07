const express = require('express');
const bodyParser = require('body-parser');
var User = require("../models/user");
require('dotenv').config();
var sms_verify = express.Router();

sms_verify.use(bodyParser.json());

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET
});

sms_verify.post('/send_sms_verify', (req, res) => {
    let phoneNumber = req.body.phonenumber;
    var user = User.findOne({ phonenumber: phoneNumber });

    if (!user) {
        res.status(401).send({ code: 1004, message: 'Parameter value is invalid.' });
    } else {
        var number = '+84' + phoneNumber.slice(1);
        console.log(number);
        nexmo.verify.request({ number: number, brand: 'MOKI' }, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error_text: err.message });
            } else {
                console.log(result);
                if (result && result.status == '0') {
                    user.last_request_id = result.request_id;
                    user.save(function (err) {
                        if (err)
                            return res.json({ code: 1005, message: 'Unknown error.' });
                        else
                            res.status(200).send({ code: 1000, message: 'OK.' });
                    })
                } else {
                    res.status(400).send(result);
                }
            }
        });
    }
});

sms_verify.post('/sms_verify', (req, res) => {
    let code = req.body.code;
    let phoneNumber = req.body.phonenumber;
    var user = User.findOne({ phonenumber: phoneNumber });
    var requestId = user.last_request_id;

    console.log("Code: " + code + " Request ID: " + requestId);

    nexmo.verify.check({ request_id: requestId, code: code }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ code: 9993, message: 'Code verify is incorrect' });
        } else {
            console.log(result)

            if (result && result.status == '0') {
                res.status(200).send({ code: 1000, message: 'OK' });
                console.log('Account verified!');

            } else {
                res.status(400).send({ code: 9993, message: 'Code verify is incorrect' });
                console.log('Error verifying account');
            }
        }
    });
});

sms_verify.post('/resend_sms_verify',
    (req, res) => {
        let phoneNumber = req.body.phonenumber;
        var user = User.findOne({ phonenumber: phoneNumber });
        var requestId = user.last_request_id;

        console.log("Request ID: " + requestId);

        let temp = nexmo.verify.control({ request_id: requestId, cmd: 'cancel' });
        let err = temp.err;
        let result = temp.result;
        if (err) {
            console.log(err);
            res.status(500).send({ error_text: err.message });
        } else {
            if (result && result.status == '0') {
                // Success
                nexmo.verify.request({ number: phoneNumber, brand: 'MOKI' }, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ error_text: err.message });
                    } else {
                        console.log(result);
                        if (result && result.status == '0') {
                            next();
                        } else {
                            res.status(400).send(result);
                        }
                    }
                });
            } else {
                res.status(400).send(result);
            }
        }
    },
    (req, res) => {
        let phoneNumber = req.body.phonenumber;

        console.log(phoneNumber);

        nexmo.verify.request({ number: phoneNumber, brand: 'MOKI' }, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error_text: err.message });
            } else {
                console.log(result);
                if (result && result.status == '0') {
                    res.status(200).send(result);
                } else {
                    res.status(400).send(result);
                }
            }
        });
    }
);

module.exports = sms_verify;