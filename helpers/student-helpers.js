var bcrypt = require('bcryptjs');
var objectId = require('mongodb').ObjectID;
var db = require('../config/connection');
var collections = require('../config/collections');

module.exports = {
   doSignup:function(studentData) {
      return new Promise(async(resolve, reject) => {
         delete studentData.cpassword
         studentData.date = new Date()
         response = {}
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({$or:[{email:studentData.email}, {mobile:studentData.mobile}]})
         if(student)
         {
            response.signupErr = "Account already exists. Please login"
            response.status = false
            resolve(response)
         }
         else
         {
            let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({id:studentData.institution})
            if(institution)
            {
               studentData.institution = objectId(institution._id)
               studentData.password = await bcrypt.hash(studentData.password, 10)
               db.get().collection(collections.STUDENT_COLLECTION).insertOne(studentData).then((data) => {
                  response.student = data.ops[0]
                  response.status = true
                  resolve(response)
               })
            }
            else
            {
               response.signupErr = "Institution does not exists. Please check and try again"
               response.status = false
               resolve(response)
            }
         }
      })
   },
   doLogin:function(studentData) {
      return new Promise(async(resolve, reject) => {
         response = {}
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({email:studentData.email})
         if(student)
         {
            bcrypt.compare(studentData.password, student.password).then((status) => {
               if(status)
               {
                  response.student = student
                  response.status = true
                  resolve(response)
               }
               else
               {
                  response.loginErr = "Invalid Email or Password"
                  response.status = false
                  resolve(response)
               }
            })
         }
         else
         {
            response.loginErr = "Invalid Email or Password"
            response.status = false
            resolve(response)
         }
      })
   },
   getStudentDetails:function(studentId) {
      return new Promise(async(resolve, reject)=> {
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({_id:objectId(studentId)})
         resolve(student)
      })
   },
   getInstitutionDetails:function(institutionId) {
      return new Promise(async(resolve, reject)=> {
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({_id:objectId(institutionId)})
         resolve(institution)
      })
   },
   updateStudentDetails:function(studentData, studentId) {
      return new Promise((resolve, reject)=> {
         db.get().collection(collections.STUDENT_COLLECTION).updateOne({_id:objectId(studentId)},
         {
            $set:
            {
               fname:studentData.fname,
               lname:studentData.lname,
               email:studentData.email,
               mobile:studentData.mobile,
               guardian:studentData.guardian,
               address:studentData.address,
               gender:studentData.gender
            }
         }).then(()=> {
            resolve()
         })
      })
   },
   getAllAnnouncements:function() {
      return new Promise(async(resolve, reject)=> {
         let announcements = await db.get().collection(collections.ANNOUNCEMENT_COLLECTION).find({$or:[{visiblity:'Everyone'},{visiblity:'Student'}]}).sort({_id:-1}).toArray()
         resolve(announcements)
      })
   }
 }