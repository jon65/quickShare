const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { S3Client, PutObjectCommand,DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client({ region: 'ap-southeast-1' });


const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

const encrypt = (buffer, password) => {
  const cipher = crypto.createCipher('aes-256-ctr', password);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
};

const decrypt = (buffer, password) => {
  const decipher = crypto.createDecipher('aes-256-ctr', password);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
};

const hashBuffer = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Upload to s3 with metadata
 * 
 * */
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const { filename, numUses } = req.body; // Get the filename and number of uses from the request body

  if (!file) {
    return res.status(400).send({
      error: 'No file uploaded',
    });
  }

  const fileBuffer = fs.readFileSync(file.path);
  const oneTimeCode = crypto.randomBytes(16).toString('hex'); // Generate a one-time code
  const encryptedBuffer = encrypt(fileBuffer, oneTimeCode); // Encrypt the file content
  const fileHash = hashBuffer(fileBuffer); // Generate hash of the original file

  const param = {
    Bucket: 'quickshare-bucket1',
    Body: encryptedBuffer,
    Key: filename,
    ContentType: file.mimetype, // Store the MIME type of the file
    Metadata: {
      'one-time-code': oneTimeCode, // Store one-time code in metadata
      'file-hash': fileHash, // Store file hash in metadata
      'usage-count': numUses // Store the number of allowed uses
    },
  };

  try {
    const cmd = new PutObjectCommand(param);
    await s3Client.send(cmd);

    // Delete temp file on multer
    fs.unlinkSync(file.path);

    res.status(200).send({
      key: filename,
      code: oneTimeCode, // Return the one-time code to the user
    });
  } catch (e) {
    console.error('Error uploading file to S3:', e);
    res.status(500).send({
      error: 'Internal server error',
    });
  }
});


app.get('/file', async (req, res) => {
  const { key, code } = req.body;

  if (!key || !code) {
    return res.status(400).send({
      error: 'Missing key or code',
    });
  }

  const headParams = {
    Bucket: 'quickshare-bucket1',
    Key: key,
  };

  try {
    const headData = await s3Client.send(new HeadObjectCommand(headParams));
    const storedCode = headData.Metadata['one-time-code'];
    const usageCount = parseInt(headData.Metadata['usage-count'], 10);

    if (storedCode !== code) {
      return res.status(400).send({
        error: 'Invalid code',
      });
    }

    if (usageCount <= 0) {
      // Delete the file if no uses are left
      const deleteParams = {
        Bucket: 'quickshare-bucket1',
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      return res.status(400).send({
        error: 'Code has expired',
      });
    }

    // Decrement the usage count and update metadata
    const newUsageCount = usageCount - 1;
    const updateParams = {
      Bucket: 'quickshare-bucket1',
      Key: key,
      Metadata: {
        ...headData.Metadata,
        'usage-count': newUsageCount.toString(),
      },
      MetadataDirective: 'REPLACE',
    };

    await s3Client.send(new CopyObjectCommand(updateParams)); // Use CopyObjectCommand to update metadata

    // Retrieve and decrypt the file
    const getObjectParams = {
      Bucket: 'quickshare-bucket1',
      Key: key,
    };

    const objectData = await s3Client.send(new GetObjectCommand(getObjectParams));
    const encryptedBuffer = await streamToBuffer(objectData.Body);
    const decryptedBuffer = decrypt(encryptedBuffer, code); // Decrypt the file content
    const retrievedFileHash = hashBuffer(decryptedBuffer); // Generate hash of the retrieved file

    // Compare the hash of the retrieved file with the stored hash
    const storedFileHash = headData.Metadata['file-hash'];
    if (retrievedFileHash !== storedFileHash) {
      return res.status(400).send({
        error: 'File integrity check failed',
      });
    }

    // Deleting the file from S3 after retrieval
    if (newUsageCount <= 0) {
      const deleteParams = {
        Bucket: 'quickshare-bucket1',
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
    }

    res.writeHead(200, {
      'Content-Type': headData.ContentType, // Ensure the content type is set correctly
      'Content-Disposition': `attachment; filename="${key}"`,
    });
    res.end(decryptedBuffer);
  } catch (e) {
    console.error('Error retrieving file from S3:', e);
    res.status(500).send({
      error: 'Internal server error',
    });
  }
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port: testing ${port}`);
});