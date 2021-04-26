const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const getClient = async () => {
    mongoose
        .connect(process.env.MONGO_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    mongoose.connection.on('connected', function(){  
        console.log("MongoDB Connected");
    });
    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("MongoDB Disconnected");
            process.exit(0);
        });
    });
};

module.exports = getClient;

