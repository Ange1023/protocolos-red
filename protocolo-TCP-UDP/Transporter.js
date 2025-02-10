const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const accountTransport = require("./account.json");

const mail = async (callback) => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground"
    );
    
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });

    oauth2Client.getAccessToken((err, token) => {
        if (err) return console.log(err);
        
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    });
};


const sendMail = (to, subject, text, callback) => {
    mail((transporter) => {
        const mailOptions = {
            from: accountTransport.auth.clientEmail,  
            to: to,  
            subject: subject,  
            text: text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error en el envío: ', error);
                callback(error, null);
            } else {
                console.log('Correo enviado: ' + info.response);
                callback(null, info);
            }
        });
    });
};

module.exports = { sendMail };
