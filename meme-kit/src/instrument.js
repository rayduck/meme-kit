import React from 'react'

const Instrument = ({keyCode, instrumentName, playing}) => {
  const componentClasses = ['key']
  if (playing) componentClasses.push('playing')

  return (
    <div id={keyCode} className={componentClasses.join(' ')} >
      <kbd>{String.fromCharCode(keyCode)}</kbd>
      <span className="sound">{instrumentName}</span>
    </div>
  )

}

export default Instrument