const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('🔣 View server icon or banner.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('icon')
        .setDescription('View the server icon.')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('banner')
        .setDescription('View the server banner.')
    ),
    
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "icon": {
        const iconUrl = interaction.guild.iconURL({ size: 4096 });

        if (iconUrl) {
          const embed = new EmbedBuilder()
            .setColor('#b434eb')
            .setTitle(`Server Icon - ${interaction.guild.name}`)
            .setImage(iconUrl)
            .setURL(iconUrl)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply(`Esse servidor: ${interaction.guild.name} não tem um icon.`);
        }
        break;
      }
      case "banner": {
        const bannerUrl = interaction.guild.bannerURL({ size: 512 });

        if (bannerUrl) {
          const embed = new EmbedBuilder()
            .setColor('#b434eb')
            .setTitle(`Server Banner - ${interaction.guild.name}`)
            .setImage(bannerUrl)
            .setURL(bannerUrl)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply(`Esse servidor: ${interaction.guild.name} não tem um banner.`);
        }
        break;
      }
      default:
        break;
    }
  },
};