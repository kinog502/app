const { canModifyQueue } = require("../util/EvobotUtil");
const Discord = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Toggle music loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(new Discord.MessageEmbed() .setDescription("There is nothing playing.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(new Discord.MessageEmbed() .setDescription(`Loop is now ${queue.loop ? "**ON**" : "**OFF**"}`).setColor("#9e1c36"))
      .catch(console.error);
  }
};
