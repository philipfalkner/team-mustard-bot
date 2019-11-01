const fetch = require('node-fetch')
const { mustardApiBaseUri } = require('../../config.json')

function colourStringToInt (colourString) {
  return parseInt(`0x${colourString.substr(1)}`)
}

module.exports = {
  name: 'mustard-day',
  description: 'Choose which day is Mustard Day!',
  async execute(logger, message) {
    const { label, colour, info, img } = await fetch(`${mustardApiBaseUri}/days/actions/pick`, { method: 'POST' }).then(response => response.json())

    const embed = {
      color: colourStringToInt(colour),
      title: `Mustard Day is ${label}!`,
      description: info,
      image: {
        url: img
      },
      timestamp: new Date()
    }

    message.channel.send({ embed: embed })
  }
}
