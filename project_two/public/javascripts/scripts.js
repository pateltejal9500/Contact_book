$(function(){

  picture()


  function picture(){
    $("#marquee").html("<marquee class='banner'>WELCOME TO YOUR INTERNATIONAL PHONEBOOK!!! CLICK THE GLOBE TO CONTINUE!!</marquee")
    $(".picture").html("<a id='enter' href='#'><img class='display' src='http://www.commerce.gov/sites/default/files/images/2011/september/noaa_globe-oceans.jpg' height='500' width='500'></a>")
    $("#enter").click(function(){
      $(".picture").fadeOut("slow", function(){
        $("#marquee").html("")
        getting(0)
        getting(1)
        getting(2) 
      })
    })
  }


  function getting(numberList){
    var number = parseInt(numberList) + 1
    $("#list" + numberList).text("")
    $.get("/categories/" + number, function(categories){
      var innards = "<div class='dropdown'><button class='btn btn-default dropdown-toggle style categoryName" + categories.id + "' type='button' id='dropdownMenu1' data-toggle='dropdown'>" + categories.name.toUpperCase() + "</button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>"
      var contacts = categories.contacts
      for ( var j = 0; j < contacts.length; j++){
        innards += "<li role='presentation'><a id=" + contacts[j].id + " class ='contact' role='menuitem' tabindex='-1' href='#'>" + contacts[j].name.toUpperCase()+ "</a></li>"
        if (j == contacts.length-1){
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a class='edit' id='category" + categories.id + "'role='menuitem' tabindex='-1' href='#'>EDIT</a></li>"
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
      $(".button").html(" ")
      $(".pic").html(" ")
      var innards = "<input class='input' name='searching' placeholder='name search'><button class='searching buttons'>SEARCH</button>"
      $("#information").html(innards)
      $(".searching").click(function(event){
        var searchWord = $("input[name='searching']").val().toLowerCase()
        $.get("/contacts", function(contacts){
          var innards = ""
          for(var i = 0; i < contacts.length; i ++){
            
            if (contacts[i].name == searchWord){
              innards += "<li><a href='#' id='" + contacts[i].id +"' class='contact searchResult'>" +contacts[i].name.toUpperCase() + "</a></li>"
               console.log(innards)
            }
          }

          if (innards == ""){
            var innards = "<h4>NO RESULTS</h4>"
          }
        $("#information").html(innards)
        contact_event(contacts)
        })
      })
    })
  }

function categoriesAdd(){
  var list = $(".list")
  var counter = 0
  for (var i = 0; i < list.length; i ++ ){
    if (list[i].children.length == 0){
      counter = counter + 1
      console.log(counter)
    }
  }

  if (counter == 3){
    $(".none").html("<h4>NO CONTACTS YET</h4><button class='new buttons'>NEW CONTACT</button>")
    newContact()
  } else if (counter != 3){
    $(".none").html("")
    
  }
}



function popover(contacts){
  for (var i = 0; i < contacts.length; i ++){ 
    $.get("/contacts/" + contacts[i].id, function(contactInfo){
      $("#" + contactInfo.id).hover(function(event){
      $(this).append($("<span class><br>Phone Number: " + contactInfo.phone_number + " ADDRESS: " + contactInfo.address + "</span>"));
       }, function(){
        $(this).find( "span:last" ).remove()   
      });
    })
  }
}


  function contact_event(contact){
    $('.contact').click(function(event) {
      $(".button").html(" ")
      $(".pic").html(" ")
        $.get("/contacts/" + event.target.id, function(contact){
          $.get("/categories/" + contact.category_id, function(category){
            var innards = "<h4>NAME:</h4><p class= 'name contact" + contact.id + "'>" +contact.name.toUpperCase() + "</p><h4>ADDRESS:</h4><p class= 'address contact" + contact.id + "'>" + contact.address + "</p><h4>AGE:</h4><p class='age contact" +contact.id + "'>" + contact.age + "</p><h4>PHONE NUMBER:</h4><p class='phone_number contact" + contact.id +"'>" + contact.phone_number +"</p><h4>CATEGORY:</h4><p class='category_id contact" + contact.id + "'>" + category.name.toUpperCase() + "</p>"
            var pic = "<h4>IMAGE:</h4><p class='picture contact" + contact.id + "'><img src='"+contact.picture + "' width='200' height='200'></p>"
            var innards1 = "<div id='deletePic" + contact.id + "'><img src='https://cdn0.iconfinder.com/data/icons/elite-general/513/trash-can-512.png' height='200' width='200'></div>"
             innards1 += "<br><div id='editPic" + contact.id + "'><img src='http://www.clker.com/cliparts/L/L/X/8/n/R/edit-button-md.png' height='200' width='200'>"
            $("#information").html(innards)
            $(".button").html(innards1)
            $(".pic").html(pic)
            $(".contact" + contact.id).draggable({ cursor: "move",containment: "window", revert: true});
            $("#deletePic" + contact.id).droppable({drop: function(event,ui) {
              $.ajax({
                url:'/contacts/' + contact.id,
                type: 'DELETE',
                success: function(result){
                $("#information").html("<h4>" + contact.name.toUpperCase() + " has been deleted </h4>")
                $(".button").html(" ")
                $(".pic").html(" ")
                getting(0)
                getting(1)
                getting(2)
                }
              })
            }
          });
          droppable(contact, category)
        })
      })
    }) 
  }       


  function droppable(contact,category){
    $("#editPic" + contact.id).droppable({drop: function(event,ui) {
      $(".button").html(" ")
      $(".pic").html(" ")
      var classes = ui.draggable[0].className.split(" ")[0]
      if (classes == "category_id"){
       $.get("/categories", function(categories){
          var innards = "<select class='buttons' name='categories'>"
          for (var i = 0; i < categories.length; i ++){
            innards += "<option value=" + categories[i].id + ">" + categories[i].name.toUpperCase() + "</option>"
          }
          innards += "</select><button class='edit buttons'>CHANGE</button>"
          $("#information").html("<h4>What Is The New Category??</h4>" + innards)
          editCategory(contact, category)
        })
      } else if (classes == "picture"){
        $("#information").html("<h4>What Is The New " + classes + "?</h4><input class='input' name='" + classes + "' placeholder='" + ui.draggable[0].innerText + "'></input><br><button class='edit buttons'>CHANGE</button><br><button class='randomPicture buttons'>RANDOM PICTURE</button>")
          randomApi()
          editNow(classes, contact)
      } else {
        $("#information").html("<h4>What Is The New " + classes.toUpperCase() + "?</h4><input class='input' name='" + classes + "' placeholder='" + ui.draggable[0].innerText + "'></input><button class='edit buttons'>CHANGE</button>")
          editNow(classes, contact)
      }
    }})
  }




function randomApi(){
  $(".randomPicture").click(function(){
    $.get('http://api.randomuser.me/', function(random){
      var picture = random.results[0].user.picture.medium
     $("input[name='picture']").val(picture)
    })
  })
}

  function editCategory(contact, oldcategory){
    $(".edit").click(function(event){
      var category = $("[name='categories']").val()
      if (category == ""){
        alert("YOU DIDN'T MAKE A CHANGE")
      } else {
        $.ajax({
          url:'/contacts/' + contact.id,
          type: 'PUT',
          data:{category_id: category},
          success: function(result){
          $("#information").html("<h4>Category Name Has Been Changed</h4>")
          getting(0)
          getting(1)
          getting(2)
          }
        })
      }
    })
  }

  function editNow(classes, contact){
    $(".edit").click(function(event){
      if (classes == "name"){  
        var newInfo = $("input[name='name']").val().toLowerCase()
      }else {
        var newInfo = $("input[name='" + classes + "']").val()
      }

      if (newInfo == ""){
        alert("YOU DIDN'T MAKE A CHANGE")
      } else {
        var newData = {}
        newData[classes] = newInfo
        console.log(newData)
        $.ajax({
          url:'/contacts/' + contact.id,
          type: 'PUT',
          data:newData,
          success: function(result){
          $("#information").html("<h4>" + classes + " has been changed</h4>")
          getting(0)
          getting(1)
          getting(2)
          }
        })
      }
    })
  }


 

  function edit(category){
    $("#category" + category.id).click(function(event) {
      $(".button").html(" ")
      $(".pic").html(" ")
      var innards = "<h4>" + category.name.toUpperCase() + "</h4><input class='input' name = 'newName' placeholder='new category name'><button class='buttons' id=edit" + category.id + "> CHANGE </button>"
      $("#information").html(innards)
      $("#edit" + category.id).click(function(event){
        var name = $('input').val().toLowerCase()
        $.ajax({
          url:'/categories/' + category.id,
          data: {name: name},
          type: 'PUT',
          success: function(result){
          $(".categoryName" + result.id).html(result.name.toUpperCase())
          $("#information").html("<h4>" + category.name.toUpperCase() + " has been changed to " + result.name.toUpperCase() + "</h4>")
          }
        })
      })
    });
  }


  function newContact(){
    $(".new").click(function(event){
      $(".button").html(" ")
      $(".pic").html(" ")
      $(".none").html("")
      $.get("/categories", function(category){
        var innards = "<input class='input' name='name' placeholder='name'><br><input class='input' name='age' placeholder='age'><br><input class='input' name='address' placeholder='address'><br><input class='input' name='phone' placeholder='phone number'><br><input class='input' name='picture' placeholder='picture'><br><select class='buttons' name='category'>"
        for (var i = 0; i < category.length; i ++){
          innards += "<option value=" + category[i].id + ">" + category[i].name.toUpperCase() + "</option>"
        }
        innards += "</select><br><button class='newPerson buttons'>ADD</button><button class='randomPicture buttons'>RANDOM PICTURE</button>"
        $("#information").html(innards)
        createContact()
      })
    })
  }



  function createContact(){
    randomApi()
    $(".newPerson").click(function(event){
      var name = $("input[name='name']").val().toLowerCase();
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
      $.post("/contacts", { 
                            name:name, 
                            phone_number: number, 
                            picture: picture, 
                            address:address, 
                            age:age, 
                            category_id: category
                          },
                          function(data){  
                          getting(0)
                          getting(1)
                          getting(2) 
      })
     
    $("#information").html("<h4>" + name.toUpperCase() + " has been ADDED</h4>")
    }
  }



})