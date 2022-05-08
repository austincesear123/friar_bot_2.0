require("dotenv").config();
const commands = require("./commands");

const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`${client.user.username} has logged in.`);
});

client.on("messageCreate", (message) => {
  commands.handleMessage(message);
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
