import { ChannelType, SlashCommandBuilder } from "discord.js";

const pingCommand = new SlashCommandBuilder()
  .setName("ask")
  .setDescription("ask command for learning")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("the question to ask")
      .setRequired(true)
  )

  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("channel to send")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)
  )
  .addIntegerOption((option) =>
    option
      .setName("messages_number")
      .setDescription("number of messages")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(5)
  );

const avatarCommand = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("show user avatar")
  .addUserOption((option) =>
    option
      .setName("user")
      .setDescription("the user you want its avatar")
      .setRequired(false)
  );

export const CommandsSchema = [pingCommand, avatarCommand];
