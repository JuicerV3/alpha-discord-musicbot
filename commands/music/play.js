const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('PLay a song')
		.addStringOption((option) =>
			option
				.setName('query')
				.setDescription('search query')
				.setRequired(true)
		),
	async execute(interaction) {
		const player = useMainPlayer();
		const channel = interaction.member.voice.channel;
		if (!channel)
			return interaction.reply('You are not in a voice channel.');
		const query = interaction.options.getString('query');

		await interaction.deferReply();

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setTitle('No results found.')
				.setDescription(`No results found for \`${query}\``)
				.setAuthor(interaction.user);

			return interaction.editReply({ embeds: [embed] });
		}

		try {
			const { track, searchResult } = await player.play(channel, result, {
				nodeOptions: {
					metadata: interaction,
				},
				requestedBy: interaction.user,
			});

			const embed = new EmbedBuilder()
				.setTitle(
					`${
						searchResult.hasPlaylist() ? 'Playlist' : 'Track'
					} queued!`
				)
				.setThumbnail(track.thumbnail)
				.setDescription(`[${track.title}](${track.url})`)
				.setFields(
					searchResult.playlist
						? [
								{
									name: 'Playlist',
									value: searchResult.playlist.title,
								},
						  ]
						: []
				)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});

			return interaction.editReply({ embeds: [embed] });
		} catch (e) {
			console.error(e);

			const embed = new EmbedBuilder()
				.setTitle('Something went wrong.')
				.setDescription(
					`Something went wrong while playing \`${query}\``
				)
				.setAuthor(interaction.user);

			return interaction.editReply({ embeds: [embed] });
		}
	},
};
