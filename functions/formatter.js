function numberFormatter(num, digits) {
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

function secondsToHms(sec) {
    sec = Number(sec);
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = Math.floor((sec % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
    var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
    return hDisplay + mDisplay + sDisplay;
}

function sourceFormatter(source, views) {
    if (views === undefined && source === 'youtube')
        return `${source.charAt(0).toUpperCase() + source.slice(1)}`;
    switch (source) {
        case 'apple_music':
            return (
                source.charAt(0).toUpperCase() +
                source.slice(1, 5) +
                ' ' +
                source.charAt(6).toUpperCase() +
                source.slice(7)
            );
        case 'soundcloud':
            return (
                source.charAt(0).toUpperCase() +
                source.slice(1, 5) +
                source.charAt(5).toUpperCase() +
                source.slice(6)
            );
        case 'youtube':
            return `${
                source.charAt(0).toUpperCase() + source.slice(1)
            } • ${numberFormatter(views, 1)} views`;
        default:
            return source.charAt(0).toUpperCase() + source.slice(1);
    }
}

function iconURLFormatter(source, avatarURL) {
    switch (source) {
        case 'spotify':
            return 'https://cdn.discordapp.com/attachments/985226448686174228/1231982720494735411/Spotify_logo.png';
        case 'apple_music':
            return 'https://cdn.discordapp.com/attachments/985226448686174228/1234083611158773760/Apple-Music-logo.png';
        case 'soundcloud':
            return 'https://cdn.discordapp.com/attachments/985226448686174228/1234085458963730502/soundcloud-logo.jpg';
        case 'youtube':
            return 'https://cdn.discordapp.com/attachments/985226448686174228/1231996659597312031/youtube-logo.png';
        default:
            return avatarURL;
    }
}

function loopStatusFormatter(repeatMode) {
    switch (repeatMode) {
        case 0:
            return 'Off';
        case 1:
            return 'Current Track';
        case 2:
            return 'Queue';
        case 3:
            return 'Autoplay Next Track';
        default:
            return 'Off';
    }
}

module.exports = {
    numberFormatter,
    secondsToHms,
    sourceFormatter,
    iconURLFormatter,
    loopStatusFormatter,
};
