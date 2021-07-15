/* Jquery Validations */
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
      firstName:
      {
        required:true
      },
      lastName:
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
      institutionId:
      {
        required:true
      },
      guardianName:
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
      confirmPassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      firstName:"<small class='text-danger'>Please enter your First Name.</small>",
      lastName:"<small class='text-danger'>Please enter your Last Name.</small>",
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
      institutionId:"<small class='text-danger'>Please enter your Institution ID.</small>",
      guardianName:"<small class='text-danger'>Please enter your Guardian's Name.</small>",
      address:"<small class='text-danger'>Please enter your Address.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter your Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      confirmPassword:
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
      firstName:
      {
        required:true
      },
      lastName:
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
      institutionId:
      {
        required:true
      },
      password:
      {
        required:true,
        minlength:8,
        maxlength:15
      },
      confirmPassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      firstName:"<small class='text-danger'>Please enter your First Name.</small>",
      lastName:"<small class='text-danger'>Please enter your Last Name.</small>",
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
      institutionId:"<small class='text-danger'>Please enter your Institution ID.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter your Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      confirmPassword:
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
      university:
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
      institutionHead:
      {
        required:true
      },
      password:
      {
        required:true,
        minlength:8,
        maxlength:15
      },
      confirmPassword:
      {
        required:true,
        equalTo:"#password"
      }
    },
    messages:
    {
      name:"<small class='text-danger'>Please enter Institution Name.</small>",
      university:"<small class='text-danger'>Please enter University Name.</small>",
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
      institutionHead:"<small class='text-danger'>Please enter Head of Institution.</small>",
      password:
      {
        required:"<small class='text-danger'>Please enter Institution Password.</small>",
        minlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>",
        maxlength:"<small class='text-danger'>Password must be 8-15 Characters.</small>"
      },
      confirmPassword:
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