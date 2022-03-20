var bcrypt = require('bcryptjs');
var db = require('../config/connection');
var collections = require('../config/collections');
var objectId = require('mongodb').ObjectId;
const { Logger } = require('mongodb');
var fs = require('fs');

module.exports = {
   doSignup: function (institutionData) {
      return new Promise(async (resolve, reject) => {
         delete institutionData.cpassword
         institutionData.date = new Date()
         response = {}
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ $or: [{ email: institutionData.email }, { mobile: institutionData.mobile }, { id: institutionData.id }] })
         if (institution) {
            response.signupErr = "Account already exists. Please login"
            response.status = false
            resolve(response)
         }
         else {
            institutionData.password = await bcrypt.hash(institutionData.password, 10)
            db.get().collection(collections.INSTITUTION_COLLECTION).insertOne(institutionData).then((data) => {
               response.institution = data.ops[0]
               response.status = true
               resolve(response)
            })
         }
      })
   },
   doLogin: function (institutionData) {
      return new Promise(async (resolve, reject) => {
         response = {}
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ email: institutionData.email })
         if (institution) {
            bcrypt.compare(institutionData.password, institution.password).then((status) => {
               if (status) {
                  response.institution = institution
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
   generateInstitutionId: function () {
      return new Promise(async (resolve, reject) => {
         function generateId(length) {
            let id = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (i = 0; i < length; i++) {
               id += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return id;
         }
         do {
            var institutionId = await generateId(8)
            var institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ id: institutionId })
         } while (institution)
         resolve(institutionId)
      })
   },
   /*Here we create a new class */
   addClass: function (classData, institutionId) {
      return new Promise(async (resolve, reject) => {
         /*Date format*/
         classData.institutionId = objectId(institutionId)
         let date = new Date()
         classData.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.CLASS_COLLECTION).insertOne(classData).then((data) => {

            resolve()
         })

      })
   },
   /*Here we store data of every class we created as an array*/
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
   addAnnouncement: function (announcementData, institutionId) {
      return new Promise(async (resolve, reject) => {
         announcementData.institutionId = objectId(institutionId)
         /*Date format*/
         let date = new Date()
         announcementData.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.ANNOUNCEMENT_COLLECTION).insertOne(announcementData).then((data) => {

            resolve()
         })

      })
   },
   /*Here we check which type of announcement does it vissible to whom */
   getAnnouncements: function (type, InstitutionId) {
      return new Promise(async (resolve, reject) => {
         let announcements = await db.get().collection(collections.ANNOUNCEMENT_COLLECTION).aggregate([
            {

               $match:
               {
                  $and: [
                     { institutionId: objectId(InstitutionId) },
                     { visiblity: type },
                  ]
               }
            },
            {
               $project: {
                  _id: 1, title: 1, date: 1, content: 1, visiblity: 1
               }
            }
         ]).toArray()
         resolve(announcements)
      })

   },
   /*Here we get all students under corresponding Institution*/
   getStudentsIn_institution: (institutionId) => {
      return new Promise(async (resolve, reject) => {
         let students = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
            {
               $match: {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: 'Signup verified' }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, guardian: 1, address: 1, gender: 1, date: 1

               }
            }
         ]).toArray()
         resolve(students)
      })
   },
   getStudentDetails: (studentId) => {
      return new Promise(async (resolve, reject) => {
         let studentDetail = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) })
         let date = studentDetail.date;
         year = date.getFullYear();
         month = date.getMonth() + 1;
         dt = date.getDate();
         if (dt < 10) {
            dt = '0' + dt;
         }
         if (month < 10) {
            month = '0' + month;
         }
         studentDetail.date = dt + '-' + month + '-' + year;
         resolve(studentDetail)
      })
   },

   /*Here we add a new remark to student*/
   addRemarks: function (remarks) {
      let studentId = remarks.StudentId;
      return new Promise(async (resolve, reject) => {
         /*Date format*/
         let date = new Date()
         remarks.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) },
            {

               $push: { remarks: remarks }

            }

         ).then((response) => {
            resolve()
         })
      })
   },
   getStudentRemarks: (studentId) => {
      return new Promise(async (resolve, reject) => {
         let studentDetail = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) })
         let remarks = studentDetail.remarks;
         resolve(remarks)
      })
   },
   getTutorDetails: (tutorId) => {
      return new Promise(async (resolve, reject) => {
         let tutorDetail = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ _id: objectId(tutorId) })
         date = tutorDetail.date;
         year = date.getFullYear();
         month = date.getMonth() + 1;
         dt = date.getDate();

         if (dt < 10) {
            dt = '0' + dt;
         }
         if (month < 10) {
            month = '0' + month;
         }
         tutorDetail.date = dt + '/' + month + '/' + year;
         resolve(tutorDetail)
      })
   },
   /*Here we add a new remark to student*/
   addTutorRemarks: function (remarks) {
      let tutorId = remarks.tutorId;
      return new Promise(async (resolve, reject) => {
         /*Date format*/
         let date = new Date()
         remarks.date = await date.toDateString() + ' Time: ' + date.toLocaleTimeString()
         db.get().collection(collections.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) },
            {

               $push: { remarks: remarks }

            }

         ).then((response) => {
            resolve()
         })
      })
   },

   getTutorRemarks: (tutorId) => {
      return new Promise(async (resolve, reject) => {
         let tutorDetail = await db.get().collection(collections.TUTOR_COLLECTION).findOne({ _id: objectId(tutorId) })
         let remarks = tutorDetail.remarks;
         resolve(remarks)
      })
   },
   /*Here we get all not verified students under corresponding Institution*/
   getNotVerifiedStudentsIn_institution: (institutionId) => {
      return new Promise(async (resolve, reject) => {
         let notVerifiedStudents = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
            {
               $match:
               {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: 'Signup pending' }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, guardian: 1, address: 1, gender: 1, date: 1

               }
            }
         ]).toArray()
         resolve(notVerifiedStudents)
      })
   },
   /*Here we change status of student*/
   changeStudentStatus: function (studentId, status) {
      return new Promise(async (resolve, reject) => {
         changeStatusTime = new Date()
         db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) },
            {

               $set: { status: status, changeStatusTime: changeStatusTime }
            }
         ).then((response) => {
            resolve(response)
         })
      })
   },
   /*Here we get all not verified students under corresponding Institution*/
   getNotVerifiedStudentsIn_institution: (institutionId, resolveType) => {
      return new Promise(async (resolve, reject) => {
         let notVerifiedStudents = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
            {
               $match:
               {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: 'Signup pending' }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, guardian: 1, address: 1, gender: 1, date: 1

               }
            }
         ]).toArray()
         if (resolveType == 'length')
            resolve(notVerifiedStudents.length)
         else (resolveType == 'values')
         resolve(notVerifiedStudents)
      })
   },
   /*Here we change status of tutor*/
   changeTutorStatus: function (tutorId, status) {
      return new Promise(async (resolve, reject) => {
         changeStatusTime = new Date()
         db.get().collection(collections.TUTOR_COLLECTION).updateOne({ _id: objectId(tutorId) },
            {

               $set: { status: status, changeStatusTime: changeStatusTime }
            }
         ).then((response) => {
            resolve(response)
         })
      })
   },

   /*Here we get all not verified tutors under corresponding Institution*/
   getTutorsOfDifferentStatus: (institutionId, status, resolveType) => {
      return new Promise(async (resolve, reject) => {
         let notVerifiedTutors = await db.get().collection(collections.TUTOR_COLLECTION).aggregate([
            {
               $match:
               {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: status }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, gender: 1, date: 1

               }
            }
         ]).toArray()
         if (resolveType == 'length' && status == 'Signup pending')
            resolve(notVerifiedTutors.length)
         else (resolveType == 'values')
         resolve(notVerifiedTutors)
      })
   },
   /*Here we change InstitutionID*/
   changeInstitutionId: function (institutionId, institutionCode) {
      return new Promise(async (resolve, reject) => {
         db.get().collection(collections.INSTITUTION_COLLECTION).updateOne({ _id: objectId(institutionId) },
            {

               $set: { id: institutionCode }
            }
         ).then((response) => {
            resolve(response)
         })
      })
   },
   /*Here we get details of institution*/
   getInstitutionDetails: function (institutionId) {
      return new Promise(async (resolve, reject) => {
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ _id: objectId(institutionId) })
         resolve(institution)
      })
   },


   /*Here we get all not verified students under corresponding Institution*/
   getStudentsOfDifferentStatus: (institutionId, status, resolveType) => {
      return new Promise(async (resolve, reject) => {
         let notVerifiedStudents = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
            {
               $match:
               {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: status }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, gender: 1, date: 1

               }
            }
         ]).toArray()
         if (resolveType == 'length' && status == 'Signup pending')
            resolve(notVerifiedStudents.length)
         else (resolveType == 'values')
         resolve(notVerifiedStudents)
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
   },
   updateStudentDetails: function (studentData, studentId) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) },
            {
               $set:
               {
                  fname: studentData.fname,
                  lname: studentData.lname,
                  email: studentData.email,
                  mobile: studentData.mobile,
                  guardian: studentData.guardian,
                  address: studentData.address
               }
            }).then(() => {
               resolve()
            })
      })
   },
   /*Here we change InstitutionID*/
   updateInstitutionDetails: function (institutionData, institutionId) {
      return new Promise(async (resolve, reject) => {
         db.get().collection(collections.INSTITUTION_COLLECTION).updateOne({ _id: objectId(institutionId) },
            {

               $set:
               {
                  name: institutionData.name,
                  email: institutionData.email,
                  mobile: institutionData.mobile,
                  type: institutionData.type,
                  board: institutionData.board,
                  head: institutionData.head,
                  address: institutionData.address
               }
            }
         ).then((response) => {
            resolve(response)
         })
      })
   },


   updateInstitutionProfilePicture: function (institutionId, files) {
      return new Promise((resolve, reject) => {
         if (files) {
            files.image.mv('./public/images/institution_profile/' + institutionId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.INSTITUTION_COLLECTION).updateOne({ _id: objectId(institutionId) }, { $set: { picture: true } }).then(() => {
                     resolve()
                  })
               }
            })
         }
         else {
            fs.unlink('./public/images/institution_profile/' + institutionId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.INSTITUTION_COLLECTION).updateOne({ _id: objectId(institutionId) }, { $unset: { picture: 1 } }).then(() => {
                     resolve()
                  })
               }
            })
         }
      })
   },
   /*Here we store data of every class we created as an array*/
   getSubjectsInClass: function (classId) {
      return new Promise(async (resolve, reject) => {
         let subjects = await db.get().collection(collections.SUBJECT_COLLECTION).aggregate([
            {
               $match: { class: objectId(classId) }
            },
            {
               $project: {
                  _id: 1, name: 1, subject_id: 1, tutor: 1, class: 1, date: 1
               }
            },
            {
               $lookup: {
                  from: collections.TUTOR_COLLECTION,
                  localField: 'tutor',
                  foreignField: '_id',
                  as: 'tutor'
               }
            },
            {
               $project: {
                  _id: 1, name: 1, subject_id: 1, class: 1, date: 1, tutor: { $arrayElemAt: ['$tutor', 0] }

               }
            },
         ]).toArray()
         resolve(subjects)
      })
   },
   /*Here we get all students under corresponding Institution*/
   getTutorsIn_institution: (institutionId) => {
      return new Promise(async (resolve, reject) => {
         let tutors = await db.get().collection(collections.TUTOR_COLLECTION).aggregate([
            {
               $match: {
                  $and: [
                     { institution: objectId(institutionId) },
                     { status: 'Signup verified' }
                  ]
               }
            },
            {
               $sort: { fname: 1, lname: 1 }
            },

            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, gender: 1, date: 1

               }
            },
            {
               $lookup: {
                  from: collections.SUBJECT_COLLECTION,
                  localField: '_id',
                  foreignField: 'tutor',
                  as: 'subjects'
               }
            },
            {
               $project: {
                  fname: 1, lname: 1, email: 1, mobile: 1, gender: 1, date: 1, subjects: { $arrayElemAt: ['$subjects', 0] }

               }
            }
         ]).toArray()
         resolve(tutors)
      })
   },
}

