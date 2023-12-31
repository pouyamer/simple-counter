const config = {
  toggleLimit: false,
  limit: {
    min: 0,
    max: 20
  },
  startingNumber: 5
}

const DEACTIVE_CLASS_NAME = "deactive"
const MAX_NUMBER_CLASS_NAME = "max"
const MIN_NUMBER_CLASS_NAME = "min"
const STARTING_NUMBER_CLASS_NAME = "starting"

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

const setNumberColorStateUI = state => {
  // state can be "max", "min", "starting", "normal"

  // clearing all states
  numberEl.classList.remove(MIN_NUMBER_CLASS_NAME)
  numberEl.classList.remove(STARTING_NUMBER_CLASS_NAME)
  numberEl.classList.remove(MAX_NUMBER_CLASS_NAME)

  switch (state) {
    case "max":
      numberEl.classList.add(MAX_NUMBER_CLASS_NAME)
      break

    case "min":
      numberEl.classList.add(MIN_NUMBER_CLASS_NAME)
      break

    case "starting":
      numberEl.classList.add(STARTING_NUMBER_CLASS_NAME)
      break
    case "normal":
      break

    default:
      break
  }
}

const disableButtonUI = (buttonElement, state) => {
  if (state) buttonElement.classList.add(DEACTIVE_CLASS_NAME)
  else buttonElement.classList.remove(DEACTIVE_CLASS_NAME)

  buttonElement.disabled = state
}

const saveToLocalStorage = number => {
  localStorage.setItem("counter", number)
}

const getFromLocalStorage = () => {
  const number = localStorage.getItem("counter")
  return number ? parseInt(number) : config.startingNumber
}

const resetAllUI = () => {
  disableButtonUI(decreaseBtn, false)
  disableButtonUI(increaseBtn, false)
  disableButtonUI(resetBtn, false)
  setNumberColorStateUI("normal")
}

let increaseCounter = () => {
  // update the state
  currentNumber = config.toggleLimit
    ? Math.min(config.limit.max, currentNumber + 1)
    : currentNumber + 1

  // update the UI
  resetAllUI()

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  updateCounterNumber(currentNumber)
  if (config.toggleLimit && currentNumber >= config.limit.max) {
    disableButtonUI(increaseBtn, true)
    setNumberColorStateUI("max")
  }

  // save to local storage
  saveToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const decreaseCounter = () => {
  // update the state

  currentNumber = config.toggleLimit
    ? Math.max(config.limit.min, currentNumber - 1)
    : currentNumber - 1

  // update the UI
  resetAllUI()
  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  updateCounterNumber(currentNumber)
  if (config.toggleLimit && currentNumber <= config.limit.min) {
    disableButtonUI(decreaseBtn, true)
    setNumberColorStateUI("min")
  }
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
  resetAllUI()

  disableButtonUI(resetBtn, true)
  setNumberColorStateUI("starting")

  if (currentNumber >= config.limit.max) {
    disableButtonUI(increaseBtn, true)
    setNumberColorStateUI("max")
  }

  if (currentNumber <= config.limit.min) {
    disableButtonUI(decreaseBtn, true)
    setNumberColorStateUI("min")
  }

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
  resetAllUI()

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  if (config.toggleLimit && currentNumber >= config.limit.max) {
    disableButtonUI(increaseBtn, true)
    numberEl.classList.add(MAX_NUMBER_CLASS_NAME)
  }

  if (config.toggleLimit && currentNumber <= config.limit.min) {
    disableButtonUI(decreaseBtn, true)
    numberEl.classList.add(MIN_NUMBER_CLASS_NAME)
  }
})
