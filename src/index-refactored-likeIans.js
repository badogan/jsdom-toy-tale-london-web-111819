//API Functions

//Constrants / Global Variables

//Functions

//EventListeners/Loading Functions

let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })
 
  // / MY CODE STARTS HERE =================================================================================
// ==================================================================================

function destroy(baseURI,id){
  let configObj = {
    method: "DELETE"
  } 
  return fetch(`${baseURI}/${id}`,configObj).then().catch(error=>console.log(error.message))
}

function post(baseURI,bodyObject){
  return fetch(baseURI,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
      },
    body: JSON.stringify(bodyObject)
  }).then(response=>response.json()).catch(error=>console.log(error.message))
}

function patch(baseURI,id,bodyObject){
  // debugger
  return fetch(`${baseURI}/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
      },
    body: JSON.stringify(bodyObject)
  }).then(response=>response.json()).catch(error=>console.log(error.message))
}

const baseURI = "http://localhost:3000/toys"
const toyCollection = document.querySelector("#toy-collection")
const addToyForm = document.querySelector(".add-toy-form")

// =Create new toy
addToyForm.addEventListener("submit",function(e){
  postToyThenRenderToy(e)
})

function postToyThenRenderToy(event){
  event.preventDefault()
  let bodyObject = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0
  }
  post(baseURI,bodyObject).then(toy=>{
    addAToyToPage(toy);
    addToyForm.reset();
  })
}

// index page. render all toys
function fetchToys(baseURI){
  console.log("inside fetchToys")
  return fetch(baseURI).then(response => response.json()).then(json => renderToys(json)).catch(error => function(error){
    console.log(error.message)
  })
}

function renderToys(json){
  console.log("inside renderToys")
  json.forEach(addAToyToPage);
}

function addAToyToPage(toy){
  console.log("inside addAToyToPage")
  let newDiv = document.createElement('div')
  newDiv.classList.add('card')
  newDiv.id = toy.id
  let newH2 = document.createElement('h2')
  newH2.innerText = toy.name
  let newImg = document.createElement('img')
  newImg.src = toy.image
  newImg.classList.add('toy-avatar')
  let newP = document.createElement('p')
  newP.innerText = `${toy.likes} Likes`
  newP.id = toy.id
  let newLikeButton = document.createElement('button')
  newLikeButton.classList.add('like-btn')
  newLikeButton.innerText = "Like <3"
  newLikeButton.addEventListener("click",()=>patchLikesThenUpdateToy(toy.id,newP))
  let newDeleteButton = document.createElement('button')
  newDeleteButton.classList.add('delete-btn')
  newDeleteButton.innerText = 'Delete'
  newDeleteButton.addEventListener("click",()=>deleteToyFromServerAndThenFromClient(toy.id,newDiv))
  newDiv.append(newH2,newImg,newP,newLikeButton,newDeleteButton)
  toyCollection.appendChild(newDiv)
}

function patchLikesThenUpdateToy(id,newP){
  let bodyObject = {
    likes: parseInt(newP.innerText) + 1
  }
  patch(baseURI, id, bodyObject).then(toy => {
    newP.innerText = `${toy.likes} Likes patched`
  })
}

function deleteToyFromServerAndThenFromClient(id,newDiv){
  destroy(baseURI,id).then(response => newDiv.remove())
}

// MAIN STARTS HERE======

fetchToys(baseURI)

  // MY CODE FINISHES HERE==================================================================================
// ==================================================================================

})
