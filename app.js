'use strict';
/** POMOYKA DROP v0.2. No server, no paid currency, no external dependencies. */
const STORAGE_KEY = 'pomoika-drop-save-v1';
const RARITIES = {
  common:    { name:'Обычный',       color:'#9d9ead', weight:49 },
  uncommon:  { name:'Необычный',     color:'#72cebd', weight:28 },
  rare:      { name:'Редкий',        color:'#7da9ff', weight:14 },
  epic:      { name:'Эпический',     color:'#b69aff', weight:6 },
  legendary: { name:'Легендарный',   color:'#fcb869', weight:2.5 },
  mythic:    { name:'Абсурдный',     color:'#ff789f', weight:.5 }
};
const UNIVERSES = {
  '42':        {name:'42',     a:'#7756b8',b:'#222039'},
  finance:    {name:'Самый настоящий андерграунд',a:'#ab9341',b:'#2b2923'},
  slop:       {name:'Слоп',a:'#d06f86',b:'#35232d'},
  gold:       {name:'Золотые ютуберы',a:'#c69c4c',b:'#342a21'},
  brainrot:   {name:'Нейрослоп',a:'#b07cdb',b:'#2b2247'},
  gta:        {name:'GTA 6',a:'#e78890',b:'#39243c'},
  cs:         {name:'Легенды CS2',a:'#8cb1dc',b:'#1e2e43'},
  internet:   {name:'Вся остальная помойка',a:'#83bd88',b:'#243529'}
};
// id | title | glyph | rarity | value | universe | description | type | glyphStyle
const RAW_ITEMS = [
  ['n42','42','42','legendary',4200,'42','Просто число. Больше объяснений не требуется.','Число','number'],
  ['fuga','Фугабот','🤖','common',22,'42','Служебная единица братухи.','Персонаж'],
  ['chain42','Цепь 42 карата','⛓️','rare',360,'42','Количество каратов вызывает вопросы.','Предмет'],
  ['shuba','Легендарная шуба','🧥','epic',960,'42','Дресс-код эпохи 42.','Одежда'],
  ['sasavot','Сасавот','🗳️','uncommon',74,'42','Мемная отсылка из вселенной 42.','Отсылка'],
  ['oldgod','Старый Бог','👁️','rare',340,'42','Старый знакомый этой вселенной.','Персонаж'],
  ['gensuha','Генсуха','🎭','uncommon',79,'42','Ещё одна узнаваемая отсылка сообщества.','Отсылка'],
  ['newpeople','Новые люди','👥','rare',315,'42','Фраза и внутренняя отсылка в коллекции.','Отсылка'],
  ['ally42','42 союз','🤝','epic',1150,'42','Там, где пересекаются сообщества.','Событие'],
  ['sticker42','Наклейка «Братуха»','💜','common',18,'42','Липнет даже к экрану.','Наклейка'],
  ['mega42','Абсолютные 42','42','mythic',24000,'42','Число, которое завершило математику.','Число','number'],
  ['fourtwo','4 + 2','4+2','common',15,'42','Пока ещё не сорок два.','Формула','text'],
  ['banana','Банан','🍌','common',16,'finance','Базовый актив. Жёлтый, ликвидный.','Еда'],
  ['bananafarm','Банановая плантация','🌴','rare',410,'finance','Диверсификация с повышенной фруктовостью.','Место'],
  ['turbine','Газовая турбина','⚙️','epic',1750,'finance','Очень убедительная инвестиционная стратегия.','Техника'],
  ['eurotrans','Евротранс','⛽','uncommon',69,'finance','Отсылка к инвестиционным обсуждениям сообщества.','Компания'],
  ['default','Технический дефолт','ДЕФОЛТ','rare',350,'finance','Неприятное событие в красной рамке.','Событие','text'],
  ['coupon','Просроченный купон','📃','common',12,'finance','Купон есть, выплаты нет.','Документ'],
  ['stockmarket','Мосбиржа','📈','uncommon',83,'finance','То вверх, то вниз. Обычно не туда.','Место'],
  ['copium','Копиум акционера','🫙','rare',470,'finance','Технически это не финансовый инструмент.','Явление'],
  ['bananagold','Золотой банан','🍌','legendary',6500,'finance','Легендарный актив золотого стандарта.','Еда'],
  ['yield','Положительная доходность','+∞%','mythic',45000,'finance','По легенде кто-то однажды её видел.','Явление','text'],
  ['hotdog','Хот-дог инвестора','🌭','common',21,'finance','Дивиденды съедены заранее.','Еда'],
  ['redportfolio','Красный портфель','📉','epic',980,'finance','Ничего личного, просто рынок.','Событие'],
  ['slop','Нейрохрючево','🧠','uncommon',81,'slop','Срочно посмотри ещё 700 роликов.','Явление'],
  ['conveyor','Конвейер контента','🏭','rare',340,'slop','Выпуск роликов больше не требует сна.','Механизм'],
  ['deadp','47-й выпуск','47','uncommon',47,'slop','Шуточная отсылка к Дедпи 47.','Видео','number'],
  ['conway','Конвей','📹','rare',370,'slop','Отсылка к YouTube-сегменту и его мемам.','Отсылка'],
  ['reaction','Реакция на реакцию','🔁','common',14,'slop','Добавь ещё одно окно с лицом.','Видео'],
  ['thousand','Тысяча роликов','1000','epic',1100,'slop','Для тех, кому мало одного.','Число','number'],
  ['clickbait','Кликбейт 200%','😱','common',29,'slop','ЭТОТ ПРЕДМЕТ ШОКИРОВАЛ ВСЕХ.','Обложка'],
  ['script','Сценарий не найден','404','legendary',5800,'slop','Попробуйте перегенерировать контент.','Ошибка','number'],
  ['slopking','Король алгоритма','👑','mythic',27000,'slop','Победил удержание. Проиграл смысл.','Титул'],
  ['masik','Масик','🎓','rare',420,'gold','Отсылка к длинным авторским видеоразборам.','Автор'],
  ['solek','Solek','🎙️','epic',1550,'gold','Авторский YouTube как отдельный вид искусства.','Автор'],
  ['boron','Boron2000','B²K','rare',510,'gold','Коллекционный символ автора.','Автор','text'],
  ['tnv','The TnV','🎩','epic',1400,'gold','Шляпа, в которой поместится интернет.','Автор'],
  ['longvideo','Часовое видеоэссе','▶','uncommon',90,'gold','Длительность: 4 часа 42 минуты.','Видео','text'],
  ['microphone','Золотой микрофон','🎤','legendary',7200,'gold','Каждому великому разбору – хороший звук.','Предмет'],
  ['deepdive','Разбор разбора','🗂️','common',24,'gold','Больше слоёв смысла, чем у лука.','Видео'],
  ['hamster','Хомяк в шляпе','🐹','legendary',8500,'gold','Шляпа не прилагается. Она уже на нём.','Персонаж'],
  ['archive','Архив Рунета','📼','mythic',38000,'gold','Потерянное видео 2011 года в 144p.','Артефакт'],
  ['tung','Тун Тун Сахур','🪵','rare',440,'brainrot','Стучит в дверь коллективного сознания.','Персонаж'],
  ['tralala','Тралалело Тралала','🦈','uncommon',85,'brainrot','Три шага в кроссовках до абсурда.','Персонаж'],
  ['bombardiro','Бомбардиро Крокодило','🐊','epic',1260,'brainrot','Воздушная рептилия сомнительного происхождения.','Персонаж'],
  ['ballerina','Балерина Капучино','☕','uncommon',72,'brainrot','Танцует даже в инвентаре.','Персонаж'],
  ['tun42','Тун Тун Братуха','🪵','legendary',9200,'brainrot','Кроссовер мемных вселенных.','Кроссовер'],
  ['aiimage','Шестой палец','✋','common',19,'brainrot','Алгоритм считает, что так должно быть.','Ошибка'],
  ['aiabsurd','Нейроабсурд','🌀','rare',320,'brainrot','Ничего не понял. Всё понравилось.','Явление'],
  ['brainking','Последний нейрослоп','👽','mythic',30000,'brainrot','Когда кончились даже бессмысленные идеи.','Явление'],
  ['vice','Вайс-Сити','🌴','uncommon',85,'gta','Пальмы, розовые огни, большие ожидания.','Место'],
  ['gta6','GTA VI','VI','legendary',6500,'gta','Шестёрка ради одного лишь хайпа.','Игра','number'],
  ['trailer','Двадцать третий трейлер','🎞️','common',18,'gta','Ещё два кадра для десяти видеоразборов.','Видео'],
  ['leak','Утечка на 240p','📱','rare',320,'gta','Качество сомнительное, просмотров миллион.','Видео'],
  ['wait','Ожидание релиза','⌛','epic',1300,'gta','Предмет, который всегда с тобой.','Явление'],
  ['hype','Гиперпетля хайпа','🚀','rare',380,'gta','Скорость обсуждений выше скорости света.','Явление'],
  ['gta42','GTA 42','42','mythic',42000,'gta','Пока ждали шестую часть, вышли ещё 36.','Игра','number'],
  ['patch','Патч первого дня','🩹','common',20,'gta','Размером со всё свободное место.','Файл'],
  ['awp','AWP «Депонлор»','🎯','mythic',52000,'cs','Самая дорогая легенда депозитной фантазии.','Скин CS2'],
  ['ak','AK-47 «Дикий лудос»','🔫','epic',1100,'cs','Никаких цветов, кроме цвета надежды.','Скин CS2'],
  ['deagle','Deagle «Горящий баланс»','🔥','rare',420,'cs','Урон по кошельку +100.','Скин CS2'],
  ['karambit','Керамбит «Доллер»','🗡️','legendary',7800,'cs','Крутится эффектнее, чем рынок.','Скин CS2'],
  ['gloves','Перчатки «Депозит»','🧤','rare',490,'cs','Чтобы не оставить отпечатков на балансе.','Скин CS2'],
  ['m4','M4A1-S «Донатстрим»','🎙️','epic',1750,'cs','Оснащена микрофоном для рекламной интеграции.','Скин CS2'],
  ['sticker','Наклейка «ОКУП»','💸','common',25,'cs','Окуп всегда где-то рядом.','Наклейка'],
  ['gold','Золотой кейс','🧰','uncommon',82,'cs','Красивее содержимого.','Предмет'],
  ['chance','Шанс 0,01%','0.01%','rare',290,'cs','Технически возможно.','Число','text'],
  ['rigged','Честный рандом','🎰','legendary',6100,'cs','Абсолютно случайно, как вы и просили.','Явление'],
  ['trash','Настоящий мусор','🗑️','common',9,'internet','Главный экспонат музея.','Предмет'],
  ['password','Пароль 123456','🔒','common',11,'internet','Не используйте дома.','Пароль'],
  ['pc','Комп на картошке','🥔','uncommon',78,'internet','Картинка не всегда загружается.','Техника'],
  ['cat','Кот из интернета','🐈','rare',360,'internet','Ничего не делает, но заслужил миллион просмотров.','Персонаж'],
  ['rickroll','Не та ссылка','🔗','rare',310,'internet','Не нажимай. Хотя уже поздно.','Событие'],
  ['error','Ошибка 404','404','uncommon',40,'internet','Мем не найден, смысл тоже.','Ошибка','number'],
  ['nothing','Абсолютно ничего','∅','legendary',4200,'internet','Бесценное отсутствие содержимого.','Абстракция','number'],
  ['silence','Семь часов тишины','🔇','epic',880,'internet','Потенциально лучше большинства контента.','Видео'],
  ['universe','Весь интернет','🌐','mythic',60000,'internet','Вы собрали помойку. Поздравляем.','Вселенная'],
  ['meme','Мем без контекста','¿','common',15,'internet','Никто не знает, почему это смешно.','Символ','number']
];
const ITEMS = RAW_ITEMS.map(([id,name,glyph,rarity,value,universe,desc,type,glyphStyle])=>({id,name,glyph,rarity,value,universe,desc,type,glyphStyle:glyphStyle||'emoji'}));
const ITEM_MAP = new Map(ITEMS.map(item=>[item.id,item]));
const CASES = [
 {id:'42',name:'42',summary:'Пятёрка, фугаботы, союзники и противники.',asset:'42.webp',price:299,category:'Мемы',glow:'#b88c45',dark:'#332719',tag:'КУЛЬТ',ids:['fourtwo','sticker42','fuga','sasavot','gensuha','newpeople','oldgod','chain42','shuba','ally42','n42','mega42']},
 {id:'euro',name:'Самый настоящий андерграунд',summary:'Мосбиржа, бананы, турбины, облигации и дефолты.',asset:'underground.webp',price:599,category:'Финансы',glow:'#c7a451',dark:'#342a1c',tag:'ФИНАНСЫ',ids:['banana','hotdog','coupon','eurotrans','stockmarket','default','bananafarm','copium','redportfolio','turbine','bananagold','yield']},
 {id:'slop',name:'Слоп',summary:'Конвей, DeadP47 и бесконечные видео.',asset:'slop.webp',price:399,category:'YouTube',glow:'#b05360',dark:'#3d2328',tag:'YouTube',ids:['reaction','clickbait','deadp','slop','conway','conveyor','thousand','script','slopking']},
 {id:'brain',name:'Нейрослоп',summary:'Тун Тун Сахур, Тралалело и остальные.',asset:'neuroslop.webp',price:749,category:'Мемы',glow:'#a06cdd',dark:'#31244b',tag:'BRAINROT',ids:['aiimage','ballerina','tralala','slop','aiabsurd','tung','bombardiro','tun42','brainking']},
 {id:'gold',name:'Золотые ютуберы',summary:'Solek, Boron2000, The TnV, Masik и другие.',asset:'gold.webp',price:999,category:'YouTube',glow:'#d6a94e',dark:'#40301c',tag:'АВТОРЫ',ids:['deepdive','longvideo','boron','masik','solek','tnv','microphone','hamster','archive']},
 {id:'gta',name:'GTA 6',summary:'Годы ожидания, хайп, трейлеры и утечки.',asset:'gta6.webp',price:1490,category:'Игры',glow:'#d65394',dark:'#402038',tag:'ИГРЫ',ids:['trailer','patch','vice','leak','hype','wait','gta6','gta42']},
 {id:'cs',name:'Легенды CS2',summary:'AWP «Депонлор» и другие пародийные скины.',asset:'cs.svg',price:549,category:'Игры',glow:'#819cd5',dark:'#223449',tag:'CS2',ids:['sticker','gold','chance','deagle','gloves','ak','m4','rigged','karambit','awp']},
 {id:'dump',name:'Общая помойка',summary:'Всё, что не попало в тематические кейсы.',asset:'dump.svg',price:149,category:'Мемы',glow:'#80b08d',dark:'#263629',tag:'СМЕШАННЫЙ',ids:['trash','password','meme','error','pc','cat','rickroll','silence','nothing','universe','banana','fuga','trailer','sticker']}
];
const DAILY_CASE={id:'daily',name:'Ежедневный кейс',summary:'Одна бесплатная награда каждый день.',asset:'daily.svg',price:0,category:'Мемы',glow:'#7a58a0',dark:'#3b3154',tag:'БЕСПЛАТНО',ids:['trash','meme','banana','fuga','coupon','sticker','error','reaction','cat','tung','n42','gold','nothing']};
const CASE_MAP=new Map([...CASES,DAILY_CASE].map(c=>[c.id,c]));
const fmt=n=>Math.round(n).toLocaleString('ru-RU');
const pct=n=>Number(n).toLocaleString('ru-RU',{maximumFractionDigits:2});
const escapeHTML=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeNum=(n,fallback=0)=>Number.isFinite(Number(n))?Number(n):fallback;
const rand=(n)=>Math.floor(Math.random()*n);
const uniqueId=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`i-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function defaults(){return{version:1,balance:4200,inventory:[],lastDailyAt:0,stats:{opened:0,spent:0,earned:0,upgrades:0,wins:0},streamer:{enabled:false,luck:85}};}
function validateSave(data){
 if(!data||typeof data!=='object'||data.version!==1||!Array.isArray(data.inventory)||data.inventory.length>20000)throw Error('Неподдерживаемый формат сохранения');
 if(typeof data.balance!=='number'||!Number.isFinite(data.balance)||data.balance<0||data.balance>1e12)throw Error('Некорректный баланс');
 const inv=data.inventory.map(x=>{if(!x||!ITEM_MAP.has(x.id))throw Error('В сохранении найден неизвестный предмет');return{id:x.id,uid:String(x.uid||uniqueId()).slice(0,100),at:Math.max(0,safeNum(x.at,Date.now()))};});
 const d=defaults();return{...d,balance:data.balance,inventory:inv,lastDailyAt:Math.max(0,safeNum(data.lastDailyAt)),stats:{opened:Math.max(0,safeNum(data.stats?.opened)),spent:Math.max(0,safeNum(data.stats?.spent)),earned:Math.max(0,safeNum(data.stats?.earned)),upgrades:Math.max(0,safeNum(data.stats?.upgrades)),wins:Math.max(0,safeNum(data.stats?.wins))},streamer:{enabled:!!data.streamer?.enabled,luck:Math.max(0,Math.min(100,safeNum(data.streamer?.luck,85)))}};
}
let state=defaults();
try{const stored=localStorage.getItem(STORAGE_KEY);if(stored)state=validateSave(JSON.parse(stored));}catch(err){console.warn('Сохранение не загружено:',err);}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch(err){console.warn('Невозможно сохранить:',err);toast('Браузер блокирует сохранение. Используй экспорт файла.',true);return false;}}
function sameDay(t){if(!t)return false;let a=new Date(t),b=new Date();return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}
function nextDayTime(){let d=new Date();d.setHours(24,0,0,0);let ms=d.getTime()-Date.now();return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}`;}
let page='cases', caseFilter='Все', collectionFilter='Все', collectionSearch='', invFilter='Все', upSource=null, upTarget=null, currentModal=null, spinning=false, toastTimer=null;
function renderCasePoster(c){return `<div class="case-poster" style="--case-glow:${c.glow};--case-dark:${c.dark}"><img class="case-poster-img" src="assets/cases/${c.asset}" alt="${escapeHTML(c.name)}" loading="lazy" width="500" height="520"></div>`;}
// Vector symbols for a mixed catalogue of memes, numbers, fictional objects and CS2 references.
// Every item has a non-emoji illustration. Some intentionally use typography as the artwork.
const ICON_KIND={
 banana:'banana',bananagold:'banana',bananafarm:'banana',hotdog:'food',
 turbine:'turbine',eurotrans:'fuel',default:'text',stockmarket:'chart',redportfolio:'chart',coupon:'paper',yield:'text',copium:'jar',
 fuga:'robot',shuba:'coat',chain42:'chain',sasavot:'eye',oldgod:'eye',gensuha:'mask',newpeople:'people',ally42:'people',sticker42:'text',
 conveyor:'factory',slop:'brain',conway:'play',reaction:'play',clickbait:'play',slopking:'crown',
 masik:'book',solek:'mic',boron:'mic',tnv:'hat',longvideo:'play',microphone:'mic',deepdive:'book',hamster:'hat',archive:'film',
 tung:'wood',tralala:'shark',bombardiro:'croc',ballerina:'coffee',tun42:'wood',aiimage:'hand',aiabsurd:'brain',brainking:'brain',
 vice:'palm',trailer:'film',leak:'play',wait:'hourglass',hype:'burst',patch:'paper',
 awp:'rifle',ak:'rifle',deagle:'pistol',karambit:'knife',gloves:'hand',m4:'rifle',sticker:'text',gold:'case',rigged:'dice',
 trash:'trash',password:'lock',pc:'monitor',cat:'cat',rickroll:'link',silence:'speaker',universe:'globe',meme:'text'
};
const VECTOR_ICONS={
 banana:`<path d="M24 67c14 21 48 16 65-9 6-9 8-16 8-23-14 19-34 27-50 20-10-4-14-12-17-25-14 15-15 26-6 37Z" fill="#ecc85b" stroke="#ffe59c" stroke-width="3"/><path d="M39 75c24 8 41-2 55-22" fill="none" stroke="#a46b19" stroke-width="3"/>`,
 turbine:`<circle cx="60" cy="60" r="40" fill="#2c3240" stroke="currentColor" stroke-width="6"/><circle cx="60" cy="60" r="13" fill="#afc0cf"/><path d="M58 46Q30 8 20 32L45 59Q16 61 25 83L53 71Q49 104 75 98L70 68Q94 86 102 62L74 57Q96 32 72 20L62 46Z" fill="#a6b0ba" stroke="#d5e0e8" stroke-width="2"/>`,
 food:`<path d="M23 72Q33 28 74 34q30 8 25 38-29 13-76 0Z" fill="#d49b4b" stroke="#ffe2a1" stroke-width="4"/><path d="M25 58Q61 43 98 63" stroke="#ba3636" stroke-width="10" stroke-linecap="round"/>`,
 fuel:`<path class="vector-line" d="M32 101V30q0-10 10-10h37q10 0 10 10v70M20 101h83M89 40l14 9v30q0 10 10 3V56l-10-10"/><rect x="42" y="30" width="36" height="23" rx="2" fill="currentColor" opacity=".8"/>`,
 chart:`<path class="vector-line" d="M20 94V18M20 94h86M28 74l22-19 20 13 27-40"/><path class="vector-line" d="m86 30 11-2-2 14"/><path d="M33 31v20m11-27v17m35 12v25m13-48v17" stroke="currentColor" stroke-width="3"/>`,
 paper:`<path class="vector-line" d="M31 17h44l18 20v67H31zM75 17v23h18M43 56h36M43 70h36M43 84h25"/>`,
 jar:`<rect x="33" y="39" width="54" height="63" rx="10" fill="#53435b" stroke="currentColor" stroke-width="5"/><path class="vector-line" d="M30 34h60M40 22h40M40 70h40"/>`,
 robot:`<rect x="31" y="33" width="58" height="61" rx="12" fill="#3b4659" stroke="currentColor" stroke-width="5"/><path class="vector-line" d="M60 33V19M45 76h30"/><circle cx="46" cy="57" r="6" fill="#f7e3a5"/><circle cx="74" cy="57" r="6" fill="#f7e3a5"/>`,
 coat:`<path d="M39 18 24 41 18 98h29l10-33 8 33h30l-6-57-18-23-15 12Z" fill="#7c6c5f" stroke="currentColor" stroke-width="5"/><path d="m39 18 21 23 11-23M60 41l-3 58" class="vector-line"/>`,
 chain:`<path class="vector-line" d="M18 80q-15-18 7-34l16-7q23-9 28 14 0 18-19 22l-15 8M104 40q16 18-7 34l-16 7Q58 90 53 67q0-18 19-22l15-8"/>`,
 eye:`<path class="vector-line" d="M11 60Q60 11 109 60 60 109 11 60Z"/><circle cx="60" cy="60" r="18" fill="currentColor"/><circle cx="65" cy="54" r="6" fill="#16131c"/>`,
 mask:`<path class="vector-line" d="M25 20q35-14 70 0v47q-6 29-35 38-29-9-35-38Z"/><path class="vector-line" d="M34 50h20M67 50h20M47 78q13 10 26 0"/>`,
 people:`<circle cx="42" cy="43" r="14" class="vector-solid"/><circle cx="80" cy="43" r="14" class="vector-solid"/><path d="M16 101q0-33 26-33t26 33M55 101q0-33 25-33t25 33" class="vector-line"/>`,
 factory:`<path class="vector-line" d="M15 100V51l26 16V49l26 17V43l32 20v37ZM29 52V23h14v38M24 83h10M48 83h11M73 83h11"/>`,
 brain:`<path class="vector-line" d="M55 25Q28 7 22 34q-22 18-2 37Q16 96 51 98M65 25q27-18 33 9 22 18 2 37 4 25-31 27M60 19v85M27 49h20M73 49h20M34 72h13M73 72h13"/>`,
 play:`<rect x="18" y="28" width="84" height="64" rx="12" fill="#262533" stroke="currentColor" stroke-width="5"/><path d="m50 43 28 17-28 17Z" fill="currentColor"/>`,
 crown:`<path class="vector-line" d="m12 38 19 16 29-33 28 33 20-16-9 58H22l-10-58ZM24 103h72"/>`,
 mic:`<rect x="43" y="13" width="34" height="64" rx="17" fill="#453b38" stroke="currentColor" stroke-width="5"/><path class="vector-line" d="M31 58q0 35 29 35 29 0 29-35M60 94v15M42 109h36"/>`,
 book:`<path class="vector-line" d="M60 34q-27-19-46-5v68q21-13 46 5 26-18 46-5V29q-21-14-46 5Zm0 1v66"/>`,
 hat:`<path class="vector-line" d="m37 72 7-45h32l7 45M14 79q44 25 92 0M33 68h54"/>`,
 film:`<rect x="18" y="18" width="84" height="84" rx="8" class="vector-line"/><path class="vector-line" d="M37 18v84M83 18v84M18 38h84M18 80h84"/><circle cx="60" cy="59" r="12" class="vector-solid"/>`,
 wood:`<rect x="36" y="16" width="48" height="92" rx="20" fill="#8f6945" stroke="currentColor" stroke-width="5"/><circle cx="49" cy="48" r="5" fill="#17120d"/><circle cx="71" cy="48" r="5" fill="#17120d"/><path d="M49 75q11 8 22 0" class="vector-line"/>`,
 shark:`<path d="M9 73q28-46 65-35l17-25 8 31-15 10 26 23-34-6Q46 91 9 73Z" fill="#7f99a9" stroke="#b5c9dc" stroke-width="4"/><circle cx="70" cy="52" r="4" fill="#16171a"/>`,
 croc:`<path d="M17 76q5-35 46-35l17-20 9 25 18 11-13 8 11 23-32-9Q39 98 17 76Z" fill="#5e986c" stroke="#b7e0a9" stroke-width="4"/><circle cx="70" cy="54" r="5" fill="#171a15"/>`,
 coffee:`<path class="vector-line" d="M22 42h70v26q0 28-35 28T22 68V42ZM92 50h11q16 20-11 23M18 103h84"/>`,
 hand:`<path class="vector-line" d="M47 104 26 78q-13-16 0-22 10-4 18 7V19q0-13 13-13 13 0 13 13v29-18q0-13 13-11 13 3 13 14v39q0 18-15 32Z"/>`,
 palm:`<path class="vector-line" d="M62 51q4 28-5 54M62 52q-21-30-48-20 14 5 25 21-22-4-35 16 29-1 57-17 17-28 40-20-8 4-24 22 22-4 38 13-34-2-53-15Z"/>`,
 hourglass:`<path class="vector-line" d="M32 14h56M32 106h56M41 17q-4 29 19 43-23 18-19 42M80 17q4 29-20 43 24 18 20 42"/>`,
 burst:`<path class="vector-line" d="M60 7 70 40 103 21 85 53 114 64 84 70 101 101 67 82 60 114 51 83 17 102 35 70 6 61 36 54 18 21 52 39Z"/>`,
 rifle:`<path d="M10 55h80v12H73l-17 24H41l11-24H10Z" fill="#b6a7a0" stroke="currentColor" stroke-width="4"/><path class="vector-line" d="M52 53V40h30l10-9M86 57h28M31 65v13M29 44h14"/>`,
 pistol:`<path d="M18 45h75v20H66l-11 38H33l7-38H18Z" fill="#b6a7a0" stroke="currentColor" stroke-width="4"/>`,
 knife:`<path d="M24 100 81 43q18-20 17-31 22 19 1 43L44 110Z" fill="#ae9e9a" stroke="currentColor" stroke-width="4"/>`,
 case:`<rect x="18" y="32" width="84" height="67" rx="8" class="vector-line"/><path class="vector-line" d="M37 32V21h46v11M18 50h84M52 50v15h17V50"/>`,
 dice:`<rect x="27" y="27" width="66" height="66" rx="10" fill="#634a56" stroke="currentColor" stroke-width="5"/><g fill="#ffdeb2"><circle cx="45" cy="45" r="5"/><circle cx="75" cy="75" r="5"/><circle cx="60" cy="60" r="5"/></g>`,
 trash:`<path class="vector-line" d="M24 35h72M42 22h36M32 35l7 69h42l7-69M49 49v38M71 49v38"/>`,
 lock:`<rect x="29" y="55" width="62" height="49" rx="8" class="vector-line"/><path class="vector-line" d="M40 55V40q0-20 20-20t20 20v15"/><circle cx="60" cy="77" r="5" class="vector-solid"/>`,
 monitor:`<rect x="15" y="20" width="90" height="64" rx="5" class="vector-line"/><path class="vector-line" d="M59 84v18M38 102h44"/>`,
 cat:`<path class="vector-line" d="M23 45 18 15l28 15q15-8 29 0l29-15-5 30q8 45-38 54-46-9-38-54Z"/><circle cx="42" cy="58" r="6" class="vector-solid"/><circle cx="78" cy="58" r="6" class="vector-solid"/><path class="vector-line" d="m54 76 6 5 6-5"/>`,
 link:`<path class="vector-line" d="m50 41 14-14q24-17 39 0 15 18-3 34L84 77M70 79 56 94q-25 16-39 0-14-18 3-34l15-16M40 78l41-40"/>`,
 speaker:`<path class="vector-line" d="M15 47h25l28-26v78L40 74H15Zm70-18 24 62"/>`,
 globe:`<circle cx="60" cy="60" r="44" class="vector-line"/><path class="vector-line" d="M16 60h88M60 16v88M36 22q28 35 0 76M84 22Q56 59 84 98"/>`
};
function vectorItemMarkup(item){
 const key=ICON_KIND[item.id]||({Число:'text',Формула:'text',Символ:'text',Событие:'chart',Видео:'play',Отсылка:'play',Автор:'mic',Персонаж:'people',Предмет:'case',Игра:'play',Документ:'paper'}[item.type])||'case';
 if(item.glyphStyle==='number'||item.glyphStyle==='text'||key==='text'){
   const t=item.glyphStyle==='number'||item.glyphStyle==='text' ? item.glyph : item.name;
   const words=t.length>10?t.split(' ').slice(0,2).join(' '):t;
   const fs=words.length>14?13:words.length>9?17:words.length>5?25:words.length>3?35:words.length>2?44:55;
   return `<text class="${words.length>5?'vector-text':'vector-number'}" x="60" y="69" style="font-size:${fs}px">${escapeHTML(words)}</text>`;
 }
 return VECTOR_ICONS[key]||VECTOR_ICONS.case;
}
function art(item){const p=UNIVERSES[item.universe],rar=RARITIES[item.rarity];return `<div class="item-art" style="--art-a:${p.a};--art-b:${p.b};--rarity:${rar.color}"><span class="item-graphic"><svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${vectorItemMarkup(item)}</svg></span><span class="item-rarity-line"></span></div>`;}
function itemCard(item,{uid='',qty=0,selectable=false,selected=false,action='',small=false,showPrice=true}={}){
 return `<div class="item-card${selectable?' selectable':''}${selected?' selected':''}" ${selectable?`data-${action}="${escapeHTML(uid||item.id)}" role="button" tabindex="0"`:''}>
  ${art(item)}${qty>1?`<span class="item-qty">×${qty}</span>`:''}
  <div class="item-card-body"><div class="item-name">${escapeHTML(item.name)}</div><div class="item-sub">${RARITIES[item.rarity].name} · ${escapeHTML(item.type)}</div>${showPrice?`<div class="item-value">${fmt(item.value)} <small>₽</small></div>`:''}
  ${uid&&!selectable?`<div class="item-actions"><button class="mini-button" type="button" data-item-detail="${item.id}">О предмете</button><button class="mini-button primary" type="button" data-sell="${escapeHTML(uid)}">Продать</button></div>`:''}</div></div>`;
}
function renderHead(){document.getElementById('balance-value').textContent=fmt(state.balance);document.getElementById('inventory-counter').textContent=fmt(state.inventory.length);const b=document.getElementById('stream-toggle');b.classList.toggle('on',state.streamer.enabled);b.setAttribute('aria-pressed',String(state.streamer.enabled));document.getElementById('hero-item-count').textContent=ITEMS.length;document.getElementById('hero-collection-count').textContent=Object.keys(UNIVERSES).length;
 const ticker=document.getElementById('preview-drop-list');if(ticker){const latest=state.inventory.slice(-2).reverse().map(x=>x.id);const sample=['n42','banana','turbine','oldgod','tralala','awp','default'];const ids=[...latest,...sample].slice(0,7);ticker.innerHTML=ids.map(id=>{const item=ITEM_MAP.get(id);return `<div class="preview-drop-entry">${art(item)}<div><strong>${escapeHTML(item.name)}</strong><small>${RARITIES[item.rarity].name}</small></div></div>`;}).join('');}}
