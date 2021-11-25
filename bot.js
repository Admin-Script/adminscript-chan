/*
let isntEmpty = function(obj){
    for(let key in obj){
        return true;
    }
    return false;
};*/


let min = function(a,b){
    return a < b ? a : b;
};




let Cmds = function(str){
    this.name = str;
    let maxsublen = 0;
    this.sub = function(name){
        //console.log(name,name.length);
        if(maxsublen < name.length){
            maxsublen = name.length;
        }
        if(!(name in this.subcmds)){
            this.subcmds[name] = new Cmds(name);
        }
        return this.subcmds[name];
    };
    this.subcmds = {};
    this.always = [];//executes no matter what
    this.tops = [];//top function only responds to tail call
    this.addFunc = function(cb,always){
        if(always){
            this.always.push(cb);
        }else{
            this.tops.push(cb);
        }
    };
    
    this.call = function(msg,substr){
        //console.log(substr);
        this.always.map(cb=>cb(msg,substr));
        //parsing the substr
        let b = (substr.match(/^\s+/)||"").length;
        let token = "";
        let ii = 0;
        //console.log(maxsublen,b,min(substr.length,b+maxsublen));
        for(let i = b; i < min(substr.length,b+maxsublen+1); i++){
            if(substr[i].match(/\s/)){//found the limit
                ii = i;
                token = substr.slice(b,ii);
                //console.log("matched token",token);
                break;
            }else if(i+1 === substr.length){
                //end of the string, token found
                ii = i+1;
                token = substr.slice(b,ii);
                //console.log("matched end",token);
                break;
            }
        }
        //console.log(token,ii);
        if(token && token in this.subcmds){//sub command found
            let substr1 = substr.slice(ii);
            //console.log(token,substr1);
            this.subcmds[token].call(msg,substr1);
        }else{
            this.tops.map(cb=>cb(msg,substr));
        }
    };
};



//re-factored the bot
//bot is now a client wrapper
let Bot = function(client,prefix){
    this.client = client;
    let that = this;
    this.prefix = prefix||"/";
    
    let cmds = new Cmds();
    this.sub = cmds.sub.bind(cmds);
    
    //readyness schenanigen
    this.ready = false;
    let readyFuncs = [];
    this.onReady = function(cb){
        if(this.ready){
            cb();
        }else{
            readyFuncs.push(cb);
        }
    };
    client.on("ready", () => {
        that.isReady = true;
        readyFuncs.map(cb=>cb());
    });
    
    
    client.on("message", async msg => {
        let str = msg.content.trim();
        if(str.slice(0,that.prefix.length) === that.prefix){//if equal to prefix
            str = str.slice(that.prefix.length).trim();
            cmds.call(msg,str);
        }
    });
};

module.exports = Bot;


