const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const timerEl = document.querySelector('span');

// Напишите реализацию createTimerAnimator
// который будет анимировать timerEl
const createTimerAnimator = () => {
  const min2Digit = new Intl.NumberFormat("ru-RU", {
    minimumIntegerDigits: 2,
    useGrouping: false
  })

  return (seconds) => {
    let secondsLeft = seconds

    const interval = setInterval(() => {
      if (secondsLeft < 0) return

      const leftSec = secondsLeft % 60
      const leftMinutes = Math.floor(secondsLeft % (60 * 60) / 60)
      const leftHours = Math.floor(secondsLeft / (60 * 60))

      const timerFormatted =
        min2Digit.format(leftHours) + ":"
        + min2Digit.format(leftMinutes) + ":"
        + min2Digit.format(leftSec)
      const timerExtended =
        `${leftHours} ${getNoun(leftHours, "час", "часа", "часов")}, `
        + `${leftMinutes} ${getNoun(leftMinutes, "минута", "минуты", "минут")}, `
        + `${leftSec} ${getNoun(leftSec, "секунда", "секунды", "секунд")}`

      timerEl.innerText = `${timerFormatted} - ${timerExtended}`
      secondsLeft--
    }, 1000)

    // Остановка таймера
    const cancelationDate = new Date((new Date()).getTime() + ((1 + seconds) * 1000))

    const timeout = runAtDate(cancelationDate, () => clearInterval(interval))

    return [interval, timeout]
  };
};

const animateTimer = createTimerAnimator();

inputEl.addEventListener('input', (e) => {
  // Очистите input так, чтобы в значении
  // оставались только числа

  // №1. <input placeholder="Seconds" type="number" min="0" />
  // №2. проверка строки после ввода
  const regex = /\D/gi;
  e.target.value = e.target.value.replaceAll(regex, "")
});

let globalInterval = null
let globalTimeout = null

buttonEl.addEventListener('click', () => {
  // Считать время таймера
  const seconds = Number(inputEl.value);
  if (seconds === 0) return
  inputEl.value = '';

  // Остановить таймера при наличии
  globalInterval && clearInterval(globalInterval)
  globalTimeout && clearTimeout(globalTimeout)

  // Вызвать новый таймер
  const [interval, timeout] = animateTimer(seconds);
  globalInterval = interval
  globalTimeout = timeout
});



//====================================== lib

/**
 * Вызывать функцию в назначенное время
 * Необходимо для таймеров больше Number.MAX_VALUE
 * @param {*} date - назначенное время
 * @param {*} func - коллбак
 * @returns setTimeout для отмены
 */
function runAtDate(date, func) {
  const now = (new Date()).getTime();
  const then = date.getTime();
  const diff = Math.max((then - now), 0);
  return diff > 0x7FFFFFFF
    ? setTimeout(() => runAtDate(date, func), 0x7FFFFFFF)
    : setTimeout(func, diff)
}

/**
 * Определить окончание для числительного
 * @example "01:12:59 - 1 час, 12 минут, 59 секунд"
 * @param {*} number - 59
 * @param {*} one - секунда
 * @param {*} two - секунды
 * @param {*} five  - секунд
 * @returns 
 */
function getNoun(number, one, two, five) {
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
}