module.exports = {
  name: 'beep',
  description: 'Beep!',
  execute (logger, message) {
    // └[∵┌] └[ ∵ ]┘ [┐∵]┘
    return message.reply('Boop.')
  }
}
