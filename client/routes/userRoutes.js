const express = require("express");
const UserModel = require("../../models/user");
const {check, validationResult} = require("express-validator");
const app = express();

app.post("/user/login", [
    check("email", "Email is not valid").not().isEmpty().isEmail().normalizeEmail({remove_dots: false}),
    check("password", "Password required").not().isEmpty(),
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).jsonp(errors.array());

    const user = await UserModel.findOne({email: req.body.email});
    try {
    if (!user) return res.status(401).send({msg: "The email address is not associated with any account."});
    user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) return res.status(401).send({msg: "Invalid password"});
        res.send({user: user.toJSON()});
    });
    } catch (err) {
    res.status(500).send(err);
    }
    }
);

app.post("/user/register", [
    check("email", "Email is not valid").not().isEmpty().isEmail().normalizeEmail({remove_dots: false}),
    check("password", "Password required").isLength({min: 8}),
    check("first", "Firstname required").notEmpty(),
    check("last", "Lastname required").notEmpty(),
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).jsonp(errors.array());

    try {
    const newuser = new UserModel(req.body);
    newuser.dateMember = new Date();
    newuser.isVerified = false;
    newuser.save(function(err) {
        if (err) {
        if (err.code === 11000) {
            return res.status(401).send({msg: "The email address you have entered is already associated with another account."});
        }
        return res.status(500).send({msg: err.message});
        }
        res.send({user: newuser.toJSON()});
    });
    } catch (err) {
    res.status(500).send(err);
    }
    }
);

app.post("/user/update/:id", async (req, res) => {
    try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.send(user);
    } catch (err) {
    console.log(err);
    res.status(500).send(err);
    }
});

app.delete("/user/:id", async (req, res) => {
    try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) res.status(404).send("No item found");
    res.status(200).send();
    } catch (err) {
    res.status(500).send(err);
    }
});

module.exports = app;