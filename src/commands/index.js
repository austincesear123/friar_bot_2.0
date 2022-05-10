const players = require("./players");
const fetch = require("node-fetch");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function handleMessage(message) {
  const stringMessage = message.toString();
  const subStringMessage = message.toString().substring(1);
  if (stringMessage.startsWith("-")) {
    for (i = 0; i < players.players.length; i++) {
      if (players.players[i] === subStringMessage) {
        await fetch(`http://127.0.0.1:3000/friar_bot/get/${players.players[i]}`)
          .then((res) => res.json())
          .then((data) =>
            message.channel.send(
              `${data.playerImgs[randomInt(1, data.playerImgs.length) - 1].url}`
            )
          )
          .catch((error) => console.log(error));
      }
    }
  }
}

exports.handleMessage = handleMessage;
