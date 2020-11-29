const container = document.getElementById("container")
const timeline = document.getElementById("timeline")
const carouselInner = document.querySelector(".carousel-inner")
const storage = firebase.storage().ref()
const bodyWidth = document.body.clientWidth

var img = ""
var pass = ""

const DB = {
  root: "https://api.jsonbin.io",
  key: "$2b$10$hC7JnIQX2Er/Zbnk12PAbOttAGliU8syUrrpqbN2XKig6l5P/Iha.",
  bin: "5fb130d53abee46e243910c9"
}
var data = {}
let data_num = 0

function createCarouselItem(url, classes, plus, plusClass) {
  const carouselItem = document.createElement("div")
  carouselItem.classList = `${classes}`
  carouselItem.innerHTML =
    `<img src="${url}" alt="...">
  <div class="carousel-caption">
  <img src="${plus}" alt="plus" class="${plusClass}" data-src="${url}">
  </div>`
  return carouselItem
}

function fetchData() {
  return fetch(`${DB.root}/b/${DB.bin}/latest`, {
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
      fetch(`${DB.root}/b/${DB.bin}`, {
          body: JSON.stringify({
            data
          }),
          method: "PUT",
          headers: {
            "secret-key": DB.key,
            "Content-Type": "application/json"
          }
        })
        .then((reslog) => reslog.json()).then(reslogjson => {
          if (reslogjson.success == true) location.reload()
        })

    })
  else {
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

function addLifeEventToDOM(data = {
  date: "",
  content: ""
}, y) {
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
          <img width="200" src=${data.image} / >
          </div>`
  prep +=
    `</div>
  `
  eventItem.innerHTML = prep
  if (y == null)
    container.appendChild(eventItem)
  else {
    var flag = true
    const newOne = htmlToElement(`
    <div class="life-event new-one">
      <div class="timeline-circle"></div>
      <div class="content">
    <input class="date" type="date" style="
background: none;
border: none;
">
    <p contenteditable="true">*שורה זו ניתנת לעריכה בלחיצה*</p>
  <input type="file" name="file" id="file" style="width: inherit;">
  <div id="progress"></div>
<div class="event-image">
    <img width="200" src="img/blank.svg" class="event-image-new">
    </div>
    <button>שגר</button>
    </div>
  </div>`)

    for (let i = 0; i < container.children.length; i++) {
      if (container.children[i].classList.contains("new-one"))
        container.children[i].remove()

      if (flag && (container.children[i].getBoundingClientRect().bottom + document.documentElement.scrollTop) >= y) {
        container.insertBefore(newOne, container.children[i])
        flag = false
      } else {
        if (flag)
          container.appendChild(newOne)
      }
    }
    carouselStorage()
  }
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

timeline.addEventListener("mouseover", e => {
  if (e.x >= timeline.clientWidth / 2 - 4 && e.x <= timeline.clientWidth / 2 + 3)
    timeline.className = "timeline hover"
  else
    timeline.className = "timeline"
})

timeline.addEventListener("click", e => {
  if (window.innerWidth > 975) {
    if (e.x >= timeline.clientWidth / 2 - 4 && e.x <= timeline.clientWidth / 2 + 3)
      addLifeEventToDOM({
        date: "30/11/2020",
        content: "ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום ממלא מקום "
      }, e.pageY)
  } else {
    if (e.x > 47 && e.x < 53)
      addLifeEventToDOM({}, e.pageY)
  }
})

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
  // document.querySelector(".add-button").addEventListener("click", function () {
  //   if (pass != "talf") {
  //     pass = prompt("סיסמא")
  //     if (pass == "talf") {
  //       carouselStorage()
  //       const addImage = document.querySelector(".add-image")
  //       addImage.style.display = (addImage.style.display == "none") ? "block" : "none"
  //     } else alert("סיסמא שגויה")
  //   } else {
  //     carouselStorage()
  //     const addImage = document.querySelector(".add-image")
  //     addImage.style.display = (addImage.style.display == "none") ? "block" : "none"
  //   }
  // })
})

window.addEventListener("scroll", () => {
  if (window.scrollY + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
    getData()
  }
})

function carouselStorage() {
  const file = document.querySelector("#file")
  const progressBar = document.querySelector("#progress")
  const rand = `img${Math.floor(Math.random()*100000)}`
  file.addEventListener("change", function () {
    const up = storage.child(rand);
    const progressq = up.put(file.files[0])
    progressq.on('state_changed', function (snapshot) {
      let progress = (Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      progressBar.innerText = ('Upload is ' + progress + '% done');
    })
    progressq.then(() => {
      const newImageURL = storage.child(`res/${rand}_500x450`);
      setTimeout(function () {
        newImageURL.getDownloadURL()
          .then(url => {
            document.querySelector(".event-image-new").src = url
            // document.querySelector(".active").classList.remove("active")
            // carouselInner.append(createCarouselItem(url, "item active", "buttons/plus.svg", "plus new-plus"))
            // document.querySelector(".new-plus").addEventListener("click", plusToggle)
            // plus = document.querySelectorAll(".plus")
          })
          .catch(() => {
            setTimeout(function () {
              newImageURL.getDownloadURL()
                .then(url => {
                  document.querySelector(".event-image-new").src = url
                  // document.querySelector(".active").classList.remove("active")
                  // carouselInner.append(createCarouselItem(url, "item active", "buttons/plus.svg", "plus new-plus"))
                  // document.querySelector(".new-plus").addEventListener("click", plusToggle)
                  // plus = document.querySelectorAll(".plus")
                })
            }, 3000)
          })
      }, 3000)
      setTimeout(function () {
        progressBar.innerText = "";
      }, 1000)
    })
  })
  const ref = storage.child("res")
  // ref.listAll().then(res => {
  //   res.items.forEach(
  //     (el, i) => el.getDownloadURL()
  //     .then(url => {
  //       if (i == 0) {
  //         carouselInner.append(createCarouselItem(url, "item active", "buttons/vee.svg", "plus"))
  //         img = url
  //         document.querySelector(".preview").src = img;
  //       } else
  //         carouselInner.append(createCarouselItem(url, "item", "buttons/plus.svg", "plus"))
  //     }).then(() => {
  //       window.plus = document.querySelectorAll(".plus")
  //       plus.forEach(e => {
  //         e.addEventListener("click", plusToggle)
  //       })

  //     })
  //   )
  // })
}

function htmlToElement(html) {
  var template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

function plusToggle(e) {
  plus.forEach(el => {
    if (el == e.target) {
      if (e.target.src.includes("vee")) {
        e.target.src = "buttons/plus.svg"
        img = "none.svg"
      } else {
        e.target.src = "buttons/vee.svg"
        img = e.target.dataset.src
      }
    } else {
      el.src = "buttons/plus.svg"
    }
  })
  document.querySelector(".preview").src = img;
}

// document.querySelector("#newStory").addEventListener("input", function () {
//   document.querySelector(".preview-text").innerText = this.value
// })

// document.querySelector("#newDate").addEventListener("change", function () {
//   document.querySelector(".preview-date").innerText = this.value
// })