var bcrypt = require('bcryptjs');
var db = require('../config/connection');
var collections = require('../config/collections');

module.exports = {
   doSignup:function(institutionData) {
      return new Promise(async(resolve, reject) => {
         delete institutionData.cpassword
         institutionData.date = new Date()
         response = {}
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({$or:[{email:institutionData.email}, {mobile:institutionData.mobile}, {id:institutionData.id}]})
         if(institution)
         {
            response.signupErr = "Account already exists. Please login"
            response.status = false
            resolve(response)
         }
         else
         {
            institutionData.password = await bcrypt.hash(institutionData.password, 10)
            db.get().collection(collections.INSTITUTION_COLLECTION).insertOne(institutionData).then((data) => {
               response.institution = data.ops[0]
               response.status = true
               resolve(response)
            })
         }
      })
   },
   doLogin:function(institutionData) {
      return new Promise(async(resolve, reject) => {
         response = {}
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({email:institutionData.email})
         if(institution)
         {
            bcrypt.compare(institutionData.password, institution.password).then((status) => {
               if(status)
               {
                  response.institution = institution
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
   generateInstitutionId:function() {
      return new Promise(async(resolve, reject) => {
         function generateId(length)
         {
            let id = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (i = 0; i < length; i++)
            {
               id += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return id;
         }
         do
         {
            var institutionId = await generateId(8)
            var institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({id:institutionId})
         }while(institution)
         resolve(institutionId)
      })
   },
   /*Here we create a new class */
   addClass:function(classData){
      return new Promise((resolve, reject) => {
      db.get().collection(collections.CLASS_COLLECTION).insertOne(classData).then((data)=>{
        
         resolve()
     })
     
   })
   },
   /*Here we store data of every class we created as an array*/
   getAllClass:function(){
      return new Promise((resolve,reject)=>{
         let classes=db.get().collection(collections.CLASS_COLLECTION).find().toArray()
         resolve(classes)
      })
   }
}