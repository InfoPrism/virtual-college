/*Add to cart Start*/
function studentInfo(studentId){
  $.ajax({
      url:'/institution/get-student-details/'+studentId,
      method:'get',
      success:((studentDetail) => {
       let fname= studentDetail.fname
       let lname= studentDetail.lname
       let fullName=fname+' '+lname
       let email= studentDetail.email
       let mobile= studentDetail.mobile
       let address= studentDetail.address
       let gender= studentDetail.gender
       let guardian= studentDetail.guardian
       console.log(email);
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
/*Add to cart Start*/
function studentInfoTrail(proId)
{ console.log("feee");
   $.ajax({
    
      url:'/institution/student-info/'+proId,
      method:'post',
      success:((institutionId) => {
         $('#regenerateInstitutionId').val(institutionId)
      })
   })
}


/* regenerate institutionid */
function regenerateInstitutionId()
{ console.log("feee");
   $.ajax({
    
      url:'/institution/regenerate-institutionid',
      method:'post',
      success:((institutionId) => {
         $('#regenerateInstitutionId').val(institutionId)
      })
   })
}



/* --SideBar Script-- */
$(document).ready(function(){
  $(".sidebar-btn").click(function(){
      $(".wrapper").toggleClass("sidebar-collapse")
  });
})



/* --Jquery Validations-- */
$(document).ready(function()
{
  $("#login").validate(
  {
    rules:
    {
      email:
      {
        required:true,
        email:true
      },
      password:
      {
        required:true
      }
     },
     messages:
     {
       email:"<small class='text-danger'>Please enter a valid Email.</small>",
       password:"<small class='text-danger'>Please enter your Password.</small>"
     }
  })
  
  $("#student-signup").validate(
  {
    rules:
    {
      fname:
      {
        required:true
      },
      lname:
      {
        required:true
      },
      email:
      {
        required:true,
        email:true
      },
      mobile:
      {
        required:true,
        number:true,
        minlength:10,
        maxlength:10
      },
      institution:
      {
        required:true
      },
      guardian:
      {
        required:true
      },
      address:
      {
        required:true
      },
      password:
      {
        required:true,
        minlength:8,
        maxlength:15
      },
      cpassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      fname:"<small class='text-danger'>Please enter your First Name.</small>",
      lname:"<small class='text-danger'>Please enter your Last Name.</small>",
      email:
      {
        required:"<small class='text-danger'>Please enter your Email.</small>",
        email:"<small class='text-danger'>Please enter a valid Email.</small>"
      },
      mobile:
      {
        required:"<small class='text-danger'>Please enter your Mobile.</small>",
        number:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        minlength:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        maxlength:"<small class='text-danger'>Please enter a valid Mobile.</small>"
      },
      institution:"<small class='text-danger'>Please enter your Institution ID.</small>",
      guardian:"<small class='text-danger'>Please enter your Guardian's Name.</small>",
      address:"<small class='text-danger'>Please enter your Address.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter your Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      cpassword:
      {
        required:"<small class='text-danger'>Please re-enter your Password.</small>",
        equalTo:"<small class='text-danger'>Password doesn't Match.</small>"
      }
    },
    errorPlacement: function (error, element)
    {
      if(element.attr("name") == "mobile")
      {
        error.appendTo("#mobileErr");
      }
      else
      {
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
        required:true
      },
      lname:
      {
        required:true
      },
      email:
      {
        required:true,
        email:true
      },
      mobile:
      {
        required:true,
        number:true,
        minlength:10,
        maxlength:10
      },
      institution:
      {
        required:true
      },
      password:
      {
        required:true,
        minlength:8,
        maxlength:15
      },
      cpassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      fname:"<small class='text-danger'>Please enter your First Name.</small>",
      lname:"<small class='text-danger'>Please enter your Last Name.</small>",
      email:
      {
        required:"<small class='text-danger'>Please enter your Email.</small>",
        email:"<small class='text-danger'>Please enter a valid Email.</small>"
      },
      mobile:
      {
        required:"<small class='text-danger'>Please enter your Mobile.</small>",
        number:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        minlength:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        maxlength:"<small class='text-danger'>Please enter a valid Mobile.</small>"
      },
      institution:"<small class='text-danger'>Please enter your Institution ID.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter your Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      cpassword:
      {
        required:"<small class='text-danger'>Please re-enter your Password.</small>",
        equalTo:"<small class='text-danger'>Password doesn't Match.</small>"
      }
    },
    errorPlacement: function (error, element)
    {
      if(element.attr("name") == "mobile")
      {
        error.appendTo("#mobileErr");
      }
      else
      {
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
        required:true
      },
      type:
      {
        required:true
      },
      board:
      {
        required:true
      },
      email:
      {
        required:true,
        email:true
      },
      mobile:
      {
        required:true,
        number:true,
        minlength:10,
        maxlength:10
      },
      address:
      {
        required:true
      },
      head:
      {
        required:true
      },
      password:
      {
        required:true,
        minlength:8,
        maxlength:15
      },
      cpassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      name:"<small class='text-danger'>Please enter Institution Name.</small>",
      type:"<small class='text-danger'>Please choose Type of Institution.</small>",
      board:"<small class='text-danger'>Please enter Board of Institution.</small>",
      email:
      {
        required:"<small class='text-danger'>Please enter Institution Email.</small>",
        email:"<small class='text-danger'>Please enter a valid Email.</small>"
      },
      mobile:
      {
        required:"<small class='text-danger'>Please enter Institution Mobile.</small>",
        number:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        minlength:"<small class='text-danger'>Please enter a valid Mobile.</small>",
        maxlength:"<small class='text-danger'>Please enter a valid Mobile.</small>"
      },
      address:"<small class='text-danger'>Please enter Institution Address.</small>",
      head:"<small class='text-danger'>Please enter Head of Institution.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter Institution Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      cpassword:
      {
        required:"<small class='text-danger'>Please re-enter Institution Password.</small>",
        equalTo:"<small class='text-danger'>Password doesn't Match.</small>"
      }
    },
    errorPlacement: function (error, element)
    {
      if(element.attr("name") == "mobile")
      {
        error.appendTo("#mobileErr");
      }
      else
      {
        error.insertAfter(element)
      }
    },
  })
})