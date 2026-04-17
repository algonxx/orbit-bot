require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async msg => {
  if (msg.author.bot) return;

  // 🎯 PING
  if (msg.content === "!ping") {
    return msg.reply("🏓 Pong!");
  }

  // 👋 HELLO
  if (msg.content === "!hello") {
    return msg.reply("👋 Hello!");
  }

  // 😂 MEME
  if (msg.content === "!meme") {
    return msg.reply("😂 Coding at 3AM hits different!");
  }

  // 🎲 ROLL
  if (msg.content === "!roll") {
    const num = Math.floor(Math.random() * 6) + 1;
    return msg.reply(`🎲 You rolled: ${num}`);
  }

  // 🎵 MUSIC
  if (msg.content.startsWith("!play")) {
    const url = msg.content.split(" ")[1];

    if (!url) return msg.reply("❌ Give YouTube URL");

    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.reply("❌ Join voice channel first");

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator,
    });

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    return msg.reply("🎵 Playing music!");
  }
});

// 👋 WELCOME
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(c => c.name === "general");
  if (channel) {
    channel.send(`🎉 Welcome ${member.user}!`);
  }
});

client.login(process.env.TOKEN);