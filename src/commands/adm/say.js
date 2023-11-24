const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

function processarDescricao(mensagem) {
    return mensagem.replace(/\\n/g, '\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('📃 Faz o bot falar qualquer coisa')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem que o bot deve falar')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Você não possui permissão para utilizar este comando.',
                ephemeral: true
            });
        }

        const mensagem = interaction.options.getString('mensagem');
        const mensagemProcessada = processarDescricao(mensagem);

        await interaction.channel.send(mensagemProcessada);

        await interaction.reply({
            content: 'Mensagem enviada!',
            ephemeral: true
        });
    },
};