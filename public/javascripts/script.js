/*To get student details in model*/
function studentInfo(studentId) {
  $.ajax({
    url: '/institution/get-student-details/' + studentId,
    method: 'get',
    success: ((studentDetail) => {
      let remarks = studentDetail.remarks;
      let lengthofRemark = remarks.length;
      if (lengthofRemark >= 2) {
        console.log("if");
        let LastRemark = remarks[remarks.length - 1];
        let SecondLastRemark = remarks[remarks.length - 2];
        let remarkedPerson1 = LastRemark.remarkedPerson + ':';
        let date1 = LastRemark.date
        let remark1 = LastRemark.remark
        let remarkedPerson2 = SecondLastRemark.remarkedPerson + ':';
        let date2 = SecondLastRemark.date;
        let remark2 = SecondLastRemark.remark;
        let dummy1 = ' '
        $("#noRemark").html(dummy1)
        $("#date1").html(date1)
        $("#date2").html(date2)
        $("#remark1").html(remark1)
        $("#remark2").html(remark2)
        $("#remarkedPerson1").html(remarkedPerson1)
        $("#remarkedPerson2").html(remarkedPerson2)
      }
      else if (lengthofRemark == 1) {
        console.log("else if");
        let LastRemark = remarks[remarks.length - 1];
        let remarkedPerson1 = LastRemark.remarkedPerson + ':';
        let date1 = LastRemark.date
        let remark1 = LastRemark.remark
        let dummy2 = ' '
        $("#noRemark").html(dummy2)
        $("#date1").html(date1)
        $("#remark1").html(remark1)
        $("#remarkedPerson1").html(remarkedPerson1)
        $("#date2").html(dummy2)
        $("#remark2").html(dummy2)
        $("#remarkedPerson2").html(dummy2)
      }
      else if (lengthofRemark == 0) {
        let fname = studentDetail.fname
        let dummy3 = ' '
        let noRemark = 'There is not any remark about ' + fname
        $("#noRemark").html(noRemark)
        $("#date1").html(dummy3)
        $("#date2").html(dummy3)
        $("#remark1").html(dummy3)
        $("#remark2").html(dummy3)
        $("#remarkedPerson1").html(dummy3)
        $("#remarkedPerson2").html(dummy3)
      }
      let id = studentDetail._id
      let fname = studentDetail.fname
      let lname = studentDetail.lname
      let fullName = fname + ' ' + lname
      let email = studentDetail.email
      let mobile = studentDetail.mobile
      let address = studentDetail.address
      let gender = studentDetail.gender
      let guardian = studentDetail.guardian
      let joinedDate = studentDetail.date


      $("#student-id").val(id)
      $("#student-fullName").html(fullName)
      $("#student-fullName2").html(fullName)
      $("#student-fname").html(fname)
      $("#student-email").html(email)
      $("#student-email2").html(email)
      $("#student-mobile").html(mobile)
      $("#student-address").html(address)
      $("#student-gender").html(gender)
      $("#student-guardian").html(guardian)
      $("#student-joinedDate").html(joinedDate)



      $("#view-remark").attr("href", "/institution/view-student-remarks/?id=" + id)

      $("#add-remark").attr("href", "/institution/add-remarks/?id=" + id)

    })

  })
}

/*To get remarks of a student*/
function studentRemamrk(studentId) {
  $.ajax({
    url: '/institution/get-student-remarks/' + studentId,
    method: 'get',
    success: ((studentRemarks) => {
      let id = studentDetail._id
      let head = studentDetail.Remarks[Remarks.length - 1];
      let fname = studentDetail.fname
      let lname = studentDetail.lname
      let fullName = fname + ' ' + lname
      let email = studentDetail.email
      let mobile = studentDetail.mobile
      let address = studentDetail.address
      let gender = studentDetail.gender
      let guardian = studentDetail.guardian
      $("#add-remark").attr("href", "/institution/add-remarks/?id=" + id)
      $("#student-id").val(id)
      $("#student-fullName").html(fullName)
      $("#student-fullName2").html(fullName)
      $("#student-fname").html(fname)
      $("#student-email").html(email)
      $("#student-email2").html(email)
      $("#student-mobile").html(mobile)
      $("#student-address").html(address)
      $("#student-gender").html(gender)
      $("#student-guardian").html(guardian)
    })

  })
}
/* regenerate institutionid */
function regenerateInstitutionId() {
  console.log("feee");
  $.ajax({

    url: '/institution/regenerate-institutionid',
    method: 'post',
    success: ((institutionId) => {
      $('#regenerateInstitutionId').val(institutionId)
    })
  })
}



