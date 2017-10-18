function playSound (e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`)
  if (!audio) return
  audio.currentTime = 0 // rewind to start so we can spam keys
  audio.play()
  key.classList.add('playing')
};

function removeTransition (e) {
  if (e.propertyName !== 'transform') return
  this.classList.remove('playing')
}

const keys = document.querySelectorAll('.key')
keys.forEach(key => key.addEventListener('transitionend', removeTransition))

window.addEventListener('keydown', playSound)

// secretCode
let pressed = []
const secretEffects = new Map()
  .set('trumpmeup', () => playMusic('trump'))
  .set('aesthetic', () => playMusic('vaporwave'))
  .set('bitesthedust', () => playMusic('kira'))
  .set('normiesgetout', () => playMusic('reee'))
  .set('shutthefuckup', () => stopMusic())
const longestCodeLength = [...secretEffects.keys()].reduce((a, b) => a.length > b.length ? a : b).length

function secretController (inputs) {
  for (let [key, value] of secretEffects) {
    if (inputs.includes(key)) {
      value()
      pressed = []
    }
  }
}

window.addEventListener('keyup', (e) => {
  pressed.push(e.key)
  pressed.splice(-longestCodeLength - 1, pressed.length - longestCodeLength)
  secretController(pressed.join(''))
})

function playMusic (id) {
  document.querySelector(`#${id}`).play()
}

function stopMusic () {
  Array.from(document.querySelectorAll('audio')).forEach(audio => { audio.pause() })
}

console.log(`
T R U M P M E U P

A E S T H E T I C

B I T E S T H E D U S T

N O R M I E S G E T O U T

S H U T T H E F U C K U P
`)
