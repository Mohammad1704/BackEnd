import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
// pull in error types and the logic to handle them and set status codes
import { BadParamsError } from "../lib/custom_errors";

import models from "../db/models";

// const tokenAuth = passport.authenticate("jwt", { session: false });
// const localAuth = passport.authenticate("local", { session: false });
const User = models.User;

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.get('/businesses',(req,res) => {
    models.Business.findAll()
    .then((businessesFromDB) => {
        res.status(200).json({
            businesses: businessesFromDB,
        });
    })
    .catch(e => console.log(e));
});

export default router;

