const { player } = require('..');

// player events
player.events.on('playerStart', (queue, track) => {
	queue.metadata.channel.send(`Started playing **${track.title}**!`);
	console.log(
		`\u001b[1;34m[Player]: Started playing ${track.title} - [${track.source}]\u001b[0m`
	);
});
