$(function(){
  getting(0)
  getting(1)
  getting(2)

function getting(number){
  console.log("counting")

  $.get("/categories", function(categories){
   
        var innards = "<div class='dropdown'><button class='btn btn-default dropdown-toggle categoryName"+categories[number].id+"' type='button' id='dropdownMenu1' data-toggle='dropdown'>"+categories[number].name+"</button><ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu1'>"
        $.get("/categories/"+categories[number].id, function(category){
         
           var contacts = category.contacts
           
           for (j=0; j < contacts.length; j++){
              innards += "<li role='presentation'><a id="+contacts[j].id+" class ='contact' role='menuitem' tabindex='-1' href='#'>"+contacts[j].name+"</a></li>"
        if (j == contacts.length-1){
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a id='category"+category.id+"'role='menuitem' tabindex='-1' href='#'>EDIT</a></li>"
           innards += "<li role='presentation' class='divider'></li><li role='presentation'><a class='new'role='menuitem' tabindex='-1' href='#'>NEW CONTACT</a></li></div>"

          }

          $("#list"+number).html(innards)
          contact_event(contacts)
          edit(category)
          newContact()
          
          
 }
  }) 
})
   }
   


function contact_event(contact){
 




$('.contact').click(function(event) {
  $.get("/contacts/"+event.target.id, function(contact){


    var innards = "<h4 id="+contact.id+">"+contact.name+ " " +contact.address+"</h4>"
    $("#information").html(innards)
   
 
});

})


}



 

 function edit(category){
  $("#category"+category.id).click(function(event) {
  var innards = "<h4>"+category.name+"</h4><input name = 'newName' placeholder='new category name'><button id=edit"+category.id+"> CHANGE </button>"
$("#information").html(innards)
$("#edit"+category.id).click(function(event){
  var name = $('input').val()
     $.ajax({
      url:'/categories/'+category.id,
      data: {name: name},
      type: 'PUT',
      success: function(result){
       $(".categoryName"+result.id).html(result.name)
       $("#information").html("<h4>"+category.name+" has been changed to "+result.name+"</h4>")
      }
 })
   })
});

}


function newContact(){
  $(".new").click(function(event){
     $.get("/categories", function(category){
      console.log(category[0])
  var innards = "<input name='name' placeholder='name'><input name='age' placeholder='age'><input name='address' placeholder='address'><input name='phone' placeholder='phone number'><input name='picture' placeholder='picture'><select name='category'>"
  for (i = 0; i < category.length; i++){
    innards += "<option value="+category[i].id+">"+category[i].name + "</option>"
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
  if (name == ""|| address==""|| age ==""||number==""||picture==""){
    alert("Missing Information")
  } else {
       $.post("/contacts", {name:name, phone_number: number, picture: picture, address:address, age:age, category_id: category},function(data){   
    })
    getting(category-1)
   $("#information").html("<h4>"+name+" has been ADDED</h4>")

  }


}
























})