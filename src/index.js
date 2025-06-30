let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // 1. Get and render all toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(renderToyCard))

  // 2. Handle new toy form submit
  const toyForm = document.querySelector(".add-toy-form")
  toyForm.addEventListener("submit", event => {
    event.preventDefault()
    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(toy => renderToyCard(toy))

    toyForm.reset()
  })
})

function renderToyCard(toy) {
  const toyDiv = document.createElement("div")
  toyDiv.className = "card"
  toyDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `
  document.querySelector("#toy-collection").appendChild(toyDiv)

  toyDiv.querySelector("button").addEventListener("click", () => handleLike(toy, toyDiv))
}

function handleLike(toy, toyDiv) {
  const newLikes = toy.likes + 1
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toyDiv.querySelector("p").textContent = `${updatedToy.likes} Likes`
      toy.likes = updatedToy.likes
    })
}