function renderDaily(){let claimed=sameDay(state.lastDailyAt);const status=document.getElementById('daily-status-text');status.textContent=claimed?`Сегодня уже открыто. Следующий бесплатный кейс через ${nextDayTime()}.`:'Один бесплатный кейс каждый календарный день. Без подписок и СМС.';const btn=document.getElementById('daily-banner-button');btn.innerHTML=claimed?'Уже получено ✓': 'Открыть бесплатно <span>↗</span>';btn.disabled=claimed;const hero=document.getElementById('hero-open-daily');hero.textContent=claimed?'Ежедневный кейс получен':'Забрать бесплатный кейс ↗';hero.disabled=claimed;}
function renderCases(){let filters=['Все',...new Set(CASES.map(x=>x.category))];document.getElementById('case-filters').innerHTML=filters.map(x=>`<button type="button" class="filter-chip ${caseFilter===x?'active':''}" data-case-filter="${escapeHTML(x)}">${escapeHTML(x)}</button>`).join('');document.getElementById('case-grid').innerHTML=CASES.filter(c=>caseFilter==='Все'||c.category===caseFilter).map(c=>`<article class="case-card">${renderCasePoster(c)}<div class="case-tag">${escapeHTML(c.tag)}</div><div class="case-details"><h3 class="case-name">${escapeHTML(c.name)}</h3><p class="case-summary">${escapeHTML(c.summary)}</p><div class="case-bottom"><div class="case-price">${fmt(c.price)} <small>₽</small></div><button type="button" class="case-open" data-case="${c.id}">Открыть ↗</button></div></div></article>`).join('');}
function renderInventory(){const el=document.getElementById('inventory-content');const total=state.inventory.reduce((s,x)=>s+(ITEM_MAP.get(x.id)?.value||0),0);const unique=new Set(state.inventory.map(x=>x.id)).size;const filters=['Все','Скины CS2','Значки и числа','Остальное'];let inv=state.inventory.filter(x=>{const it=ITEM_MAP.get(x.id);return invFilter==='Все'||(invFilter==='Скины CS2'&&it.universe==='cs')||(invFilter==='Значки и числа'&&['Число','Значок','Наклейка','Формула','Символ'].includes(it.type))||(invFilter==='Остальное'&&it.universe!=='cs'&&!['Число','Значок','Наклейка','Формула','Символ'].includes(it.type));}).slice().reverse();
 el.innerHTML=`<div class="stats-row"><div class="stat-box"><small>Всего наград</small><strong>${fmt(state.inventory.length)}</strong></div><div class="stat-box"><small>Разных предметов</small><strong>${fmt(unique)}</strong></div><div class="stat-box"><small>Стоимость инвентаря</small><strong>${fmt(total)} ₽</strong></div></div><div class="toolbar"><div class="flex-row">${filters.map(f=>`<button type="button" data-inv-filter="${escapeHTML(f)}" class="filter-chip ${invFilter===f?'active':''}">${escapeHTML(f)}</button>`).join('')}</div><div class="note">Открыто кейсов: ${fmt(state.stats.opened)}</div></div>${inv.length?`<div class="item-grid">${inv.map(x=>itemCard(ITEM_MAP.get(x.id),{uid:x.uid})).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">◇</div><h3>${state.inventory.length?'В этой категории пусто':'Тут пока слишком чисто'}</h3><p>Открой первый кейс, чтобы начать коллекцию абсолютно бессмысленных ценностей.</p><button type="button" class="btn btn-primary" data-go="cases">К кейсам ↗</button></div>`}`;}
function getSource(){return state.inventory.find(x=>x.uid===upSource)||null;}
function getTarget(){return ITEM_MAP.get(upTarget)||null;}
function upgradeChance(source,target){if(!source||!target||target.value<=source.value)return 0;return state.streamer.enabled?state.streamer.luck:Math.max(.05,Math.min(85,source.value/target.value*90));}
function chooseDefaultTarget(source){if(!source)return null;return ITEMS.filter(x=>x.value>source.value).sort((a,b)=>a.value-b.value)[0]?.id||null;}
function renderUpgrade(){const el=document.getElementById('upgrade-content');let sourceEntry=getSource();if(!sourceEntry&&state.inventory.length){upSource=state.inventory[state.inventory.length-1].uid;sourceEntry=getSource();}const source=sourceEntry?ITEM_MAP.get(sourceEntry.id):null;let target=getTarget();if(!target||source&&target.value<=source.value){upTarget=chooseDefaultTarget(source);target=getTarget();}const chance=upgradeChance(source,target);
 const slot=(label,item,price,empty)=>`<div class="upgrade-slot"><div class="upgrade-slot-heading"><span>${label}</span><span>${item?'✓ ВЫБРАНО':'НЕ ВЫБРАНО'}</span></div>${item?`<div class="selected-item">${art(item)}<div><div class="selected-name">${escapeHTML(item.name)}</div><div class="selected-price">${fmt(item.value)} ₽</div></div></div>`:`<div class="slot-placeholder"><span class="slot-placeholder-icon">${empty}</span><strong>${label==='ТВОЙ ПРЕДМЕТ'?'Нет предметов':'Выбери цель'}</strong><span>${label==='ТВОЙ ПРЕДМЕТ'?'Сначала открой кейс':'Нужен предмет из инвентаря'}</span></div>`}</div>`;
 const own=state.inventory.slice().reverse().map(entry=>({entry,item:ITEM_MAP.get(entry.id)}));const targets=source?ITEMS.filter(x=>x.value>source.value).sort((a,b)=>a.value-b.value):[];
 el.innerHTML=`<div class="upgrade-layout">${slot('ТВОЙ ПРЕДМЕТ',source,source?.value,'01')}<div class="upgrade-center"><div class="chance-ring" style="--chance:${chance}%"><div><small>ШАНС УСПЕХА</small><strong>${pct(chance)}%</strong></div></div>${state.streamer.enabled?'<span class="stream-badge">● РЕЖИМ СТРИМЕРА – ШАНС ИЗМЕНЁН</span>':`<p>Чем дороже цель, тем ниже шанс.</p>`}<button type="button" class="btn btn-primary btn-wide" data-upgrade="1" ${!source||!target?'disabled':''}>АПГРЕЙДНУТЬ ↗</button><p>При неудаче исходный предмет сгорает. Все цены игровые.</p></div>${slot('ЖЕЛАЕМАЯ ЦЕЛЬ',target,target?.value,'02')}</div><div class="picker-wrap"><div class="toolbar"><h3>1. Выбери предмет из инвентаря</h3><span class="note">${own.length} шт.</span></div>${own.length?`<div class="picker-items">${own.map(x=>itemCard(x.item,{uid:x.entry.uid,selectable:true,selected:x.entry.uid===upSource,action:'source'})).join('')}</div>`:`<div class="empty-state"><p>Инвентарь пуст. Начни с бесплатного кейса.</p><button class="btn btn-primary" type="button" data-go="cases">Открыть кейсы</button></div>`}</div><div class="picker-wrap"><div class="toolbar"><h3>2. Выбери предмет, который хочешь получить</h3><span class="note">Показаны цели дороже исходной</span></div>${targets.length?`<div class="picker-items">${targets.map(x=>itemCard(x,{selectable:true,selected:x.id===upTarget,action:'target'})).join('')}</div>`:`<div class="empty-state"><p>${source?'Дороже этого предмета уже ничего нет.':'Сначала выбери исходный предмет.'}</p></div>`}</div>`;
}
function renderCollections(){const el=document.getElementById('collections-content');const tabs=['Все',...Object.keys(UNIVERSES)];const all=ITEMS.filter(x=>(collectionFilter==='Все'||x.universe===collectionFilter)&&(`${x.name} ${x.desc} ${UNIVERSES[x.universe].name}`.toLowerCase().includes(collectionSearch.toLowerCase())));const owned=new Set(state.inventory.map(x=>x.id));
 el.innerHTML=`<div class="toolbar"><div class="toolbar-title">Исследуй коллекцию</div><input type="search" id="collection-search" class="search-input" autocomplete="off" placeholder="Найти мем или предмет…" value="${escapeHTML(collectionSearch)}" aria-label="Поиск по коллекциям"></div><div class="collection-tabs">${tabs.map(x=>`<button type="button" class="collection-tab ${collectionFilter===x?'active':''}" data-collection-filter="${escapeHTML(x)}">${x==='Все'?'Все вселенные':escapeHTML(UNIVERSES[x].name)}</button>`).join('')}</div><div class="collection-summary">Найдено <strong>${all.length}</strong> наград · Собрано уникальных <strong>${owned.size} / ${ITEMS.length}</strong></div>${all.length?`<div class="item-grid">${all.map(x=>`<div class="item-card"><div style="cursor:pointer" data-item-detail="${x.id}">${art(x)}<div class="item-card-body"><div class="item-name">${escapeHTML(x.name)} ${owned.has(x.id)?'✓':''}</div><div class="item-sub">${escapeHTML(UNIVERSES[x.universe].name)}</div><div class="item-value">${fmt(x.value)} ₽</div></div></div></div>`).join('')}</div>`:`<div class="empty-state"><h3>Не найдено</h3><p>Попробуй другой поисковый запрос.</p></div>`}`;
}
function renderAll(){renderHead();renderDaily();renderCases();renderInventory();renderUpgrade();renderCollections();}
function go(next){if(!['cases','upgrade','inventory','collections'].includes(next))return;page=next;document.querySelectorAll('.page').forEach(e=>e.classList.toggle('is-visible',e.id===`page-${page}`));document.querySelectorAll('[data-go]').forEach(e=>e.classList.toggle('active',e.dataset.go===page));if(location.hash!==`#${page}`)history.replaceState(null,'',`#${page}`);window.scrollTo({top:0,behavior:'smooth'});}
function toast(message,error=false){const e=document.getElementById('toast-stack');e.innerHTML=`<div class="toast ${error?'error':''}">${escapeHTML(message)}</div>`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.innerHTML='',3300);}
function modal(inner,size=''){closeModal();const root=document.getElementById('modal-root');currentModal=uniqueId();root.innerHTML=`<div class="modal-backdrop" data-backdrop="1"><div class="modal ${size}" role="dialog" aria-modal="true" aria-label="Диалог Помойка Дроп" data-modal-id="${currentModal}"><button class="modal-close" type="button" data-close="1" aria-label="Закрыть">×</button>${inner}</div></div>`;document.body.classList.add('modal-open');root.querySelector('.modal-close')?.focus({preventScroll:true});return currentModal;}
function closeModal(){document.getElementById('modal-root').innerHTML='';document.body.classList.remove('modal-open');currentModal=null;spinning=false;}
function caseModal(caseId){const c=CASE_MAP.get(caseId);if(!c)return;const dailyClaimed=c.id==='daily'&&sameDay(state.lastDailyAt);modal(`<div class="modal-head"><div class="eyebrow dim">ОТКРЫТИЕ КЕЙСА / ${escapeHTML(c.tag)}</div><h2>${escapeHTML(c.name)}</h2></div><div class="modal-content"><div class="case-modal-top">${renderCasePoster(c)}<div><div class="case-modal-text">${escapeHTML(c.summary)} Предмет может оказаться скином, персонажем, бананом или просто числом. Это нормально.</div><div class="case-modal-stats"><span class="pill">${c.ids.length} возможных наград</span><span class="pill">${c.price?`${fmt(c.price)} ₽`:'Бесплатно'}</span></div>${state.streamer.enabled?`<span class="stream-badge">● СТРИМЕР: ${state.streamer.luck}% шанс высоких редкостей</span>`:''}</div></div><div class="case-open-actions"><button type="button" class="btn btn-primary" data-open-case="${c.id}" ${dailyClaimed?'disabled':''}>${dailyClaimed?'Сегодня уже получено':`Открыть ${c.price?`за ${fmt(c.price)} ₽`:'бесплатно'} ↗`}</button><button class="btn btn-outline" type="button" data-close="1">Закрыть</button></div><div class="loot-title">ЧТО МОЖЕТ ВЫПАСТЬ</div><div class="loot-grid">${c.ids.map(id=>{const it=ITEM_MAP.get(id);return itemCard(it,{showPrice:false});}).join('')}</div></div>`, 'large');}
function randomItem(c){const pool=c.ids.map(id=>ITEM_MAP.get(id)).filter(Boolean);if(state.streamer.enabled&&Math.random()*100<state.streamer.luck){const high=pool.filter(x=>['legendary','mythic'].includes(x.rarity));if(high.length)return high[rand(high.length)];}
 const poolWeights=pool.map(x=>RARITIES[x.rarity].weight/Math.max(1,pool.filter(a=>a.rarity===x.rarity).length));let n=Math.random()*poolWeights.reduce((a,b)=>a+b,0);for(let i=0;i<pool.length;i++){n-=poolWeights[i];if(n<=0)return pool[i];}return pool[pool.length-1];}
function startOpening(id){if(spinning)return;const c=CASE_MAP.get(id);if(!c)return;if(id==='daily'&&sameDay(state.lastDailyAt)){toast('Сегодня бесплатный кейс уже открыт.',true);return;}if(state.balance<c.price){toast('Не хватает помойкоинов. Продай предметы или забери ежедневный кейс.',true);return;}
 const reward=randomItem(c);state.balance-=c.price;if(id==='daily')state.lastDailyAt=Date.now();state.stats.opened++;state.stats.spent+=c.price;const entry={id:reward.id,uid:uniqueId(),at:Date.now()};state.inventory.push(entry);save();renderAll();
 const reel=Array.from({length:42},(_,i)=>i===36?reward:ITEM_MAP.get(c.ids[rand(c.ids.length)]));spinning=true;const modalId=modal(`<div class="modal-head"><div class="eyebrow dim">РУЛЕТКА В ДЕЛЕ</div><h2>${escapeHTML(c.name)}</h2></div><div class="modal-content"><div class="reel-viewport" id="reel-viewport"><div class="reel-pointer"></div><div class="reel-track" id="reel-track">${reel.map(it=>`<div class="reel-item">${art(it)}<div class="reel-item-name">${escapeHTML(it.name)}</div></div>`).join('')}</div></div><p class="note" style="text-align:center">Результат выбран. Крутится исключительно для драматического эффекта.</p></div>`,'large');spinning=true;
 const viewport=document.getElementById('reel-viewport');const track=document.getElementById('reel-track');const winnerEl=track?.children[36];const shouldAnimate=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const distance=()=>winnerEl?viewport.clientWidth/2-(winnerEl.offsetLeft+winnerEl.clientWidth/2):0;
 if(track&&winnerEl){if(shouldAnimate){requestAnimationFrame(()=>requestAnimationFrame(()=>{if(currentModal===modalId){track.classList.add('reel-animating');track.style.transform=`translateX(${distance()}px)`;}}));}else{track.style.transform=`translateX(${distance()}px)`;}}
 setTimeout(()=>{if(currentModal===modalId){spinning=false;showDropResult(reward,entry.uid,c.name);}else spinning=false;},shouldAnimate?3350:250);
}
function showDropResult(item,uid,caseName){modal(`<div class="modal-head"><div class="eyebrow dim">КЕЙС ОТКРЫТ · ${escapeHTML(caseName)}</div><h2>ТВОЙ НОВЫЙ МУСОР</h2></div><div class="modal-content"><div class="result-card">${art(item)}<div><div class="rarity-name" style="color:${RARITIES[item.rarity].color}">${RARITIES[item.rarity].name}</div><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.desc)}</p><div class="result-value">${fmt(item.value)} ₽</div><div class="result-actions"><button type="button" class="btn btn-primary btn-small" data-close="1">Оставить</button><button type="button" class="btn btn-outline btn-small" data-sell="${escapeHTML(uid)}">Продать</button></div></div></div></div>`);}
function sell(uid){const i=state.inventory.findIndex(x=>x.uid===uid);if(i<0){toast('Предмет уже продан.',true);return;}const [entry]=state.inventory.splice(i,1);const item=ITEM_MAP.get(entry.id);state.balance+=item.value;state.stats.earned+=item.value;if(upSource===uid){upSource=null;upTarget=null;}save();closeModal();renderAll();toast(`Продано: ${item.name} (+${fmt(item.value)} ₽)`);}
function detail(itemId){const item=ITEM_MAP.get(itemId);if(!item)return;modal(`<div class="modal-head"><div class="eyebrow dim">ЭКСПОНАТ МЕМНОГО МУЗЕЯ</div><h2>${escapeHTML(item.name)}</h2></div><div class="modal-content"><div class="item-detail">${art(item)}<div><span class="rarity-name" style="color:${RARITIES[item.rarity].color}">${RARITIES[item.rarity].name}</span><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.desc)}</p><p>Вселенная: <strong>${escapeHTML(UNIVERSES[item.universe].name)}</strong><br>Тип: <strong>${escapeHTML(item.type)}</strong></p><div class="detail-price">${fmt(item.value)} ₽</div></div></div></div>`,'small');}
function doUpgrade(){const e=getSource(),target=getTarget();if(!e||!target)return;const source=ITEM_MAP.get(e.id),chance=upgradeChance(source,target);if(!chance)return;const index=state.inventory.findIndex(x=>x.uid===e.uid);if(index<0)return;state.inventory.splice(index,1);const won=Math.random()*100<chance;let newEntry=null;if(won){newEntry={uid:uniqueId(),id:target.id,at:Date.now()};state.inventory.push(newEntry);state.stats.wins++;}state.stats.upgrades++;upSource=null;upTarget=null;save();renderAll();modal(`<div class="modal-head"><div class="eyebrow dim">АПГРЕЙД ЗАВЕРШЁН</div><h2>${won?'НЕОЖИДАННЫЙ ОКУП!':'ПРЕДМЕТ УШЁЛ В ПОМОЙКУ'}</h2></div><div class="modal-content"><div class="result-card">${art(won?target:source)}<div><div class="rarity-name" style="color:${won?'#d9ff70':'#ff879b'}">${won?'УСПЕХ':'НЕУДАЧА'}</div><h3>${escapeHTML(won?target.name:source.name)}</h3><p>${won?'Невероятно! Новая награда уже в инвентаре.':'Исходный предмет потерян. Это были исключительно игровые ценности.'}</p><p>Шанс был ${pct(chance)}%${state.streamer.enabled?' в режиме стримера':''}.</p><div class="result-actions"><button class="btn btn-primary btn-small" type="button" data-go="inventory">Инвентарь ↗</button><button class="btn btn-outline btn-small" type="button" data-close="1">Закрыть</button></div></div></div></div>`);}
function showSettings(){modal(`<div class="modal-head"><div class="eyebrow dim">ЛОКАЛЬНАЯ ДЕМОВЕРСИЯ</div><h2>НАСТРОЙКИ ПОМОЙКИ</h2></div><div class="modal-content"><div class="setting-group"><div class="setting-line"><div><h3>Режим стримера</h3><p>Открыто изменяет вероятности внутри этой вымышленной игры.</p></div><label class="switch" aria-label="Режим стримера"><input type="checkbox" id="setting-streamer" ${state.streamer.enabled?'checked':''}><span class="switch-track"></span></label></div><div id="luck-settings"><div class="setting-line"><span class="note">Шанс высокой награды в кейсах и успеха апгрейда</span><strong id="luck-label">${state.streamer.luck}%</strong></div><input class="range" type="range" id="setting-luck" min="0" max="100" step="1" value="${state.streamer.luck}" ${state.streamer.enabled?'':'disabled'}><div class="range-row"><span>0% · рандом</span><span>100% · реклама удалась</span></div></div></div><div class="setting-group"><h3>Сохранения</h3><p>Прогресс хранится в этом браузере (localStorage). Экспортируй файл, чтобы перенести инвентарь на другое устройство. Дата ежедневного кейса тоже хранится локально.</p><div class="settings-actions"><button type="button" class="btn btn-outline btn-small" data-export="1">Экспорт .json</button><button type="button" class="btn btn-outline btn-small" data-import="1">Импорт .json</button><button type="button" class="btn btn-danger btn-small" data-reset="1">Новая игра</button></div></div><div class="setting-group"><h3>Статистика</h3><div class="note">Открытий: <strong>${fmt(state.stats.opened)}</strong> · Апгрейдов: <strong>${fmt(state.stats.upgrades)}</strong> · Побед: <strong>${fmt(state.stats.wins)}</strong> · Потрачено: <strong>${fmt(state.stats.spent)} ₽</strong></div></div><div class="modal-footnote">Демо не содержит настоящих платежей, авторизации и обмена со Steam. Все шансы в режиме стримера регулируются явно, без скрытой подкрутки.</div></div>`,'small');}
function exportSave(){const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(b);const a=document.createElement('a');a.href=url;a.download='pomoika-drop-save.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Сохранение экспортировано.');}
async function importSave(file){try{if(file.size>2000000)throw Error('Файл слишком большой');const loaded=validateSave(JSON.parse(await file.text()));state=loaded;upSource=null;upTarget=null;save();closeModal();renderAll();toast('Сохранение импортировано.');}catch(err){toast(err.message||'Не удалось прочитать файл.',true);}}
function resetGame(){if(!confirm('Удалить текущий инвентарь, баланс и статистику? Действие необратимо без экспортированного сохранения.'))return;state=defaults();upSource=null;upTarget=null;save();closeModal();renderAll();go('cases');toast('Новая игра начата.');}
// Single event delegation for all dynamically rendered pages and overlays.
document.addEventListener('click',e=>{
 const btn=e.target.closest('button,a[data-go],[data-source],[data-target],[data-item-detail]');if(!btn){if(e.target.matches('[data-backdrop]'))closeModal();return;}
 if(btn.hasAttribute('data-close')){closeModal();return;}
 if(btn.dataset.go){e.preventDefault();closeModal();go(btn.dataset.go);return;}
 if(btn.dataset.scroll){document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'});return;}
 if(btn.dataset.caseFilter){caseFilter=btn.dataset.caseFilter;renderCases();return;}
 if(btn.dataset.invFilter){invFilter=btn.dataset.invFilter;renderInventory();return;}
 if(btn.dataset.collectionFilter){collectionFilter=btn.dataset.collectionFilter;renderCollections();return;}
 if(btn.dataset.case){caseModal(btn.dataset.case);return;}
 if(btn.dataset.openCase){startOpening(btn.dataset.openCase);return;}
 if(btn.dataset.sell){sell(btn.dataset.sell);return;}
 if(btn.dataset.itemDetail){detail(btn.dataset.itemDetail);return;}
 if(btn.dataset.source){upSource=btn.dataset.source;upTarget=null;renderUpgrade();return;}
 if(btn.dataset.target){upTarget=btn.dataset.target;renderUpgrade();return;}
 if(btn.dataset.upgrade){doUpgrade();return;}
 if(btn.dataset.export){exportSave();return;}
 if(btn.dataset.import){document.getElementById('import-file').click();return;}
 if(btn.dataset.reset){resetGame();return;}
 if(btn.id==='hero-open-daily'||btn.id==='daily-banner-button'||btn.dataset.daily){caseModal('daily');return;}
 if(btn.id==='stream-toggle'||btn.id==='open-settings'||btn.id==='footer-settings'||btn.dataset.streamPanel){showSettings();return;}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentModal){closeModal();return;}if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-source],[role="button"][data-target]')){e.preventDefault();e.target.click();}});
document.addEventListener('input',e=>{if(e.target.id==='setting-luck'){state.streamer.luck=Math.max(0,Math.min(100,Number(e.target.value)));document.getElementById('luck-label').textContent=`${state.streamer.luck}%`;save();renderUpgrade();}if(e.target.id==='collection-search'){const pos=e.target.selectionStart;collectionSearch=e.target.value;renderCollections();const input=document.getElementById('collection-search');input.focus();input.setSelectionRange(pos,pos);}});
document.addEventListener('change',e=>{if(e.target.id==='setting-streamer'){state.streamer.enabled=e.target.checked;document.getElementById('setting-luck').disabled=!e.target.checked;save();renderHead();renderUpgrade();}if(e.target.id==='import-file'&&e.target.files?.[0]){importSave(e.target.files[0]);e.target.value='';}});
window.addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(['cases','upgrade','inventory','collections'].includes(p))go(p);});
renderAll();go(['cases','upgrade','inventory','collections'].includes(location.hash.slice(1))?location.hash.slice(1):'cases');
setInterval(renderDaily,60000);
