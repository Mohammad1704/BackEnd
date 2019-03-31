import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// import businessRoutes from './routes/business_router.js';

// pull in error types and the logic to handle them and set status codes
import { BadParamsError } from "../lib/custom_errors";

import models from "./../db/models";

const tokenAuth = passport.authenticate("jwt", { session: false });
const localAuth = passport.authenticate("local", { session: false });
const User = models.User;

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.get('/user/:id', (req, res) => {
  console.log("===========tes get user/:id======");

  if (!isNaN(req.params.id)){
    models.User.findByPk(req.params.id)
    .then((user) => {
      if (user !== null){
        res.status(200).json({ user });
      } else {
        res.status(401).json({message: 'user not found'});
      }
    })
    .catch(e => console.log(e));
  }else{
    res.status(406).json({ error: 'unvilde ID'});
  }
});
 
router.post("/sign-up", (req, res, next) => {
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve(req.body.credentials)
    .then(credentials => {
      if (
        !credentials ||
        !credentials.password ||
        credentials.password !== credentials.password_confirmation
      ) {
        throw new BadParamsError();
      } else {
        console.log(credentials)
        return models.User.create( {
          email: credentials.email,
          hashedPassword: credentials.password,
          password_confirmation:credentials.password_confirmation
          // name: credentials.name,
          // car_pic: credentials.car_pic ,
          // additional_info: credentials.additional_info ,
          // phone_number: credentials.phone_number
         }
        );
      }
    })
    .then(user => {
      const payload = {
        id: user.id,
        email: user.email,
        expires: process.env.JWT_EXPIRATION_D + "d"
      };

      // assigns payload to req.user
      req.login(payload, { session: false }, error => {
        if (error) {
          next();
        }

        // generate a signed json web token and return it in the response
        const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

        // assign our jwt to the cookie
        res
          .cookie("jwt", token, { httpOnly: true, secure: false })
          .status(201)
          .json({ id: req.user.id, email: req.user.email });
      });
    })
    // pass any errors along to the error handler
    .catch(e => next());
});

router.post("/sign-in", localAuth, (req, res, next) => {
  if (req.user) {
    // This is what ends up in our JWT
    const payload = {
      id: req.user.id,
      email: req.user.email,
      expires: process.env.JWT_EXPIRATION_D + "d"
    };

    // assigns payload to req.user
    req.login(payload, { session: false }, error => {
      if (error) {
        next();
      }

      // generate a signed json web token and return it in the response
      const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

      // assign our jwt to the cookie
      res
        .cookie("jwt", token, { httpOnly: true, secure: false })
        .status(200)
        .json({ id: req.user.id, email: req.user.email });
    });
  }
});

router.patch("/change-password", tokenAuth, (req, res, next) => {
  if (!req.body.passwords.new) throw new BadParamsError();

  User.findOne({
    where: {
      email: req.user.email
    }
  })
    .then(user => {
      console.log("then happninng  in user/:id/businesse");

      if (user != null) {
        if (user.validPassword(req.body.passwords.old)) {
          user.bcrypt(req.body.passwords.new);

          res.status(200).json({ msg: "success" });
        } else {
          throw new BadParamsError();
        }
      } else {
        throw new BadParamsError();
      }
    })
    .catch(e => next());
});

router.get('/user/:id/businesses', (req, res) => {
  models.User.findByPk(req.params.id, { include: [{model: models.Business}] }).then(user => {
    res.status(200).json({ Business: user });
  })
  .catch(e => {console.log(e);
    console.log("catch happned in /api/user/:id/businesse");
  });
});

// ; 


export default router;
