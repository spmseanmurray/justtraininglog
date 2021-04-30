const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const getClient = require('./db.js');
const activityRouter = require('./client/routes/activityRoutes.js');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const host = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use("/api",activityRouter);

if (process.env.NODE_ENV === 'production') {
    // Exprees will serve up production assets
    app.use(express.static('client/build'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

app.listen(port, host, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await getClient();
    }catch(err) {throw err};
});