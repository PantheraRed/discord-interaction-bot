module.exports = {
  name: 'ping',
  description: 'Returns latency ping',
  async execute(interaction) {
    await interaction.reply(`🏓 **Pong** ${interaction.client.ws.ping}ms!`);
  }
};
