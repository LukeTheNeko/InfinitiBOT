const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('🔒 tranca um canal de texto')
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Qual canal de texto deseja trancar?')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });
        }

        const canal = interaction.options.getChannel('canal');

        try {
            await canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
            const embed = new Discord.EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('Canal Trancado')
                .setDescription('🔐 Este canal foi trancado!');

            interaction.reply({ content: `🔐 O canal de texto ${canal} foi trancado!`, ephemeral: true });
            await canal.send({ embeds: [embed] });
        } catch (e) {
            interaction.reply({ content: '❌ Ops, algo deu errado.', ephemeral: true });
        }
    },
};