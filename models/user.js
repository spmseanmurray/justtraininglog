const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email required"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    first: {
        type: String,
        required: [true, "Firstname required"],
        lowercase: true,
    },
    last: {
        type: String,
        required: [true, "Lastname required"],
        lowercase: true,
    },
    stravaID: {
        type: String,
        lowercase: true,
    },
    isVerified: {type: Boolean, default: false},
    avatar: {type: String},
});

UserSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
        });
    });
});

UserSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;