const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('🌐 Desbanir um usuário')
        .addStringOption(option =>
            option.setName('usuário')
                .setDescription('ID do usuário a ser desbanido')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({
                content: '❌ Você não possui permissão para utilizar este comando.',
                ephemeral: true
            });
        }

        const userId = interaction.options.getString('usuário');

        try {
            await interaction.guild.bans.remove(userId);

            await interaction.reply({
                content: `Usuário com ID ${userId} foi desbanido.`,
                ephemeral: true
            });
        } catch (error) {
            console.error(`Erro ao desbanir o usuário com ID ${userId}:`, error);
            await interaction.reply({ content: 'Ocorreu um erro ao executar esse comando.', ephemeral: true });
        }
    },
};