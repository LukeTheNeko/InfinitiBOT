const fs = require('fs');
const path = require('path');

const commandMap = new Map();

const registerCommandsInFolder = (folder) => {
    const commandFiles = fs.readdirSync(path.join(__dirname, `../commands/${folder}`)).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(__dirname, `../commands/${folder}/${file}`));
        commandMap.set(command.data.name, command);
    }
}

module.exports = {
    handleInteractionCreate: async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = commandMap.get(interaction.commandName);
        if (!command) {
            console.error(`Comando não encontrado: ${interaction.commandName}`);
            await interaction.reply({ content: '❌ Ops, esse comando não foi encontrado!', ephemeral: true });
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Erro ao executar o comando ${interaction.commandName}:`, error);
            await interaction.reply({ content: '❌ Houve um erro ao executar esse comando!', ephemeral: true });
        }
    },
    createCommands: async (client) => {
        try {
            const commands = await client.application.commands.fetch();
            for (const command of commands.values()) {
                await command.delete();
            }
            console.log('🔴 Slash commands unregistered!');
        } catch (error) {
            console.error('❌ Erro ao excluir os comandos de barra:', error);
        }

        const commandFolders = fs.readdirSync(path.join(__dirname, '../commands'));

        for (const folder of commandFolders) {
            registerCommandsInFolder(folder);
        }

        for (const [, command] of commandMap) {
            await client.application.commands.create(command.data);
        }

        console.log('🔵 Slash commands registered!');
        console.log('🟢 Working!');
    }
};