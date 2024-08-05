import React, { useContext, useState } from 'react';
import { QuickShareContext } from './context/quickShareContext';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Dashboard = () => {
    const { isLoading, isError, errMsg, uploadFile, code, key } = useContext(QuickShareContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filename, setFilename] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFilenameChange = (e) => {
        setFilename(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile && filename) {
            uploadFile(selectedFile, filename);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Typography variant="h1" gutterBottom>
                    Upload File
                </Typography>
                {isError && <Typography color="error">{errMsg}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Filename"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={filename}
                        onChange={handleFilenameChange}
                        required
                    />
                    <input
                        accept="*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" component="span">
                            Choose File
                        </Button>
                    </label>
                    <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                        Upload
                    </Button>
                </form>
                {selectedFile && (
                    <Box my={2}>
                        <Typography variant="body1">
                            <strong>Selected File Details:</strong>
                        </Typography>
                        <Typography variant="body2">Name: {selectedFile.name}</Typography>
                        <Typography variant="body2">Size: {(selectedFile.size / 1024).toFixed(2)} KB</Typography>
                        <Typography variant="body2">Type: {selectedFile.type}</Typography>
                    </Box>
                )}
                {isLoading && <Typography>Loading...</Typography>}
            </Box>
            {code && key && (
                <Box my={4}>
                    <div>
                        <Typography variant="body1">
                            <strong>Token:</strong> {code}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Key:</strong> {key}
                        </Typography>
                    </div>
                </Box>
            )}
        </Container>
    );
};

export { Dashboard };
