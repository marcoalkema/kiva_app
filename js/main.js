const Rx = require('rxjs')
const requestUrl = 'https://api.github.com/users'
import * as R from 'ramda'
// const requestUrl = 'https://jsonplaceholder.typicode.com/users'

const refreshButton = document.querySelector('.refresh')
const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click')

const queries = ['.close1', '.close2', '.close3']
const closeButtonsStreams = queries
    .map((query) => document.querySelector(query))
    .map((button) => Rx.Observable.fromEvent(button, 'click'))

const requestStream = refreshClickStream.startWith('startup click')
      .map(() => {
        const randomOffset = Math.floor(Math.random() * 500)
        return requestUrl + '?since=' + randomOffset
      })

var responseStream = requestStream
    .flatMap((requestUrl_) => {
      return Rx.Observable.from(fetch(requestUrl_)
                                .then(result => result.json()))
    })

const getSuggestions = (buttonClickStream, index, e) => {
  return buttonClickStream.startWith('startup click')
      .combineLatest(responseStream,
                     (click, listUsers) => {
                       return {
                         user: listUsers[Math.floor(Math.random() * listUsers.length)],
                         source: e[index].sourceObj
                       }
                     }
                    )
      .merge(
        refreshClickStream.map(() => { return null })
      )
      .startWith(null)
}

function renderSuggestion(suggestion) {
  var containerEl = suggestion.source.parentElement
  var bodyElement = containerEl.parentElement
  if (suggestion.user === undefined) {
    containerEl.style.visibility = 'hidden'
  } else {
    var usernameEl = bodyElement.querySelector('.username')
    var urlEl = bodyElement.querySelector('.url')
    var imgEl = bodyElement.querySelector('img')
    var followsEl = bodyElement.querySelector('.follows')

    const suggestedUser = suggestion.user
    const followers = Rx.Observable.from(
      fetch(suggestedUser.followers_url)
        .then(result => result.json()))

    containerEl.style.visibility = 'visible'
    urlEl.textContent = suggestedUser.html_url
    urlEl.href = suggestedUser.html_url
    usernameEl.textContent = suggestedUser.login
    imgEl.src = ''
    imgEl.src = suggestedUser.avatar_url

    followers.subscribe(function (users) {
      if (users != null) {
        const mkImgString = (str, user) => { return str + '<a href="' + user.html_url + '"><img class="round" src="' + user.avatar_url + '" alt="' + user.login + '"/></a>' }
        const setFollowsEl = (str) => { followsEl.innerHTML = str }

        R.compose(setFollowsEl,
                  R.reduce(mkImgString, ''),
                  R.take(5))(users)
      }
    })
  }
}

closeButtonsStreams
  .map(getSuggestions)
  .map(stream => stream.subscribe(function (suggestion) {
    if (suggestion != null) renderSuggestion(suggestion)
  }))
