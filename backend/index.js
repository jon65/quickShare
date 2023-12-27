const express = require('express');
const cors = require('cors');
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({region: 'ap-southeast-1'});

const app = express();
app.use(express.json());

//i want to upload files to the cloud db

app.get('/', uploadFiles);

// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT || 8080}`);
});
3
//functions
const uploadFiles = async () => { };