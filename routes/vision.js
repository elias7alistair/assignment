var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

router.post('/classify', async function(req, res, next) {
  try {
    // Assuming you receive an AWS temporary access key, secret key, and region
    AWS.config.update({
      accessKeyId: 'AKIARAR74F5B2ZJFROOU',
      secretAccessKey: '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',
      region: 'ap-southeast-1'
    });

    const rekognition = new AWS.Rekognition();

    // Assuming you are using a simple logic to detect labels using AWS Rekognition
    const params = {
      Image: {
        Bytes: req.files.file.data
      }
    };

    const response = await rekognition.detectLabels(params).promise();

    // Extracting labels from the AWS Rekognition response
    const labels = response.Labels.map(label => label.Name);

    res.json({
      "labels": labels
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      "error": "Unable to process the request"
    });
  }
});

module.exports = router;
