const { SlashCommandBuilder, User } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meuid')
    .setDescription('🔣 verifica seu id'),
    
  async execute(interaction, user) {

    const userId = interaction.user.id;

    await interaction.reply(`Seu id é ${userId}`);
  },
};