const container = document.getElementById("container")
const timeline = document.getElementById("timeline")
const plus = document.querySelectorAll(".plus")
var img = ""
var pass = ""

const DB = {
  root: "https://api.jsonbin.io",
  key: "$2b$10$hC7JnIQX2Er/Zbnk12PAbOttAGliU8syUrrpqbN2XKig6l5P/Iha."
}
var data = {}
let data_num = 0

function fetchData() {
  return fetch(`${DB.root}/b/5fbcf5b94f12502c21d7e698/latest`, {
      headers: {
        "secret-key": DB.key
      }
    })
    .then(res => res.json())
}

function dateConvert(row) {
  row.date = row.date.split("-")
  row.date = `${row.date[2]}/${row.date[1]}/${row.date[0]}`
  return row
}

function update() {
  const newDate = document.querySelector("#newDate").value
  const newStory = document.querySelector("#newStory").value
  if (newDate != "" && newStory != "" && img != "none.svg")
    data = fetchData().then(res => {
      data = res.data
      data.unshift({
        date: newDate,
        content: newStory,
        image: img
      })
      fetch(`${DB.root}/b/5fb130d53abee46e243910c9`, {
          body: JSON.stringify({
            data
          }),
          method: "PUT",
          headers: {
            "secret-key": DB.key,
            "Content-Type": "application/json"
          }
        })
        .then(() => location.reload())

    })
    else{
      alert("יש לבחור תמונה, תאריך, ולכתוב תוכן")
    }
}

function getData() {
  if (data_num < data.length - 1) {
    addLifeEventToDOM(dateConvert(data[data_num]))
    data_num++
  } else if (data_num == data.length - 1) {
    addNowToDOM(data[data_num])
    data_num++
  }
}

function addLifeEventToDOM(data) {
  const eventItem = document.createElement("div")
  eventItem.classList.add("life-event")
  let prep = `
      <div class="timeline-circle"></div>
      <div class="content">
          <div class="date">${data.date}</div>
          <p>${data.content}</p>`
  if (data.hasOwnProperty('image'))
    prep +=
    `<div class="event-image">
          <img width="200" src=img/${data.image} / >
          </div>`
  prep +=
    `</div>
  `
  eventItem.innerHTML = prep
  container.appendChild(eventItem)
}

function addNowToDOM(data) {
  const nowItem = document.createElement("div")
  nowItem.classList.add("now-container")
  nowItem.innerHTML = `
    <div class="now">${data.date}</div>
    <div class="now-content">${data.content}</div>
  `
  timeline.insertAdjacentElement("afterend", nowItem)
}

window.addEventListener("load", () => {
  fetchData()
    .then(res => {
      data = res.data

      let today = data.pop()

      data.sort((a, b) => {

        if (a.date > b.date)
          return 1
        else
          return -1
      }).push(today)

      getData()
    })

  plus.forEach(e => {
    e.addEventListener("click", plusToggle)
  })

  document.querySelector(".add-button").addEventListener("click", function(){
    if (pass != "zivif"){
      pass = prompt("סיסמא")
      if (pass == "zivif"){
        const addImage = document.querySelector(".add-image")
        addImage.style.display = (addImage.style.display == "none") ? "block" : "none"
      }
      else alert("סיסמא שגויה")
    }
    else{
      const addImage = document.querySelector(".add-image")
      addImage.style.display = (addImage.style.display == "none") ? "block" : "none"
    }
  })
})

window.addEventListener("scroll", () => {
  if (window.scrollY + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
    getData()
  }
})

function htmlToElement(html) {
  var template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

function plusToggle(e) {
  plus.forEach(el => {
    if (el == e.target) {
      if (e.target.src.includes("vee")){
        e.target.src = "buttons/plus.svg"
        img = "none.svg"
      }
      else{
        e.target.src = "buttons/vee.svg"
        img = e.target.dataset.src
      }
    } else {
      el.src = "buttons/plus.svg"
    }
  })
  document.querySelector(".preview").src = `img/${img}`;
}

document.querySelector("#newStory").addEventListener("input",function(){
  document.querySelector(".preview-text").innerText = this.value
  })

  document.querySelector("#newDate").addEventListener("change",function(){
    document.querySelector(".preview-date").innerText = this.value
    })