const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('useravatar')
    .setDescription('👤 Exibe o avatar do usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário do qual você deseja ver o avatar')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
        .setColor('#b434eb')
        .setTitle(`Avatar de ${user.tag}`)
        .setImage(avatarUrl)
        .setURL(avatarUrl)
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
},
};