/* --SideBar Script-- */
$(document).ready(function () {
  $(".sidebar-btn").click(function () {
    $(".wrapper").toggleClass("sidebar-collapse")
  });
})



/* --Jquery Validations-- */
$(document).ready(function () {
  $("#login").validate(
    {
      rules:
      {
        email:
        {
          required: true,
          email: true
        },
        password:
        {
          required: true
        }
      },
      messages:
      {
        email: "<small class='text-danger'>Please enter a valid Email.</small>",
        password: "<small class='text-danger'>Please enter your Password.</small>"
      }
    })

  $("#student-signup").validate(
    {
      rules:
      {
        fname:
        {
          required: true
        },
        lname:
        {
          required: true
        },
        email:
        {
          required: true,
          email: true
        },
        mobile:
        {
          required: true,
          number: true,
          minlength: 10,
          maxlength: 10
        },
        institution:
        {
          required: true
        },
        guardian:
        {
          required: true
        },
        address:
        {
          required: true
        },
        password:
        {
          required: true,
          minlength: 8,
          maxlength: 15
        },
        cpassword:
        {
          required: true,
          equalTo: "#password"
        }
      },
      messages:
      {
        fname: "<small class='text-danger'>Please enter your First Name.</small>",
        lname: "<small class='text-danger'>Please enter your Last Name.</small>",
        email:
        {
          required: "<small class='text-danger'>Please enter your Email.</small>",
          email: "<small class='text-danger'>Please enter a valid Email.</small>"
        },
        mobile:
        {
          required: "<small class='text-danger'>Please enter your Mobile.</small>",
          number: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          minlength: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          maxlength: "<small class='text-danger'>Please enter a valid Mobile.</small>"
        },
        institution: "<small class='text-danger'>Please enter your Institution ID.</small>",
        guardian: "<small class='text-danger'>Please enter your Guardian's Name.</small>",
        address: "<small class='text-danger'>Please enter your Address.</small>",
        password:
        {
          required: "<small class='text-danger'>Please enter your Password.</small>",
          minlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>",
          maxlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>"
        },
        cpassword:
        {
          required: "<small class='text-danger'>Please re-enter your Password.</small>",
          equalTo: "<small class='text-danger'>Password doesn't Match.</small>"
        }
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "mobile") {
          error.appendTo("#mobileErr");
        }
        else {
          error.insertAfter(element)
        }
      },
    })

  $("#tutor-signup").validate(
    {
      rules:
      {
        fname:
        {
          required: true
        },
        lname:
        {
          required: true
        },
        email:
        {
          required: true,
          email: true
        },
        mobile:
        {
          required: true,
          number: true,
          minlength: 10,
          maxlength: 10
        },
        institution:
        {
          required: true
        },
        password:
        {
          required: true,
          minlength: 8,
          maxlength: 15
        },
        cpassword:
        {
          required: true,
          equalTo: "#password"
        }
      },
      messages:
      {
        fname: "<small class='text-danger'>Please enter your First Name.</small>",
        lname: "<small class='text-danger'>Please enter your Last Name.</small>",
        email:
        {
          required: "<small class='text-danger'>Please enter your Email.</small>",
          email: "<small class='text-danger'>Please enter a valid Email.</small>"
        },
        mobile:
        {
          required: "<small class='text-danger'>Please enter your Mobile.</small>",
          number: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          minlength: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          maxlength: "<small class='text-danger'>Please enter a valid Mobile.</small>"
        },
        institution: "<small class='text-danger'>Please enter your Institution ID.</small>",
        password:
        {
          required: "<small class='text-danger'>Please enter your Password.</small>",
          minlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>",
          maxlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>"
        },
        cpassword:
        {
          required: "<small class='text-danger'>Please re-enter your Password.</small>",
          equalTo: "<small class='text-danger'>Password doesn't Match.</small>"
        }
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "mobile") {
          error.appendTo("#mobileErr");
        }
        else {
          error.insertAfter(element)
        }
      },
    })

  $("#institution-signup").validate(
    {
      rules:
      {
        name:
        {
          required: true
        },
        type:
        {
          required: true
        },
        board:
        {
          required: true
        },
        email:
        {
          required: true,
          email: true
        },
        mobile:
        {
          required: true,
          number: true,
          minlength: 10,
          maxlength: 10
        },
        address:
        {
          required: true
        },
        head:
        {
          required: true
        },
        password:
        {
          required: true,
          minlength: 8,
          maxlength: 15
        },
        cpassword:
        {
          required: true,
          equalTo: "#password"
        }
      },
      messages:
      {
        name: "<small class='text-danger'>Please enter Institution Name.</small>",
        type: "<small class='text-danger'>Please choose Type of Institution.</small>",
        board: "<small class='text-danger'>Please enter Board of Institution.</small>",
        email:
        {
          required: "<small class='text-danger'>Please enter Institution Email.</small>",
          email: "<small class='text-danger'>Please enter a valid Email.</small>"
        },
        mobile:
        {
          required: "<small class='text-danger'>Please enter Institution Mobile.</small>",
          number: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          minlength: "<small class='text-danger'>Please enter a valid Mobile.</small>",
          maxlength: "<small class='text-danger'>Please enter a valid Mobile.</small>"
        },
        address: "<small class='text-danger'>Please enter Institution Address.</small>",
        head: "<small class='text-danger'>Please enter Head of Institution.</small>",
        password:
        {
          required: "<small class='text-danger'>Please enter Institution Password.</small>",
          minlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>",
          maxlength: "<small class='text-danger'>Password must be 8-15 Characters.</small>"
        },
        cpassword:
        {
          required: "<small class='text-danger'>Please re-enter Institution Password.</small>",
          equalTo: "<small class='text-danger'>Password doesn't Match.</small>"
        }
      },
      errorPlacement: function (error, element) {
        if (element.attr("name") == "mobile") {
          error.appendTo("#mobileErr");
        }
        else {
          error.insertAfter(element)
        }
      },
    })
})

