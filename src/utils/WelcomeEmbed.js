const { EmbedBuilder } = require('discord.js');
const channels = require('../config/channels.json');

module.exports = function (member) {
    const welcomeEmbed = new EmbedBuilder()
        .setColor('#7604c7')
        .setTitle(`Bem-vindo(a), ${member.user.tag}!`)
        .setTimestamp(Date.now())
        .setThumbnail(member.user.displayAvatarURL())
        .setFooter({ text: 'by LukeTheNeko', iconURL: 'https://i.imgur.com/JOvo9D7.png' })
        /*
        .setImage('IMG LINK')
        */
        .setDescription(`Olá <@${member.user.id}>, você acabou de entrar em nosso Servidor. 
Você poderá conversar com a galera da Comunidade, fazer novas amizades.

Por padrão as notificações de atualização do Servidor e do Canal no YouTube/Twitch é 
**ATIVADO**, se você **NÃO** quiser receber notificação, desative na sala: <#${channels.notificaChannelID}>.

**Minhas Redes**
📺 [Canal no YouTube](https://www.youtube.com/)
💻 [Loja](https://twitter.com/)
🐦 [Twitter](https://twitch.tv/)
📷 [Instagram](https://www.instagram.com/)
`);

    member.guild.channels.cache.get(channels.welcomeChannelID).send(`<@${member.user.id}>`, welcomeEmbed);

    return welcomeEmbed;
};