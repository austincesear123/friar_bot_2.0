require("dotenv").config();
const imageSearch = require("image-search-google");

const client = new imageSearch(process.env.CSE_ID, process.env.API_KEY);
const options = { page: 1 };

function randomImage() {
  client
    .search("Fernando Tatis Jr Padres", options)
    .then(
      (images) => console.log(images)
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

exports.randomImage = randomImage