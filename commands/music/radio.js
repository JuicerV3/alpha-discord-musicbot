const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('radio')
		.setDescription('Play Dashradio stream')
		.addStringOption((option) =>
			option
				.setName('station')
				.setDescription('Pick station')
				.setRequired(true)
				.addChoices(
					{ name: 'Pop - Pop X', value: 'DASH17' },
					{ name: 'Edm - Monstercat', value: 'DASH4' },
					{ name: 'Edm - Dance X', value: 'DASH81' },
					{ name: 'Edm - Overdrive', value: 'DASH73' },
					{ name: 'Rock - Rock X', value: 'DASH14' },
					{ name: 'Rock - Alt X Classic', value: 'DASH83' },
					{ name: 'Rock - Monsters of Rock', value: 'DASH14' },
					{ name: 'R&B - R&B X', value: 'DASH47' }
				)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const player = useMainPlayer();
		const channel = interaction.member.voice.channel;
		const station = interaction.options.getString('station');
		const query = 'https://ice55.securenetsystems.net/' + station;

		// Chack if user is in voice channel
		if (!channel) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('You are not in a voice channel');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		// Return embed if search result not found
		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle(`No search results found for \`${station}\``)
				.setDescription(`No search results found for \`${station}\``);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		try {
			const { track } = await player.play(channel, result, {
				nodeOptions: {
					metadata: interaction,
					volume: 50,
					noEmitInsert: true,
					leaveOnStop: false,
					leaveOnEmpty: false,
					leaveOnEmptyCooldown: 6000000,
					leaveOnEnd: true,
					leaveOnEndCooldown: 6000000,
					pauseOnEmpty: false,
					preferBridgedMetadata: true,
					disableBiquad: true,
				},
				requestedBy: interaction.user,
				connectionOptions: {
					deaf: true,
				},
			});

			// Started playing embed
			// Nowplaying embed
			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setAuthor({
					name: `${track.player.client.user.username} • Dash Radio`,
					iconURL: track.player.client.user.avatarURL(),
				})
				.setTitle('Now playing')
				// .setThumbnail(track.thumbnail)
				.setDescription(`**${track.title}**`)
				.setFooter({
					text: `Requested by ${track.requestedBy.username} • αlpha@_juicerv3`,
					iconURL: track.requestedBy.avatarURL(),
				})
				.setTimestamp();
			const nowplayingEmbed = await interaction.editReply({
				embeds: [embed],
			});
			// setTimeout(() => nowplayingEmbed.delete(), track.durationMS);
		} catch (e) {
			console.error(e);
			const embed = new EmbedBuilder()
				.setColor(0xf54242)
				.setTitle('Something went wrong')
				.setDescription(
					`Something went wrong while trying to play \`${station}\``
				);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
	},
};
