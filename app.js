const tmi = require('tmi.js');
const fs = require("fs");

// Define configuration options for Twitch
const opts = {
  // Login info:
  identity: {username: "WeirdAndOdd", password: "oauth:6zbum2a50hv9x977fm1gx19fem44er"},
  // Channels to connect to, aushyro is my own channel, but we are connecting with aushyrobot
  // This bot is just a second Twitch account.
  // Please note: you can connect to any channel as long as they have an open chat channel (not for followers only)
  // DON'T SPAM with it!! Unless you would like to get your bot banned from that channel :-)
  channels: ["aushyro"] //, "designy"]
};

// Create a Twitch client with our options
const client = new tmi.client(opts);
var dadjokes = [];
var newline = "\n";

Init();

function Init() {
	// Register our event handlers (defined below)
	client.on('message', onMessageHandler);
	client.on('connected', onConnectedHandler);
	client.on("disconnected", onDisconnectedHandler);
	
	// Connect to Twitch:
	client.connect();
	
	text = fs.readFileSync("./dadjokes.txt", "utf-8");
	dadjokes = text.split(newline)
}

// Called every time a message comes in
function onMessageHandler (channel, usercontext, message, self) {
  // Ignore messages from the bot
  if (self) { return; }
  
  //get username (the username who asked the question:
  //const username = usercontext.username.replace("#","@");
  
  // Remove whitespace from chat message
  message = message.trim();
  
  // If the command is known, let's execute it
  if (message.startsWith('!dadjoke')) {
		dadjokenumber = Math.floor(Math.random() * dadjokes.length);
		client.say(channel, String(dadjokes[dadjokenumber]));
  }
}

function testUserPermission (usercontext) {
	const username = usercontext.username.replace("#","");
	
	if (usercontext.mod) {
		return true;	
	}
	
	return false;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
	writeToLog(`* Connected to Twitch: ${addr}:${port}`);
}

// Called when server connection lost
function onDisconnectedHandler(reason) {
	writeToLog(`* Disconnected from Twitch`);
}

// Logging
function writeToLog(message) {
	var today  = new Date();
	var logMsg = today.toLocaleString().concat(" ", message);
	console.log(logMsg);
}