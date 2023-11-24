const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const roles = require('../../config/roles.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notificação')
    .setDescription('Lista de Notificações'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ Você não possui permissão para utilizar este comando.',
        ephemeral: true
      });
    }

    const options = [
      {
        label: '・ Notificações',
        value: 'Notification',
        emoji: '📢',
      },
      {
        label: '・ Sorteios',
        value: 'Sorteios',
        emoji: '🎁',
      },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('cargoSelect')
      .setPlaceholder('Selecione uma ou mais opções')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setColor('#00008b')
      .setTitle('Selecione as Notificações')
      .setFooter({ text: 'Notz', iconURL: 'https://i.imgur.com/JOvo9D7.png' })
      .setTimestamp()
      .setDescription(`

Selecione as Notifiçaoes que deseja ativar/desativar do servidor \n\n
<@&${roles.NotificaID}> Você vai receber todas notificações do servidor \n     
<@&${roles.SorteiosID}> Você vai receber notificações quando um jogo ficar de graça 
`);

    await interaction.channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: 'Embed enviado!', ephemeral: true });
  },
};