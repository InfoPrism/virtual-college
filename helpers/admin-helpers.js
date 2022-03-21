var bcrypt = require('bcryptjs');
var db = require('../config/connection');
var collections = require('../config/collections');
var objectId = require('mongodb').ObjectId;
const { Logger } = require('mongodb');
var fs = require('fs');
module.exports = {

    doSignup: (adminData) => {  //here userData is req.body which is passed from user.js
        return new Promise(async (resolve, reject) => {
          let emailExist=await db.get().collection(collections.ADMIN_COLLECTION).findOne({email:adminData.email})
          //console.log(adminData);
         // adminkey="$2b$10$xD/XN0eDxmDads.spe0zIusN..zWz1fbsDAhevLZpRxt8YrQOvzkW";
        // bcrypt.compare(adminData.Password,).then((status)=>{
          if(emailExist){
            resolve({ status:true});
          }else{
          
          if (adminData.code==="infoprism@1k") {
            
            let  date= new Date()
            console.log(date.toLocaleString('en-US', {
            weekday: 'short', // "Sat"
            month: 'long', // "June"
            day: '2-digit', // "01"
            year: 'numeric' // "2019"
            }))
            console.log(date.toDateString())
            console.log(date.toLocaleTimeString())
            adminData.password = await bcrypt.hash(adminData.password, 10);
            adminData.code= await bcrypt.hash(adminData.code, 10);
            adminData.date = await date.toDateString()+' Time: '+date.toLocaleTimeString()
           // adminData.Password = await bcrypt.hash(adminData.Password, 10);
            db.get().collection(collections.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0]);
              });
          } else {
            resolve({ status: false });
          }
        }
        });
      },
      doLogin : (adminData) => {              //here userData is re.body which is passed from user.js
        return new Promise(async(resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collections.ADMIN_COLLECTION).findOne({email:adminData.email})
            if(admin){
                bcrypt.compare(adminData.password, admin.password).then((status)=>{
                    if(status){
                       //console.log("Login success")
                        response.admin = admin
                        response.status= true
                        resolve(response)
                        
             }else{
                        //console.log("Incorrect password")
                         resolve({status:false})
                    }
                })
            }else{
                 //console.log("Incorrect email")
                resolve({status:false})
            }
        })
    },
    /*Here we get all students under corresponding Institution*/
   getInstitution: () => {
    return new Promise(async (resolve, reject) => {
       let institutions = await db.get().collection(collections.INSTITUTION_COLLECTION).find().toArray()
       resolve(institutions)
    })
 },
 getInstitutionDetails: (institutionId) => {
  return new Promise(async (resolve, reject) => {
     let institutionDetails = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ _id: objectId(institutionId) })
     date = institutionDetails.date;
     year = date.getFullYear();
     month = date.getMonth() + 1;
     dt = date.getDate();

     if (dt < 10) {
        dt = '0' + dt;
     }
     if (month < 10) {
        month = '0' + month;
     }
     institutionDetails.date = dt + '/' + month + '/' + year;
     resolve(institutionDetails)
  })
},
   /*Here we store data of every class we created as an array*/
   getNoData: function (InstitutionId) {
    return new Promise(async (resolve, reject) => {



       let classes = await db.get().collection(collections.CLASS_COLLECTION).aggregate([
          {
             $match: { institutionId: objectId(InstitutionId) }
          },
       ]).toArray()
       let students = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
          {
             $match: {
                $and: [
                   { institution: objectId(InstitutionId) },
                   { status: 'Signup verified' }
                ]
             }
          },
       ]).toArray()
       let tutors = await db.get().collection(collections.TUTOR_COLLECTION).aggregate([
          {
             $match: {
                $and: [
                   { institution: objectId(InstitutionId) },
                   { status: 'Signup verified' }
                ]
             }
          },
       ]).toArray()
       let blockedStudents = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
          {
             $match: {
                $and: [
                   { institution: objectId(InstitutionId) },
                   { status: 'Blocked' }
                ]
             }
          },
       ]).toArray()
       let blockedTutors = await db.get().collection(collections.TUTOR_COLLECTION).aggregate([
          {
             $match: {
                $and: [
                   { institutionId: objectId(InstitutionId) },
                   { status: 'Blocked' }
                ]
             }
          },
       ]).toArray()
       noData = [students.length, tutors.length, blockedStudents.length, blockedTutors.length, classes.length]
       resolve(noData)
    })
 },         /*Here we store data of every class we created as an array*/
   getAllClass: function (InstitutionId) {
    return new Promise(async (resolve, reject) => {



       let classes = await db.get().collection(collections.CLASS_COLLECTION).aggregate([
          {

             $match:
             {
                institutionId: objectId(InstitutionId)
             }
          },
          {
             $project: {
                name: 1, description: 1, duration: 1, date: 1
             }
          }
       ]).toArray()
       resolve(classes)
    })
 },
     /*Here we get all students under corresponding Institution*/
     getAdmins: () => {
      return new Promise(async (resolve, reject) => {
         let admins = await db.get().collection(collections.ADMIN_COLLECTION).find().toArray()
         resolve(admins)
      })
   },
}