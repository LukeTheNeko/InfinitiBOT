const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcuuid')
    .setDescription('🟦 Exibe informações do jogador do Minecraft')
    .addStringOption((option) =>
      option.setName('usuario').setDescription('Usuário do Minecraft').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.isCommand() || interaction.commandName !== 'mcuuid') return;

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

      const profileResponse = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuidData.id}`);
      const profileData = profileResponse.data;

      if (!profileData || !profileData.properties || profileData.properties.length === 0) {
        await interaction.reply('Não foi possível obter as informações do jogador.');
        return;
      }

      const skinTexture = profileData.properties[0].value;
      const decodedTexture = Buffer.from(skinTexture, 'base64').toString('utf-8');
      const textureData = JSON.parse(decodedTexture);

      const skinURL = textureData.textures.SKIN.url;
      const headURL = `https://crafatar.com/renders/head/${uuidData.id}?overlay`;
      const bodyURL = `https://crafatar.com/renders/body/${uuidData.id}?overlay`;

      const embed = new EmbedBuilder()
        .setColor('#800080')
        .setTitle(`Usuário ${usuario}`)
        .setThumbnail(headURL)
        .setDescription(`Nick: ${usuario}\nUUID: ${uuidData.id}`)
        .setImage(bodyURL);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('Ocorreu um erro ao executar o comando.');
    }
  },
};