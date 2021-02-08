const { play } = require("../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default;
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME } = require("../util/EvobotUtil");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const Discord = require("discord.js")
module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "Plays audio from YouTube or Soundcloud",
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply(new Discord.MessageEmbed() .setDescription("You need to join a voice channel first!").setColor("#9e1c36")).catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(new Discord.MessageEmbed() .setDescription(`You must be in the same channel as ${message.client.user}`).setColor("#9e1c36")).catch(console.error);

    if (!args.length)
      return message
        .reply(new Discord.MessageEmbed() .setDescription(`Usage: ${message.client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`).setColor("#9e1c36"))
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply(new Discord.MessageEmbed() .setDescription("Cannot connect to voice channel, missing permissions").setColor("#9e1c36"));
    if (!permissions.has("SPEAK"))
      return message.reply(new Discord.MessageEmbed() .setDescription("I cannot speak in this voice channel, make sure I have the proper permissions!").setColor("#9e1c36"));

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(new Discord.MessageEmbed() .setDescription(error.message).setColor("#9e1c36")).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(new Discord.MessageEmbed() .setDescription(error.message).setColor("#9e1c36")).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(new Discord.MessageEmbed() .setDescription(error.message).setColor("#9e1c36")).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(new Discord.MessageEmbed() .setDescription(`Queued  [**${song.title}**](${song.url}) [<@${message.author.id}>]`)        .setColor("9e1c36"))
         .then(message => message.delete({timeout: 5000}))
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(new Discord.MessageEmbed() .setDescription(`Could not join the channel: ${error}`).setColor("#9e1c36")).catch(console.error);
    }
  }
};
