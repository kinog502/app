const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply(new MessageEmbed() .setDescription("There is nothing playing.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(new MessageEmbed() .setDescription(`${message.author} ⏹ stopped the music!`).setColor("#9e1c36")).catch(console.error);
  }
};
