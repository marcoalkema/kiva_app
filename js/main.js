const Rx = require('rxjs')
const requestUrl = 'https://api.github.com/users'
import * as R from 'ramda'
// const requestUrl = 'https://jsonplaceholder.typicode.com/users'

// const refreshButton = document.querySelector('.refresh')
// const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click')

// const queries = ['.close1', '.close2', '.close3']
// const closeButtonsStreams = queries
//     .map((query) => document.querySelector(query))
//     .map((button) => Rx.Observable.fromEvent(button, 'click'))

// const requestStream = refreshClickStream.startWith('startup click')
//       .map(() => {
//         const randomOffset = Math.floor(Math.random() * 500)
//         return requestUrl + '?since=' + randomOffset
//       })

// var responseStream = requestStream
//     .flatMap((requestUrl_) => {
//       return Rx.Observable.from(fetch(requestUrl_)
//                                 .then(result => result.json()))
//     })

// const getSuggestions = (buttonClickStream, index, e) => {
//   return buttonClickStream.startWith('startup click')
//       .combineLatest(responseStream,
//                      (click, listUsers) => {
//                        return {
//                          user: listUsers[Math.floor(Math.random() * listUsers.length)],
//                          source: e[index].sourceObj
//                        }
//                      }
//                     )
//       .merge(
//         refreshClickStream.map(() => { return null })
//       )
//       .startWith(null)
// }

// function renderSuggestion(suggestion) {
//   var containerEl = suggestion.source.parentElement
//   var bodyElement = containerEl.parentElement
//   if (suggestion.user === undefined) {
//     containerEl.style.visibility = 'hidden'
//   } else {
//     var usernameEl = bodyElement.querySelector('.username')
//     var urlEl = bodyElement.querySelector('.url')
//     var imgEl = bodyElement.querySelector('img')
//     var followsEl = bodyElement.querySelector('.follows')

//     const suggestedUser = suggestion.user
//     const followers = Rx.Observable.from(
//       fetch(suggestedUser.followers_url)
//         .then(result => result.json()))

//     containerEl.style.visibility = 'visible'
//     urlEl.textContent = suggestedUser.html_url
//     urlEl.href = suggestedUser.html_url
//     usernameEl.textContent = suggestedUser.login
//     imgEl.src = ''
//     imgEl.src = suggestedUser.avatar_url

//     followers.subscribe(function (users) {
//       if (users != null) {
//         const mkImgString = (str, user) => { return str + '<a href="' + user.html_url + '"><img class="round" src="' + user.avatar_url + '" alt="' + user.login + '"/></a>' }
//         const setFollowsEl = (str) => { followsEl.innerHTML = str }

//         R.compose(setFollowsEl,
//                   R.reduce(mkImgString, ''),
//                   R.take(5))(users)
//       }
//     })
//   }
// }

// closeButtonsStreams
//   .map(getSuggestions)
//   .map(stream => stream.subscribe(function (suggestion) {
//     if (suggestion != null) renderSuggestion(suggestion)
//   }))


const increaseButton = document.querySelector('.increase')
const increaseClickStream = Rx.Observable.fromEvent(increaseButton, 'click')

const decreaseButton = document.querySelector('.decrease')
const decreaseClickStream = Rx.Observable.fromEvent(decreaseButton, 'click')

const inputButton = document.querySelector('.input')
const inputClickStream = Rx.Observable.fromEvent(inputButton, 'keypress')

var init = {
  count: 0,
  cheater: null
}

var increase = increaseClickStream
    .map(() => state => R.assoc('count', state.count + 1, state))

var decrease = decreaseClickStream
    .map(() => state => Object.assign({}, state, {count: state.count - 1}))

var input = inputClickStream
    .pluck('target', 'value')
    .map(x => parseInt(x))
    .filter(x => !isNaN(x))
    .map(Math.round)
    .map((value) => state => Object.assign({}, state, {cheater: value}))

var state = Rx.Observable
    .merge(
      increase,
      decrease,
      input
    )
    .scan((state, changeFn) => changeFn(state), init)

var prevState = {}
state.subscribe((state) => {
  if (state.count !== prevState.count) {
    document.querySelector('.result').innerHTML = state.count
  }
  if (state.cheater !== prevState.cheater) {
    console.log("state.cheater = ", state.cheater);
    console.log("prevState.cheater = ", prevState.cheater);
    console.log('We don\'t like cheaters \'round here, pal', state.cheater)
  }
  prevState = state
});


function myObservable(observer) {
  const datasource = new DataSource()
  datasource.ondata = (e) => observer.next(e)
  datasource.onerror = (err) => observer.error(err)
  datasource.oncomplete = () => observer.complete()
  return () => {
        datasource.destroy()
  }
}

var parent = document.querySelector('.parent')
var widget = document.querySelector('.widget')

var mouseDowns = Rx.Observable.fromEvent(widget, 'mousedown')
var mouseMoves = Rx.Observable.fromEvent(parent, 'mousemove')
var mouseUps = Rx.Observable.fromEvent(parent, 'mouseup')

var drags = mouseDowns
    .concatMap((e) => {
      return mouseMoves
        .takeUntil(mouseUps)
    })

drags.forEach((e) => {
  widget.style.left = e.clientX + 'px'
  widget.style.top = e.clientY + 'px'
})

var foo = [[[1,2,3,4], [5,6,7,8]], [[1,2,3,1], [5,6,7,8]]]

var bar =
    R.flatten(
      foo.map(function (n1) {
        return R.flatten(
          n1.map(function (n2) {
            return n2.filter(function (n) {
              return n === 4
            }).
              map(function (n) {
                return 'Gevonden! ' + n
              })
          })
        )
      })
    )

console.log(bar)

//timerOne emits first value at 1s, then once every 4s
const timerOne = Rx.Observable.timer(1000, 4000);
//timerTwo emits first value at 2s, then once every 4s
const timerTwo = Rx.Observable.timer(2000, 4000)
//timerThree emits first value at 3s, then once every 4s
const timerThree = Rx.Observable.timer(3000, 4000)

//when one timer emits, emit the latest values from each timer as an array
const combined = Rx.Observable
.combineLatest(
    timerOne,
    timerTwo,
    timerThree
).map(([x, y, z]) => x + y + y)

const subscribe = combined.subscribe(latestValues => {
    //grab latest emitted values for timers one, two, and three
  /*
      Example:
    timerOne first tick: 'Timer One Latest: 1, Timer Two Latest:0, Timer Three Latest: 0
    timerTwo first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 0
    timerThree first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 1
  */
  // console.log(
  //   latestValues
  //  );
});

const setHtml = id => val => {
  document.querySelector(id).innerHTML = val;
}

const addOneClick$ = id => Rx.Observable
    .fromEvent(document.querySelector(id), 'click')
    // map every click to 1
    .mapTo(1)
    .startWith(0)
    // keep a running total
    .scan((acc, curr) => acc + curr)
    // set HTML for appropriate element
    .do(setHtml(`${id}`))


const combineTotal$ = Rx.Observable
  .combineLatest(
    addOneClick$('.red'),
    addOneClick$('.black')
  )
  .map(([val1, val2]) => val1 + val2)
  .subscribe(setHtml('.total'));
