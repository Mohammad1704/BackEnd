import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

// import businessRoutes from './routes/business_router.js';

// pull in error types and the logic to handle them and set status codes
import { BadParamsError , OwnershipError } from "../lib/custom_errors";

import models from "./../db/models";
import { request } from "http";

const tokenAuth = passport.authenticate("jwt", { session: false });
const localAuth = passport.authenticate("local", { session: false });
const User = models.User;

// instantiate a router (mini app that only handles routes)
const router = express.Router();

router.get('/user/:id', (req, res) => {
  console.log("===========tes get user/:id======");

  if (!isNaN(req.params.id)){
    models.User.findByPk(req.params.id, {
      include: [{ model: models.Business, as: "business"}]
    })
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
  // Promise.resolve(req.body.credentials)
  //   .then(credentials => {
  //     if (
  //       !credentials ||
  //       !credentials.password ||
  //       credentials.password !== credentials.password_confirmation
  //     ) {
  //       throw new BadParamsError();
  //     } else {
  //       console.log(credentials)
        // return models.User.create( {
        //   email: credentials.email,
        //   hashedPassword: credentials.password,
        //   // password_confirmation:credentials.password_confirmation,
        //   // car_pic:credentials.car_pic,
        //   // additional_info:credentials.additional_info,
        //   // phone_number:credentials.phone_number
        //   // name: credentials.name,
        //   // car_pic: credentials.car_pic ,
        //   // additional_info: credentials.additional_info ,
        //   // phone_number: credentials.phone_number
        //  }
        // );
  //     }
  //   })
    // .then(user => {
    //   const payload = {
    //     id: user.id,
    //     email: user.email,
    //     expires: process.env.JWT_EXPIRATION_D + "d"
    //   };

  //     // assigns payload to req.user
  //     req.login(payload, { session: false }, error => {
  //       if (error) {
  //         next();
  //       }

  //       // generate a signed json web token and return it in the response
  //       const token = jwt.sign(JSON.stringify(payload), process.env.PASS_KEY);

  //       // assign our jwt to the cookie
        // res
        //   .cookie("jwt", token, { httpOnly: true, secure: false })
        //   .status(201)
        //   .json({ id: req.user.id, email: req.user.email });
  //     });
  //   })
  //   // pass any errors along to the error handler
  //   .catch(e => next());

  models.User.create( {
          email: credentials.email,
          hashedPassword: credentials.password,
          // password_confirmation:credentials.password_confirmation,
          // car_pic:credentials.car_pic,
          // additional_info:credentials.additional_info,
          // phone_number:credentials.phone_number
          // name: credentials.name,
          // car_pic: credentials.car_pic ,
          // additional_info: credentials.additional_info ,
          // phone_number: credentials.phone_number
         }).then(user => { res.json({ user})}).catch(e => next());
})
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

router.put('/EditProfile/:id', (req, res) => {
  console.log('hi');
  models.User.findByPk(req.params.id).then(user => {   
    console.log("then run /EditProfile/:id", req.body.user);
         
     user.update({
      name:req.body.user.name,
      email:req.body.user.email,
      car_pic:req.body.user.car_pic,
      additional_info : req.body.user.additional_info,
      phone_number: req.body.user.phone_number
    })
    res.status(200).json({ user: user });
  }).catch(e => console.log(e));
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

router.get('/user/:userID/businesses', (req, res) => {
  models.User.findByPk(req.params.userID,
    { include: [{model: models.Business , as: "business"}] }
    ).then(user => {
    res.status(200).json({ user: user }); // or use user.business to show only user businesses
  })
  .catch(e => {console.log(e);
    console.log("catch happens in /api/user/:id/business");
  });
});

router.put('/user/:userID/businesses/:id', tokenAuth , (req, res , next) => {  // <=== not work 

 
  models.Business.findByPk(req.params.id).then(business => {  
    // if(req.user.id === business.user_id )  {    
     business.update({
      shop_name: req.body.business.shop_name,
      location: req.body.business.location,
      opining_time: req.body.business.opining_time ,
      closing_time: req.body.business.closing_time ,
      phone_number: req.body.business.phone_number ,
      menu: req.body.business.menu
    })
    res.status(200).json({ business: business });
  // } else {
  //   throw new OwnershipError()
  // }
  }).catch(e => next());
});

// ; 
router.post('/user/:userID/businesses', tokenAuth, (req, res) => { // <=== not work
  models.Business.create({
    shop_name: req.body.business.shop_name,                                               
    location: req.body.business.location,                                   
    opining_time: req.body.business.opining_time,                                     
    closing_time: req.body.business.closing_time,                                     
    phone_number: req.body.business.phone_number,                                     
    menu: req.body.business.menu,                                   
    user_id: req.params.userID                         
  })
    .then((business) => {
      res.status(201).json({
          business: business,
      });
    })
    .catch(e => console.log(e));
});

export default router;


