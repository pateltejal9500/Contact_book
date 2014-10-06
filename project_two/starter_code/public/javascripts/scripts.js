$(function(){
  picture()
  function picture(){
    $(".picture").html("<a id='enter' href='#'><img  src='https://lonelygirlbloggers19.files.wordpress.com/2010/03/telephone-cartoon.jpg' height='500' width='500'></a>")
    $("#enter").click(function(){
      $(".picture").fadeOut("slow", function(){
        getting(0)
        getting(1)
        getting(2)
        
      })
    })
  }

function getting(numberList){
  var number = parseInt(numberList) + 1
  $("#information").html("")
  $("#list" + numberList).text("")
  $.get("/categories/"+ number, function(categories){
    console.log(categories.name)
    var innards = "<div class='dropdown'><button class='btn btn-default dropdown-toggle categoryName"+categories.id + "' type='button' id='dropdownMenu1' data-toggle='dropdown'>" + categories.name + "</button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>"
      var contacts = categories.contacts
      for (j=0; j < contacts.length; j++){
        innards += "<li role='presentation'><a id=" + contacts[j].id + " class ='contact' role='menuitem' tabindex='-1' href='#'>" + contacts[j].name + "</a></li>"
        if (j == contacts.length-1){
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a id='category"+ categories.id + "'role='menuitem' tabindex='-1' href='#'>EDIT</a></li>"
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a class='search'role='menuitem' tabindex='-1' href='#'>SEARCH</a></li>"
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a class='new'role='menuitem' tabindex='-1' href='#'>NEW CONTACT</a></li></div>"
         }

     
        $("#list" + numberList).html(innards)
      }
    contact_event(contacts)
    popover(contacts)
    edit(categories)
    newContact()
    categoriesAdd()
    searching()
    
  }) 

}

function searching(){
  $(".search").click(function(event){
    var innards = "<input name='searching' placeholder='name search'><button class='searching'>SEARCH</button>"
    $("#information").html(innards)
  
  $(".searching").click(function(event){
    var searchWord = $("input[name='searching']").val()
      $.get("/contacts", function(contacts){
        for(i = 0; i < contacts.length; i ++){
           if (contacts[i].name == searchWord){
            var innards ="<li><a href='#' id='" + contacts[j].id +"' class='contact'>" + contacts[i].name + "</a></li>"
            
           } else {
            var innards ="<h4>NO RESULTS</h4>"
           }
        }
        $("#information").html(innards)
        contact_event(contacts)
      })
  })
  })

}

function categoriesAdd(){

  if (($("#list0")[0].innerText == "") && ($("#list1")[0].innerText=="") && ($("#list2")[0].innerText=="")){
    $("#information").html("<h4>NO CONTACTS YET</h4><button class='new'>NEW CONTACT</button>")
    newContact()
  }
}


function popover(contacts){
  for (i = 0; i < contacts.length; i++){ 
    $.get("/contacts/" + contacts[i].id, function(contactInfo){
      $("#" + contactInfo.id).hover(function(event){
      $(this).append($("<span> Phone Number: " + contactInfo.phone_number + " ADDRESS: " + contactInfo.address + "</span>"));
       }, function(){
        $(this).find( "span:last" ).remove()   
      });
    })
  }
}


function contact_event(contact){
  $('.contact').click(function(event) {
    $(".contact").fadeIn("slow", function(){
      $.get("/contacts/" + event.target.id, function(contact){

        $.get("/categories/" + contact.category_id, function(category){
          var innards = "<h4>NAME:</h4><h4 class= 'name contact" + contact.id + "'>" +contact.name + "</h4><h4>ADDRESS:</h4><h4 class= 'address contact" + contact.id + "'>" + contact.address + "</h4><h4>AGE:</h4><h4 class='age contact" +contact.id + "'>" + contact.age + "</h4><h4>PHONE NUMBER:</h4><h4 class='phone_number contact" + contact.id +"'>" + contact.phone_number +"</h4><h4>CATEGORY:</h4><h4 class='category_id contact"+ contact.id + "'>" + category.name + "</h4>"
            innards += "<div id='deletePic" + contact.id + "'><img src='https://cdn0.iconfinder.com/data/icons/elite-general/513/trash-can-512.png' height='100' width='100'></div>"
            innards += "<div id='editPic" + contact.id + "'><img src='http://www.clker.com/cliparts/L/L/X/8/n/R/edit-button-md.png' height='100' width='100'></div>"
          $("#information").html(innards)
          $(".contact" + contact.id).draggable({ cursor: "move",containment: "window", revert: true});
          $("#deletePic" + contact.id).droppable({drop: function(event,ui) {
            $.ajax({
              url:'/contacts/' + contact.id,
              type: 'DELETE',
              success: function(result){
              $("#information").html("<h4>" + contact.name + " has been deleted </h4>")
              console.log(contact.category_id)
              getting(contact.category_id - 1)
              
              }
            })
          }
          
        });
        droppable(contact, category)
      })
    })
  })
 }) 
}       


function droppable(contact,category){
  $("#editPic" + contact.id).droppable({drop: function(event,ui) {
  var classes = ui.draggable[0].className.split(" ")[0]
    if (classes == "category_id"){
       $.get("/categories", function(categories){
          var innards = "<select name='categories'>"
          for (i = 0; i < categories.length; i++){
            innards += "<option value=" + categories[i].id + ">" + categories[i].name + "</option>"
          }
          innards += "</select><button class='edit'>CHANGE</button>"
          $("#information").html("<h4>What is the new category??</h4>" + innards)
          editCategory(contact, category.name)
      })
    } else {
        $("#information").html("<h4>What would you like to change the "+classes+" too?</h4><input name='" + classes + "' placeholder='" + ui.draggable[0].innerText + "'></input><button class='edit'>CHANGE</button>")
          editNow(classes, contact)
    }
  }})
}



function editCategory(contact, categoryName){
  $(".edit").click(function(event){
    var category = $("[name='categories']").val()
    $.ajax({
      url:'/contacts/' + contact.id,
      type: 'PUT',
      data:{category_id: category},
      success: function(result){
        console.log(result)
       $("#information").html("<h4> " + categoryName + " has been changed</h4>")
        getting(0)
        getting(1)
        getting(2)
      }
    })
  })
}

function editNow(classes, contact){
  $(".edit").click(function(event){
    var newInfo = $("input[name='name']").val()
    var newData = {}
    newData[classes]=newInfo
    $.ajax({
      url:'/contacts/' + contact.id,
      type: 'PUT',
      data:newData,
      success: function(result){
        console.log(result)
       $("#information").html("<h4>" + contact[classes] + " has been changed to " + result[classes] + "</h4>")
        getting(0)
        getting(1)
        getting(2)
      }
    })
  })
}


 

function edit(category){
  $("#category" + category.id).click(function(event) {
    var innards = "<h4>"+category.name + "</h4><input name = 'newName' placeholder='new category name'><button id=edit" + category.id + "> CHANGE </button>"
    $("#information").html(innards)
    $("#edit" + category.id).click(function(event){
      var name = $('input').val()
      $.ajax({
        url:'/categories/' + category.id,
        data: {name: name},
        type: 'PUT',
        success: function(result){
          $(".categoryName" + result.id).html(result.name)
          $("#information").html("<h4>" + category.name + " has been changed to " + result.name + "</h4>")
        }
      })
    })
  });
}


function newContact(){


  $(".new").click(function(event){
    $.get("/categories", function(category){
      var innards = "<input name='name' placeholder='name'><input name='age' placeholder='age'><input name='address' placeholder='address'><input name='phone' placeholder='phone number'><input name='picture' placeholder='picture'><select name='category'>"
      for (i = 0; i < category.length; i++){
        innards += "<option value=" + category[i].id + ">" + category[i].name + "</option>"
      }
      innards += "</select><button class='newPerson'>ADD</button><button class='randomPicture'>RANDOM</button>"
      $("#information").html(innards)
      createContact()
    })
  })
}



function createContact(){
  $(".randomPicture").click(function(){
    $.get('http://api.randomuser.me/', function(random){
      var picture = random.results[0].user.picture.medium
     $("input[name='picture']").val(picture)
    })
  })

  $(".newPerson").click(function(event){
    var name = $("input[name='name']").val()
    var address = $("input[name='address']").val()
    var age = $("input[name='age']").val()
    var number = $("input[name='phone']").val()
    var picture = $("input[name='picture']").val()
    var category = $("[name='category']").val()
    check(name,address,age,number,picture,category)   
  })
}

function check(name,address,age,number,picture,category){
  if (name == ""|| address== ""|| age == ""|| number== ""|| picture== ""){
    alert("Missing Information")
  } else {
    $.post("/contacts", {name:name, phone_number: number, picture: picture, address:address, age:age, category_id: category},function(data){   
    })
    getting(0)
    getting(1)
    getting(2)
   $("#information").html("<h4>"+name+" has been ADDED</h4>")
  }
}



})