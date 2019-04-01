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


router.get('/business/:id', (req, res) => {
    console.log("=========== get business/:id ======");
    
    if (!isNaN(req.params.id)){
      models.Business.findByPk(req.params.id)
      .then((business) => {
        if (business !== null){
          res.status(200).json({ business });
        } else {
          res.status(401).json({message: 'business not found'});
        }
      })
      .catch(e => console.log(e));
    }else{
      res.status(406).json({ error: 'unvilde ID'});
    }
    });


router.get('/businesses',(req,res) => {
    models.Business.findAll()
    .then((businessesFromDB) => {
        res.status(200).json({
            businesses: businessesFromDB,
        });
    })
    .catch(e => console.log(e));
});

router.delete('/business/:id', (req, res) => {
    models.Business.findByPk(req.params.id) // findByPk is find by praymary key 
    .then(business => {
        business.destroy().then(() => {
        res.status(200).json({
          result:`business with ID ${req.params.id} Deleted`, success: true
        });
      })
    })
  })

  // router.put('user/:user_id/business/:id', (req, res) => {
  //   models.Business.findByPk(req.params.id).then(business => {        
  //      business.update({
  //       shop_name: req.body.test,
  //       location: req.body.location,
  //       opining_time: req.body.opining_time    ,
  //       closing_time: req.body.closing_time ,
  //       phone_number: req.body.phone_number ,
  //       menu: req.body.menu
  //     })
  //     res.status(200).json({ business: business });
  //   }).catch(e => console.log(e));
  // });

  



export default router;

