const Rx = require('rxjs')
import * as R from 'ramda'

import { fetchLoansObs  } from './api.js'
import { convertToD3Data, renderBarGraph, renderTotalPerSector } from './d3.js'
import { toggleSpinner } from './UI.js'

const initialState = {
  fetchingApi: false,
  apiLoaded: false,
  data: null
}

const totalAmountPerSectorButton = document.querySelector('.showTotalAmountPerSector')
const totalAmountPerSectorButtonObs = Rx.Observable.fromEvent(totalAmountPerSectorButton, 'click')

const state = Rx.Observable.merge(
  fetchLoansObs)
      .scan((state, changeFn) => changeFn(state), initialState)
      .subscribe(state => {
        toggleSpinner(state.fetchingApi)

        totalAmountPerSectorButtonObs.subscribe(e => {
          renderTotalPerSector(state.data)
        })
      })
