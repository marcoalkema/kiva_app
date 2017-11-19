import * as R from 'ramda'
const Rx = require('rxjs')

const spinner = require('../assets/spinner.gif')
const blank = require('../assets/blank.gif')

export const toggleSpinner = (shouldDisplay) => {
  const spinnerEl = document.querySelector('.spinner')
  const displayElement = shouldDisplay ? 'block' : 'none'
  spinnerEl.innerHTML = '<img src="' + spinner + '"/>'
  spinnerEl.style.display = displayElement
}

export const countrySelector = R.compose(
  R.reduce((acc, str) => acc + str, ''),
  R.map(country => '<li class="countryOption"><img src=' + blank + ' class="flag flag-' + country.code + '"/>' + country.name + '</li>')
)

export const setSelectorState = (isToggled, selector) => {
  selector.className = isToggled ? 'countriesInput active' : 'countriesInput'
  selector.querySelector('ul').className = isToggled ? 'countriesList active' : 'countriesList'
}

export const setSelectedCountryInWidget = (country) => {
  const countryFlagImgStr = country.code === '' ? '' : '<img src=' + blank + ' class="flag flag-' + country.code + '"/>'
  document.querySelector('.selectedCountry').innerHTML = countryFlagImgStr + country.name
}
