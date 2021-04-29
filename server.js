const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const getClient = require('./db.js');
const activityRouter = require('./routes/activityRoutes.js');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api",activityRouter);

if (process.env.Node_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    }); 
}

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
        await getClient();
    }catch(err) {throw err};
});