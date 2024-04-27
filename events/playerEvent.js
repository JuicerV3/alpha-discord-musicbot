const {
	EmbedBuilder,
	ActivityType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require('discord.js');
const { player } = require('..');

// player events
player.events.on('playerStart', async (queue, track) => {
	let loopStatus;
	switch (queue.repeatMode) {
		case 0:
			loopStatus = 'Off';
			break;
		case 1:
			loopStatus = 'Current Track';
			break;
		case 2:
			loopStatus = 'Queue';
			break;
		case 3:
			loopStatus = 'Autoplay Next Track';
			break;
		default:
			loopStatus = 'Off';
	}
	function nFormatter(num, digits) {
		const lookup = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'K' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e9, symbol: 'G' },
			{ value: 1e12, symbol: 'T' },
			{ value: 1e15, symbol: 'P' },
			{ value: 1e18, symbol: 'E' },
		];
		const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
		const item = lookup.findLast((item) => num >= item.value);
		return item
			? (num / item.value)
					.toFixed(digits)
					.replace(regexp, '')
					.concat(item.symbol)
			: '0';
	}
	let trackSource =
		track.source.charAt(0).toUpperCase() + track.source.slice(1);
	if (track.source === 'youtube') {
		trackSource = `${
			track.source.charAt(0).toUpperCase() + track.source.slice(1)
		} • ${nFormatter(track.views, 1)} views`;
	}
	const embed = new EmbedBuilder()
		.setColor(0x96ffff)
		.setAuthor({
			name: `${queue.player.client.user.username} • ${
				track.source.charAt(0).toUpperCase() + track.source.slice(1)
			}`,
			iconURL: queue.player.client.user.avatarURL(),
		})
		.setTitle('Now playing')
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
				value: trackSource,
				inline: true,
			},
			{
				name: 'Loop status',
				value: loopStatus,
				inline: true,
			}
		)
		.setFooter({
			text: `Requested by ${track.requestedBy.username} • αlpha@_juicerv3`,
			iconURL: track.requestedBy.avatarURL(),
		})
		.setTimestamp();

	const nextupTrack = {
		title: queue.tracks.map((track) => `[${track.title}](${track.url})`),
		requestBy: queue.tracks.map((track) => `${track.requestedBy.username}`),
		source: queue.tracks.map(
			(track) =>
				`${
					track.source.charAt(0).toUpperCase() + track.source.slice(1)
				}`
		),
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

	// const controlPanel = [
	// 	(buttonRow = new ActionRowBuilder().addComponents(
	// 		new ButtonBuilder()
	// 			.setCustomId('shuffle')
	// 			.setStyle(ButtonStyle.Primary)
	// 			.setLabel('🔀'),
	// 		new ButtonBuilder()
	// 			.setCustomId('back')
	// 			.setStyle(ButtonStyle.Primary)
	// 			.setLabel('⏮️'),
	// 		new ButtonBuilder()
	// 			.setCustomId('playercontrol')
	// 			.setStyle(ButtonStyle.Primary)
	// 			.setLabel('⏯️'),
	// 		new ButtonBuilder()
	// 			.setCustomId('skip')
	// 			.setStyle(ButtonStyle.Primary)
	// 			.setLabel('⏭️'),
	// 		new ButtonBuilder()
	// 			.setCustomId('loop')
	// 			.setStyle(ButtonStyle.Primary)
	// 			.setLabel('🔂')
	// 	)),
	// ];
	const msg = await queue.metadata.channel.send({
		embeds: [embed],
		// components: controlPanel,
	});
	setTimeout(() => msg.delete(), track.durationMS);
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

player.events.on('disconnect', (queue) => {
	const embed = new EmbedBuilder()
		.setColor(0x96ffff)
		.setAuthor({
			name: queue.player.client.user.username,
			iconURL: queue.player.client.user.avatarURL(),
		})
		.setTitle('Disconnected')
		.setDescription('Disconnected from voice channel.');
	queue.metadata.channel.send({ embeds: [embed] });
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
