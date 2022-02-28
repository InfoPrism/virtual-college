var bcrypt = require('bcryptjs');
var objectId = require('mongodb').ObjectID;
var db = require('../config/connection');
var collections = require('../config/collections');
var fs = require('fs');

module.exports = {
   doSignup: function (studentData) {
      return new Promise(async (resolve, reject) => {
         delete studentData.cpassword
         studentData.remarks = []
         studentData.subjects = []
         studentData.date = new Date()
         response = {}
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ $or: [{ email: studentData.email }, { mobile: studentData.mobile }] })
         if (student) {
            signupErr = "Account already exists. Please login"
            reject(signupErr)
         }
         else {
            let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ id: studentData.institution })
            if (institution) {
               studentData.institution = objectId(institution._id)
               studentData.password = await bcrypt.hash(studentData.password, 10)
               db.get().collection(collections.STUDENT_COLLECTION).insertOne(studentData).then((data) => {
                  student = data.ops[0]
                  resolve(student)
               })
            }
            else {
               signupErr = "Institution does not exists. Please check and try again"
               reject(signupErr)
            }
         }
      })
   },
   doLogin: function (studentData) {
      return new Promise(async (resolve, reject) => {
         response = {}
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ email: studentData.email })
         if (student) {
            bcrypt.compare(studentData.password, student.password).then((status) => {
               if (status) {
                  resolve(student)
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
   getStudentDetails: function (studentId) {
      return new Promise(async (resolve, reject) => {
         let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) })
         resolve(student)
      })
   },
   getInstitutionDetails: function (institutionId) {
      return new Promise(async (resolve, reject) => {
         let institution = await db.get().collection(collections.INSTITUTION_COLLECTION).findOne({ _id: objectId(institutionId) })
         resolve(institution)
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
   updateStudentProfilePicture: function (studentId, files) {
      return new Promise((resolve, reject) => {
         if (files) {
            files.image.mv('./public/images/student_profile/' + studentId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) }, { $set: { picture: true } }).then(() => {
                     resolve()
                  })
               }
            })
         }
         else {
            fs.unlink('./public/images/student_profile/' + studentId + '.jpg', function (err) {
               if (!err) {
                  db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) }, { $unset: { picture: 1 } }).then(() => {
                     resolve()
                  })
               }
            })
         }
      })
   },
   getAllAnnouncements: function () {
      return new Promise(async (resolve, reject) => {
         let announcements = await db.get().collection(collections.ANNOUNCEMENT_COLLECTION).find({ $or: [{ visiblity: 'Everyone' }, { visiblity: 'Student' }] }).sort({ _id: -1 }).toArray()
         resolve(announcements)
      })
   },
   joinClass: function (studentId, subjectId) {
      return new Promise(async (resolve, reject) => {
         let subject = await db.get().collection(collections.SUBJECT_COLLECTION).findOne({ subject_id: subjectId })
         if (subject) {
            let classDetails = await db.get().collection(collections.CLASS_COLLECTION).findOne({ _id: objectId(subject.class) })
            let studentDetails = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ _id: objectId(studentId) })
            if (classDetails.institutionId.toString() === studentDetails.institution.toString()) {
               let student = await db.get().collection(collections.STUDENT_COLLECTION).findOne({ _id: objectId(studentId), subjects: { $in: [objectId(subject._id)] } })
               if (student) {
                  joinClassErr = "You already joined in the Class"
                  reject(joinClassErr)
               }
               else {
                  db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) }, { $push: { subjects: objectId(subject._id) } }).then(() => {
                     resolve()
                  })
               }
            }
            else {
               joinClassErr = "You can only join class in your Institution"
               reject(joinClassErr)
            }
         }
         else {
            joinClassErr = "Class does not exists. Please check and try again"
            reject(joinClassErr)
         }
      })
   },
   unenrollClass: function (studentId, subjectId) {
      return new Promise((resolve, reject) => {
         db.get().collection(collections.STUDENT_COLLECTION).updateOne({ _id: objectId(studentId) }, { $pull: { subjects: objectId(subjectId) } }).then(()=> {
            resolve()
         })
      })
   },
   getAllClasses: function (studentId) {
      return new Promise(async (resolve, reject) => {
         student = await db.get().collection(collections.STUDENT_COLLECTION).aggregate([
            {
               $match: { _id: objectId(studentId) }
            },
            {
               $lookup: {
                  from: collections.SUBJECT_COLLECTION,
                  let: { subjects: '$subjects' },
                  pipeline: [
                     {
                        $match: {
                           $expr: {
                              $in: ['$_id', '$$subjects']
                           }
                        }
                     }
                  ],
                  as: 'subjects'
               }
            },
            {
               $lookup: {
                  from: collections.TUTOR_COLLECTION,
                  localField: 'subjects.tutor',
                  foreignField: '_id',
                  as: 'tutors'
               }
            },
            {
               $lookup: {
                  from: collections.CLASS_COLLECTION,
                  localField: 'subjects.class',
                  foreignField: '_id',
                  as: 'classes'
               }
            }
         ]).toArray()
         for (let i = 0; i < student[0].subjects.length; i++) {
            for (let j = 0; j < student[0].tutors.length; j++) {
               if (student[0].subjects[i].tutor.toString() === student[0].tutors[j]._id.toString())
                  student[0].subjects[i].tutor = student[0].tutors[j]
            }
            for (let k = 0; k < student[0].classes.length; k++) {
               if (student[0].subjects[i].class.toString() === student[0].classes[k]._id.toString())
                  student[0].subjects[i].class = student[0].classes[k]
            }
         }
         resolve(student[0].subjects)
      })
   }
}