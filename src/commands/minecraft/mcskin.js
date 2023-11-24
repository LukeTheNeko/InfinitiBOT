const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcskin')
    .setDescription('🟦 Exibe a skin completa do jogador do Minecraft')
    .addStringOption((option) =>
      option.setName('usuario').setDescription('Usuário do Minecraft').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.isCommand() || interaction.commandName !== 'mcskin') return;

    const { options } = interaction;
    const usuario = options.getString('usuario');

    if (!usuario) {
      await interaction.reply('Usuário não encontrado.');
      return;
    }

    try {
      const uuidResponse = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${usuario}`);
      const uuidData = uuidResponse.data;

      if (!uuidData || !uuidData.id) {
        await interaction.reply('Usuário do Minecraft não encontrado.');
        return;
      }

      const skinURL = `https://crafatar.com/renders/body/${uuidData.id}?overlay`;

      const embed = new EmbedBuilder()
        .setColor('#A020F0')
        .setTitle(`Skin de ${usuario}`)
        .setImage(skinURL);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('Ocorreu um erro ao executar o comando.');
    }
  },
};