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