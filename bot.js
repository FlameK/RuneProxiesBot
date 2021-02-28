const settings = require("./settings.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const url = process.env.MONGODB_URI; // "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });
const moment = require("moment");

let client1;


client.login(settings.token);

client.on("ready", ready =>{
    console.log("Ready");
    mongoClient.connect(function(err, cli){
        client1 = cli;
    })
    setInterval(() =>{
        checkReminders();
    }, 60 * 1000)
})

client.on("message", msg =>{
    let args = msg.content.split(' ');
    if(msg.channel.type !== "text" || msg.author.bot) return;
    if(args[0] === settings.prefix + "renew" && msg.member.hasPermission("ADMINISTRATOR")){
        //renew <reminder> @user1 @user2 in x amount of time
        let users = msg.mentions.members.array();
        let us = [];
        for(let i = 0; i < users.length; i++){
            us.push(users[i].id);
        }
        if(users.length < 1) return;
        if(!msg.content.split("<")[1]) return;
        let reminder = msg.content.split("<")[1].split(">")[0];
        let type = args[args.length - 1];
        if(!Number.isInteger(Number.parseInt(args[args.length - 2]))) return;
        let value =Number.parseInt(args[args.length - 2]);
        if(type !== "days" && type !== "hours" && type !== "minutes" && type !== "months" && type !== "weeks") return;
        let rem = moment();
        rem.add(value, type);
        let db = client1.db("rembot");
        let collection = db.collection("reminders");
        collection.insertOne({message : reminder, channel : msg.channel.id, users : us, expires : rem.format(), remthree : false}, function(err){
            if(err) console.log(err);
            msg.reply("Reminder was added successfully!");
        })
    }
})

function checkReminders(){
    let db = client1.db("rembot");
    let collection = db.collection("reminders");
    collection.find().toArray(function(err, result){
        if(err) console.log(err);
        for(let i = 0; i < result.length; i++){
            let now = moment();
            let exp = moment(result[i].expires);
            let threed = moment(exp);
            threed.subtract(3, "days");
            if(now.date() === exp.date() && now.month() === exp.month()){
                let ch = client.channels.cache.get(result[i].channel);
                if(ch){
                    let mess = '';
                    for(let j = 0; j < result[i].users.length; j++){
                        mess += `<@${result[i].users[j]}>, `
                    }
                    mess += `you have ${result[i].message} which expire today. Please let us know if you would like to renew them so you don't loose access.`;
                    ch.send(mess);
                    collection.deleteOne(result[i], function(err){
                        if(err) console.log(err);
                    })
                }
            }
            else{
                if(threed.date() === now.date() && threed.month() === now.month() && !result[i].remthree){
                    let ch = client.channels.cache.get(result[i].channel);
                    if(ch){
                        let mess = '';
                        for(let j = 0; j < result[i].users.length; j++){
                            mess += `<@${result[i].users[j]}>, `
                        }
                        mess += `you have ${result[i].message} which will expire in 3 days. Let us know if you would like to renew them so you do not loose access.`;
                        ch.send(mess);
                        collection.updateOne(result[i], {$set : {remthree : true}}, function(err){
                            if(err) console.log(err);
                        })
                    }
                }
            }
        }
    })
}

