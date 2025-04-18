import {
  GatewayIntentBits,
  Client,
  REST,
  Routes,
  MessageFlags,
  ChannelType,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import dotenv from "dotenv";
import fs from "fs/promises";
import { CommandsSchema } from "./commands";

dotenv.config();

const restClient = new REST().setToken(process.env.TOKEN as string);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", async () => {
  console.log(`The bot ${client.user?.username}`);
});

async function sleep(ms: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.commandName;

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  }); // 15 min

  if (command === "ask") {
    const question = interaction.options.getString("question", true);

    const channel = interaction.options.getChannel("channel", false, [
      ChannelType.GuildText,
    ]);

    const n = interaction.options.getInteger("messages_number") || 1;

    await interaction.editReply(`Your Question is ${question}`);

    if (!channel) return;

    for (let i = 0; i < n; i++) await channel.send(question);
  } else if (command === "avatar") {
    const user = interaction.options.getUser("user") || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`Avatar of ${user.username}`)
      .setImage(user.displayAvatarURL());

    const imageBuffer = await fs.readFile("assets/image.jpg");

    const attachment = new AttachmentBuilder(imageBuffer).setName("conan.jpg");

    await interaction.editReply({
      embeds: [embed],
      files: [attachment],
    });
  }
});

async function main() {
  await restClient.put(
    Routes.applicationCommands(process.env.CLIENT_ID as string),
    {
      body: CommandsSchema,
    }
  );

  await client.login(process.env.TOKEN);
}

main();
