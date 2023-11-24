const { SlashCommandBuilder } = require('@discordjs/builders');

const morseCodeMap = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
    '/': ' ',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decodificamorse')
        .setDescription('⭐ Decodificar uma mensagem em código Morse')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem a ser decodificada')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        const mensagemCodificada = interaction.options.getString('mensagem').trim().split(' ');

        const mensagemDecodificada = mensagemCodificada
            .map(code => morseCodeMap[code] || code)
            .join('');

        await interaction.reply(`Mensagem decodificada: \n\n${mensagemDecodificada}`);
    },
};