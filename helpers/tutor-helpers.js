var bcrypt = require('bcryptjs');
var objectId = require('mongodb').ObjectID;
var db = require('../config/connection');
var collections = require('../config/collections');
var fs = require('fs');
var rimraf = require('rimraf')
var path = require('path');

function getYTVideoId(videoUrl) {
   if (videoUrl != undefined || videoUrl != '') {
      let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      let match = videoUrl.match(regExp);
      return match[2]
   }
   return null
}

module.exports = {
   doSignup: function (tutorData) {
      return new Promise(async (resolve, reject) => {
         delete tutorData.cpassword
         tutorData.date = new Date()
         tutorData.remarks = []
         //response = {}
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ $or: [{ email: tutorData.email }, { mobile: tutorData.mobile }] })
         if (tutor) {
            signupErr = "Account already exists. Please login"
            reject(signupErr)
         }
         else {
            let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ id: tutorData.institution })
            if (institution) {
               tutorData.institution = objectId(institution._id)
               tutorData.password = await bcrypt.hash(tutorData.password, 10)
               tutorData.status = 'Signup pending'
               db.get().collection(collections.TUTOR_COLLECTION).insertOne(tutorData).then((data) => {
                  //tutor = data.ops[0]
                  signupMsg = "Your status is now pending. Institution will verify your details then you can login."
                  resolve(signupMsg)
               })
            }
            else {
               signupErr = "Institution does not exists. Please check and try again"
               reject(signupErr)
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
                  if (tutor.status === 'Signup verified') {
                     resolve(tutor)
                  }
                  else if (tutor.status === 'Signup pending') {
                     loginErr = "Your status is now pending. Institution will verify your details then you can logged in."
                     reject(loginErr)
                  }
                  else if (tutor.status == 'Signup denied') {
                     loginErr = "Your signup request was denied by institution. Please contact your institution."
                     reject(loginErr)
                  }
                  else {
                     loginErr = "Your account was blocked. Please contact your institution"
                     reject(loginErr)
                  }
               }
               else {
                  loginErr = "Invalid Email or Password"
                  reject(loginErr)
               }
            })
         }
         else {
            loginErr = "Invalid Email or Password"
            reject(loginErr)
         }
      })
   },
   getTutorDetails: function (tutorId) {
      return new Promise(async (resolve, reject) => {
         let tutor = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ _id: objectId(tutorId) })
         resolve(tutor)
      })
   },
   getInstitutionDetails: function (institutionId) {
      return new Promise(async (resolve, reject) => {
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ _id: objectId(institutionId) })
         resolve(institution)
      })
   },
   updateTutorDetails: function (tutorData, tutorId) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) },
            {
               $set:
               {
                  fname: tutorData.fname,
                  lname: tutorData.lname,
                  email: tutorData.email,
                  mobile: tutorData.mobile
               }
            }).then(() => {
               resolve()
            })
      })
   },
   updateTutorProfilePicture: function (tutorId, files) {
      return new Promise((resolve, reject) => {
         if (files) {
            files.image.mv('./public/images/tutor_profile/' + tutorId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) }, { $set: { picture: true } }).then(() => {
                     resolve()
                  })
               }
            })
         }
         else {
            fs.unlink('./public/images/tutor_profile/' + tutorId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) }, { $unset: { picture: 1 } }).then(() => {
                     resolve()
                  })
               }
            })
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
                  institutionId: objectId(institutionId)
               }
            },
            {
               $project: {
                  name: 1
               }
            }
         ]).toArray()
         resolve(classes)
      })
   },

   /*Add Subject*/

   addSubject: function (subjectDetails) {
      return new Promise(async (resolve, reject) => {
         let class_details = await db.get().collection(collections.CLASS_COLLECTION).findOne({ name: subjectDetails.class_name })
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

   editSubject: function (subjectId, subjectDetails) {
      return new Promise((resolve, reject) => {
         console.log(subjectId);
         console.log(subjectDetails.name);
         db.get().collection(collections.SUBJECT_COLLECTION).updateOne({ _id: objectId(subjectId) },
            {
               $set: { name: subjectDetails.name }
            }).then(() => {
               resolve()
            })
      })
   },

   /* Get all announcements */

   getAllAnnouncements: function () {
      return new Promise(async (resolve, reject) => {
         let announcements = await db.get().collection(collections.ANNOUNCEMENT_COLLECTION).find({ $or: [{ visiblity: 'Everyone' }, { visiblity: 'Tutor' }] }).sort({ _id: -1 }).toArray()
         resolve(announcements)
      })
   },

   /* Get my subjects */
   getSubjects: function (tutor) {
      return new Promise(async (resolve, reject) => {
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

   getMyannouncements: function (tutor) {
      return new Promise(async (resolve, reject) => {

         let announcements = await db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).aggregate([
            {
               $match: { tutor: objectId(tutor) }
            },
            {
               $lookup: {
                  from: collections.SUBJECT_COLLECTION,
                  let: { visibility: '$visibility' },
                  pipeline: [
                     {
                        $match: {
                           $expr: {
                              $in: ['$_id', '$$visibility']
                           }
                        }
                     }
                  ],
                  as: 'visibility'
               }
            },
            {
               $project: {
                  title: 1, content: 1, date: 1, visibility: 1
               }
            }
         ]).sort({ _id: -1 }).toArray()
         resolve(announcements)
      })
   },

   /* Post my announcements */

   postMyAnnouncements: function (announcement) {
      return new Promise(async (resolve, reject) => {
         let date = new Date()
         if (typeof (announcement.visibility) != "object") {
            announcement.visibility = [announcement.visibility]
         }
         for (let i = 0; i < announcement.visibility.length; i++) {
            announcement.visibility[i] = objectId(announcement.visibility[i])
         }
         announcement.tutor = objectId(announcement.tutor)
         announcement.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).insertOne(announcement).then((data) => {
            resolve()
         })
      })
   },

   /* Delete my announcement */

   deleteMyAnnouncement: function (id) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.TUTOR_ANNOUNCEMENT_COLLECTION).deleteOne({ _id: objectId(id) }).then((data) => {
            resolve()
         })
      })
   },

   /* Get full details of subject */

   getAllSubjectDetails: function (tutor) {
      return new Promise(async (resolve, reject) => {
         let subjects = await db.get().collection(collections.SUBJECT_COLLECTION).aggregate([
            {
               $match: { tutor: objectId(tutor) }
            },
            {
               $lookup: {
                  from: collections.CLASS_COLLECTION,
                  localField: 'class',
                  foreignField: '_id',
                  as: 'class'
               }
            }
         ]).toArray()
         resolve(subjects.reverse())
      })
   },
   /* GET details of subject for showing classes posted */
   getEachSubject: function (subjectId) {
      return new Promise(async (resolve, reject) => {
         let subject = await db.get().collection(collections.SUBJECT_COLLECTION).aggregate([
            {
               $match: { _id: objectId(subjectId) }
            },
            {
               $lookup: {
                  from: collections.TOPIC_COLLECTION,
                  localField: '_id',
                  foreignField: 'subject',
                  as: 'topics'
               }
            },
            {
               $lookup: {
                  from: collections.CLASS_COLLECTION,
                  localField: 'class',
                  foreignField: '_id',
                  as: 'class'
               }
            },
            {
               $project: { name: 1, subject_id: 1, date: 1, class: { $arrayElemAt: ["$class", 0] }, topics: 1 }
            }
         ]).toArray()
         subject[0].topics.reverse()
         resolve(subject[0])
      })
   },
   deleteSubject: function (subjectId) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.SUBJECT_COLLECTION).deleteOne({ _id: objectId(subjectId) }).then(async () => {
            let topics = await db.get().collection(collections.TOPIC_COLLECTION).find({ subject: objectId(subjectId) }).toArray()
            db.get().collection(collections.TOPIC_COLLECTION).deleteMany({ subject: objectId(subjectId) }).then((response) => {
               topics.forEach((topic) => {
                  let folderPath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', topic._id.toString())
                  rimraf(folderPath, (err) => {
                     if (err)
                        console.log(err);
                  })
               })
               db.get().collection(collections.STUDENT_COLLECTION).updateMany({ subjects: objectId(subjectId) }, { $pull: { subjects: objectId(subjectId) } })
               resolve()
            })
         })
      })
   },

   /* POST a class with files uploaded*/
   postUploadClassWithFile: function (uploadClass, files) {
      return new Promise((resolve, reject) => {
         let date = new Date()
         uploadClass.date = date
         uploadClass.subject = objectId(uploadClass.subject);
         uploadClass.tutor = objectId(uploadClass.tutor);
         if (uploadClass.file == '') {
            delete uploadClass.file;
         }
         if (uploadClass.link == undefined) {
            delete uploadClass.link;
         }
         else if (typeof (uploadClass.link) != "object") {
            uploadClass.link = [uploadClass.link]
         }
         if (uploadClass.link) {
            uploadClass.YTvideos = []
            for (let i = 0; i < uploadClass.link.length; i++) {
               uploadClass.YTvideos[i] = getYTVideoId(uploadClass.link[i])
            }
            delete uploadClass.link
         }
         db.get().collection(collections.TOPIC_COLLECTION).insertOne(uploadClass).then((data) => {
            let id = data.ops[0]._id.toString();
            let folderPath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', id)
            fs.mkdir(folderPath, async (err) => {
               if (err) {
                  console.log(err);
               }
               else {
                  /*if there are multiple files, this IF STATEMENT executes*/
                  if (files.file[0] != undefined) {
                     for (let i = 0; i < files.file.length; i++) {
                        let fileName = i + path.extname(files.file[i].name);
                        let filePath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', id, fileName)
                        await files.file[i].mv(filePath);
                     }
                  }
                  /*if there is only a single file, this ELSE STATEMENT executes*/
                  else {
                     let fileName = '0' + path.extname(files.file.name);
                     let filePath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', id, fileName)
                     await files.file.mv(filePath);
                  }
               }
            })
            resolve()
         })
      })
   },

   /* POST a class without files uploaded*/
   postUploadClassWithoutFile: function (uploadClass) {
      return new Promise((resolve, reject) => {
         let date = new Date()
         uploadClass.date = date
         uploadClass.subject = objectId(uploadClass.subject);
         uploadClass.tutor = objectId(uploadClass.tutor);
         if (uploadClass.file == '') {
            delete uploadClass.file;
         }
         if (uploadClass.link == undefined) {
            delete uploadClass.link;
         }
         else if (typeof (uploadClass.link) != "object") {
            uploadClass.link = [uploadClass.link]
         }
         if (uploadClass.link) {
            uploadClass.YTvideos = []
            for (let i = 0; i < uploadClass.link.length; i++) {
               uploadClass.YTvideos[i] = getYTVideoId(uploadClass.link[i])
            }
            delete uploadClass.link
         }
         db.get().collection(collections.TOPIC_COLLECTION).insertOne(uploadClass).then((data) => {
            resolve()
         })
      })
   },
   getTopicDetails: function (topicId) {
      return new Promise(async (resolve, reject) => {
         let topic = await db.get().collection(collections.TOPIC_COLLECTION).findOne({ _id: objectId(topicId) })
         let folderPath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', topic._id.toString())
         fs.readdir(folderPath, (err, files) => {
            if (files) {
               topic.files = files
            }
            resolve(topic)
         })
      })
   },
   removeTopic: function (topicId) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.TOPIC_COLLECTION).removeOne({ _id: objectId(topicId) }).then(() => {
            let folderPath = path.join('public', 'tutor_files', 'uploaded_files', 'topics', topicId)
            rimraf(folderPath, (err) => {
               if (err)
                  console.log(err);
            })
            resolve()
         })
      })
   }
}

