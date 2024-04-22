const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('list queue'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		const tracks = queue.tracks.map(
			(track, index) => `${++index}. ${track.title}`
		);
		let trackQueue = '';

		if (tracks.length < 1) {
			trackQueue = '------------------------------';
		} else if (tracks.length > 9) {
			tracksQueue = tracks.slice(0, 10).join('\n');
			tracksQueue += `\nand ${tracks.length - 10} other songs`;
		} else {
			trackQueue = tracks.join('\n');
		}

		const loopStatus = queue.repeatMode
			? queue.repeatMode === 2
				? 'ALL'
				: 'One'
			: 'OFF';

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle(`Now Playing : ${queue.currentTrack.title}\n\n`)
			.setDescription(trackQueue)
			.setFooter({ text: loopStatus })
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
