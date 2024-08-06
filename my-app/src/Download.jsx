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
        downloadFile(key1, code1);
    }

    return (
        <Container maxWidth="lg">
            <Box>
                <Typography variant="h1">Download File</Typography> 
                <Box>
                    <Box>
                    <h3>Key</h3>
                    <TextField
                        id="outlined-basic"
                        label="Enter Key"
                        variant="outlined"
                        value={key1} // Bind state to the input
                        onChange={(e) => setKey(e.target.value)} // Update state on change
                        fullWidth // Optional: Makes the input take full width of its container
                    />
                    <Button variant="contained" href="#contained-buttons">
                        Link
                    </Button>
                    </Box>
                      <Box>
                    <h3>Code</h3>
                    <TextField
                        id="outlined-basic"
                        label="Enter Code"
                        variant="outlined"
                        value={code1} // Bind state to the input
                        onChange={(e) => setCode(e.target.value)} // Update state on change
                        fullWidth // Optional: Makes the input take full width of its container
                    />
                        <Button variant="contained" href="#contained-buttons" sx={{width:"80%"}}>
                        Link
                    </Button>
                    </Box>
                    <Box>
                        <h3>Submit</h3>
                        <Button onClick={submitHandler}>Submit</Button>
                    </Box>
                </Box>
           
            </Box>
        </Container>
    );
}

export default Download;
