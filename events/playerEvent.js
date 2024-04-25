const {
	EmbedBuilder,
	time,
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
			loopStatus = 'Repeat Off';
			break;
		case 1:
			loopStatus = 'Repeat Current Track';
			break;
		case 2:
			loopStatus = 'Repeat Queue';
			break;
		case 3:
			loopStatus = 'Autoplay Next Track';
			break;
		default:
			loopStatus = 'Repeat Off';
	}
	const embed = new EmbedBuilder()
		.setColor(0x96ffff)
		.setAuthor({
			name: `${queue.player.client.user.username} • ${
				track.source.charAt(0).toUpperCase() + track.source.slice(1)
			}`,
			iconURL: queue.player.client.user.avatarURL(),
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
				value: `${
					track.source.charAt(0).toUpperCase() + track.source.slice(1)
				}`,
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
