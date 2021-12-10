const express =require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')



router.get('/tasks',auth, async(req,res)=>{
    try{
        const match = {};
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        const sort = {}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                sort:sort
            }
        });

        res.status(200).send(req.user.tasks);
    }
    catch(e){
        res.status(500).send(error);
    }
})

router.post('/tasks',auth,async(req,res)=>{
    try{
        const task = new Task({...req.body,owner:req.user._id});
        await task.save();
        res.status(200).send(task);
    }
    catch(e){
            res.status(400).send(e)
        }
})

router.get('/tasks/:id',auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send("task not found")
        }
        res.status(200).send(task);
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id;
        const task = await Task.findOneAndUpdate({_id,owner:req.user._id},req.body)
        if(!task){
            return res.status(404).send('can not find task')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        console.log(task)
        if(!task){
            return res.status(404).send('can not find task')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

/// get owner information by task id

router.get('/ownerTask/:id',auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        const task = await Task.findOne({_id,owner:req.user._id});
        if(!task){
            return res.status(404).send("task not found")
        }
        await task.populate('owner')
        res.status(200).send(task.owner);
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports = router;