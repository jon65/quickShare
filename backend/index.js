const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { S3Client, ListBucketsCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client({ region: 'ap-southeast-1' });

app.get('/', async (req, res) => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log('Success', data.Buckets);
    res.send({
      file: data.Buckets,
    });
  } catch (err) {
    console.log('Error', err);
    res.status(500).send({
      error: 'Failed to list buckets',
    });
  }
});
/**
 * Upload to s3 with metadata
 * 
 * */
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

  console.log('Uploaded file:', file); // Debugging log

  if (!file) {
    return res.status(400).send({
      error: 'No file uploaded',
    });
  }

  // Ensure file.path is a string
  if (typeof file.path !== 'string') {
    return res.status(400).send({
      error: 'Invalid file path',
    });
  }

  const fileStream = fs.createReadStream(file.path);

  const param = {
    Bucket: 'quickshare-bucket1',
    Body: fileStream,
    Key: file.originalname,
  };

  try {
    const cmd = new PutObjectCommand(param);
    const data = await s3Client.send(cmd);

    // Delete temp file on multer
    fs.unlinkSync(file.path);

    res.status(200).send({
      file: data,
    });
  } catch (e) {
    console.error('Error uploading file to S3:', e);
    res.status(500).send({
      error: 'Internal server error',
    });
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
