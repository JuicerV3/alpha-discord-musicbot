const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)
		),
	async execute(interaction) {
		const commandName = interaction.options
			.getString('command', true)
			.toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			const msg = await interaction.reply(
				`There is no command with name \`${commandName}\`!`
			);
			return setTimeout(() => msg.delete(), 10000);
		}

		delete require.cache[
			require.resolve(`../${command.category}/${command.data.name}.js`)
		];

		try {
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(`../${command.category}/${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			const msg = await interaction.reply(
				`Command \`${newCommand.data.name}\` was reloaded!`
			);
			return setTimeout(() => msg.delete(), 10000);
		} catch (error) {
			console.error(error);
			const msg = await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``
			);
			return setTimeout(() => msg.delete(), 10000);
		}
	},
};
