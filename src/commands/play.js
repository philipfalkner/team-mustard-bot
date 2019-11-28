const fetch = require('node-fetch')
const moment = require('moment')
const { minecraftServerFunctionUri } = require('../../config.json')

module.exports = {
  name: 'play',
  usage: '[game name]',
  description: 'Start a Team Mustard game server.',
  async execute (logger, message, args) {
    const data = []
    let game = args[0] || ''

    switch (game.toLowerCase()) {
      case 'minecraft':
        try {
          await startMinecraft(logger, message)
        } catch (e) {
          logger.error(e)
          message.reply("Sorry, something went wrong starting Minecraft. :cry:")
        }
        return

      default:
        data.push("Here's a list of all the games I know:")
        data.push('minecraft')
        return message.author.send(data, { split: true })
    }
  }
}

async function startMinecraft (logger, message) {
  const startupTimeLimit = moment().add(5, 'minute')

  message.reply("I'm getting Minecraft ready for you!")

  const url = `${minecraftServerFunctionUri}?code=${process.env.MINECRAFT_SERVER_FUNCTION_CODE}`
  logger.info(`Sending request to start the Minecraft server (${url})...`)

  const functionStartResponse = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
  const functionStart = await functionStartResponse.json()

  logger.info('Waiting for Minecraft server to start...')
  while (moment().isBefore(startupTimeLimit)) {
    const functionStatusResponse = await fetch(functionStart.statusQueryGetUri, { headers: { 'Content-Type': 'application/json' } })
    const functionStatus = await functionStatusResponse.json()

    const serverData = functionStatus.customStatus
    const serverStatus = serverData && serverData.serverStatus
    logger.info(`Minecraft server status: ${serverStatus}`)

    switch (serverStatus) {
      case 'Running':
        message.reply(`Minecraft is ready! Connect to ${serverStatus}`)
        return

      case 'Stopping':
      case 'Stopped':
        throw new Error('Minecraft server unexpectedly stopped.')

      default:
        await sleep(5000)
    }
  }

  throw new Error('Minecraft server failed to start within time limit.')
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
