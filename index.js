const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { Player } = require('discord-player');

console.log('\u001b[1;32mStarting bot...');

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
	],
});

// Discord player entrypoint
const player = new Player(client, {
	skipFFmpeg: false,
	ytdlOptions: {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 27,
	},
});
exports.player = player;
player.extractors.loadDefault();

// Slash command handler part
client.commands = new Collection();

// read commands files in ./commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}
console.log('\u001b[1;34m => Commands loading finished.');

// read event files in ./events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
console.log('\u001b[1;34m => Events loading finished.');

// Log in to Discord with your client's token
client.login(token);

// prevent crash on unhandled promise rejection
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled promise rejection:', reason);
});

// prevent crash on uncaught exception
process.on('uncaughtException', (error) => {
	console.error('Uncaught exception:', error);
});
