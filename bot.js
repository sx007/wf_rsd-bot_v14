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

//----------------------------------------
//Список команд
function funcCommands(authorRole, command){
    //authorRole = 0-Владелец сервера, 1-Админы и модераторы (из idAdmMod), 2-Прочие пользователи
    //command = название команды из чата

    //Команды владельца сервера
    if (authorRole == 0) {
        //Текстовый чат
        return EmbMsg(':information_source: СПИСОК КОМАНД',0x7ED321,`\n**\`${prefix}команды\`** отобразить список всех доступных команд\n**\`${prefix}боец\`** получить игровую статистику о бойце\n**\`${prefix}клан\`** получить информацию о ежемесячном рейтинге клана\n**\`${prefix}бот\`** получить информацию о данном боте\n**\`${prefix}вк\`** получить ссылку на группу клана в VK\n**\`${prefix}монетка\`** случайный результат подброса монетки\n**\`${prefix}гороскоп\`** Позволяет получить гороскоп на сегодня по указанному знаку зодиака\n\n**\`${prefix}rs\`** перезагрузить бота\n**\`${prefix}ping\`** узнать время генерации сообщения\n**\`${prefix}удалить\`** позволяет удалить N-количество сообщений в текстовом канале\n**\`${prefix}кик\`** позволяет выгналь пользователя с сервера\n**\`${prefix}бан\`** позволяет забанить пользователя на сервере\n\n:warning: Получить подробную справку о любой команде можно добавив через пробел вопросительный знак.\n**Пример набора команды**\n\`\`\`${prefix}${command} ?\`\`\``);
    }
    //Команды админов и модераторов (из idAdmMod)
    if (authorRole == 1) {
        //Текстовый чат
        return EmbMsg(':information_source: СПИСОК КОМАНД',0x7ED321,`\n**\`${prefix}команды\`** отобразить список всех доступных команд\n**\`${prefix}боец\`** получить игровую статистику о бойце\n**\`${prefix}клан\`** получить информацию о ежемесячном рейтинге клана\n**\`${prefix}бот\`** получить информацию о данном боте\n**\`${prefix}вк\`** получить ссылку на группу клана в VK\n**\`${prefix}монетка\`** случайный результат подброса монетки\n**\`${prefix}гороскоп\`** Позволяет получить гороскоп на сегодня по указанному знаку зодиака\n\n**\`${prefix}кик\`** позволяет выгналь пользователя с сервера\n**\`${prefix}бан\`** позволяет забанить пользователя на сервере\n\n:warning: Получить подробную справку о любой команде можно добавив через пробел вопросительный знак.\n**Пример набора команды**\n\`\`\`${prefix}${command} ?\`\`\``);
    }
    //Команды прочие пользователи
    if (authorRole == 2) {
        //Текстовый чат
        return EmbMsg(':information_source: СПИСОК КОМАНД',0x7ED321,`\n**\`${prefix}команды\`** отобразить список всех доступных команд\n**\`${prefix}боец\`** получить игровую статистику о бойце\n**\`${prefix}клан\`** получить информацию о ежемесячном рейтинге клана\n**\`${prefix}бот\`** получить информацию о данном боте\n**\`${prefix}вк\`** получить ссылку на группу клана в VK\n**\`${prefix}монетка\`** случайный результат подброса монетки\n**\`${prefix}гороскоп\`** Позволяет получить гороскоп на сегодня по указанному знаку зодиака\n\n:warning: Получить подробную справку о любой команде можно добавив через пробел вопросительный знак.\n**Пример набора команды**\n\`\`\`${prefix}${command} ?\`\`\``);
    }
}

//ВК
function funcVk(){
    return EmbMsg(':thumbsup: Группа клана', 0x2B71FF, `\nВступайте в нашу группу в социальной сети ВКонтакте:\n[Наша группа в ВК](https://vk.com/wf_rsd)`);
}

