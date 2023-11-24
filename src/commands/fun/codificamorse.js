const { SlashCommandBuilder } = require('@discordjs/builders');
const diacritics = require('diacritics');

const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    ' ': '/',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('codificamorse')
        .setDescription('🌟 Codificar uma mensagem em código Morse')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem a ser codificada')
                .setRequired(true)
        ),
        
    async execute(interaction) {
        const mensagemOriginal = interaction.options.getString('mensagem').toUpperCase();

        const mensagemSemAcentos = diacritics.remove(mensagemOriginal);

        const mensagemCodificada = mensagemSemAcentos
            .split('')
            .map(char => morseCodeMap[char] || char)
            .join(' ');

        await interaction.reply(`Mensagem código Morse convertida: \n\n ${mensagemCodificada}`);
    },
};