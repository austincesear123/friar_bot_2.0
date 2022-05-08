const imageSearch = require("./imageSearch");

function handleMessage(message) {
  const stringMessage = message.toString();
  const newMessage = stringMessage.substring(1);
  if (stringMessage.startsWith("-") === true) {
    if (newMessage === "tatis") {
      imageSearch.imageSearch();
    }
  }
}

exports.handleMessage = handleMessage;
