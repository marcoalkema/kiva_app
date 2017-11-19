const Rx = require('rxjs')
import * as R from 'ramda'

import { fetchLoansObs, getCountries } from './api.js'
import { convertToD3Data, renderBarGraph, renderTotalPerSector, renderTotalPerCountry } from './d3.js'
import { toggleSpinner, countrySelector, setSelectorState, setSelectedCountryInWidget } from './UI.js'
import { renderGoogleMap } from './googleApi.js'

const initialState = {
  fetchingApi: false,
  apiLoaded: false,
  data: null,
  countriesInputToggled: false,
  countries: [],
  selectCountriesWidget: {
    selectedCountry: {
      name: '',
      code: ''
    }
  }
}

const totalAmountPerSectorButton = document.querySelector('.showTotalAmountPerSector')
const totalAmountPerSectorButtonObs = Rx.Observable.fromEvent(totalAmountPerSectorButton, 'click')

const totalAmountPerCountryButton = document.querySelector('.showTotalAmountPerCountry')
const totalAmountPerCountryButtonObs = Rx.Observable.fromEvent(totalAmountPerCountryButton, 'click')

const showActiveCountriesButton = document.querySelector('.showActiveCountries')
const showActiveCountriesButtonObs = Rx.Observable.fromEvent(showActiveCountriesButton, 'click')

const countriesInput = document.querySelector('.countriesInput')
const countriesInputObs = Rx.Observable.fromEvent(countriesInput, 'click')
      .map(() => state => R.assoc('countriesInputToggled', !state.countriesInputToggled, state))

const countryOptionThroughInputObs = Rx.Observable.fromEvent(countriesInput, 'click')
      .map(e => state => e.target.className === 'countryOption' ?
           R.assocPath(['selectCountriesWidget', 'selectedCountry'],
                       R.find(R.propEq('name', e.target.textContent), state.countries),
                       state) :
           state)

const setCountriesInputObs = Rx.Observable.of()
      .map((data) => state => R.assoc('countries', data, state))

const state = Rx.Observable.merge(
  fetchLoansObs,
  countriesInputObs,
  countryOptionThroughInputObs)
      .scan((state, changeFn) => changeFn(state), initialState)
      .subscribe(state => {

        ///////////////////////////////////////////////////////////////////////
        // TODO: Should only update corresponding data in state has changed. //
        ///////////////////////////////////////////////////////////////////////

        toggleSpinner(state.fetchingApi)

        console.log(state.data)

        totalAmountPerSectorButtonObs.subscribe(e => {
          renderTotalPerSector(state.data)
        })

        totalAmountPerCountryButtonObs.subscribe(e => {
          renderTotalPerCountry(state.data)
        })

        showActiveCountriesButtonObs.subscribe(e => {
          renderGoogleMap(state.countries)
        })

        setSelectorState(state.countriesInputToggled, countriesInput)

        setSelectedCountryInWidget(R.path(['selectCountriesWidget', 'selectedCountry'], state))

        R.compose(
          countriesList => document.querySelector('.countriesList').innerHTML = countriesList,
          countrySelector,
          R.sortBy(R.prop('name'))
        )(state.countries)
      })
