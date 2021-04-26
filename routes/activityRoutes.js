const express = require('express');
const activityModel = require('../models/activity');
const app = express();

app.get('/activity/:id', async (req, res) => {
    const activity = await activityModel.find({activityID:req.params.id});
    try {
      res.send(activity);
    } catch (err) {
      res.status(500).send(err);
    }
});
app.get('/activity', async (req, res) => {
    const activity = await activityModel.find();
    try {
      res.send(activity);
    } catch (err) {
      res.status(500).send(err);
    }
});
app.post('/activity', async (req, res) => {
    const activity = new activityModel(req.body);
    try {
      await activity.save();
      res.send(activity);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
});

module.exports = app;