const config = {
  startingNumber: 1,
  numberLimit: {
    toggle: true,
    min: 0,
    max: 50
  },
  flashingTitle: {
    toggle: true,
    interval: 2000
  }
}

// destructuring

const { toggle: numberLimitToggle } = config.numberLimit
const { toggle: flashingTitleToggle, interval: flashingTitleInterval } =
  config.flashingTitle

// constants

const DEACTIVE_CLASS_NAME = "deactive"
const MAX_NUMBER_CLASS_NAME = "max"
const MIN_NUMBER_CLASS_NAME = "min"
const STARTING_NUMBER_CLASS_NAME = "starting"
const SAVED_NUMBER_CLASS_NAME = "saved"

// querySelectors
const numberEl = document.querySelector(".number")
const increaseBtn = document.querySelector(".increase")
const decreaseBtn = document.querySelector(".decrease")
const resetBtn = document.querySelector(".reset")
const clearMemoryBtn = document.querySelector(".clear")
const savedBtn = document.querySelector(".saved")
const minBtn = document.querySelector("button.min")
const maxBtn = document.querySelector("button.max")
const setBtn = document.querySelector(".set")
const submitBtn = document.querySelector(".submit")
const lastSubjectSpanEl = document.querySelector(".last-subject-span")
const lastSubjectInputEl = document.querySelector(".last-subject-input")
const numberSpanEl = document.querySelector(".number-span")

let currentNumber = config.startingNumber
let isInputBeingEdited = false

// functions

const log = (message, debugMode = false, showDate = true) => {
  const dateAndTime = new Date().toLocaleString()
  console.log(
    `${debugMode ? "DEBUG: " : ""}${
      showDate ? `[${dateAndTime}] ` : ""
    }${message}`
  )
}

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
  numberEl.classList.remove(SAVED_NUMBER_CLASS_NAME)

  // setting new state
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

    case "saved":
      numberEl.classList.add(SAVED_NUMBER_CLASS_NAME)
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

const resetAllUI = () => {
  disableButtonUI(decreaseBtn, false)
  disableButtonUI(increaseBtn, false)
  disableButtonUI(resetBtn, false)
  disableButtonUI(clearMemoryBtn, false)
  disableButtonUI(minBtn, false)
  disableButtonUI(maxBtn, false)
  disableButtonUI(savedBtn, false)
}

const setButtonStatesBasedOnCurrentNumber = () => {
  // TODO: handle clear later
  resetAllUI()

  const lastSubjectNumber = parseInt(getLastSubjectNumberFromLocalStorage())
  const subject = getLastSubjectFromLocalStorage()

  if (subject === null) {
    disableButtonUI(clearMemoryBtn, true)
  }
  if (currentNumber === lastSubjectNumber || isNaN(lastSubjectNumber)) {
    disableButtonUI(savedBtn, true)
  }

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
  }

  if (numberLimitToggle) {
    if (currentNumber === config.numberLimit.min) {
      disableButtonUI(decreaseBtn, true)
      disableButtonUI(minBtn, true)
    }

    if (currentNumber === config.numberLimit.max) {
      disableButtonUI(increaseBtn, true)
      disableButtonUI(maxBtn, true)
    }
  } else {
    disableButtonUI(minBtn, true)
    disableButtonUI(maxBtn, true)
  }
}

const setNumberColorStateBasedOnCurrentNumber = () => {
  setNumberColorStateUI("normal")

  if (currentNumber === parseInt(getLastSubjectNumberFromLocalStorage())) {
    setNumberColorStateUI("saved")
  }

  if (currentNumber === config.startingNumber) {
    setNumberColorStateUI("starting")
  }

  if (numberLimitToggle) {
    if (currentNumber === config.numberLimit.min) {
      setNumberColorStateUI("min")
      return
    }

    if (currentNumber === config.numberLimit.max) {
      setNumberColorStateUI("max")
      return
    } else return
  }
}

