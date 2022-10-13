# AWS Certification Task 1

Imagine that you are the owner of an online bakery that sells cakes. Your customers can purchase cakes online and they will get them delivered to their homes some time after. 
For that you need to:
- create a serverless system to do the whole ordering process. 
- model the flow of the data. 
- manage the order in a stream of data. 

### Basic flow:
![](media/flow.png "flow picture")

1. The users order a cake in our online shop. 
2. When that happens, someone needs to notify the cake maker that there is an order and what kind of cake to make. 
3. The order will appear as an email to the cake maker so they know that they have a new order to prepare. 
4. When the cake maker is done making the cake, they will notify the system that the order is fulfilled. 
5. When the order is fulfilled, the system now needs to notify the delivery company to take the cake to the customer. 
6. When the customer receives the cake, they will need to notify the company that they have received it. Now the order is completed and delivered. ☺️ 

### Part 0. Preparation
`npm install -g serverless`

`serverless config credentials --provider aws --key {iam-key} --secret {iam-secret}`

### Part 1. Resources to create
![](media/part1.png)
- AWS Gateway - endpoint to order a cake
- AWS Lambda - executes when the message come to an endpoint
- AWS Deploy - to deploy application to AWS Account
