const Discord = require('discord.js');

let getClient = function(Discord){
    let flags = Discord.Intents.FLAGS;
    const client = new Discord.Client({
        intents: [
            flags.GUILDS, flags.GUILD_MESSAGES
        ] /*["GUILDS", "GUILD_MESSAGES"]*/
    });
    
    /*
    let wrapper = Object.create(client);
    
    let evts = {};
    let targets = "ready,message".split(",");
    targets.map(t=>{
        evts[t] = [];
        client.on(t,function(a,b,c,d,e,f){
            evts[t].map(cb=>{
                console.log("cb called");
                cb(a,b,c,d,e,f)
            });
        });
    });
    client.on = function(evt,cb){
        evts[evt].push(cb)
    };*/
    return client;
};


const client = getClient(Discord);
require('dotenv').config();
client.login(process.env.TOKEN);


let Bot = require("./bot.js");

let main = async function(){
    let bot = (new Bot(client,"?"));
    let a = bot.sub("adminscript");
    a.sub("exec").addFunc((msg,substr)=>{
        console.log("exec called");
        msg.reply(substr);
    });
    
    a.sub("parse").addFunc((msg,substr)=>{
        msg.reply(substr);
    });
    
    let initmsgs = [];
    bot.onReady(()=>{
        console.log(`Logged in as ${client.user.tag}!`);
        const guilds = bot.client.guilds.cache;
        initmsgs.push("guilds: "+JSON.stringify(guilds.map(g=>g.name)));
        //sending it to every channels
        guilds.map(guild=>{
            //GUILD_CATEGORY
            //GUILD_CATEGORY
            //GUILD_TEXT
            //GUILD_VOICE
            guild.channels.cache.filter(channel=>{
                channel.type === "GUILD_TEXT";
            }).map(channel=>{
                console.log(channel.type);
                channel.send(initmsgs.join("\n"));
            });
        });
    });
};

main();
