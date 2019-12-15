const fetch = require('fetch-retry')
const { mustardApiBaseUri } = require('../../config.json')

function colourStringToInt (colourString) {
  return parseInt(`0x${colourString.substr(1)}`)
}

module.exports = {
  name: 'mustard-day',
  description: 'Choose which day is Mustard Day!',
  async execute (logger, message) {
    logger.info('Fetching Mustard Day...')
    const { label, colour, info, img } = await fetch(
      `${mustardApiBaseUri}/days/actions/pick`,
      {
        method: 'POST',
        retries: 3,
        retryDelay: (attempt, error, response) => Math.pow(2, attempt) * 1000 // exponential backoff
      }
    ).then(response => response.json())
    logger.info(`Mustard Day is ${label}.`)

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
