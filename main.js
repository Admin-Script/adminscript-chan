const Discord = require("discord.js");
let Adminscript = require("adminscript");
const { spawn } = require('child_process');
//const AdminScript = require("./AdminScript.js/main.js");

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
    
    
    
    
    
    let a = bot.sub("adminscript");
    bot.sub("exec").addFunc((msg,substr)=>{
        console.log("exec called");
        msg.reply(substr);
    });
    
    let parsecmd = bot.sub("parse");
    parsecmd.addFunc((msg,substr)=>{
        console.log("\""+substr+"\"");
        try{
            let ast = Adminscript.parse(substr)[0];
            msg.reply("```javascript\n"+JSON.stringify(ast,null,4)+"\n```");
        }catch(err){
            msg.reply(err+"");
        }
    });
    
    parsecmd.sub("-e").addFunc((msg,substr)=>{
        console.log("\""+substr+"\"");
        try{
            let ast = Adminscript.parse(substr);
            msg.reply("```javascript\n"+JSON.stringify(ast,null,4)+"\n```");
        }catch(err){
            msg.reply(err+"");
        }
    });
    
    bot.sub("inspect").addFunc((msg,substr)=>{
        let varname = substr.trim();
        if("msg substr bot this Adminscript main client".split(" ").indexOf(varname) !== -1){
            let variable = eval(varname)//this[varname];
            msg.reply("```javascript\n"+JSON.stringify(variable,function(key, val) { return (typeof val === 'function') ? '[function]' : val; },4)+"\n```");
        }else{
            msg.reply(varname+": access to variable denied");
        }
    });
    
    bot.sub("update").addFunc(async (msg,substr)=>{
        msg.reply("updating itself");
        const child = spawn("npm", ["update"]);
        for await (const data of child.stdout) {
            msg.channel.send(""+data);
        };
        child.on("exit", code => {
            msg.channel.send("Update complete");
            msg.channel.send(`Exit code is: ${code}`);
            delete require.cache[require.resolve("adminscript")];
            Adminscript = require("adminscript");
        });
    });
};

main();
