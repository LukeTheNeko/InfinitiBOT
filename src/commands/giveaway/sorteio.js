const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const roles = require('../../config/roles.json');
const Discord = require("discord.js");

function processarDescricao(descricao) {
    return descricao.replace(/\\n/g, '\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sorteio')
        .setDescription('🎁 Crie um sorteio no servidor')
        .addStringOption(option =>
            option.setName('prêmios')
                .setDescription('Prêmios separados por vírgula (ex: "Prêmio 1, Prêmio 2")')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('descrição')
                .setDescription('Descreva o que será sorteado. Use "\\n" para pular uma linha.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('tempo')
                .setDescription('Digite o tempo do sorteio em minutos.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('quantidade_vencedores')
                .setDescription('Quantidade de vencedores a serem escolhidos.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('cor')
                .setDescription('Escolha a cor do embed (formato hexadecimal #FF0000 = Vermelho)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('imagem')
                .setDescription('A imagem do sorteio')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('notificar')
                .setDescription('Notificar o cargo específico')
                .setRequired(false)
        ),

        async execute(interaction) {
            try {
                if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
                    return interaction.reply({
                        content: '❌ Você não possui permissão para utilizar este comando.',
                        ephemeral: true
                    });
                }
        
                const premios = interaction.options.getString('prêmios').split(',').map(s => s.trim());
                const quantidadeVencedores = interaction.options.getInteger('quantidade_vencedores');
        
                if (premios.length < quantidadeVencedores) {
                    return interaction.reply('A quantidade de prêmios deve ser maior ou igual à quantidade de vencedores.');
                }
        
                const tempo = interaction.options.getInteger('tempo');
                const descricao = interaction.options.getString('descrição');
                const descricaoProcessada = processarDescricao(descricao); // Processar a descrição
                const img = interaction.options.getString('imagem');
        
                const cor = interaction.options.getString('cor');
                if (cor && !/^#[0-9A-F]{6}$/i.test(cor)) {
                    return interaction.reply('O código HEX da cor fornecido é inválido. Certifique-se de usar um formato válido, como #5a32a8.');
                }
        
                const duracao = tempo * 60 * 1000;
        
                const notificarOption = interaction.options.getBoolean('notificar');
                const notificar = notificarOption !== null ? notificarOption : false;
        
                if (notificar) {
                    const notificarRole = interaction.guild.roles.cache.get(roles.SorteiosID);
                    if (notificarRole) {
                        await interaction.channel.send(notificarRole.toString());
                    } else {
                        return interaction.reply('O cargo de notificação não foi encontrado.');
                    }
                }
        
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('botaosorteio')
                            .setLabel('Participar')
                            .setStyle('2')
                            .setEmoji('🎉')
                    );
        
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: 'Novo sorteio!',
                        iconURL: interaction.guild.iconURL({ dynamic: true })
                    })
                    .setThumbnail(img ? img : interaction.guild.iconURL({ dynamic: true }))
                    .setDescription(`\nPrêmios: **${premios.join(', ')}**\n\n > ${descricaoProcessada}\n\nTempo: \`${tempo} minutos\`\nClique no botão para participar.\n**Boa sorte!!!**`)
                    .setFooter({ text: 'Data do sorteio:' })
                    .setColor(cor || '#993399')
                    .setTimestamp(Date.now() + duracao);
        
                const msg = await interaction.channel.send({ embeds: [embed], components: [button] });
        
                await interaction.reply({
                    content: 'Embed enviado!',
                    ephemeral: true
                });
        
                const coletor = msg.createMessageComponentCollector({ time: duracao });
        
                coletor.on('end', () => {
                    if (click.length === 0) {
                        return interaction.followUp({ content: `**SORTEIO CANCELADO!**\nNão houve participantes no sorteio.`, ephemeral: true });
                    }
        
                    if (click.length < quantidadeVencedores) {
                        return interaction.followUp({ content: `**SORTEIO CANCELADO!**\nNão há participantes suficientes para escolher ${quantidadeVencedores} vencedores.`, ephemeral: true });
                    }
        
                    const vencedores = [];
                    for (let i = 0; i < quantidadeVencedores; i++) {
                        const randomIndex = Math.floor(Math.random() * click.length);
                        const ganhador = click.splice(randomIndex, 1)[0];
                        vencedores.push(ganhador);
                    }
        
                    let premiosAtribuidos = '';
                    if (quantidadeVencedores === 1) {
                        premiosAtribuidos = `Parabéns <@${vencedores[0]}>, você ganhou o seguinte prêmio: **${premios[0]}**`;
                    } else {
                        const vencedoresMencionados = vencedores.map(id => `<@${id}>`).join(', ');
                        premiosAtribuidos = `${vencedoresMencionados} ganharam os seguintes prêmios:\n\n${vencedores.map((id, index) => `${vencedoresMencionados.split(', ')[index]} Ganhou um(a): **${premios[index]}**`).join('\n')}`;
                    }
        
                    interaction.followUp(premiosAtribuidos);
        
                    const winnerEmbed = new EmbedBuilder()
                        .setTitle('VENCEDOR(ES) E PRÊMIO(S)')
                        .setDescription(`Os vencedores e prêmios foram:\n\n${premiosAtribuidos}`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setColor('#ff0000')
                        .setFooter({ text: 'Sorteio finalizado' });
        
                    msg.edit({ embeds: [winnerEmbed], components: [] });
                });
        
                const click = [];
        
                coletor.on('collect', (i) => {
                    if (i.customId === 'botaosorteio') {
                        if (click.includes(i.user.id)) {
                            i.reply({ content: `Olá ${i.user.username}, você já está participando do sorteio.`, ephemeral: true });
                        } else {
                            click.push(i.user.id);
                            i.reply({ content: `Olá ${i.user.username}, você entrou no sorteio.`, ephemeral: true });
                        }
                    }
                });
            } catch (e) {
                interaction.reply({ content: e.message, ephemeral: true });
            }
        }
};