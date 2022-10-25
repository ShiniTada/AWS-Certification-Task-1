"use strinct";

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  region: process.env.region,
});

module.exports.sendMessage = (queue, message) => {
  const params = {
    MessageBody: message,
    QueueUrl: queue,
  };
  console.log("Params for SQS " + JSON.stringify(params));

  return sqs
    .sendMessage(params)
    .promise()
    .then((data) => {
      console.log(
        "Notification about fulfilled orders was sent to sqs queue. " +
          JSON.stringify(data)
      );
      return data;
    });
};
