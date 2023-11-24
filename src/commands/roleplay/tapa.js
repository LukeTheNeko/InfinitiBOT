const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tapa')
    .setDescription('🤚 Dê um tapa em alguém')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Usuário a ser alvo do tapa')
        .setRequired(true)
    ),
    
  async execute(interaction) {
    const user = interaction.options.getUser('alvo');
    const sender = interaction.user;

    await interaction.reply(`${sender.toString()} deu um tapa em ${user.toString()}! 👋`);
  },
};