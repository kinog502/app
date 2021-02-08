const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "Skip to the selected queue number",
  execute(message, args) {
    if (!args.length || isNaN(args[0]))
      return message
        .reply(new MessageEmbed() .setDescription(`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`).setColor("#9e1c36"))
        .catch(console.error);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(new MessageEmbed() .setDescription("There is no queue.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    if (args[0] > queue.songs.length)
      return message.reply(new MessageEmbed() .setDescription(`The queue is only ${queue.songs.length} songs long!`).setColor("#9e1c36")).catch(console.error);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
    
    queue.connection.dispatcher.end();
    queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ⏩ skipped ${args[0] - 1} songs`).setColor("#9e1c36")).catch(console.error);
  }
};
