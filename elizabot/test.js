var elizabot = require('./elizabot.js');

console.log(elizabot.start()) // initializes eliza and returns a greeting message

msgtext = "I am feeling tired."
console.log(elizabot.reply(msgtext)) // returns a eliza-like reply based on the message text passed into it

console.log(elizabot.bye()) // returns a farewell message