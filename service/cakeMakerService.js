"use strict";

const sesService = require("./aws/sesService");

// env variables
const CAKE_MAKER_EMAIL = process.env.cakeMakerEmail;
const ORDERING_SYSTEM_EMAIL = process.env.orderingSystemEmail;

module.exports.handlePlacedOrders = (orders) => {
  let responses = [];
  for (let order of orders) {
    sesService
      .notifyByEmail(
        order,
        "New cake order",
        ORDERING_SYSTEM_EMAIL,
        CAKE_MAKER_EMAIL
      )
      .then((data) => {
        responses.push(data);
        console.log("SES responses: " + JSON.stringify(responses));
      });
  }
  return responses;
};
