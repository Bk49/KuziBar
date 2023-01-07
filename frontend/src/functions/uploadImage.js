import { Buffer as buffer } from "buffer";

// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "ap-southeast-1" });

// Set the credentials
AWS.config.update({
    accessKeyId: "AKIASH7TJKHN3BLBVS7F",
    secretAccessKey: "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",
});

// Create an S3 client
const s3 = new AWS.S3();

const uploadImage = async (images) => {
    for (let { imageUrl, base64 } of images) {
        if (/^https?:\/\//.test(imageUrl)) continue;
        const buf = new buffer.from(
            base64.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        // const buf = base64.replace(/^data:image\/\w+;base64,/, "")
        const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        await s3
            .upload({
                Bucket: "mochi-bucket",
                Key: `${imageUrl}.${mime[1].substring(6)}`,
                ContentEncoding: "base64",
                Body: buf,
                ContentType: mime[1],
            })
            .promise();
    }
    return;
};

export default uploadImage;
