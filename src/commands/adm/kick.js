const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('⭕ Expulsa um usuário ou bot do servidor')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('O usuário ou bot que será expulso')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userToKick = interaction.options.getMember('usuario');

    if (!userToKick || userToKick.id === interaction.user.id) {
      return interaction.reply({ content: 'Ei, você não pode expulsar a si mesmo.',  ephemeral: true });
    }

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });  
    }

    try {
      await userToKick.kick('Motivo da expulsão');
      interaction.reply({ content: `Usuário ${userToKick.user.tag} foi expulso com sucesso.`, ephemeral: true });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Ocorreu um erro ao tentar expulsar o usuário ou bot.', ephemeral: true });            
    }
  },
};