const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Desmutar um usuário.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Selecione o usuário a ser desmutado.')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.MuteMembers)) {
      return interaction.reply({
        content: '❌ Você não possui permissão para utilizar este comando.',
        ephemeral: true
      });
    }

    const targetUser = interaction.options.getUser('usuario');

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      const targetMember = guild.members.cache.get(targetUser.id);

      if (!targetMember) {
        return interaction.editReply("Ops, esse usuário não existe neste servidor.");
      }

      if (!targetMember.timeout) {
        return interaction.editReply("Esse usuário não está mutado.");
      }

      await targetMember.timeout(5000);

      return interaction.editReply(`${targetUser.tag} foi desmutado.`);
    } catch (error) {
      console.log(`Houve um erro ao desmutar o usuário: ${error}`);
      return interaction.editReply('Houve um erro ao desmutar o usuário.', { ephemeral: true });
    }
  },
};