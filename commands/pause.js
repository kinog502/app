const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(new MessageEmbed() .setDescription("There is nothing playing.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ⏸ paused the music.`).setColor("#9e1c36")).catch(console.error);
    }
  }
};
