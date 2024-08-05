const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client({ region: 'ap-southeast-1' });

const generateIV = () => crypto.randomBytes(16);

const encrypt = (buffer, password) => {
  const iv = generateIV();
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(password, 'hex'), iv);
  const encrypted = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return encrypted;
};

const decrypt = (buffer, password) => {
  const iv = buffer.slice(0, 16);
  const encryptedText = buffer.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(password, 'hex'), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted;
};

const hashBuffer = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const generateCodes = (num) => {
  const codes = [];
  for (let i = 0; i < num; i++) {
    codes.push(crypto.randomBytes(16).toString('hex'));
  }
  return codes;
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { filename, numCodes } = req.body;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded' });
  }

  const fileBuffer = fs.readFileSync(file.path);
  const oneTimeCodes = generateCodes(parseInt(numCodes, 10));
  const encryptionKey = oneTimeCodes[0];
  const encryptedBuffer = encrypt(fileBuffer, encryptionKey);
  const fileHash = hashBuffer(fileBuffer);

  const param = {
    Bucket: 'quickshare-bucket1',
    Body: encryptedBuffer,
    Key: filename,
    ContentType: file.mimetype,
    Metadata: {
      'one-time-codes': oneTimeCodes.join(','),
      'file-hash': fileHash,
      'codes-remaining': oneTimeCodes.length
    },
  };

  try {
    const cmd = new PutObjectCommand(param);
    await s3Client.send(cmd);
    fs.unlinkSync(file.path);
    res.status(200).send({ key: filename, code: encryptionKey });
  } catch (e) {
    console.error('Error uploading file to S3:', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.get('/file', async (req, res) => {
  const { key, code } = req.query;

  if (!key || !code) {
    return res.status(400).send({ error: 'Missing key or code' });
  }

  const headParams = {
    Bucket: 'quickshare-bucket1',
    Key: key,
  };

  try {
    const headData = await s3Client.send(new HeadObjectCommand(headParams));

    if (!headData.Metadata['one-time-codes'].split(',').includes(code)) {
      return res.status(400).send({ error: 'Invalid code' });
    }

    const getObjectParams = {
      Bucket: 'quickshare-bucket1',
      Key: key,
    };

    const objectData = await s3Client.send(new GetObjectCommand(getObjectParams));
    const encryptedBuffer = await streamToBuffer(objectData.Body);
    const decryptedBuffer = decrypt(encryptedBuffer, code);
    const retrievedFileHash = hashBuffer(decryptedBuffer);
    const storedFileHash = headData.Metadata['file-hash'];

    if (retrievedFileHash !== storedFileHash) {
      return res.status(400).send({ error: 'File integrity check failed' });
    }

    const deleteParams = {
      Bucket: 'quickshare-bucket1',
      Key: key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    res.writeHead(200, {
      'Content-Type': headData.ContentType,
      'Content-Disposition': `attachment; filename="${key}"`,
    });
    res.end(decryptedBuffer);
  } catch (e) {
    console.error('Error retrieving file from S3:', e);
    res.status(500).send({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
