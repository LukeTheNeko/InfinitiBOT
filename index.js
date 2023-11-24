require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client({ intents: 3276799 });
const guildMemberAdd = require('./src/events/guildMemberAdd');
const ready = require('./src/events/ready');
const cargosAdd = require('./src/events/cargosadd');
const createCommands = require('./src/events/createcommands');
const token = process.env.DISCORD_TOKEN;

ready(client);

client.on('guildMemberAdd', guildMemberAdd);

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(client, interaction);
  }
);

async function handleInteraction(client, interaction) {
  await cargosAdd.execute(interaction);
  createCommands.handleInteractionCreate(interaction);
}

client.login(token);
