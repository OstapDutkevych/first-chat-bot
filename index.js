const {gameOptions, againOptions } = require('./options');
const Telegram = require('node-telegram-bot-api');

const token = '2009110287:AAHohSAkZZ1AL5ZY6t46FloDYSeWVewCBl0';

const bot = new Telegram(token, {polling:true});

const chats ={};

const optionMarkupLang = {
    "parse_mode": "HTML",
};

const startGame = async (chatId)=> {
    await bot.sendMessage(chatId, `I'll guess the number from 0 to 9 and you have to guess the number`)
    let randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Start guessing', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command:'/start', description:'Initial greeting'},
        {command:'/info', description:'Get information about users'},
        {command:'/game', description:'Play game and relax'},
    ])

    bot.on('message', async msg => {
        const {text, chat} = msg

        if(text === "/start"){
            console.log(msg)
            await bot.sendSticker(chat.id,'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chat.id, `Hello ${chat.first_name.bold()} You are Welcome!!`, optionMarkupLang)
        }
        if(text === "/info"){
            console.log(msg)
            return bot.sendMessage(chat.id, `Your Name: ${chat.first_name.bold()} and Surname: ${chat.last_name.bold()}`, optionMarkupLang)

        }
        if(text === "/game"){
           return startGame(chat.id)
        }
       return bot.sendMessage(chat.id, 'I don not understand you, try again please!!')
    })

    bot.on('callback_query', async msg => {
        const { data, message:{chat}} = msg;

        if(data === '/again'){
            return startGame(chat.id);
        }
        if(+data === +chats[chat.id]){
            return bot.sendMessage(chat.id, `My congratulations, you guessed the number: ${chats[chat.id]}`.bold(), againOptions)
        }else {
            console.log(chats)
            return bot.sendMessage(chat.id, `Unfortunately you didn't guess, I guessed the number:   ${chats[chat.id]}` , againOptions)
        }

    })
}

start()