// event listener functions:
let increaseCounter = () => {
  // update the state
  currentNumber = numberLimitToggle
    ? Math.min(config.numberLimit.max, currentNumber + 1)
    : currentNumber + 1

  // update the UI
  resetAllUI()

  if (currentNumber === config.startingNumber) {
    disableButtonUI(resetBtn, true)
    setNumberColorStateUI("starting")
  }

  updateCounterNumber(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  // save to local storage
  saveNumberToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const decreaseCounter = () => {
  // update the state

  currentNumber = numberLimitToggle
    ? Math.max(config.numberLimit.min, currentNumber - 1)
    : currentNumber - 1

  // update the UI
  resetAllUI()

  updateCounterNumber(currentNumber)
  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()
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

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  // save to local storage
  saveNumberToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const setCounterToCustomNumber = () => {
  let numberStringPrompt = window.prompt("Enter the number:")
  console.log(numberStringPrompt)
  const number = parseInt(numberStringPrompt)

  if (numberStringPrompt === null || numberStringPrompt === "") return

  if (isNaN(number)) {
    alert("You must type a number in input")
    return
  }

  if (numberLimitToggle) {
    if (number > config.numberLimit.max) {
      alert("your number is too high")
      return
    }

    if (number < config.numberLimit.min) {
      alert("your number is too low")
      return
    }
  }

  currentNumber = number

  updateCounterNumber(number)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  // save to local storage
  saveNumberToLocalStorage(currentNumber)

  // update the app title
  updateTitle(currentNumber)
}

const setCounterToMax = () => {
  // setting the state
  currentNumber = config.numberLimit.max

  // update the UI
  updateCounterNumber(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  // save to local storage
  saveNumberToLocalStorage(currentNumber)
}

const setCounterToMin = () => {
  // setting the state
  currentNumber = config.numberLimit.min

  // update the UI
  updateCounterNumber(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  // save to local storage
  saveNumberToLocalStorage(currentNumber)
}

const setCounterToLastSubjectNumber = () => {
  currentNumber = parseInt(getLastSubjectNumberFromLocalStorage())

  updateCounterNumber(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  saveNumberToLocalStorage(currentNumber)
}

const clearMemory = () => {
  localStorage.clear()

  lastSubjectSpanEl.innerText = ""
  numberSpanEl.innerText = ""

  updateCounterNumber(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

  saveNumberToLocalStorage(currentNumber)

  log("Memory cleared")
}

// setting initial state
numberEl.innerText = config.startingNumber

increaseBtn.addEventListener("mousedown", increaseCounter)

decreaseBtn.addEventListener("mousedown", decreaseCounter)

resetBtn.addEventListener("mousedown", resetCounter)

setBtn.addEventListener("mousedown", setCounterToCustomNumber)

maxBtn.addEventListener("mousedown", setCounterToMax)

minBtn.addEventListener("mousedown", setCounterToMin)

savedBtn.addEventListener("mousedown", setCounterToLastSubjectNumber)

clearMemoryBtn.addEventListener("mousedown", clearMemory)
//  on pressing -, downarrow decrease
document.addEventListener("keydown", event => {
  if (isInputBeingEdited) return
  switch (event.key) {
    case "-":
    case "ArrowDown":
    case "ArrowLeft":
    case "s":
    case "a":
    case "PageDown":
      decreaseCounter()
      break

    case "+":
    case "ArrowUp":
    case "ArrowRight":
    case "w":
    case "d":
    case "PageUp":
      increaseCounter()
      break

    case "r":
    case " ":
      resetCounter()
      break

    case "f":
      setCounterToCustomNumber()
      break

    case "m":
    case "End":
      setCounterToMax()
      break

    case "n":
    case "Home":
      setCounterToMin()
      break

    case "l":
      setCounterToLastSubjectNumber()
      break

    case "Delete":
      clearMemory()
      break

    default:
      log(`Key pressed: ${event.key}`, (debugMode = true))
      break
  }
})

window.addEventListener("load", event => {
  // read from local storage
  currentNumber = getNumberFromLocalStorage()

  // update the UI
  updateCounterNumber(currentNumber)
  setButtonStatesBasedOnCurrentNumber()
  setNumberColorStateBasedOnCurrentNumber()

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

  log(`New saved subject: ${currentNumber} | Subject: "${subject}"`)

  lastSubjectInputEl.value = ""

  // save to local storage
  saveLastSubjectToLocalStorage(subject)
  saveLastSubjectNumberToLocalStorage(currentNumber)

  setButtonStatesBasedOnCurrentNumber()
  setCounterToLastSubjectNumber()
})

lastSubjectInputEl.addEventListener("focus", () => {
  isInputBeingEdited = true
})

lastSubjectInputEl.addEventListener("blur", () => {
  isInputBeingEdited = false
})
// TODO: Add Buttons:

// - Max [x]
// - Min [x]
// - Clear Memory [x]
// - Set (a number modal) [x]

// TODO: Following key events

// - End => Go to Max [x]
// - Home => Go to Min [x]
// - Delete => Clear Memory [x]

flashingTitleToggle &&
  setInterval(() => {
    if (document.title === `< ${currentNumber} >`) {
      document.title = "Counter"
      return
    }
    updateTitle(currentNumber)
  }, flashingTitleInterval)
