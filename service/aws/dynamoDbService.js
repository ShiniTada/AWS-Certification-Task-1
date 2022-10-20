"use strinct";

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

// env variables
const TABLE_NAME = process.env.orderTableName;

module.exports.saveOrder = (order) => {
  const params = {
    TableName: TABLE_NAME,
    Item: order,
  };
  return dynamo
    .put(params)
    .promise()
    .then((data) => {
      console.log(JSON.stringify(data) + " saved in database.");
      return data;
    });
};

module.exports.getOrderById = (orderId) => {
  const params = {
    Key: {
      orderId: orderId,
    },
    TableName: TABLE_NAME,
  };
  return dynamo
    .get(params)
    .promise()
    .then((result) => {
      console.log("Get order form database: " + JSON.stringify(result.Item));
      return result.Item;
    });
};
