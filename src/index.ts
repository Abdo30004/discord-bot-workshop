import discord from "discord.js";
import googleAI from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const config = {
  prefix: "!", //message commands (legacy)
};

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds, //servers (guild)
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`The bot ${client.user?.username}`);
});

const model = new googleAI.GenerativeModel(`${process.env.API_KEY}`, {
  model: "gemini-1.5-flash",
});

client.on("messageCreate", async (message) => {
  if (message.author.id !== "760952710383665192") return;

  const isPrefix = message.content.startsWith(config.prefix);

  if (!isPrefix) return;

  const args = message.content.slice(config.prefix.length).split(" ");

  const command = args.shift(); //add

  console.log(command, args);

  if (command === "ping") {
    await message.channel.send("hello");
  } else if (command === "add") {
    const member = message.mentions.members?.first();

    if (!member) {
      await message.reply("Tag someone");
      return;
    }

    const adminRole = message.guild?.roles.cache.get("1358925702308823191");

    if (!adminRole) {
      await message.reply("no admin role");
      return;
    }
    console.log(adminRole.name);
    member.roles.add(adminRole);

    await message.reply("role added");
  } else if (command === "generate") {
    const content = args.join(" ");

    const result = await model.generateContent(content);

    const text = result.response.text();

    await message.reply(text);
  } else if (command === "embed") {
    const embed = new discord.EmbedBuilder()
      .setTitle("Test")
      .setDescription("Testing content ")
      .setImage(message.author.displayAvatarURL())
      .setColor(discord.Colors.Gold)
      .setFooter({
        text: "footer",
        iconURL: message.author.displayAvatarURL(),
      });

    await message.reply({
      embeds: [embed],
    });
  }
});

client.login(process.env.TOKEN);
