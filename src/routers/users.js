const express = require('express');
const router = new express.Router();
const User = require('../models/users');
const auth = require('../middleware/auth');
const multer = require('multer');


//signup
router.post('/users', async(req,res)=>{
    try{
        const user = new User(req.body);
        const token = await user.generateToken();
        await user.save()
        res.status(200).send({user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
})

// sign in
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findCredentials(req.body.email,req.body.password)
        const token = await user.generateToken();
        res.status(200).send({user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
})


router.get('/users',auth,(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})

router.get('/profile',auth,(req,res)=>{
    res.send(req.user)
})

router.get('/users/:id',auth,(req,res)=>{
    const id = req.params.id;
    User.findById(id).then((user)=>{
        if(!user){
            return res.status(404).send('unable to find user')
        }
        res.status(200).send(user)
    }).catch((error)=>{
        res.status(500).send(error)
    })
})



router.patch('/users/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const allowedUpdates = ["name","password"];
        const isValid = updates.every(update=> allowedUpdates.includes(update))
        if(!isValid){
            return res.status(400).send('can not update');
        }

        const _id = req.params.id;
        const user = await User.findById(_id)
        if(!user){
           return res.status(404).send('can not found user');
        }
        //updates == ["name","password"]
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    }
    catch(e){
        res.status(400).send(e)
    }

})

router.patch('/profile',auth,async(req,res)=>{
    try{
        let user = req.user
        const updates = Object.keys(req.body);
        
        updates.forEach(update => user[update] = req.body[update]);
        await user.save();
        res.status(200).send(user);
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id);
        if(!user){
            return res.status(404).send('user not found')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.delete('/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(el =>{
            return el.token !== req.token
        })
        await req.user.save();
        res.send('logout success');
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send('logout all success');
    }
    catch(e){
        res.status(500).send(e)
    }
})

// upload images
const uploads = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)){
            cb(new Error('you must upload image'))
        }
        cb(null,true)
    }
})

router.post('/profileImage',uploads.single('avatar'),auth,async(req,res)=>{
    try{
        req.user.avatar = req.file.buffer;
        await req.user.save();
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.delete('/profileImage',auth,async(req,res)=>{
    try{
        req.user.avatar = null;
        await req.user.save();
    }catch(e){
        res.status(500).send("e"+e);
    }
})

module.exports = router;