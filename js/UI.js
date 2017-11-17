const spinner = require('../assets/spinner.gif')

export const toggleSpinner = (shouldDisplay) => {
  const spinnerEl = document.querySelector('.spinner')
  const displayElement = shouldDisplay ? 'block' : 'none'
  spinnerEl.innerHTML = '<img src="' + spinner + '"/>'
  spinnerEl.style.display = displayElement
}
