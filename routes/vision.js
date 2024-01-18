var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

router.post('/classify', async function(req, res, next) {
  try {
   
    AWS.config.update({
      accessKeyId: '',
      secretAccessKey: '',
      region: 'ap-southeast-1'
    });

    const rekognition = new AWS.Rekognition();

    if (!req.files || !req.files.file || !req.files.file.data) {
      // If the file data is missing
      return res.status(400).json({
        error: 'Please Select an image'
      });
    }

    const params = {
      Image: {
        Bytes: req.files.file.data
      }
    };

    const response = await rekognition.detectLabels(params).promise();

    // Extracting labels from the AWS Rekognition response
    const labels = response.Labels.map(label => label.Name);

    res.json({
      labels: labels
    });
  } catch (error) {
    console.error("Error:", error);

    if (error.code === 'MissingRequiredParameter') {
      // Handle missing required parameters in case
      return res.status(400).json({
        error: 'Missing required parameters'
      });
    }

    if (error.statusCode === 400) {
      // Handle AWS Rekognition validation errors
      return res.status(400).json({
        error: 'AWS Rekognition validation error',
        details: error.message
      });
    }

    res.status(500).json({
      error: 'Server Unreachable at the moment'
    });
  }
});

module.exports = router;
