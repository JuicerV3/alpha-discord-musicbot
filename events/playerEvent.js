const { EmbedBuilder, ActivityType } = require('discord.js');
const { player } = require('..');
const {
	sourceFormatter,
	loopStatusFormatter,
} = require('../functions/formatter');

// player events
player.events.on('playerStart', async (queue, track) => {
	// Nowplaying embed
	const embed = new EmbedBuilder()
		.setColor(0x96ffff)
		.setAuthor({
			name: `${track.player.client.user.username} • ${sourceFormatter(
				track.source
			)}`,
			iconURL: track.player.client.user.avatarURL(),
		})
		.setTitle('Started playing')
		.setThumbnail(track.thumbnail)
		.setDescription(`**[${track.title}](${track.url})**\n${track.author}`)
		.setFields(
			{
				name: 'Track length',
				value: track.duration,
				inline: true,
			},
			{
				name: 'Source',
				value: sourceFormatter(track.source, track.views),
				inline: true,
			},
			{
				name: 'Loop status',
				value: loopStatusFormatter(queue.repeatMode),
				inline: true,
			}
		)
		.setFooter({
			text: `Requested by ${track.requestedBy.username} • αlpha@_juicerv3`,
			iconURL: track.requestedBy.avatarURL(),
		})
		.setTimestamp();

	// Nextup track
	const nextupTrack = {
		title: queue.tracks.map((track) => `[${track.title}](${track.url})`),
		requestBy: queue.tracks.map((track) => `${track.requestedBy.username}`),
		source: queue.tracks.map((track) => `${sourceFormatter(track.source)}`),
		duration: queue.tracks.map((track) => `${track.duration}`),
	};
	if (!nextupTrack.title.length < 1) {
		embed.addFields({
			name: 'Nextup',
			value: `${nextupTrack.title.slice(
				0,
				1
			)}\n └─ ${nextupTrack.requestBy.slice(
				0,
				1
			)} • ${nextupTrack.source.slice(
				0,
				1
			)} • ${nextupTrack.duration.slice(0, 1)}`,
		});
	}

	queue.metadata.channel.send({ embeds: [embed] });

	// set presence to track name
	player.client.user.setPresence({
		activities: [
			{
				name: `${track.title}`,
				type: ActivityType.Streaming,
				url: 'https://twitch.tv/music',
			},
		],
	});
	console.log(
		`\u001b[1;34m[Player]: Started playing ${track.title} - (${track.source})\u001b[0m`
	);
});

player.events.on('disconnect', async (queue) => {
	const embed = new EmbedBuilder()
		.setColor(0x96ffff)
		.setAuthor({
			name: queue.player.client.user.username,
			iconURL: queue.player.client.user.avatarURL(),
		})
		.setTitle('Disconnected from voice channel');
	const msg = await queue.metadata.channel.send({ embeds: [embed] });
	return setTimeout(() => msg.delete(), 10000);
});

player.events.on('emptyQueue', () => {
	player.client.user.setPresence({
		activities: [
			{
				name: 'Music',
				type: ActivityType.Streaming,
				url: 'https://twitch.tv/music',
			},
		],
		status: 'online',
	});
});

player.events.on('playerError', (queue, error) => {
	console.log(
		`\u001b[1;31m[Player ERROR] (ID:${queue.metadata.channel}) Error emitted from the player: ${error.message}\u001b[0m`
	);
	queue.metadata.channel.send({
		content:
			'An error occurred while trying to extract the following song.',
	});
});

player.events.on('error', (queue, error) => {
	console.log(
		`\u001b[1;31m[${queue.guild.name}] (ID:${queue.metadata.channel}) Error emitted from the queue: ${error.message}`
	);
});
