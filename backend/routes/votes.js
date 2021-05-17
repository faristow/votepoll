const express = require("express");
const multer = require("multer")
const router = express.Router();

const Vote = require("../models/vote")
const checkAuth = require("../middleware/check-auth")


const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if(isValid){
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
     const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.post("",
  checkAuth,
 multer({storage : storage}).single("image"), async (req,res,next) =>{
  const url = req.protocol + '://' + req.get("host");
  const {title,content,voteCount} = req.body
  const vote ={
    title ,
    content ,
    imagePath: url + "/images/" + req.file.filename,
    voteCount
  }
 await new Vote(vote).save()



 res.status(201).json({
  message : 'Vote added succesfully',

});

})

router.put("/:id",
checkAuth,
multer({storage : storage}).single("image"), (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url+ "/images/" + req.file.filename
  }
  const vote = new Vote({
    _id: req.body.id,
    title : req.body.title,
    content : req.body.content,
    imagePath : imagePath,
    voteCount : req.body.voteCount
  });
  console.log(vote)
  Vote.updateOne({_id: req.params.id}, vote )
  .then(result =>{
    console.log(result);
    res.status(200).json({
      message : 'Updated Succesfully'
    })
  })
})
router.put("/updateVote/:id",
checkAuth,
 async(req, res, next) =>{
 const data = await Vote.findById(req.params.id)
 console.log(data,'before')
 data.voteCount = data.voteCount + 1
 console.log(data,'after')

  Vote.updateOne({_id: req.params.id}, data )
  .then(result =>{
    console.log(result);
    res.status(200).json({
      message : 'Updated Succesfully'
    })
  })
})

router.get("/:id", (req, res, next) =>{
  Vote.findById(req.params.id).then(vote =>{
    if(vote){
      res.status(200).json(vote)
    }else{
      res.status(404).json({
        message : 'Vote not found'
      })
    }
  })
})

router.get("",(req, res, next) =>{
  Vote.find().then(documents =>{
    res.status(200).json({
      message:'Votes fetched succesfully',
      votes : documents
    });
  })
 })


 router.delete("/:id", checkAuth, (req, res, next) =>{
  Vote.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result)
    res.status(200).json({
      message : "Vote Deleted"
    })
  })

 })


module.exports = router;
