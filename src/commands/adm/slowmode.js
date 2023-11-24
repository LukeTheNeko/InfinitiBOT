const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('🐢 Define o modo lento em um canal')
    .addChannelOption((option) =>
      option.setName('canal').setDescription('Canal onde o modo lento será ativado').setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('tempo').setDescription('Tempo em segundos para o modo lento').setRequired(true)
    ),
    
  async execute(interaction) {
    if (!interaction.isCommand() || interaction.commandName !== 'slowmode') return;

    const { options } = interaction;
    const canal = options.getChannel('canal');
    const tempo = options.getInteger('tempo');

    if (!canal || tempo < 0 || tempo > 21600) {
      await interaction.reply('Por favor, forneça um canal válido e um tempo de modo lento entre 0 e 21600 segundos.');
      return;
    }

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
      await interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });
      return;
    }

    try {
      await canal.setRateLimitPerUser(tempo);
      await interaction.reply(`O modo lento foi definido para ${tempo} segundos no canal ${canal.toString()}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Ocorreu um erro ao definir o modo lento.');
    }
  },
};