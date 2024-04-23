const { EmbedBuilder } = require('discord.js');
const { player } = require('..');

// player events
player.events.on('playerStart', (queue, track) => {
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
		});
	queue.metadata.channel.send({ embeds: [embed] });
	console.log(
		`\u001b[1;34m[Player]: Started playing ${track.title} - [${track.source}]\u001b[0m`
	);
});
