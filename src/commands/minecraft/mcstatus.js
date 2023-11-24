const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcstatus')
    .setDescription('🟦 Verifica um servidor de Minecraft')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('IP do servidor')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ip = interaction.options.getString('ip');
    const link = `https://api.mcstatus.io/v2/widget/java/${ip}`;
    
    await interaction.reply(`${link}`);
  },
};