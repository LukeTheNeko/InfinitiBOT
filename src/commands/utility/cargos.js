const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cargos')
    .setDescription('Lista de Cargos'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });
    }

    const options = [
      {
        label: '・ CS2',
        value: 'CS2',
        emoji: {
          name: 'CSGO',
          id: '1131013867649122314',
        },
      },
      {
        label: '・ Minecraft',
        value: 'Minecraft',
        emoji: {
          name: 'MinecraftICON',
          id: '1131011458361204766',
        },
      },
      {
        label: '・ GTA V',
        value: 'GTAV',
        emoji: {
          name: 'gtav',
          id: '1131013773658947586',
        },
      },
      {
        label: '・ Valorant',
        value: 'Valorant',
        emoji: {
          name: 'Valorant',
          id: '1131006473825165414',
        },
      },
      {
        label: '・ Fortnite',
        value: 'Fortnite',
        emoji: {
          name: 'fortnite',
          id: '1125915315759480862',
        },
      },
      {
        label: '・ Forza',
        value: 'Forza',
        emoji: {
          name: 'forzaicon',
          id: '1131005200686133318',
        },
      },
      // Adicione mais opções conforme necessário
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('cargoSelect')
      .setPlaceholder('Selecione uma ou mais opções')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const embed = new EmbedBuilder()
      .setColor('#00008b')
      .setTitle('Selecione seus jogos favoritos')
      .setFooter({ text: 'Voxel', iconURL: 'https://i.imgur.com/JOvo9D7.png' })
      .setTimestamp()
      .setDescription(`Selecione os jogos que você atualmente joga para receber um cargo.\n
      Você receberá um cargo a cada jogo selecionado.\n
      `);

    await interaction.channel.send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: 'Embed enviado!', ephemeral: true });
  },
};