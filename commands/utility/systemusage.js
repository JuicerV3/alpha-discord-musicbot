const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('systemusage')
		.setDescription('Show bot system usage'),
	async execute(interaction) {
		await interaction.deferReply();

		// Cpu load
		const platform = os.platform();
		const load = os.loadavg();
		const strLoad = `[${load[0].toFixed(2)}, ${load[1].toFixed(
			2
		)}, ${load[2].toFixed(2)}]`;
		let cpuPercent = '0%';

		if (platform === 'win32') {
			try {
				const { stdout, stderr } = await exec(
					'wmic cpu get LoadPercentage'
				);
				if (stderr) {
					throw new Error(stderr);
				}

				const loadArr = stdout
					.split('\r\r\n')
					.filter((item) => !isNaN(parseInt(item)));
				const totalLoad = loadArr.reduce(
					(acc, load) => acc + parseInt(load),
					0
				);
				const avgLoad = Math.round(totalLoad / loadArr.length);
				cpuPercent = avgLoad + '%';
			} catch (error) {
				console.error('Error getting CPU load:', error);
			}
		} else {
			cpuPercent = (await getCpuPercentage()) + '%';
		}

		// Total Ram
		const totalRam = os.totalmem();
		const usedRam = process.memoryUsage().rss;
		const usedRatio = (((usedRam / totalRam) * 10000) / 100).toFixed(1);
		const totalMb = (totalRam / (1024 * 1024)).toFixed(0);
		const usedMb = (usedRam / (1024 * 1024)).toFixed(0);

		// Total Ram heap
		const totalHeap = process.memoryUsage().heapTotal;
		const usedHeap = process.memoryUsage().heapUsed;
		const husedRatio = (((usedHeap / totalHeap) * 10000) / 100).toFixed(1);
		const htotalMb = (totalHeap / (1024 * 1024)).toFixed(0);
		const husedMb = (usedHeap / (1024 * 1024)).toFixed(0);

		const getCpuLoad = () => {
			const cpus = os.cpus();

			let totalIdle = 0,
				totalTick = 0;
			cpus.forEach((cpu) => {
				for (type in cpu.times) {
					totalTick += cpu.times[type];
				}
				totalIdle += cpu.times.idle;
			});

			return {
				idle: totalIdle / cpus.length,
				total: totalTick / cpus.length,
			};
		};

		const getCpuPercentage = () => {
			const firstLoad = getCpuLoad();

			return new Promise((resolve) => {
				setTimeout(() => {
					const secondLoad = getCpuLoad();

					const idleDiff = secondLoad.idle - firstLoad.idle;
					const totalDiff = secondLoad.total - firstLoad.total;
					const avgLoad = 100 - ~~((100 * idleDiff) / totalDiff);
					resolve(avgLoad);
				}, 1000);
			});
		};

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL(),
			})
			.setTitle('Status')
			.setFooter({
				text: `Code with pain by @_juicerv3`,
				iconURL: interaction.client.user.avatarURL(),
			})
			.addFields(
				{
					name: 'CPU Usage',
					value: `${cpuPercent} (${strLoad})`,
					inline: true,
				},
				{
					name: 'RAM Usage',
					value: `${usedRatio}% (${usedMb} / ${totalMb} MB)`,
					inline: true,
				},
				{
					name: 'HEAP Usage',
					value: `${husedRatio}% (${husedMb} / ${htotalMb} MB)`,
					inline: true,
				}
			)
			.setTimestamp();
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
