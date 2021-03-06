const mongoose = require('mongoose');

const Task = mongoose.model('tasks',{
    
    description:{
    type:String,
    required:true,
    trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users' //model name
    }

})

module.exports = Task;