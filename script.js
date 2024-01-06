const config = {
  isNumberLimitEnabled: true,
  numberLimit: {
    min: 0,
    max: 50
  },
  startingNumber: 50,
  flashingTitle: {
    toggle: true,
    interval: 2000
  }
}

// destructuring
const { toggle: flashingTitleToggle, interval: flashingTitleInterval } =
  config.flashingTitle

// constants

const DEACTIVE_CLASS_NAME = "deactive"
const MAX_NUMBER_CLASS_NAME = "max"
const MIN_NUMBER_CLASS_NAME = "min"
const STARTING_NUMBER_CLASS_NAME = "starting"

// querySelectors
const numberEl = document.querySelector(".number")
const increaseBtn = document.querySelector(".increase")
const decreaseBtn = document.querySelector(".decrease")
const resetBtn = document.querySelector(".reset")
const submitBtn = document.querySelector(".submit")
const lastSubjectSpanEl = document.querySelector(".last-subject-span")
const lastSubjectInputEl = document.querySelector(".last-subject-input")
const numberSpanEl = document.querySelector(".number-span")

let currentNumber = config.startingNumber
let isInputBeingEdited = false

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

const saveNumberToLocalStorage = number => {
  localStorage.setItem("counter", number)
}

const getNumberFromLocalStorage = () => {
  const number = localStorage.getItem("counter")
  return number ? parseInt(number) : config.startingNumber
}

const saveLastSubjectToLocalStorage = subject => {
  localStorage.setItem("lastSubject", subject)
}

const getLastSubjectFromLocalStorage = () => {
  return localStorage.getItem("lastSubject")
}

const saveLastSubjectNumberToLocalStorage = number => {
  localStorage.setItem("lastSubjectNumber", number)
}

const getLastSubjectNumberFromLocalStorage = () => {
  return localStorage.getItem("lastSubjectNumber")
}

const setLastSubject = (currentNumber, subject) => {
  saveLastSubjectToLocalStorage(subject)
  lastSubjectSpanEl.innerText = subject
}

const resetAllUI = () => {
  disableButtonUI(decreaseBtn, false)
  disableButtonUI(increaseBtn, false)
  disableButtonUI(resetBtn, false)
  setNumberColorStateUI("normal")
}

let increaseCounter = () => {
  // update the state
  currentNumber = config.isNumberLimitEnabled
    ? Math.min(config.numberLimit.max, currentNumber + 1)
    : currentNumber + 1

  // update the UI
  resetAllUI()

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  updateCounterNumber(currentNumber)
  if (config.isNumberLimitEnabled && currentNumber >= config.numberLimit.max) {
    disableButtonUI(increaseBtn, true)
    setNumberColorStateUI("max")
  }

  // save to local storage
  saveNumberToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const decreaseCounter = () => {
  // update the state

  currentNumber = config.isNumberLimitEnabled
    ? Math.max(config.numberLimit.min, currentNumber - 1)
    : currentNumber - 1

  // update the UI
  resetAllUI()
  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  updateCounterNumber(currentNumber)
  if (config.isNumberLimitEnabled && currentNumber <= config.numberLimit.min) {
    disableButtonUI(decreaseBtn, true)
    setNumberColorStateUI("min")
  }
  // save to local storage
  saveNumberToLocalStorage(currentNumber)

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

  if (currentNumber >= config.numberLimit.max) {
    disableButtonUI(increaseBtn, true)
    setNumberColorStateUI("max")
  }

  if (currentNumber <= config.numberLimit.min) {
    disableButtonUI(decreaseBtn, true)
    setNumberColorStateUI("min")
  }

  // save to local storage
  saveNumberToLocalStorage(currentNumber)

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
  if (isInputBeingEdited) return
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
  currentNumber = getNumberFromLocalStorage()

  // update the UI
  updateCounterNumber(currentNumber)
  resetAllUI()

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  if (config.isNumberLimitEnabled && currentNumber >= config.numberLimit.max) {
    disableButtonUI(increaseBtn, true)
    numberEl.classList.add(MAX_NUMBER_CLASS_NAME)
  }

  if (config.isNumberLimitEnabled && currentNumber <= config.numberLimit.min) {
    disableButtonUI(decreaseBtn, true)
    numberEl.classList.add(MIN_NUMBER_CLASS_NAME)
  }

  // set the last subject in UI
  const lastSubject = getLastSubjectFromLocalStorage()
  if (lastSubject) {
    lastSubjectSpanEl.innerText = lastSubject
  }

  const lastSubjectNumber = getLastSubjectNumberFromLocalStorage()
  if (lastSubjectNumber) {
    numberSpanEl.innerText = lastSubjectNumber
  }
})

submitBtn.addEventListener("click", event => {
  event.preventDefault()
  const subject = lastSubjectInputEl.value.trim()
  if (subject === "") {
    return
  }

  lastSubjectSpanEl.innerText = subject
  numberSpanEl.innerText = currentNumber

  lastSubjectInputEl.value = ""

  // save to local storage
  saveLastSubjectToLocalStorage(subject)
  saveLastSubjectNumberToLocalStorage(currentNumber)
})

lastSubjectInputEl.addEventListener("focus", () => {
  isInputBeingEdited = true
})

lastSubjectInputEl.addEventListener("blur", () => {
  isInputBeingEdited = false
})

// TODO: Add Buttons:
// - Max
// - Min
// - Set (a number modal)
// - Clear Memory

// TODO: Following key events
// - End => Go to Max
// - Home => Go to Min
// - Delete => Clear Memory

if (flashingTitleToggle) {
  setInterval(() => {
    if (document.title === `< ${currentNumber} >`) {
      document.title = "Counter"
      return
    }
    updateTitle(currentNumber)
  }, flashingTitleInterval)
}
