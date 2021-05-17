const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
const user = require("../models/user");
const router = express.Router();


router.post("/signup",(req, res, next) =>{
  bcrypt.hash(req.body.password, 10)
  .then(hash =>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result =>{
      res.status(201).json({
        message:'User Created!!',
        result: result
      })
    })
    .catch( err =>{
      res.status(500).json({
        error: err
      })
    })
  })
})

router.post("/login", (req, res, next)=>{
  let fetchedUser;
  User.findOne({ email: req.body.email})
  .then(user =>{
    // console.log(user)
    if(!user){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result =>{
    // console.log(result)
    if(!result){
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
       'secret_this_should_be_longer',
       { expiresIn : "1h"}
       );
       res.status(200).json({
         token :"Bearer " + token,
         expiresIn: 3600,
         userId : fetchedUser._id
       })
  })
  .catch(err =>{
    res.status(500).json({
      error: err
    })
  })
})

router.put("/updateVote",
checkAuth,
 (req, res, next) =>{
  const vote ={
    isVoted :true
  };
  console.log(vote)
  user.updateOne({_id: req.userData.userId}, vote )
  .then(result =>{
    console.log(result);
    res.status(200).json({
      message : 'Voted Succesfully'
    })
  })
})

router.get("/getUserDetails",checkAuth, (req, res, next) =>{
  User.findById(req.userData.userId).then(user =>{
    if(user){
      res.status(200).json(user)
    }else{
      res.status(404).json({
        message : 'User not found'
      })
    }
  })
})

module.exports = router;
