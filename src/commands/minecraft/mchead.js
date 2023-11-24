const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mchead')
    .setDescription('🟦 Exibe a cabeça do jogador do Minecraft')
    .addStringOption((option) =>
      option.setName('usuario').setDescription('Usuário do Minecraft').setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.isCommand() || interaction.commandName !== 'mchead') return;

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
        await interaction.reply('Não foi possível obter a cabeça do jogador.');
        return;
      }

      const skinTexture = profileData.properties[0].value;
      const decodedTexture = Buffer.from(skinTexture, 'base64').toString('utf-8');
      const textureData = JSON.parse(decodedTexture);

      const headURL = textureData.textures.SKIN.url;

      const headImageResponse = await axios.get(`https://crafatar.com/avatars/${uuidData.id}`, {
        headers: { 'User-Agent': 'DiscordBot' },
        responseType: 'arraybuffer'
      });
      const headImageDataBuffer = Buffer.from(headImageResponse.data, 'binary');

      await interaction.reply({
        files: [new AttachmentBuilder(headImageDataBuffer, 'head.png')],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply('Ocorreu um erro ao executar o comando.');
    }
  },
};