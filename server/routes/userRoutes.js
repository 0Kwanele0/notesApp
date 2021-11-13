const express = require("express");
const User = require("../models/User");
const route = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

route.post("/register", async (req, res) => {
  User.findOne({ email: req.body.email }).then((theUser) => {
    if (!theUser) {
      try {
        bcrypt.genSalt(10, (err, salt) => {
          if (!err) {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (!err) {
                const data = {
                  name: req.body.name,
                  email: req.body.email,
                  password: hash,
                };
                const user = new User(data);
                user.save().then((myuser) => {
                  jwt.sign(
                    { id: myuser._id },
                    process.env.SECRETE,
                    (err, token) => {
                      if (err) throw err;
                      res.send({
                        token,
                        user: {
                          id: myuser._id,
                        },
                      });
                    }
                  );
                });
              } else {
                res.send("Failed to hash password");
              }
            });
          } else {
            res.send("Failed to hash password");
          }
        });
      } catch (err) {
        res.status(409).send("Unable to create user");
      }
    } else {
      res.send("Email already exist");
    }
  });
});

route.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }).then((theUser) => {
    if (theUser) {
      try {
        bcrypt.compare(req.body.password, theUser.password, (err, result) => {
          if (result) {
            jwt.sign({ id: theUser._id }, process.env.SECRETE, (err, token) => {
              if (err) throw err;
              res.send({
                token,
                user: {
                  id: theUser._id,
                },
              });
            });
          } else {
            res.send("wrong password");
          }
        });
      } catch (err) {
        res.status(409).send("Unable to create user");
      }
    } else {
      res.send("Email doesn't exist");
    }
  });
});

module.exports = route;
