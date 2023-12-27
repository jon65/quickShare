const express = require('express');
const cors = require('cors');


const app = express();
app.use(express.json());

// listen to port
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening to port ${process.env.PORT || 8080}`);
});