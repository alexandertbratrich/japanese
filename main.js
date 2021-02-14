/*

% todo: that split second, when the cards arrive/leave, it shows them in red bzw. with the solution.
% one card problem
% whole pile positioning

*/

let app = new Vue({
  el: '#app',
  data: {
    version: '0.1.214b',     // '0.1.0129',
    answer: '',             // the input thingy
    fullorder: [],          // the full list of gana in the current run
    order: [],              // the list of gana that are left to do
    reserve: [],            // the failed gana that you have redo
    state: 'wait',
    eligibleNewCard: true, // if you get a new card, in the next run
    newCard: -1,
    time: 0,
    timer: undefined,
    errors: 0,
    inarow: 0,
    timebonus: 0,
    score: 0,
    highscore: 0,
    hiragana: [
      // ∅
      { gana: 'あ', roman: 'a', cor: -1 },
      { gana: 'い', roman: 'i', cor: -1 },
      { gana: 'う', roman: 'u', cor: -1 },
      { gana: 'え', roman: 'e', cor: -1 },
      { gana: 'お', roman: 'o', cor: -1 },
      // k
      { gana: 'か', roman: 'ka', cor: -1 },
      { gana: 'き', roman: 'ki', cor: -1 },
      { gana: 'く', roman: 'ku', cor: -1 },
      { gana: 'け', roman: 'ke', cor: -1 },
      { gana: 'こ', roman: 'ko', cor: -1 },
      // s
      { gana: 'さ', roman: 'sa', cor: -1 },
      { gana: 'し', roman: 'shi', cor: -1 },
      { gana: 'す', roman: 'su', cor: -1 },
      { gana: 'せ', roman: 'se', cor: -1 },
      { gana: 'そ', roman: 'so', cor: -1 },
      // t
      { gana: 'た', roman: 'ta', cor: -1 },
      { gana: 'ち', roman: 'chi', cor: -1 },
      { gana: 'つ', roman: 'tsu', cor: -1 },
      { gana: 'て', roman: 'te', cor: -1 },
      { gana: 'と', roman: 'to', cor: -1 },
      // n
      { gana: 'な', roman: 'na', cor: -1 },
      { gana: 'に', roman: 'ni', cor: -1 },
      { gana: 'ぬ', roman: 'nu', cor: -1 },
      { gana: 'ね', roman: 'ne', cor: -1 },
      { gana: 'の', roman: 'no', cor: -1 },
      // h
      { gana: 'は', roman: 'ha', cor: -1 },
      { gana: 'ひ', roman: 'hi', cor: -1 },
      { gana: 'ふ', roman: 'fu', cor: -1 },
      { gana: 'へ', roman: 'he', cor: -1 },
      { gana: 'ほ', roman: 'ho', cor: -1 },
      // m
      { gana: 'ま', roman: 'ma', cor: -1 },
      { gana: 'み', roman: 'mi', cor: -1 },
      { gana: 'む', roman: 'mu', cor: -1 },
      { gana: 'め', roman: 'me', cor: -1 },
      { gana: 'も', roman: 'mo', cor: -1 },
      // y
      { gana: 'や', roman: 'ya', cor: -1 },
      { gana: 'ゆ', roman: 'yu', cor: -1 },
      { gana: 'よ', roman: 'yo', cor: -1 },
      // r
      { gana: 'ら', roman: 'ra', cor: -1 },
      { gana: 'り', roman: 'ri', cor: -1 },
      { gana: 'る', roman: 'ru', cor: -1 },
      { gana: 'れ', roman: 're', cor: -1 },
      { gana: 'ろ', roman: 'ro', cor: -1 },
      // w
      { gana: 'わ', roman: 'wa', cor: -1 },
      { gana: 'を', roman: 'wo', cor: -1 },
      { gana: 'ん', roman: 'n', cor: -1 },
      // g
      { gana: 'が', roman: 'ga', cor: -1 },
      { gana: 'ぎ', roman: 'gi', cor: -1 },
      { gana: 'ぐ', roman: 'ku', cor: -1 },
      { gana: 'げ', roman: 'ke', cor: -1 },
      { gana: 'ご', roman: 'ko', cor: -1 },
      // z
      { gana: 'ざ', roman: 'za', cor: -1 },
      { gana: 'じ', roman: 'ji', cor: -1 },
      { gana: 'ず', roman: 'zu', cor: -1 },
      { gana: 'ぜ', roman: 'ze', cor: -1 },
      { gana: 'ぞ', roman: 'zo', cor: -1 },
      // d
      { gana: 'だ', roman: 'da', cor: -1 },
      { gana: 'ぢ', roman: 'dji', cor: -1 },
      { gana: 'づ', roman: 'dzu', cor: -1 },
      { gana: 'で', roman: 'de', cor: -1 },
      { gana: 'ど', roman: 'do', cor: -1 },
      // b
      { gana: 'ば', roman: 'ba', cor: -1 },
      { gana: 'び', roman: 'bi', cor: -1 },
      { gana: 'ぶ', roman: 'bu', cor: -1 },
      { gana: 'べ', roman: 'be', cor: -1 },
      { gana: 'ぼ', roman: 'bo', cor: -1 },
      // p
      { gana: 'ぱ', roman: 'pa', cor: -1 },
      { gana: 'ぴ', roman: 'pi', cor: -1 },
      { gana: 'ぷ', roman: 'pu', cor: -1 },
      { gana: 'ぺ', roman: 'pe', cor: -1 },
      { gana: 'ぽ', roman: 'po', cor: -1 }
    ]
  },
  computed: {
    progress: function () {
      // returns how far I am in precent (kinda unused)
      return (this.hiragana.length - this.order.length - this.reserve.length) / this.hiragana.length
    }
  },
  methods: {
    shuffle (array) {
      return array.sort(() => Math.random() - 0.5)
    },
    prepCards () {
      // reset ganas
      this.fullorder = []
      this.order = []
      this.reserve = []
      for (let i = 0; i < this.hiragana.length; i++) {
        if (this.hiragana[i].cor >= 0) {
          this.order.push(i)
        }
      }
      // reshuffle ganas
      this.order = this.shuffle(this.order)
      this.fullorder = JSON.parse(JSON.stringify(this.order))
    },
    introduceNewCard () {
      for (var i = 0; i < this.hiragana.length; i++) {
        if (this.hiragana[i].cor === -1) {
          this.hiragana[i].cor = 0
          this.newCard = i
          this.eligibleNewCard = false
          localStorage.setItem("eligibleNewCard", this.eligibleNewCard)
          break
        }
      }

      this.state = 'new'
      this.prepCards()
    },
    start (newCard) {
      // reset score, time and answer
      this.time = 0
      this.inarow = 0
      this.errors = 0
      this.score = 0
      this.answer = ''
      // reset newCard state
      if (newCard) {
        this.newCard = -1
      } else {
        // reset ganas
        this.prepCards()
      }
      // set state and start timer
      this.state = 'running'
      this.startTimer()
    },
    submit () {
      let temp = undefined
      if (this.answer.trim() === this.hiragana[this.order[0]].roman) {
        // if answer is correct, remove gana from list
        // this.hiragana[this.order[0]].cor++
        this.order.shift()
        // ... and increase "in a row"
        this.inarow++
      } else {
        // if not, then move gana to the reserve
        temp = this.order.shift()
        this.reserve.push(temp)
        // and reset "in a row" and increase errors
        this.inarow = 0
        this.errors++
      }

      if (this.order.length === 0 && this.reserve.length === 0) {
        // this is the end of the round
        this.state = 'done'
        clearInterval(this.timer)
        let basescore = this.fullorder.length * 100
        let streak = this.inarow * 100
        let errors = this.errors * 100
        let avgTime = this.time/1000/this.fullorder.length
        if (avgTime < 1) this.timebonus = 1 - avgTime
        else this.timebonus = 0
        this.score = Math.round((basescore + streak - errors) * (1 + this.timebonus))
        if (this.score > this.highscore) this.highscore = this.score
        if (this.errors == 0) {
          this.eligibleNewCard = true
          localStorage.setItem("eligibleNewCard", this.eligibleNewCard)
        }
        localStorage.setItem("highscore", this.highscore)
        localStorage.setItem("hiragana", JSON.stringify(this.hiragana))
        this.timer = undefined
      } else if (this.order.length === 0 && this.reserve.length > 0) {
        this.order = JSON.parse(JSON.stringify(this.shuffle(this.reserve)))
        this.reserve = []
      }

      this.answer = ''
    },
    getCardStyle (c, fullIndex, orderIndex) {
      let deg = 0
      let top = 72 + (orderIndex * 8)
      let x = 0
      let y = 0
      let op = 1 - (orderIndex/5)//this.fullorder.length)
      let z = 1 + this.order.length - orderIndex
      if (!this.order.includes(c) && !this.reserve.includes(c)) {
        // if correct
        x = -256 + (c * 512/(this.fullorder.length-1))
        y = -300 + (fullIndex * 50/this.fullorder.length)
        deg = x/256*10
        op = 0
        z = 1 + fullIndex
        if (this.fullorder.length==1) z = 0
      } else if (this.reserve.includes(c)) {
        // if in reserve
        x = 128 - (c * 256/(this.fullorder.length-1))
        y = 512 + (fullIndex * 50/this.fullorder.length)
        deg = x/256*10
        op = 1
        z = this.reserve.length - orderIndex
      }
      return {
        top: top + 'px',
        transform: 'rotate('+deg+'deg) translate('+x+'px, '+y+'px)',
        opacity: op,
        zIndex: z
      }
    },
    getInputStyle () {
      let op = 1
      let pointer = 'auto';
      if (this.order.length == 0 && this.reserve.length == 0) {
        op = 0
        pointer = 'none';
      }
      return {
        zIndex: this.hiragana.length + 1,
        opacity: op,
        pointerEvents: pointer
      }
    },
    count (interval) {
      // count milliseconds in given interval
      this.time += interval
      // also autofocus to input
      if (document.activeElement !== document.getElementById("input"))
        document.getElementById("input").focus()
    },
    startTimer () {
      // fire function every interval
      if(this.timer === undefined) {
        this.timer = setInterval(() => this.count(100), 100)
      }
    },
    deleteAllProgress () {
      let r = confirm("Are you sure about that?")
      if (r == true) {
        localStorage.clear()
        location.reload(true)
      }
    }
  },
  mounted () {
    // retrieve gang progress and high score from localstorage
    if (localStorage.getItem("hiragana") !== null && localStorage.getItem("hiragana") !== undefined) {
      this.hiragana = JSON.parse(localStorage.getItem("hiragana"))
    }
    if (localStorage.getItem("highscore") !== null && localStorage.getItem("hiragana") !== undefined) {
      this.highscore = localStorage.getItem("highscore")
    }
    if (localStorage.getItem("eligibleNewCard") !== null && localStorage.getItem("eligibleNewCard") !== undefined) {
      this.eligibleNewCard = localStorage.getItem("eligibleNewCard")
    }
    // prepCards
    this.prepCards()
  }
})