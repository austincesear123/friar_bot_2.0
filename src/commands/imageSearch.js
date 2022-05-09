require("dotenv").config();
const imageSearch = require("image-search-google");

const client = new imageSearch(process.env.CSE_ID, process.env.API_KEY);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomImage(message) {
  client
    .search("Fernando Tatis Jr Padres", { page: randomInt(1, 3) })
    .then(
      (images) => message.channel.send(`${images[randomInt(1, 10)].url}`)
      /*
          [{
              'url': item.link,
              'thumbnail':item.image.thumbnailLink,
              'snippet':item.title,
              'context': item.image.contextLink
          }]
           */
    )
    .catch((error) => console.log(error));
}

exports.randomImage = randomImage;
