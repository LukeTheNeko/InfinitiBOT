const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const roles = require('../../config/roles.json');
const Discord = require("discord.js")

function processarDescricao(descricao) {
    return descricao.replace(/\\n/g, '\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayembed')
        .setDescription('📃 Cria uma mensagem em embed')
        .addStringOption(option =>
            option.setName('titulo')
                .setDescription('O título do embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descricao')
                .setDescription('A descrição do embed com quebras de linha (use \n para quebra de linha)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('O código HEX da cor do embed')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('notificar')
                .setDescription('Notificar o cargo específico')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('A thumbnail do anúncio')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('imagem')
                .setDescription('A imagem do anúncio')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ Você não possui permissão para utilizar este comando.', ephemeral: true });
        }

        const cor = interaction.options.getString('cor');
        if (cor && !/^#[0-9A-F]{6}$/i.test(cor)) {
            return interaction.reply('O código HEX da cor fornecido é inválido. Certifique-se de usar um formato válido, como #5a32a8.');
        }

        const titulo = interaction.options.getString('titulo');
        const descricao = interaction.options.getString('descricao');
        const thumbnail = interaction.options.getString('thumbnail');
        const imagem = interaction.options.getString('imagem');
        const descricaoProcessada = processarDescricao(descricao);
        const notificar = interaction.options.getBoolean('notificar') ?? roles.NotificaID;

        if (notificar) {
            const notificarRole = interaction.guild.roles.cache.get(roles.NotificaID);
            if (!notificarRole) {
                return interaction.reply('O cargo de notificação não foi encontrado.');
            }
            await interaction.channel.send(notificarRole.toString());
        }

        const embed = new EmbedBuilder()
            .setColor(cor || '#993399')
            .setTitle(titulo)
            .setDescription(descricaoProcessada)
            .setTimestamp(Date.now())
            .setThumbnail(thumbnail)
            .setImage(imagem);

        await interaction.channel.send({ embeds: [embed] });

        await interaction.reply({ content: 'Embed enviado!', ephemeral: true });
    },
};