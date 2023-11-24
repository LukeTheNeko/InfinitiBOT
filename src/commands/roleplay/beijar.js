const { SlashCommandBuilder } = require('@discordjs/builders');

const gifLinks = [
  'https://media.tenor.com/Ogp6c0W2ENsAAAAC/nakuru-narumi-nakuru.gif',
  'https://media.tenor.com/0LMxPQdFBKAAAAAC/nekopara-kiss.gif',
  'https://media.tenor.com/xmBO_gpkQasAAAAC/blandship-bland.gif'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beijar')
    .setDescription('😽 Dê um beijo em alguém')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Usuário a ser alvo do beijo')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('alvo');
    const sender = interaction.user;

    const randomIndex = Math.floor(Math.random() * gifLinks.length);
    const gifLink = gifLinks[randomIndex];

    await interaction.reply({ content: `${sender.toString()} deu um beijo em ${user.toString()}!`, files: [gifLink] });
  },
};