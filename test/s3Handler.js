// RUN `npm install aws-sdk` BEFORE YOU RUN THIS SCRIPT

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");
const fs = require("fs");

// Set the region
AWS.config.update({ region: "ap-southeast-1" });

// Set the credentials
AWS.config.update({
    accessKeyId: "AKIASH7TJKHN3BLBVS7F",
    secretAccessKey: "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",
});

// Create an S3 client
var s3 = new AWS.S3();

async function uploadFiles(files, lotteryName) {
    for (let i = 0; i < files.length; i++) {
        // Convert the base64-encoded string to a Buffer
        var fileData = Buffer.from(files[i], "base64");

        // Set the parameters for the upload
        var params = {
            Bucket: "mochi-bucket",
            Key: `${lotteryName}/` + i + ".png",
            Body: fileData,
            ContentType: "image/png",
        };

        // Upload the file to S3
        await s3.upload(params).promise();
    }
}

// Read the JSON file
const currentDir = process.cwd();
var fileData = fs.readFileSync(currentDir + "\\test\\listOfByte64.json");

// Parse the JSON data
var files = JSON.parse(fileData);

// main function
uploadFiles(files, "test");
