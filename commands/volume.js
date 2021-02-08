const { canModifyQueue } = require("../util/EvobotUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["vol"],
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply(new MessageEmbed() .setDescription("There is nothing playing.").setColor("#9e1c36")).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply(new MessageEmbed() .setDescription("You need to join a voice channel first!").setColor("#9e1c36")).catch(console.error);

    if (!args[0]) return message.reply(new MessageEmbed() .setDescription(`🔊 The current volume is: **${queue.volume}%**`).setColor("#9e1c36")).catch(console.error);
    if (isNaN(args[0])) return message.reply(new MessageEmbed() .setDescription("Please use a number to set volume.").setColor("#9e1c36")).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply(new MessageEmbed() .setDescription("Please use a number between 0 - 100.").setColor("#9e1c36")).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(new MessageEmbed() .setDescription(`Volume set to: **${args[0]}%**`).setColor("#9e1c36"))
      
      .catch(console.error);
  }
};
