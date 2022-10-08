const { Client, GatewayIntentBits, Partials, ChannelType, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, TextInputBuilder, ModalBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.MessageContent], partials: [Partials.User, Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.ThreadMember] });
var request = require('request');
//Токен
const token = process.env.BOT_TOKEN;
//Префикс для команд
const prefix = process.env.PREFIX;
//ID канала, куда слать системные сообщения
const idChMsg = process.env.ID_CHANNEL_SEND;
//ID сервера
const idSrv = process.env.ID_SERVER;
//Название клана
const clNm = process.env.CLAN_NAME;
//ID ролей (Администраторов и Модераторов)
const idAdmMod = process.env.ID_ADM_MOD_ROLE;
//Время старта бота
const startBot = Date.now();
//Для устранения проблем с получением request
process.env.UV_THREADPOOL_SIZE = 64;
//Задаем настройки по умолчанию
const customRequest = request.defaults({
    method: "GET",
    agent : false, 
    pool : {maxSockets: 500}, 
    timeout : 20000
});

//Заготовка для Embed сообщения (обычное)
function EmbMsg(title, color, descr){
    let embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setDescription(descr)
    .setTimestamp()
    return embed;
}

//Заготовка для Embed сообщения (справка)
function EmbMsgHelp(title, color, descr, img){
    let embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setDescription(descr)
    .setImage(img)
    .setTimestamp()
    return embed;
}

//Заготовка для Embed сообщения (информационные сообщения)
function EmbedMsg(color, Descr){
    let embed = new EmbedBuilder()
    .setColor(color)
    .setDescription(Descr)
    .setTimestamp()
    return embed;
}

//Заготовка для Кнопки-ссылки
function MsgLink(link,linkdesc){
    let linkButton = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(linkdesc)
        .setURL(link)
        .setStyle(ButtonStyle.Link)
        );
    return linkButton;
}

//Список для гороскопа
function listForHoro(CustId){
    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId(CustId)
                .setPlaceholder('Выберите знак зодиака')
                .addOptions([
                    {
                        label: 'Овен',
                        description: 'Прогноз для знака - Овен',
                        value: 'aries',
                        emoji: '♈',
                    },
                    {
                        label: 'Телец',
                        description: 'Прогноз для знака - Телец',
                        value: 'taurus',
                        emoji: '♉',
                    },
                    {
                        label: 'Близнецы',
                        description: 'Прогноз для знака - Близнецы',
                        value: 'gemini',
                        emoji: '♊',
                    },
                    {
                        label: 'Рак',
                        description: 'Прогноз для знака - Рак',
                        value: 'cancer',
                        emoji: '♋',
                    },
                    {
                        label: 'Лев',
                        description: 'Прогноз для знака - Лев',
                        value: 'leo',
                        emoji: '♌',
                    },
                    {
                        label: 'Дева',
                        description: 'Прогноз для знака - Дева',
                        value: 'virgo',
                        emoji: '♍',
                    },
                    {
                        label: 'Весы',
                        description: 'Прогноз для знака - Весы',
                        value: 'libra',
                        emoji: '♎',
                    },
                    {
                        label: 'Скорпион',
                        description: 'Прогноз для знака - Скорпион',
                        value: 'scorpio',
                        emoji: '♏',
                    },
                    {
                        label: 'Стрелец',
                        description: 'Прогноз для знака - Стрелец',
                        value: 'sagittarius',
                        emoji: '♐',
                    },
                    {
                        label: 'Козерог',
                        description: 'Прогноз для знака - Козерог',
                        value: 'capricorn',
                        emoji: '♑',
                    },
                    {
                        label: 'Водолей',
                        description: 'Прогноз для знака - Водолей',
                        value: 'aquarius',
                        emoji: '♒',
                    },
                    {
                        label: 'Рыбы',
                        description: 'Прогноз для знака - Рыбы',
                        value: 'pisces',
                        emoji: '♓',
                    },
                ]),
        );
    return row;
}

//Проверка ролей Администратора и Модераторов по ID из переменной (конфигурации)
function hasRoleId(mem){
    var idRepl = idAdmMod.replace(/ +/g, ' ');
    var idSplit = idRepl.split(' ');
    var result = false;
    //Перебираем ID в переменной
    idSplit.forEach(function(idSplit) {
        if (idSplit != '') {
            //Проверяем длинну ID
            if (idSplit.length === 18) {
                //Проверка указанного id сервера
                if (idSrv !== '' || idSrv.length === 18) {
                    //Проверка роли
                    var members = client.guilds.cache.get(idSrv).roles.cache.find(role => role.id === idSplit).members.map(m=>m.user.id);
                    //Находим среди пользователей с ролью автора сообщения
                    if (members.indexOf(mem.id) != -1) {
                        result = true;
                    }
                }
            }
        }
    });
    //Выводим результат
    return result;
}

//Проверка на JSON
function IsJsonString(str) {
    str = typeof item !== "string"
        ? JSON.stringify(str)
        : str;
    try {
        str = JSON.parse(str);
    } catch (e) {
        return false;
    }
    if (typeof str === "object" && str !== null) {
        return true;
    }
    return false;
}










//

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    //Если это сам же бот, то игнорировать
    if (message.author.bot) return;
    
    //Получаем ID владельца сервера
    const ownerSrvID = client.guilds.cache.map(guild => guild.ownerId).join("\n");
    //Название сервера
    const nameSrv = client.guilds.cache.map(guild => guild.name).join("\n");

    //Проверка на личное сообщение
    function privateMsg(){
        //Если личное сообщение
        if (message.channel.type === ChannelType.DM){
            return true;
        }
        //Если публичное сообщение
        if (message.channel.type === ChannelType.GuildText){
            return false;
        }
    }

    if (message.content === 'ping'){
        message.reply('Pong!');
        if(hasRoleId(message.author)){
            message.reply('adm!');
        }
        //Если сообщение публичное
        if (privateMsg() == false){
            message.reply('pub');
        } else {
            message.reply('priv');
        }
    }
});

client.login(token);
