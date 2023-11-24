const roles = require('../config/roles.json');
const channels = require('../config/channels.json');

module.exports = (member) => {
    const welcomeChannel = member.guild.channels.cache.get(channels.welcomeChannelID);
    const welcomeMessage = require('../utils/WelcomeEmbed.js')(member);

    if (!welcomeChannel || !welcomeMessage) {
        console.error('Canal de boas-vindas ou mensagem não encontrados');
        return;
    }

    welcomeChannel.send({ embeds: [welcomeMessage] })
        .then(() => {
            console.log('Mensagem de boas-vindas enviada com sucesso');
            const welcomeRole = member.guild.roles.cache.get(roles.MemberID);
            const notificaRole = member.guild.roles.cache.get(roles.NotificaID);

            if (!welcomeRole || !notificaRole) {
                console.error('Cargos de boas-vindas não encontrados');
                return;
            }

            member.roles.add([welcomeRole, notificaRole])
                .then(() => console.log(`Cargos atribuídos com sucesso para ${member.user.username}`))
                .catch(console.error);
        })
        .catch(console.error);
};