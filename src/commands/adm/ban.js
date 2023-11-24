const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banir um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('⛔ Usuário a ser banido')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });
        }

        const user = interaction.options.getUser('usuário');
        const reason = interaction.options.getString('motivo') || 'Sem motivo fornecido';

        try {
            await interaction.guild.members.ban(user, { reason });

            const banMessage = `**${user.tag}** foi banido!\nMotivo: ${reason}`;

            await interaction.reply({ content: banMessage, ephemeral: true });
        } catch (error) {
            console.error(`ops, erro ao banir o usuário ${user.tag}:`, error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao executar esse comando.', ephemeral: true });  
        }
    },
};