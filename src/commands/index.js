const players = require("./players");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
require("dotenv").config();
const API_URL = process.env.API_URL

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
    "How to upload an image:\n-upload `player name ('manny', 'crone', etc)` `image url`\nExample: '-upload manny https://exampleimageurl.jpg'\n\n\n\nHow to delete an image:\n-delete `image ID#`\nExample: '-delete 628e6256bb5328993cb08365'",
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
        "-azocar\n-barlow\n-bro\n-bunt\n-campy\n-carp\n-cooper\n-crismatt\n-crone\n-cruz\n-daddy\n-dam\n-darvish\n-dick\n-double\n",
      inline: true,
    },
    {
      name: "\u200b",
      value:
        "-friar\n-ftd\n-fuck\n-garcia\n-gary\n-gman\n-grisham\n-hader\n-hill\n-honeywell\n-homer\n-kim\n-lose\n-lugo\n-manny\n",
      inline: true,
    },
    {
      name: "\u200b",
      value:
        "-martinez\n-musgrove\n-nice\n-nola\n-rbi\n-reynolds\n-snell\n-soto\n-suarez\n-tatis\n-triple\n-wacha\n-wilson\n-win\n-xan\n",
      inline: true,
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
  ],
  footer: {
    text: "Developed by austincesear123, 2023",
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
        await fetch(`${API_URL}/friar_bot/get/${players.players[i]}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.playerImgs.length > 0) {
              const imageEmbed = new MessageEmbed().setColor("GOLD");
              const num = randomInt(1, data.playerImgs.length) - 1;
              imageEmbed.setImage(`${data.playerImgs[num].url}`);
              imageEmbed.setFooter({
                text: `ID: ${data.playerImgs[num]._id}, uploaded by ${data.playerImgs[num].user}`,
              });
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
      if (players.players.includes(messageArr[1])) {
        const dataBody = {
          url: messageArr[2],
          playerName: messageArr[1],
          user: message.author.username,
        };
        await fetch(`${API_URL}/friar_bot/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataBody),
        })
          .then((res) => res.json())
          .then((data) => {
            const uploadEmbed = new MessageEmbed().setColor("GOLD");
            uploadEmbed.setDescription(
              `Image successfully uploaded for: ${messageArr[1]}, ID: ${data.player._id}`
            );
            message.channel.send({ embeds: [uploadEmbed] });
          })
          .catch((error) => {
            console.log(error);
            const imageEmbed = new MessageEmbed().setColor("GOLD");
            imageEmbed.setDescription(
              "There was an error uploading your image"
            );
            message.channel.send({ embeds: [imageEmbed] });
          });
      } else {
        const imageEmbed = new MessageEmbed().setColor("GOLD");
        imageEmbed.setDescription(
          `${messageArr[1]} is not an available command`
        );
        message.channel.send({ embeds: [imageEmbed] });
      }
    }

    if (subStringMessage === "help") {
      getHelp(message);
    }

    if (subStringMessage.slice(0, 6) === "delete") {
      const messageArr = subStringMessage.split(" ", 2);
      const id = messageArr[1];
      let validId;
      let key;
      let playerName;
      let user;
      await fetch(`${API_URL}/friar_bot/id/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.img === null) {
            validId = false;
            const imageEmbed = new MessageEmbed().setColor("GOLD");
            imageEmbed.setDescription("Image ID not found");
            message.channel.send({ embeds: [imageEmbed] });
          } else {
            validId = true;
            const sliceIndex = data.img.url.lastIndexOf("/") + 1;
            key = data.img.url.slice(sliceIndex);
            playerName = data.img.playerName;
            user = data.img.user;
          }
        })
        .catch((error) => console.log(error));
      if (validId) {
        if (user === message.author.username || user === undefined) {
          const dataBody = {
            id: id,
            playerName: playerName,
            key: key,
          };
          await fetch(`${API_URL}/friar_bot/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataBody),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 200) {
                const imageEmbed = new MessageEmbed().setColor("GOLD");
                imageEmbed.setDescription(
                  `Image ID# ${id} for ${playerName} successfully deleted`
                );
                message.channel.send({ embeds: [imageEmbed] });
              }
            })
            .catch((error) => {
              console.log(error);
              const imageEmbed = new MessageEmbed().setColor("GOLD");
              imageEmbed.setDescription(
                "There was an error trying to delete your image"
              );
              message.channel.send({ embeds: [imageEmbed] });
            });
        } else {
          const imageEmbed = new MessageEmbed().setColor("GOLD");
          imageEmbed.setDescription(
            "Images can only be deleted by the same user that uploaded them"
          );
          message.channel.send({ embeds: [imageEmbed] });
        }
      }
    }
  }
}

exports.handleMessage = handleMessage;
