const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("🧹 Limpa o chat.")
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription("Número de mensagens a serem excluídas.")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const quantidade = interaction.options.getInteger("quantidade");

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)
    ) {
      return await interaction.editReply({
        content: "❌ Você não possui permissão para utilizar este comando.",
      });
    }

    if (quantidade <= 0 || quantidade > 100) {
      return await interaction.editReply({
        content:
          "A quantidade de mensagens a serem excluídas deve estar entre 1 e 100.",
      });
    }
    
    const messages = await interaction.channel.messages.fetch({
      limit: quantidade,
    });
    const messagesToDelete = messages.filter((message) => {
      const ageInDays =
        (Date.now() - message.createdTimestamp) / (1000 * 60 * 60 * 24);
      return ageInDays < 14;
    });

    await interaction.channel.bulkDelete(messagesToDelete);

    await interaction.editReply({
      content: `Foram excluídas ${messagesToDelete.size} mensagens.`,
    });
  },
};