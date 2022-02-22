var bcrypt = require('bcryptjs');
var objectId = require('mongodb').ObjectID;
var db = require('../config/connection');
var collections = require('../config/collections');

module.exports = {
   doSignup: function (tutorData) {
      return new Promise(async (resolve, reject) => {
         delete tutorData.cpassword
         tutorData.date = new Date()
         tutorData.remarks = []
         response = {}
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ $or: [{ email: tutorData.email }, { mobile: tutorData.mobile }] })
         if (tutor) {
            response.signupErr = "Account already exists. Please login"
            response.status = false
            resolve(response)
         }
         else {
            let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ id: tutorData.institution })
            if (institution) {
               tutorData.institution = objectId(institution._id)
               tutorData.password = await bcrypt.hash(tutorData.password, 10)
               db.get().collection(collections.TUTOR_COLLECTION).insertOne(tutorData).then((data) => {
                  response.tutor = data.ops[0]
                  response.status = true
                  resolve(response)
               })
            }
            else {
               response.signupErr = "Institution does not exists. Please check and try again"
               response.status = false
               resolve(response)
            }
         }
      })
   },
   doLogin: function (tutorData) {
      return new Promise(async (resolve, reject) => {
         response = {}
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ email: tutorData.email })
         if (tutor) {
            bcrypt.compare(tutorData.password, tutor.password).then((status) => {
               if (status) {
                  response.tutor = tutor
                  response.status = true
                  resolve(response)
               }
               else {
                  response.loginErr = "Invalid Email or Password"
                  response.status = false
                  resolve(response)
               }
            })
         }
         else {
            response.loginErr = "Invalid Email or Password"
            response.status = false
            resolve(response)
         }
      })
   },
   /*get all classes*/
   getAllClass: function (institutionId) {
      return new Promise(async (resolve, reject) => {
         let classes = await db.get().collection(collections.CLASS_COLLECTION).aggregate([
            {

               $match:
               {
                  institutionId: institutionId
               }
            },
            {
               $project: {
                  class_name: 1
               }
            }
         ]).toArray()
         resolve(classes)
      })
   },

   /*Add Subject*/

   addSubject: function (subjectDetails) {
      return new Promise(async (resolve, reject) => {
         let class_details = await db.get().collection(collections.CLASS_COLLECTION).findOne({ class_name: subjectDetails.class_name })
         subjectDetails.class = class_details._id;
         delete subjectDetails.class_name;
         subjectDetails.tutor = objectId(subjectDetails.tutor);
         let date = new Date()
         subjectDetails.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         console.log(subjectDetails);
         db.get().collection(collections.SUBJECT_COLLECTION).insertOne(subjectDetails).then((data) => {
            resolve()
         })
      })

   },

   /* Get all announcements */

   getAllAnnouncements:function() {
      return new Promise(async(resolve, reject)=> {
         let announcements = await db.get().collection(collections.ANNOUNCEMENT_COLLECTION).find({$or:[{visiblity:'Everyone'},{visiblity:'Tutor'}]}).sort({_id:-1}).toArray()
         resolve(announcements)
      })
   },

   /* Get my subjects */
   getSubjects : function(tutor){
      return new Promise(async(resolve,reject)=>{
         let subjects = await db.get().collection(collections.SUBJECT_COLLECTION).aggregate([
            {

               $match:
               {
                  tutor: objectId(tutor)
               }
            },
            {
               $project: {
                  name: 1
               }
            }  
         ]).toArray()
         resolve(subjects)
      })
   },

   /* Get my announcements */

   getMyannouncements:function(tutor){
      return new Promise(async(resolve,reject)=>{
         let announcements = await db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).find({tutor : objectId(tutor)}).sort({_id :-1}).toArray()
         resolve(announcements)
      })
   },

   /* Post my announcements */
   
   postMyAnnouncements:function(announcement){
      return new Promise(async(resolve,reject)=>{
         let date = new Date()
         if(typeof(announcement.visibility) != "object"){
            console.log("True");
            announcement.visibility = [announcement.visibility]
         }
         console.log(announcement.visibility);
         for(let i=0; i<announcement.visibility.length;i++){
            announcement.visibility[i] = objectId(announcement.visibility[i])
         }
         announcement.tutor= objectId(announcement.tutor)
         announcement.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).insertOne(announcement).then((data)=>{
            resolve()
         })
      })
   },
   /* Delete my announcement */
   deleteMyAnnouncement:function(id){
      return new Promise((resolve,reject)=>{
         db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).deleteOne({_id: objectId(id)}).then((data)=>{
            resolve()
         })
      })
   }
}

