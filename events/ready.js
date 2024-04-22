const { Events } = require('discord.js');
// console.log when bot ready.
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(
			`\u001b[1;32mConnection established. Ready! Logged in as ${client.user.tag}` +
				'\u001b[0m'
		);
	},
};
