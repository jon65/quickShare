import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { QuickShareContext } from './context/quickShareContext';
import React, { useContext, useState } from 'react';

const Download = () => { 
    const [key1, setKey] = useState('');
    const [code1, setCode] = useState('');
    const { isLoading, isError, errMsg, downloadFile } = useContext(QuickShareContext);

    const submitHandler = (e) => { 
        e.preventDefault();
        downloadFile(key1, code1);
    }

    return (
        <div
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
            <Container maxWidth="lg">
                <Box
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
                    <Typography fontWeight="500" variant="h2" sx={{ width: '100%', textAlign: 'center', letterSpacing: 6, color: '#ebebeb' }}>
                        Download File
                    </Typography>
                    {isError && <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>{errMsg}</Typography>}
                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ color: '#ebebeb', mb: 2 }}>Key</Typography>
                            <TextField
                                id="outlined-basic-key"
                                label="Enter Key"
                                variant="outlined"
                                value={key1}
                                onChange={(e) => setKey(e.target.value)}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#ebebeb',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#33415c',
                                    },
                                }}
                            />
                   
                        </Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ color: '#ebebeb', mb: 2 }}>Code</Typography>
                            <TextField
                                id="outlined-basic-code"
                                label="Enter Code"
                                variant="outlined"
                                value={code1}
                                onChange={(e) => setCode(e.target.value)}
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#ebebeb',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: '#33415c',
                                    },
                                }}
                            />
                          
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                onClick={submitHandler}
                                sx={{
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    letterSpacing: '1px',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default Download;