/*--Modal for create a class--*/

$('#createsubject').on('show.bs.modal', function (event) {
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  function generateId() {
    let id = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (i = 0; i < 5; i++) {
      id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
  }

  var modal = $(this)
  var id = generateId()
  modal.find('.modal-body #subjectId').val(id)
})

/* Get classes to modal*/

function getclasses() {
  $.ajax({
    url: '/tutor/get-class',
    method: 'get',
    success: ((classes) => {
      var sizeOfArrray = classes.length;
      console.log(sizeOfArrray);
      for (var i = 0; i < sizeOfArrray; i++) {
        $('#getClasses').append($('<option>').val(classes[i].name).text(classes[i].name));
      }
    })
  })
}



/*To get tutor details in model*/
function tutorInfo(tutorId){
  console.log(tutorId);
$.ajax({
    url:'/institution/get-tutor-details/'+tutorId,
    method:'get',
    success:((tutorDetail) => {
      console.log("samsmmmmmmmmmmmmmmmm");
      console.log(tutorDetail);
     let remarks= tutorDetail.remarks;
     let lengthofRemark=remarks.length;
     if(lengthofRemark>=2)
     {
       console.log("if");
     let LastRemark= remarks[remarks.length-1];
     let SecondLastRemark= remarks[remarks.length-2];
     let remarkedPerson1= LastRemark.remarkedPerson+':';
     let date1=LastRemark.date
     let remark1=LastRemark.remark
     let remarkedPerson2=SecondLastRemark.remarkedPerson+':';
     let date2=SecondLastRemark.date;
     let remark2=SecondLastRemark.remark;
     let dummy1=' '
     $("#noRemark").html(dummy1)
     $("#date1").html(date1)
     $("#date2").html(date2)
     $("#remark1").html(remark1)
     $("#remark2").html(remark2)
     $("#remarkedPerson1").html(remarkedPerson1)
     $("#remarkedPerson2").html(remarkedPerson2)
     }
     else if(lengthofRemark==1)
     {
      console.log("else if");
      let LastRemark= remarks[remarks.length-1];
      let remarkedPerson1= LastRemark.remarkedPerson+':';
      let date1=LastRemark.date
      let remark1=LastRemark.remark
      let dummy2=' '
      $("#noRemark").html(dummy2)
      $("#date1").html(date1)
      $("#remark1").html(remark1)
      $("#remarkedPerson1").html(remarkedPerson1)
      $("#date2").html(dummy2)
      $("#remark2").html(dummy2)
      $("#remarkedPerson2").html(dummy2)
    }
    else if(lengthofRemark==0)
    {
      console.log("hhhhhhh");
      let fname= tutorDetail.fname
      let dummy3=' '
      let noRemark='There is not any remark about '+fname
      $("#noRemark").html(noRemark)
      $("#date1").html(dummy3)
      $("#date2").html(dummy3)
      $("#remark1").html(dummy3)
      $("#remark2").html(dummy3)
      $("#remarkedPerson1").html(dummy3)
      $("#remarkedPerson2").html(dummy3)
    }
     let id= tutorDetail._id
     let fname= tutorDetail.fname
     let lname= tutorDetail.lname
     let fullName=fname+' '+lname
     let email= tutorDetail.email
     let mobile= tutorDetail.mobile
     let gender= tutorDetail.gender
     let joinedDate= tutorDetail.date

     
      $("#student-id").val(id)
      $("#student-fullName").html(fullName)
      $("#student-fullName2").html(fullName)
      $("#student-fname").html(fname)
      $("#student-email").html(email)
      $("#student-email2").html(email)
      $("#student-mobile").html(mobile)
      $("#student-gender").html(gender)
      $("#student-joinedDate").html(joinedDate)
      
     

      $("#view-remark").attr("href","/institution/view-tutor-remarks/"+id)
      
      $("#add-remark").attr("href","/institution/add-tutor-remarks/?id="+id)
   })

})  
}

 /* Multiple Select box*/

 $(document).ready(function(){

  var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
  removeItemButton: true,
  })
  });

  /*Change status of student Eg block,Signup allowed, dened
function changeStudentStatus(studentId,status,studentFname) {
   console.log(studentId);
    $.ajax({
    url: '/institution/change-student-status',
    method: 'post',
    data:{
      studentId,
      status
    },
    beforeSend:function(){
      return confirm("Are you sure to change status of "+studentFname);
    },
    success: ((classes) => {
    updateStudentList()

    })
  })
}
*/

/* --Google sheet form submit-- */
$("#user-feedback").submit((e) => {
  e.preventDefault()
  $.ajax({
    url: "https://script.google.com/macros/s/AKfycbxMWMZW4CTCltsilgfekVUruTg5UmtLxlgJ91SL/exec",
    data: $("#user-feedback").serialize(),
    method: "post",
    success: function (response) {
      $("#feedback-response").html("Feedback Submitted Successfully!")
      $( "#feedback-response" ).removeClass("alert-danger")
      $( "#feedback-response" ).addClass("alert-success")
      $("#feedback-response").css("display", "block")
      window.location.href = "#user-feedback"
      setTimeout(()=> {
        $("#feedback-response").css("display", "none")
        $("#feedback-response").trigger("reset")
      }, 3000)
    },
    error: function (err) {
      $("#feedback-response").html("Feedback  Submission Error!")
      $( "#feedback-response" ).removeClass("alert-success")
      $( "#feedback-response" ).addClass("alert-danger")
      $("#feedback-response").css("display", "block")
      window.location.href = "#user-feedback"
      setTimeout(()=> {
        $("#feedback-response").css("display", "none")
        $("#feedback-response").trigger("reset")
      }, 3000)
    }
  })
})