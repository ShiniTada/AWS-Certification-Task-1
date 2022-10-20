"use strict";

const AWS = require("aws-sdk");
const ses = new AWS.SES({
  region: process.env.region,
});

module.exports.notifyCakeMakerByEmail = (order, fromEmail, toEmail) => {
  const params = {
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "New cake order",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: JSON.stringify(order),
        },
      },
    },
  };
  console.log("Params for SES " + JSON.stringify(params));

  return ses
    .sendEmail(params)
    .promise()
    .then((data) => {
      console.log(
        "Notification about new orders was sent to cake maker. " +
          JSON.stringify(data)
      );
      return data;
    })
    .catch((err) => {
      console.log("Error occurred while sending nitification. " + err);
    });
};
