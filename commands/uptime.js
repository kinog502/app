const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "uptime",
  aliases: ["u"],
  description: "Check the uptime",
  execute(message) {
    let seconds = Math.floor(message.client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
let owner = "446273606180405248"

    if(owner === message.author.id){
      message.channel.send(new MessageEmbed().setColor("9e1c36") .setDescription(` \`\`\`js\nUptime: ${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds\`\`\` `))
} else
{
 message.channel.send(new MessageEmbed().setColor("9e1c36").setDescription("**Only bot owner can use this command**"))

}
   
  }
};
