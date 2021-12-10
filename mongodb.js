// npm i mongodb
const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';

const dbName = 'task_manager';

mongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('error');
    }
    console.log('success');
    const db = client.db(dbName);

    // db.collection('users').insertOne({
    //     name:'amr',
    //     age:25
    // },(error,data)=>{
    //     if(error){
    //         return console.log('cannot insert');
    //     }
    //     console.log(data.insertedId);
    // })

//     db.collection('users').insertMany([{
//         name:'amr',
//         age:25
//     },
//     {name:'ali',age:30}
// ])

// db.collection('tasks').insertOne({
//     description:'add new task',
//     completed:false
// })

// db.collection('tasks').insertMany([{
//     description:'task1',
//     completed:false
// },{
//     description:'task2',
//     completed:false
// },
// {
//     description:'task3',
//     completed:false
// },
// {
//     description:'update ui',
//     completed:true
// }],(error,result)=>{
//     if(error){
//         return console.log('cannot insert');
//     }
//     console.log(result.insertedCount);
// })

const ObjectId = mongodb.ObjectId

    // db.collection('users').findOne({age:25},(error,user)=>{
    //     if(error){
    //         console.log('error'); ==> return first user with age 25
    //     }
    //     console.log(user);
    // })

    // db.collection('tasks').findOne({_id:new ObjectId("6190c50ebd4e9b4a82a6c6f7")},(error,user)=>{
    //     if(error){
    //         console.log('error');
    //     }
    //     console.log(user);
    // })
    // db.collection('tasks').find({completed:false}).limit(3).toArray((error,users)=>{
    //     if(error){
    //         return console.log('error');
    //     }
    //     console.log(users);
    // })

    // db.collection('users').updateOne({_id:new ObjectId("6190c2ec61d1d9046cfa21ec")},{
    //     $set:{name:'ahmed'},
    //     $inc:{age:6}
    // }).then(result=>{
    //     console.log(result.modifiedCount);
    // }).catch(error=>{
    //     console.log(error);
    // })

    // db.collection('tasks').updateMany({},{
    //     $set:{completed:true}
        
    // }).then(result=>{
    //     console.log(result.modifiedCount);
    // }).catch(error=>{
    //     console.log(error);
    // })

    // db.collection('users').deleteOne({_id:new ObjectId("6190c2ec61d1d9046cfa21ec")},(error,user)=>{
    //     if(error){
    //         console.log('error');
    //     }
    //     console.log(user.deletedCount);
    // })

    // db.collection('tasks').deleteMany({},(error,user)=>{
    //     if(error){
    //         console.log('error');
    //     }
    //     console.log(user.deletedCount);
    // })

    // db.collection('users').deleteMany({},(error,user)=>{
    //     if(error){
    //         console.log('error');
    //     }
    //     console.log(user.deletedCount);
    // })


})