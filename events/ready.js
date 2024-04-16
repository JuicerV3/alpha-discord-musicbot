const { Events } = require('discord.js');
// console.log when bot ready.
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(
			`Connection established. Ready! Logged in as ${client.user.tag}`
		);
	},
};
