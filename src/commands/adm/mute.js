const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇Mutar um usuário.')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Selecione o usuário a ser mutado.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tempo')
        .setDescription('Escolha o tempo do mute.')
        .setRequired(true)
        .addChoices(
          {
            name: '1 Minuto',
            value: '1m'
          },
          {
            name: '5 Minutos',
            value: '5m'
          },
          {
            name: '10 Minutos',
            value: '10m'
          },
          {
            name: '30 Minutos',
            value: '30m'
          },
          {
            name: '1 Hora',
            value: '1h'
          },
          {
            name: '2 Hora',
            value: '2h'
          },
          {
            name: '5 Hora',
            value: '5h'
          },
          {
            name: '1 Dia',
            value: '1d'
          },
          {
            name: '1 Semana',
            value: '1w'
          },
          {
            name: '2 Semanas',
            value: '2w'
          },
          {
            name: '25 Dias',
            value: '25d'
          },
        )
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Escreva o motivo do mute.')
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.MuteMembers)) {
      return interaction.reply({
        content: '❌ Você não possui permissão para utilizar este comando.',
        ephemeral: true
      });
    }

    const targetUser = interaction.options.getUser('usuario');
    const duration = interaction.options.getString('tempo');
    const reason = interaction.options.getString('motivo') || 'Sem motivo mencionado';

    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const targetMember = guild.members.cache.get(targetUser.id);

    if (!targetMember) {
      return interaction.editReply("Ops, esse usuário não existe neste servidor.");
    }

    if (targetMember.user.bot) {
      return interaction.editReply("Não posso mutar um bot.");
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration) || msDuration < 5000 || msDuration > 2.419e9) {
      return interaction.editReply('Por favor, forneça uma duração de mute válida.');
    }

    const targetUserRolePosition = targetMember.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = guild.members.cache.get(interaction.client.user.id).roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      return interaction.editReply("Você não pode mutar esse usuário porque ele tem o mesmo ou um cargo mais alto que você.");
    }

    if (targetUserRolePosition >= botRolePosition) {
      return interaction.editReply("Não posso mutar esse usuário porque ele tem o mesmo ou um cargo mais alto que eu.");
    }

    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetMember.isCommunicationDisabled()) {
        await targetMember.timeout(msDuration, reason);
        return interaction.editReply(`${targetUser.tag}'s mute foi atualizado para ${prettyMs(msDuration, { verbose: true })}\nMotivo: ${reason}`);
      } else {
        await targetMember.timeout(msDuration, reason);
        return interaction.editReply(`${targetUser.tag} foi mutado por ${prettyMs(msDuration, { verbose: true })}.\nMotivo: ${reason}`);
      }
    } catch (error) {
      console.log(`Houve um erro ao aplicar o mute: ${error}`);
      return interaction.editReply('Houve um erro ao aplicar o mute.', { ephemeral: true });
    }
  },
};