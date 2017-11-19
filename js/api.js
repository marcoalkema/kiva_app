const Rx = require('rxjs')
const api = 'https://api.kivaws.org/v1/loans/newest.json?per_page=500'
import * as R from 'ramda'

export const fetchLoansObs = Rx.Observable.ajax(api)
      .flatMap(ajaxResponse => {
        const pagesAmount = ajaxResponse.response.paging.pages
        return Rx.Observable.range(1, pagesAmount)
          .flatMap(pageNumber =>
                   Rx.Observable.ajax(api + '&page=' + pageNumber)
                   .map(ajaxResponse => ajaxResponse.response.loans)
                  )
          .bufferCount(pagesAmount)
      })
      .map(result => R.compose(
        R.assoc('data', R.flatten(result)),
        R.assoc('fetchingApi', false),
        R.assoc('apiLoaded', true),
        R.assoc('countries', R.flatten(getCountries(result)))
      ))
      .catch(error => {
        console.log('Error while retrieving file:', error)
        return Rx.Observable.empty()
      })

export const groupTotalAmountBy = (category) => (data) => {
  const categoryName = R.takeLast(1, category)

  const totalValue = (num, key, obj) => {
    return R.compose(
      R.reduce(R.add, 0),
      R.map(R.prop('amount')),
      R.prop(key)
    )(obj)
  }

  return R.compose(
    R.mapObjIndexed(totalValue),
    R.groupBy(R.prop(categoryName)),
    R.map(loan => R.assoc(categoryName,
                          R.path(category, loan),
                          {amount: loan.funded_amount}))
  )(data)
}

export const getCountries = R.compose(
  R.uniq,
  R.map(loan => ({
    name: R.path(['location', 'country'], loan),
    code: R.compose(
      R.toLower,
      R.path(['location', 'country_code'])
    )(loan)
  })),
  R.flatten
)
