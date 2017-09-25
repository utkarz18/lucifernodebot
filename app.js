var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD
	/*appId: "497e79d9-7ad9-42d7-86aa-d5ae4d6ff587",
	appPassword: "UgUTNTjQjinyg9Pvw8mk3xm"*/
    
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, [
    function (session) {
		session.send("aa");
    }
]);


bot.dialog('greetings', [function (session, args, next) {
		session.dialogData.profile = args || {}; // Set the profile or create the object.
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "Hi! What's your name?");
        } else {
            next(); // Skip if we already have this info.
        }
	},
	
	function (session, results) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.profile.name = results.response;
        }
        if (session.dialogData.profile.name) {
            session.endDialog(`Welcome ${session.dialogData.profile.name}!`);
        }
    }
])
.triggerAction({
    matches: /^Hi$|^Hello$/i,
});
