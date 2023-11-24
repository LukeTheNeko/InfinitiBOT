const { SlashCommandBuilder } = require('@discordjs/builders');

const gifLinks = [
  'https://media.tenor.com/kCZjTqCKiggAAAAC/hug.gif',
  'https://media.tenor.com/5UwhB5xQSTEAAAAC/anime-hug.gif',
  'https://media.tenor.com/l0AcbwYY50sAAAAC/anime-hug.gif',
  'https://media.tenor.com/EdoDOOomnfkAAAAC/cat-girl-affection.gif'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('abraçar')
    .setDescription('🫂 Dê um abraço em alguém')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Usuário a ser alvo do abraço')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('alvo');
    const sender = interaction.user;

    const randomIndex = Math.floor(Math.random() * gifLinks.length);
    const gifLink = gifLinks[randomIndex];

    await interaction.reply({ content: `${sender.toString()} deu um abraço em ${user.toString()}!`, files: [gifLink] });
  },
};