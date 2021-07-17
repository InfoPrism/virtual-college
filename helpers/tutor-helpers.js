var bcrypt = require('bcryptjs');
var objectId = require('mongodb').ObjectID;
var db = require('../config/connection');
var collections = require('../config/collections');

module.exports = {
   doSignup:function(tutorData) {
      return new Promise(async(resolve, reject) => {
         delete tutorData.cpassword
         tutorData.date = new Date()
         response = {}
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({$or:[{email:tutorData.email}, {mobile:tutorData.mobile}]})
         if(tutor)
         {
            response.signupErr = "Account already exists. Please login"
            response.status = false
            resolve(response)
         }
         else
         {
            let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({id:tutorData.institution})
            if(institution)
            {
               tutorData.institution = objectId(institution._id)
               tutorData.password = await bcrypt.hash(tutorData.password, 10)
               db.get().collection(collections.TUTOR_COLLECTION).insertOne(tutorData).then((data) => {
                  response.tutor = data.ops[0]
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
   doLogin:function(tutorData) {
      return new Promise(async(resolve, reject) => {
         response = {}
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({email:tutorData.email})
         if(tutor)
         {
            bcrypt.compare(tutorData.password, tutor.password).then((status) => {
               if(status)
               {
                  response.tutor = tutor
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
   }
}