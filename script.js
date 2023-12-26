const config = {
  startingNumber: 50,
  allowNegative: false,
  changeColorDuration_MS: 1000
}

// querySelectors
const numberEl = document.querySelector(".number")
const increaseBtn = document.querySelector(".increase")
const decreaseBtn = document.querySelector(".decrease")
const resetBtn = document.querySelector(".reset")

let currentNumber = config.startingNumber

// functions

const updateCounterNumber = number => {
  numberEl.innerText = number
}

const saveOnUrl = number => {
  history.pushState(null, null, `#${number}`)
}

const updateTitle = number => {
  document.title = `< ${number} >`
}

const saveToLocalStorage = number => {
  localStorage.setItem("counter", number)
}

const getFromLocalStorage = () => {
  const number = localStorage.getItem("counter")
  if (number) {
    return parseInt(number)
  } else {
    return config.startingNumber
  }
}

let increaseCounter = () => {
  // update the state
  currentNumber += 1

  // update the UI
  updateCounterNumber(currentNumber)

  // save to local storage
  saveToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const decreaseCounter = () => {
  // update the state
  currentNumber = config.allowNegative
    ? currentNumber - 1
    : Math.max(0, currentNumber - 1)

  // update the UI
  updateCounterNumber(currentNumber)

  // save to local storage
  saveToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const resetCounter = () => {
  // update the state
  currentNumber = config.startingNumber

  // update the UI
  updateCounterNumber(currentNumber)

  // save to local storage
  saveToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

// setting initial state
numberEl.innerText = config.startingNumber

increaseBtn.addEventListener("mousedown", increaseCounter)

decreaseBtn.addEventListener("mousedown", decreaseCounter)

resetBtn.addEventListener("mousedown", resetCounter)

//  on pressing -, downarrow decrease
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "-":
    case "ArrowDown":
    case "ArrowLeft":
    case "s":
    case "a":
      decreaseCounter()
      break

    case "+":
    case "ArrowUp":
    case "ArrowRight":
    case "w":
    case "d":
      increaseCounter()
      break

    case "r":
    case " ":
      resetCounter()
      break

    default:
      break
  }
})

window.addEventListener("load", event => {
  // read from local storage
  currentNumber = getFromLocalStorage()

  // update the UI
  updateCounterNumber(currentNumber)
})
