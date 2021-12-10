const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT;

const cors = require('cors');

require('./db/mongoose');
app.use(cors())
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



/////////////////////////////////

const multer = require('multer');
// const uploads = multer({
//     dest:"images",
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.endsWith('.pdf')){
//             cb(new Error('you must upload pdf file'))
//         }
//         cb(null,true)
//     }
// })

// app.post('/profileImage',uploads.single('avatar'),(req,res)=>{
//     res.send('uploaded')
// })

app.listen(port,()=>{
    console.log('server is running '+port);
})