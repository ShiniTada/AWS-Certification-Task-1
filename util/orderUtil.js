"use strinct";

//run command: npm i uuid --save
const { v4: uuidv4 } = require("uuid");

module.exports.createOrder = (body) => {
  const order = {
    orderId: uuidv4(),
    name: body.name,
    address: body.address,
    productId: body.productId,
    quantity: body.quantity,
    orderDate: Date.now(),
    eventType: "order_placed",
  };
  console.log("Input converted to Order object: " + JSON.stringify(order));
  return order;
};

module.exports.makeOrderFulfilled = (order, fulfillmentId) => {
  order.eventType = "order_fulfilled";
  order.fulfillmentId = fulfillmentId;
  order.fulfillmentDate = Date.now();
  console.log("Make order fulfilled: " + JSON.stringify(order));
  return order;
};
