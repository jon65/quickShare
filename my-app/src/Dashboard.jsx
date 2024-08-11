import React, { useContext, useState } from 'react';
import { QuickShareContext } from './context/quickShareContext';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

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

    const handleCopyToClipboard = () => {
        const textToCopy = `Key: ${key}\nToken: ${code}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Copied to clipboard!');
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    return (
        <div
            className="page-container"
            style={{
                backgroundColor: '#bee9e8',
                height: '100vh',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', padding: 2, width: '100%', height: '100%' }}>
                <Box
                    my={4}
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        backgroundColor: '#33415c',
                        borderRadius: '10px',
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingLeft: 4,
                        paddingRight: 4,
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography fontWeight="500" variant="h2" sx={{ width: '100%', textAlign: 'left', letterSpacing: 6, color: '#ebebeb' }}>
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
                            <Button
                                variant="contained"
                                component="span"
                                sx={{
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px',
                                    marginRight: 2,
                                    '&:hover': {
                                        backgroundColor: '#45a049',
                                    },
                                }}
                            >
                                Choose File
                            </Button>
                        </label>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={isLoading}
                            sx={{
                                backgroundColor: '#1976d2',
                                color: 'white',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                marginTop: 2,
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
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
                    <Box
                        my={4}
                        sx={{
                            backgroundColor: '#ffffff',
                            padding: 4,
                            borderRadius: '10px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#001845' }}>
                            Token & Key
                        </Typography>
                         <Typography variant="h5" sx={{color: '#001845' }}>
                            Token: {code}
                        </Typography>
                            <Typography variant="h5" sx={{color: '#001845' }}>
                            Key: { key}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleCopyToClipboard}
                        >
                            Copy Token & Key to Clipboard
                        </Button>
                    </Box>
                )}
            </Container>
        </div>
    );
};

export { Dashboard };
