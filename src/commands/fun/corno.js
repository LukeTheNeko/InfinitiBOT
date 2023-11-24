const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('corno')
    .setDescription('🐮 Descubra o nível de "corno." de alguém')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Usuário a ser verificado')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const nivelDeCorno = Math.floor(Math.random() * 101);

    let cor;
    if (nivelDeCorno <= 25) {
        cor = 0x008000;
    } else if (nivelDeCorno <= 75) {
        cor = 0xFFA500;
    } else {
        cor = 0xFF0000;
    }

    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
        .setColor(cor)
        .setTitle(`Nível de corno de ${user.tag}`)
        .setDescription(`O nível de corno de ${user.tag} é de **${nivelDeCorno}%**`)
        .setImage(avatarUrl)
        .setURL(avatarUrl)
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
},
};