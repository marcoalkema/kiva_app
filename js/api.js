const Rx = require('rxjs')
const api = 'https://api.kivaws.org/v1/loans/newest.json?per_page=500'
import * as R from 'ramda'

export const fetchLoansObs = Rx.Observable.ajax(api)
      .flatMap(ajaxResponse => {
        const pagesAmount = ajaxResponse.response.paging.pages
        return Rx.Observable.range(1, pagesAmount)
          .flatMap(pageNumber =>
                   Rx.Observable.ajax(api + '&page=' + pageNumber)
                   .map(ajaxResponse =>
                        R.map((loan) => ({
                          sector: loan.sector,
                          loan: loan.loan_amount
                        }), ajaxResponse.response.loans)
                       )).bufferCount(pagesAmount)
      })
      .map(result => R.compose(
        R.assoc('data', R.flatten(result)),
        R.assoc('fetchingApi', false),
        R.assoc('apiLoaded', true)
      ))
      .catch(error => {
        console.log('Error while retrieving file:', error)
        return Rx.Observable.empty()
      })


const groupBySector = R.compose(
  R.groupBy(R.prop('sector'))
)

const valueBySector = (num, key, obj) => {
  return R.compose(
    R.reduce(R.add, 0),
    R.map(R.prop('loan')),
    R.prop(key)
  )(obj)
}

export const totalAmountPerSector = R.compose(
  R.mapObjIndexed(valueBySector),
  groupBySector,
  R.flatten
)
