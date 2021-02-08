const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: "Remove song from the queue",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(new MessageEmbed() .setDescription("There is no queue.").setColor("9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(new MessageEmbed() .setDescription(`Usage: ${message.client.prefix}remove <Queue Number>`).setColor("9e1c36"));
    if (isNaN(args[0])) return message.reply(new MessageEmbed() .setDescription(`Usage: ${message.client.prefix}remove <Queue Number>`).setColor("9e1c36"));

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ❌ removed **${song[0].title}** from the queue.`).setColor("9e1c36"));
  }
};
