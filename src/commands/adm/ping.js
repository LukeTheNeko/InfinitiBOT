const Discord = require("discord.js")

module.exports = {
    data: {
        name: 'ping',
        description: 'Mostra o ping do bot.',
    },
    async execute(interaction) {
        const client = interaction.client;
        const user = interaction.user;

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            console.log('This member can ping');
            return interaction.reply({
                content: '❌ Você não possui permissão para utilizar este comando.',
                ephemeral: true
            });
        }

        if (user.id === interaction.member.user.id) {
            const ping = client.ws.ping;
            await interaction.reply({ content: `Ping do bot: ${ping}ms`, ephemeral: true });
        }
    },
};