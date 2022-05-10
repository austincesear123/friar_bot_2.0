const players = require("./players");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const helpEmbed = {
  color: "GOLD",
  title: "**__Commands__**:",
  author: {
    name: "friar_bot_2.0",
    icon_url:
      "https://s.yimg.com/cv/apiv2/default/mlb/20200508/500x500/padres_wbgs.png",
  },
  description:
    "How to upload an image:\n\n-upload `player name ('manny', 'crone', etc)` `image url`\nExample: '-upload manny https://exampleimageurl.jpg'",
  thumbnail: {
    url: "https://www.pinclipart.com/picdir/big/567-5676646_san-diego-padres-logo-2020-clipart.png",
  },
  fields: [
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "Players:",
      value:
        "-alfaro\n-azocar\n-cj\n-clevinger\n-crismatt\n-crone\n-dam\n-darvish\n-friar\n-ftd\n",
      inline: true,
    },
    {
      name: "\u200b",
      value:
        "-gore\n-grisham\n-hosmer\n-kim\n-lamet\n-lose\n-manaea\n-manny\n-martinez\n-musgrove\n",
      inline: true,
    },
    {
      name: "\u200b",
      value:
        "-myers\n-nola\n-profar\n-rogers\n-snell\n-suarez\n-tatis\n-voit\n-win\n",
      inline: true,
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
  ],
  footer: {
    text: "Developed by austincesear123, 2022",
  },
};

// const imageEmbed = new MessageEmbed().setColor("GOLD");

function getHelp(message) {
  message.channel.send({
    embeds: [helpEmbed],
  });
}

async function handleMessage(message) {
  const stringMessage = message.toString();
  const subStringMessage = message.toString().substring(1);
  if (stringMessage.startsWith("-")) {
    for (i = 0; i < players.players.length; i++) {
      if (players.players[i] === subStringMessage) {
        await fetch(`http://127.0.0.1:3000/friar_bot/get/${players.players[i]}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.playerImgs.length > 0) {
              const imageEmbed = new MessageEmbed().setColor("GOLD");
              imageEmbed.setImage(
                `${
                  data.playerImgs[randomInt(1, data.playerImgs.length) - 1].url
                }`
              );
              message.channel.send({ embeds: [imageEmbed] });
            } else {
              const imageEmbed = new MessageEmbed().setColor("GOLD");
              imageEmbed.setDescription(
                `I don't have any images for ${players.players[i]} yet!`
              );
              message.channel.send({ embeds: [imageEmbed] });
            }
          })
          .catch((error) => console.log(error));
      }
    }

    if (subStringMessage.slice(0, 6) === "upload") {
      const messageArr = subStringMessage.split(" ", 3);
      const dataBody = {
        url: messageArr[2],
        playerName: messageArr[1],
      };
      await fetch(`http://127.0.0.1:3000/friar_bot/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBody),
      })
        .then(() => {
          const uploadEmbed = new MessageEmbed().setColor("GOLD");
          uploadEmbed.setDescription(
            `Image successfully uploaded for: ${messageArr[1]}`
          );
          message.channel.send({ embeds: [uploadEmbed] });
        })
        .catch((error) => console.log(error));
    }

    if (subStringMessage === "help") {
      getHelp(message);
    }
  }
}

exports.handleMessage = handleMessage;
