const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply(new MessageEmbed() .setDescription("There is nothing playing that I could skip for you.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ⏩ skipped the song`).setColor("#9e1c36")).catch(console.error);
  }
};