//Монетка
function funcMonetka(){
    //Вычисляем случайное число от 1 до 3
    var random = Math.floor(Math.random() * 3) + 1;
    if (random === 1) {
        //Если число = 1, то выпадает орёл.
        return ':full_moon: Орёл!';
    } else if (random === 2) { 
        //Если число = 2, то выпадает решка.
        return ':new_moon: Решка!';
    } else if (random === 3) { 
        //Если число = 3, то монета падает ребром.
        return ':last_quarter_moon: Монета упала ребром!';
    }
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

    //Удаление из текстого канала ссылок-приглашений
    if (message.content.includes('discord.gg/') ||  message.content.includes('discordapp.com/invite/')){
        //Если сообщение публичное
        if (privateMsg() == false){
            //Если сообщение от Администратора или Модератора, то разрешаем
            if(!hasRoleId(message.author)){
                //Удаляем сообщение
                message.delete();
                //Отправляем в личку сообщение пользователю
                message.author.send({ content: 'Ссылки-приглашения (Invite) **запрещены** на данном сервере!\nЧтобы кого-то пригласить на другой Discord-сервер, отправьте приглашение или ссылку в личку определённому человеку.', allowedMentions: { repliedUser: false }});
            }
        }
    }

    //Проверка на наличие префикса в начале сообщения
    if (!message.content.startsWith(prefix)) return;
    //Получение команды из полученного сообщения
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const numArgs = args.map(x => parseFloat(x));
    const numArg = numArgs.length;
    const command = args.shift().toLowerCase();

    //----------------------------------------------------
    if (command === "команды") {
        if(numArg === 2 && args[0] === "?") {
            //Выдаём справку по данной команде
            message.reply({ embeds: [EmbMsgHelp(':information_source: СПРАВКА ПО КОМАНДЕ', 0x7ED321, `\nПоказывает краткую информацию доступных для вас команд.\n\n**Пример набора команды**\n\`\`\`${prefix}${command}\`\`\``, 'https://i.imgur.com/h2sueFM.gif')]});
            return;
        }
        //Если сообщение публичное
        if (privateMsg() == false){
            //Если публичное сообщение
            if (hasRoleId(message.author)) {
                //Проверяем на права владельца сервера
                if (message.author.id === ownerSrvID) {
                    //Если есть права владельца
                    message.reply({ embeds: [funcCommands(0,command)]});
                } else {
                    //Если Администратор или Модератор
                    message.reply({ embeds: [funcCommands(1,command)]});
                }
            } else {
                //Обычный пользователь
                message.reply({ embeds: [funcCommands(2,command)]});
            }
        } else {
            //Если личное сообщение
            if (hasRoleId(message.author)) {
                //Проверяем на права владельца сервера
                if (message.author.id === ownerSrvID) {
                    //Если есть права владельца
                    message.reply({ embeds: [funcCommands(0,command)]});
                } else {
                    //Если Администратор или Модератор
                    message.reply({ embeds: [funcCommands(1,command)]});
                }
            } else {
                //Обычный пользователь
                message.reply({ embeds: [funcCommands(2,command)]});
            }
        }
    }

    //Если отправлена команда вк
    else if (command === "вк") {
        if(numArg === 2 && args[0] === "?") {
            //Выдаём справку по данной команде
            message.reply({ embeds: [EmbMsgHelp(':information_source: СПРАВКА ПО КОМАНДЕ', 0x7ED321, `\nДанная команда позволяет получить ссылку на группу нашего клана в социальной сети ВКонтакте.\n\n**Пример набора команды**\n\`\`\`${prefix}${command}\`\`\``, 'https://i.imgur.com/LtMTPRC.gif')]});
            return;
        }
        if(numArg === 1) {
            //Отправляем ссылку на группу
            message.reply({ embeds: [funcVk()], components: [MsgLink('https://vk.com/wf_rsd','Наша группа в ВК')]});
            return;
        }
        if(numArg > 1 && args[0] != "?") {
            //Выдаём ошибку
            message.reply({ embeds: [EmbMsg(':no_entry_sign: Ошибка', 0x2B71FF, `\nДопущена ошибка при вводе команды.\n\n**Пример набора команды**\n\`\`\`${prefix}${command}\`\`\``)]});
            return;
        }
    }

    /* Подбросить монетку */
    else if (command === "монетка") {
        if(numArg === 2 && args[0] === "?") {
            //Выдаём справку по данной команде
            message.reply({ embeds: [EmbMsgHelp(':information_source: СПРАВКА ПО КОМАНДЕ', 0x7ED321, `\nВыдаёт случайный результат подброса монетки.\n\nВарианты:\nОрёл, решка или упала на ребро.\n\n**Пример набора команды**\n\`\`\`${prefix}${command}\`\`\``, 'https://i.imgur.com/zaQC0LS.gif')]});
            return;
        }
        message.reply({ content: funcMonetka(), allowedMentions: { repliedUser: false }});
    }

});

client.login(token);
