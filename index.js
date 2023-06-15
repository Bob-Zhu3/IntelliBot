require("dotenv/config");
const {Client, IntentsBitField} = require("discord.js");
const {Configuration, OpenAIApi} = require("openai");

const client = new Client
({
    intents: 
    [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on
(
    "ready", () =>
    {
        console.log("IntelliBot is online.");
    }
);

const configuration = new Configuration({apiKey: process.env.API_KEY,});

const openaiapi = new OpenAIApi(configuration);

client.on
(
    "messageCreate", async (message) =>
    {
        if (message.author.bot || message.content.startsWith("**"))
            return;

        let conversation = [{role: "system", content: "You are a friendly, humorous, and intelligent chatbot. Pretend to be a human, don't say things like 'As an AI language model, I don't have feelings in the traditional sense'."}];

        await message.channel.sendTyping();

        let prevMessages = await message.channel.messages.fetch({limit: 30});
        prevMessages.reverse();

        prevMessages.forEach
        (
            (msg) =>
            {
                if (message.content.startsWith("**") || (msg.author.id !== client.user.id && message.author.bot))
                    return;

                conversation.push({role: "user", content: msg.content});
            }
        )

        const output = await openaiapi.createChatCompletion({model: "gpt-3.5-turbo", messages: conversation});

        message.reply(output.data.choices[0].message);
    }
);
client.login(process.env.TOKEN);