const { Client, Collection } = require('discord.js');
const { clientId, guildId } = require('../botconfig');
const { walkdir } = require('./utils/index');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');
const { resolve } = require('path');

require('dotenv').config();
const { DISCORD_TOKEN } = process.env;

const client = new Client({ intents: 513 });
client.commands = new Collection;

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    for await (const path of walkdir('src/commands')) {
      const command = require(resolve(path));
      client.commands.set(command.name, command);
      console.log(`Loaded "${command.name}" command`);
    }

    for await (const path of walkdir('src/events')) {
      const event = require(resolve(path));
      client[!event.once ? 'on' : 'once'](event.name, event.listener);
      console.log(`Loaded "${event.name}" event`);
    }

    console.log('Started refreshing application slash commands');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [...client.commands.values()] },
    );

    console.log('Successfully reloaded application slash commands');
  } catch (error) {
    console.error(error);
  }
})();

client.login();
