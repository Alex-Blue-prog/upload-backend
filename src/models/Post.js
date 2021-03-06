const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION
});

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
},{timestamps: true});

PostSchema.pre('save', function () {
    if(!this.url) {
        this.url = `${process.env.APP_URL}files/${this.key}`;
    }
});

PostSchema.pre('remove', function () {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: `uploadexample2`,
            Key: this.key
        }).promise()
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key));
    }
});

module.exports = mongoose.model("Post", PostSchema);
