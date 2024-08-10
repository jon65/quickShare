import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import mainLogo from './image/logoQS.png';
import './Homepage.css'; // Import the CSS file for styling
//todo https://coolors.co/palettes/trending 



const Homepage = () => {
  return (    
    <div
      className="page-container"
      style={{
      height: '100vh',       
      width: '100%',        
      display: 'flex',      
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div
        className="content-container"
        style={{
      height: '100%',
      width: '80%',        
      display: 'flex',      
      justifyContent: 'center' 
    }}>
      <Grid 
        container 
        justifyContent="center"
        alignItems="center"
        spacing={4} // Add spacing between grid items
      >
        <Grid item xs={5}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 5,
          }}>
              <Typography fontWeight="500" variant="h1" sx={{width: '100%',textAlign: 'right', letterSpacing: 6, color: '#ebebeb'}}>
                QuickShare
              </Typography>
              <Typography variant="h5" sx={{ width: '100%', textAlign: 'right', pr: 3, color: '#ebebeb'}}>
                A secure way to transfer files securely
              </Typography>
              <Typography variant="h5" sx={{ width: '100%', textAlign: 'right', pr:3, color: '#ebebeb'}}>
                No authentication needed!
              </Typography>
              <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                p: 3
              }}>
                <Button variant="contained" color="primary"
                    sx={{
                      mr: 2,
                          fontWeight: 'bold', // Make the font bold
                      fontSize: '1.1rem', // Adjust font size
                      width: '60%',
                      height: '3em',
                      backgroundColor: "#001233",

                      marginBottom: 3,
                      borderRadius: '8px', // Adjust border radius if needed
            letterSpacing: '0.1em', // Increase letter spacing

      }}
                >
                Upload Files
              </Button>
                <Button variant="contained" color="secondary"
             sx={{
               mr: 2,
    fontWeight: 'bold', // Make the font bold
    fontSize: '1.1rem', // Adjust font size                      fontSize: '1.1rem', // Adjust font size
                      width: '60%',
               height: '3em',
               marginBottom: 3,
                      backgroundColor: '#52796f',
               borderRadius: '8px', // Adjust border radius if needed
            letterSpacing: '0.1em', // Increase letter spacing

      }}
                >
                Download Files
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingRight: 3,
            alignItems: 'center',
          }}>
            <img 
              src={mainLogo} 
              alt="An Unknown brand" 
              style={{ width: '100%', maxWidth: '800px', height: 'auto' }} 
            />
          </Box>
        </Grid>
      </Grid>
      </div>
        <svg className="wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150" preserveAspectRatio="none">
        <path d="M0,0 C150,100 450,-100 750,50 C1050,200 1200,-100 1200,50 L1200,150 L0,150 Z" className="wave-path"></path>
      </svg>
    </div>
  );
}

export default Homepage;
