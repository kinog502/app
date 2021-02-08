const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Resume currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(new MessageEmbed() .setDescription("There is nothing playing.").setColor("9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ▶ resumed the music!`).setColor("9e1c36")).catch(console.error);
    }

    return message.reply(new MessageEmbed() .setDescription("The queue is not paused.").setColor("9e1c36")).catch(console.error);
  }
};
