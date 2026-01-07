import { Injectable } from '@nestjs/common';
import { Smogon } from '@pkmn/smogon';
import { Dex } from '@pkmn/dex';
import { Generations } from '@pkmn/data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pokemon } from '../Entities/Pokemon';
import { PokemonBuild } from '../Entities/PokemonBuild';
import {In} from 'typeorm';

@Injectable()
export class SmogonService {
  private smogon: Smogon;
  private gens: Generations;

  constructor(
    @InjectRepository(PokemonBuild)
    private readonly buildRepo: Repository<PokemonBuild>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepo: Repository<Pokemon>,
  ) {
    this.smogon = new Smogon(globalThis.fetch);
    this.gens = new Generations(Dex);
  }

  /**
   * Obtiene los builds de un Pokémon y los guarda en la base de datos
   * @param pokemon Instancia de Pokemon
   * @returns Lista de builds guardadas
   */


  async normalizePokemonName(name: string): Promise<string> {
    return name
      .normalize("NFD")                       // separa tildes
      .replace(/[\u0300-\u036f]/g, "")        // elimina tildes
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")                   // espacios → guiones
      .replace(/[^a-z0-9-]/g, "")             // limpia caracteres no válidos
      .replace(/--+/g, "-");                  // evita guiones dobles
  }

  private normalizeForSmogon(name: string): string {
    const map: Record<string, string> = {
      "mightyena": "Mightyena",
      "calyrex": "Calyrex",
      "silicobra": "Silicobra",
      "dusknoir": "Dusknoir",
      "octillery": "Octillery",
      "beautifly": "Beautifly",
      "druddigon": "Druddigon",
      "zeraora": "Zeraora",
      "eiscue-ice": "Eiscue-Ice",
      "dhelmise": "Dhelmise",
      "pawmi": "Pawmi",
      "silcoon": "Silcoon",
      "kabutops": "Kabutops",
      "electrode": "Electrode",
      "illumise": "Illumise",
      "golem": "Golem",
      "paras": "Paras",
      "pupitar": "Pupitar",
      "tyrogue": "Tyrogue",
      "prinplup": "Prinplup",
      "jangmo-o": "Jangmo-o",
      "purugly": "Purugly",
      "skiddo": "Skiddo",
      "roserade": "Roserade",
      "kangaskhan": "Kangaskhan",
      "hypno": "Hypno",
      "crabrawler": "Crabrawler",
      "seismitoad": "Seismitoad",
      "celesteela": "Celesteela",
      "trumbeak": "Trumbeak",
      "pansage": "Pansage",
      "nincada": "Nincada",
      "gossifleur": "Gossifleur",
      "patrat": "Patrat",
      "garbodor": "Garbodor",
      "tangela": "Tangela",
      "sunflora": "Sunflora",
      "wynaut": "Wynaut",
      "aron": "Aron",
      "caterpie": "Caterpie",
      "musharna": "Musharna",
      "pidgey": "Pidgey",
      "thievul": "Thievul",
      "falinks": "Falinks",
      "simisage": "Simisage",
      "morelull": "Morelull",
      "celebi": "Celebi",
      "skrelp": "Skrelp",
      "lotad": "Lotad",
      "happiny": "Happiny",
      "pidgeot": "Pidgeot",
      "eevee": "Eevee",
      "pheromosa": "Pheromosa",
      "slowpoke": "Slowpoke",
      "yanma": "Yanma",
      "sinistea": "Sinistea",
      "bouffalant": "Bouffalant",
      "aromatisse": "Aromatisse",
      "honedge": "Honedge",
      "regigigas": "Regigigas",
      "chikorita": "Chikorita",
      "genesect": "Genesect",
      "chingling": "Chingling",
      "hoppip": "Hoppip",
      "purrloin": "Purrloin",
      "graveler": "Graveler",
      "spoink": "Spoink",
      "golett": "Golett",
      "accelgor": "Accelgor",
      "blacephalon": "Blacephalon",
      "finneon": "Finneon",
      "mawile": "Mawile",
      "brionne": "Brionne",
      "seedot": "Seedot",
      "sandygast": "Sandygast",
      "chatot": "Chatot",
      "swablu": "Swablu",
      "pancham": "Pancham",
      "glalie": "Glalie",
      "jigglypuff": "Jigglypuff",
      "melmetal": "Melmetal",
      "steelix": "Steelix",
      "gulpin": "Gulpin",
      "oddish": "Oddish",
      "dewgong": "Dewgong",
      "dratini": "Dratini",
      "ledian": "Ledian",
      "marshadow": "Marshadow",
      "poliwhirl": "Poliwhirl",
      "swanna": "Swanna",
      "klink": "Klink",
      "maushold-family-of-four": "Maushold-Family-of-Four",
      "jynx": "Jynx",
      "arctozolt": "Arctozolt",
      "spinda": "Spinda",
      "tapu-koko": "Tapu Koko",
      "tadbulb": "Tadbulb",
      "grubbin": "Grubbin",
      "kricketot": "Kricketot",
      "swoobat": "Swoobat",
      "klang": "Klang",
      "archeops": "Archeops",
      "walrein": "Walrein",
      "popplio": "Popplio",
      "ducklett": "Ducklett",
      "inkay": "Inkay",
      "pumpkaboo-average": "Pumpkaboo-Average",
      "manectric": "Manectric",
      "togedemaru": "Togedemaru",
      "ampharos": "Ampharos",
      "loudred": "Loudred",
      "zubat": "Zubat",
      "jellicent": "Jellicent",
      "combee": "Combee",
      "torchic": "Torchic",
      "togepi": "Togepi",
      "clobbopus": "Clobbopus",
      "vespiquen": "Vespiquen",
      "dartrix": "Dartrix",
      "starmie": "Starmie",
      "binacle": "Binacle",
      "grapploct": "Grapploct",
      "emolga": "Emolga",
      "electrike": "Electrike",
      "miltank": "Miltank",
      "mime-jr": "Mime Jr.",
      "espurr": "Espurr",
      "tandemaus": "Tandemaus",
      "staravia": "Staravia",
      "machoke": "Machoke",
      "nidoran-m": "Nidoran-M",
      "woobat": "Woobat",
      "yungoos": "Yungoos",
      "poochyena": "Poochyena",
      "pawmo": "Pawmo",
      "mr-rime": "Mr. Rime",
      "skitty": "Skitty",
      "centiskorch": "Centiskorch",
      "blipbug": "Blipbug",
      "dewpider": "Dewpider",
      "bronzor": "Bronzor",
      "floette": "Floette",
      "magby": "Magby",
      "staryu": "Staryu",
      "piplup": "Piplup",
      "crobat": "Crobat",
      "parasect": "Parasect",
      "tangrowth": "Tangrowth",
      "kingler": "Kingler",
      "doublade": "Doublade",
      "basculin-red-striped": "Basculin-Red-Striped",
      "maractus": "Maractus",
      "exploud": "Exploud",
      "dustox": "Dustox",
      "granbull": "Granbull",
      "wugtrio": "Wugtrio",
      "hatenna": "Hatenna",
      "slaking": "Slaking",
      "stakataka": "Stakataka",
      "obstagoon": "Obstagoon",
      "claydol": "Claydol",
      "diggersby": "Diggersby",
      "swalot": "Swalot",
      "simisear": "Simisear",
      "milcery": "Milcery",
      "helioptile": "Helioptile",
      "pichu": "Pichu",
      "cascoon": "Cascoon",
      "anorith": "Anorith",
      "turtwig": "Turtwig",
      "nidoran-f": "Nidoran-F",
      "solosis": "Solosis",
      "rapidash": "Rapidash",
      "palpitoad": "Palpitoad",
      "metang": "Metang",
      "darumaka": "Darumaka",
      "oshawott": "Oshawott",
      "fennekin": "Fennekin",
      "escavalier": "Escavalier",
      "sizzlipede": "Sizzlipede",
      "hoothoot": "Hoothoot",
      "wormadam-plant": "Wormadam-Plant",
      "xerneas": "Xerneas",
      "tynamo": "Tynamo",
      "ferroseed": "Ferroseed",
      "togetic": "Togetic",
      "chimecho": "Chimecho",
      "duskull": "Duskull",
      "watchog": "Watchog",
      "cetoddle": "Cetoddle",
      "goomy": "Goomy",
      "flapple": "Flapple",
      "scorbunny": "Scorbunny",
      "bewear": "Bewear",
      "snivy": "Snivy",
      "sigilyph": "Sigilyph",
      "joltik": "Joltik",
      "swellow": "Swellow",
      "pidove": "Pidove",
      "kadabra": "Kadabra",
      "victini": "Victini",
      "pinsir": "Pinsir",
      "furret": "Furret",
      "cosmog": "Cosmog",
      "litwick": "Litwick",
      "geodude": "Geodude",
      "krabby": "Krabby",
      "throh": "Throh",
      "nidorina": "Nidorina",
      "bergmite": "Bergmite",
      "munna": "Munna",
      "boltund": "Boltund",
      "orbeetle": "Orbeetle",
      "xurkitree": "Xurkitree",
      "rockruff": "Rockruff",
      "vanilluxe": "Vanilluxe",
      "misdreavus": "Misdreavus",
      "steenee": "Steenee",
      "scatterbug": "Scatterbug",
      "whirlipede": "Whirlipede",
      "mantine": "Mantine",
      "rookidee": "Rookidee",
      "lileep": "Lileep",
      "quilava": "Quilava",
      "carnivine": "Carnivine",
      "bellsprout": "Bellsprout",
      "shuckle": "Shuckle",
      "gastly": "Gastly",
      "leavanny": "Leavanny",
      "metapod": "Metapod",
      "wigglytuff": "Wigglytuff",
      "corvisquire": "Corvisquire",
      "liepard": "Liepard",
      "spidops": "Spidops",
      "nuzleaf": "Nuzleaf",
      "shiinotic": "Shiinotic",
      "cubchoo": "Cubchoo",
      "magcargo": "Magcargo",
      "dugtrio": "Dugtrio",
      "sealeo": "Sealeo",
      "nacli": "Nacli",
      "glaceon": "Glaceon",
      "gimmighoul": "Gimmighoul",
      "frigibax": "Frigibax",
      "heliolisk": "Heliolisk",
      "abra": "Abra",
      "exeggcute": "Exeggcute",
      "tirtouga": "Tirtouga",
      "slugma": "Slugma",
      "mothim": "Mothim",
      "rampardos": "Rampardos",
      "nidoking": "Nidoking",
      "pineco": "Pineco",
      "skiploom": "Skiploom",
      "vanillite": "Vanillite",
      "relicanth": "Relicanth",
      "marill": "Marill",
      "stonjourner": "Stonjourner",
      "archen": "Archen",
      "grumpig": "Grumpig",
      "dubwool": "Dubwool",
      "beheeyem": "Beheeyem",
      "goldeen": "Goldeen",
      "runerigus": "Runerigus",
      "omanyte": "Omanyte",
      "fomantis": "Fomantis",
      "wooper": "Wooper",
      "jumpluff": "Jumpluff",
      "elgyem": "Elgyem",
      "spewpa": "Spewpa",
      "greavard": "Greavard",
      "sentret": "Sentret",
      "yamask": "Yamask",
      "smoliv": "Smoliv",
      "lunatone": "Lunatone",
      "guzzlord": "Guzzlord",
      "swadloon": "Swadloon",
      "munchlax": "Munchlax",
      "seviper": "Seviper",
      "buneary": "Buneary",
      "noctowl": "Noctowl",
      "shedinja": "Shedinja",
      "dedenne": "Dedenne",
      "cubone": "Cubone",
      "shroomish": "Shroomish",
      "teddiursa": "Teddiursa",
      "nosepass": "Nosepass",
      "roselia": "Roselia",
      "rabsca": "Rabsca",
      "kirlia": "Kirlia",
      "rattata": "Rattata",
      "slurpuff": "Slurpuff",
      "seaking": "Seaking",
      "electivire": "Electivire",
      "phione": "Phione",
      "petilil": "Petilil",
      "skwovet": "Skwovet",
      "chimchar": "Chimchar",
      "clauncher": "Clauncher",
      "shuppet": "Shuppet",
      "cursola": "Cursola",
      "zebstrika": "Zebstrika",
      "ninjask": "Ninjask",
      "boldore": "Boldore",
      "kecleon": "Kecleon",
      "eldegoss": "Eldegoss",
      "raichu": "Raichu",
      "wailmer": "Wailmer",
      "torracat": "Torracat",
      "surskit": "Surskit",
      "banette": "Banette",
      "cherrim": "Cherrim",
      "xatu": "Xatu",
      "corsola": "Corsola",
      "bulbasaur": "Bulbasaur",
      "silvally": "Silvally",
      "snorunt": "Snorunt",
      "carkol": "Carkol",
      "cacnea": "Cacnea",
      "dottler": "Dottler",
      "sobble": "Sobble",
      "bayleef": "Bayleef",
      "naganadel": "Naganadel",
      "treecko": "Treecko",
      "flareon": "Flareon",
      "vulpix": "Vulpix",
      "yamper": "Yamper",
      "simipour": "Simipour",
      "tepig": "Tepig",
      "taillow": "Taillow",
      "poltchageist": "Poltchageist",
      "karrablast": "Karrablast",
      "spinarak": "Spinarak",
      "farfetchd": "Farfetch'd",
      "tranquill": "Tranquill",
      "buzzwole": "Buzzwole",
      "burmy": "Burmy",
      "poliwag": "Poliwag",
      "vigoroth": "Vigoroth",
      "arbok": "Arbok",
      "zygarde-50": "Zygarde-50",
      "roggenrola": "Roggenrola",
      "diglett": "Diglett",
      "fearow": "Fearow",
      "wailord": "Wailord",
      "froakie": "Froakie",
      "butterfree": "Butterfree",
      "stunfisk": "Stunfisk",
      "applin": "Applin",
      "aerodactyl": "Aerodactyl",
      "luxray": "Luxray",
      "vanillish": "Vanillish",
      "bagon": "Bagon",
      "shieldon": "Shieldon",
      "houndour": "Houndour",
      "dwebble": "Dwebble",
      "marowak": "Marowak",
      "carvanha": "Carvanha",
      "kartana": "Kartana",
      "pidgeotto": "Pidgeotto",
      "alakazam": "Alakazam",
      "phanpy": "Phanpy",
      "meganium": "Meganium",
      "wooloo": "Wooloo",
      "barboach": "Barboach",
      "meltan": "Meltan",
      "tyrantrum": "Tyrantrum",
      "shinx": "Shinx",
      "ralts": "Ralts",
      "luxio": "Luxio",
      "tyrunt": "Tyrunt",
      "nidoqueen": "Nidoqueen",
      "grimer": "Grimer",
      "bibarel": "Bibarel",
      "heatmor": "Heatmor",
      "machamp": "Machamp",
      "indeedee-male": "Indeedee-Male",
      "minun": "Minun",
      "frillish": "Frillish",
      "stoutland": "Stoutland",
      "ferrothorn": "Ferrothorn",
      "larvitar": "Larvitar",
      "skorupi": "Skorupi",
      "spearow": "Spearow",
      "turtonator": "Turtonator",
      "lopunny": "Lopunny",
      "panpour": "Panpour",
      "lillipup": "Lillipup",
      "clamperl": "Clamperl",
      "arrokuda": "Arrokuda",
      "wiglett": "Wiglett",
      "dreepy": "Dreepy",
      "bellossom": "Bellossom",
      "toucannon": "Toucannon",
      "sawk": "Sawk",
      "kakuna": "Kakuna",
      "pyukumuku": "Pyukumuku",
      "baltoy": "Baltoy",
      "gothorita": "Gothorita",
      "swirlix": "Swirlix",
      "nickit": "Nickit",
      "aegislash-shield": "Aegislash-Shield",
      "squawkabilly-green-plumage": "Squawkabilly-Green-Plumage",
      "lombre": "Lombre",
      "golduck": "Golduck",
      "rolycoly": "Rolycoly",
      "tropius": "Tropius",
      "gogoat": "Gogoat",
      "horsea": "Horsea",
      "drampa": "Drampa",
      "flabebe": "Flabebe",
      "crustle": "Crustle",
      "masquerain": "Masquerain",
      "ekans": "Ekans",
      "arctibax": "Arctibax",
      "delcatty": "Delcatty",
      "ariados": "Ariados",
      "drowzee": "Drowzee",
      "stufful": "Stufful",
      "drapion": "Drapion",
      "cleffa": "Cleffa",
      "natu": "Natu",
      "sudowoodo": "Sudowoodo",
      "growlithe": "Growlithe",
      "swinub": "Swinub",
      "squirtle": "Squirtle",
      "beldum": "Beldum",
      "gourgeist-average": "Gourgeist-Average",
      "litten": "Litten",
      "mr-mime": "Mr. Mime",
      "igglybuff": "Igglybuff",
      "phantump": "Phantump",
      "flittle": "Flittle",
      "klawf": "Klawf",
      "sawsbuck": "Sawsbuck",
      "floragato": "Floragato",
      "cyndaquil": "Cyndaquil",
      "kubfu": "Kubfu",
      "dracovish": "Dracovish",
      "amaura": "Amaura",
      "shelgon": "Shelgon",
      "sliggoo": "Sliggoo",
      "wobbuffet": "Wobbuffet",
      "zigzagoon": "Zigzagoon",
      "deino": "Deino",
      "plusle": "Plusle",
      "totodile": "Totodile",
      "lickitung": "Lickitung",
      "charcadet": "Charcadet",
      "furfrou": "Furfrou",
      "capsakid": "Capsakid",
      "rowlet": "Rowlet",
      "noibat": "Noibat",
      "nihilego": "Nihilego",
      "zangoose": "Zangoose",
      "huntail": "Huntail",
      "lairon": "Lairon",
      "pachirisu": "Pachirisu",
      "litleo": "Litleo",
      "rellor": "Rellor",
      "pikipek": "Pikipek",
      "pangoro": "Pangoro",
      "wimpod": "Wimpod",
      "klinklang": "Klinklang",
      "delibird": "Delibird",
      "mareep": "Mareep",
      "budew": "Budew",
      "darmanitan-standard": "Darmanitan-Standard",
      "flaaffy": "Flaaffy",
      "fidough": "Fidough",
      "slakoth": "Slakoth",
      "venipede": "Venipede",
      "honchkrow": "Honchkrow",
      "toxel": "Toxel",
      "feebas": "Feebas",
      "exeggutor": "Exeggutor",
      "pansear": "Pansear",
      "gumshoos": "Gumshoos",
      "seel": "Seel",
      "gorebyss": "Gorebyss",
      "absol": "Absol",
      "cosmoem": "Cosmoem",
      "wishiwashi-solo": "Wishiwashi-Solo",
      "cofagrigus": "Cofagrigus",
      "barbaracle": "Barbaracle",
      "venonat": "Venonat",
      "tympole": "Tympole",
      "togekiss": "Togekiss",
      "scolipede": "Scolipede",
      "unown": "Unown",
      "riolu": "Riolu",
      "machop": "Machop",
      "sirfetchd": "Sirfetch'd",
      "cradily": "Cradily",
      "kabuto": "Kabuto",
      "remoraid": "Remoraid",
      "cufant": "Cufant",
      "gigalith": "Gigalith",
      "mantyke": "Mantyke",
      "smoochum": "Smoochum",
      "sunkern": "Sunkern",
      "spheal": "Spheal",
      "herdier": "Herdier",
      "lumineon": "Lumineon",
      "kricketune": "Kricketune",
      "regice": "Regice",
      "aggron": "Aggron",
      "unfezant": "Unfezant",
      "bonsly": "Bonsly",
      "golbat": "Golbat",
      "armaldo": "Armaldo",
      "wyrdeer": "Wyrdeer",
      "magikarp": "Magikarp",
      "aurorus": "Aurorus",
      "sharpedo": "Sharpedo",
      "castform": "Castform",
      "makuhita": "Makuhita",
      "cherubi": "Cherubi",
      "wurmple": "Wurmple",
      "whismur": "Whismur",
      "tarountula": "Tarountula",
      "shelmet": "Shelmet",
      "luvdisc": "Luvdisc",
      "golisopod": "Golisopod",
      "weedle": "Weedle",
      "fletchling": "Fletchling",
      "bunnelby": "Bunnelby",
      "starly": "Starly",
      "bidoof": "Bidoof",
      "tapu-lele": "Tapu Lele",
      "arctovish": "Arctovish",
      "raticate": "Raticate",
      "ponyta": "Ponyta",
      "aipom": "Aipom",
      "drizzile": "Drizzile",
      "voltorb": "Voltorb",
      "spritzee": "Spritzee",
      "omastar": "Omastar",
      "solrock": "Solrock",
      "sprigatito": "Sprigatito",
      "minior-red-meteor": "Minior-Red-Meteor",
      "sewaddle": "Sewaddle",
      "yveltal": "Yveltal",
      "oranguru": "Oranguru",
      "mudkip": "Mudkip",
      "trubbish": "Trubbish",
      "snom": "Snom",
      "oinkologne-male": "Oinkologne-Male",
      "audino": "Audino",
      "linoone": "Linoone",
      "glameow": "Glameow",
      "gloom": "Gloom",
      "persian": "Persian",
      "type-null": "Type: Null",
      "dolliv": "Dolliv",
      "beedrill": "Beedrill",
      "ledyba": "Ledyba",
      "carracosta": "Carracosta",
      "samurott": "Samurott",
      "dracozolt": "Dracozolt",
      "tapu-fini": "Tapu Fini",
      "salandit": "Salandit",
      "tapu-bulu": "Tapu Bulu",
      "greedent": "Greedent",
      "bounsweet": "Bounsweet",
      "vibrava": "Vibrava",
      "nidorino": "Nidorino",
      "poipole": "Poipole",
      "basculegion-male": "Basculegion-Male",
      "onix": "Onix",
      "blitzle": "Blitzle",
      "lechonk": "Lechonk",
      "durant": "Durant",
      "lickilicky": "Lickilicky"
    };

    return map[name] || name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('-');
  }

  async fetchAndSaveBuilds(pokemon: Pokemon): Promise<PokemonBuild[]> {
  // Mapeo de nombres a Smogon
    const SMOGON_NAME_OVERRIDES: Record<string, string> = {
      "silicobra": "Silicobra",
      "poipole": "Poipole",
      "steenee": "Steenee",
      "wugtrio": "Wugtrio",
      "combee": "Combee",
      "scatterbug": "Scatterbug",
      "wurmple": "Wurmple",
      "corvisquire": "Corvisquire",
      "kubfu": "Kubfu",
      "indeedee-male": "Indeedee-Male",
      "dewpider": "Dewpider",
      "sobble": "Sobble",
      "gossifleur": "Gossifleur",
      "cufant": "Cufant",
      "fidough": "Fidough",
      "trumbeak": "Trumbeak",
      "dolliv": "Dolliv",
      "frigibax": "Frigibax",
      "luxio": "Luxio",
      "sizzlipede": "Sizzlipede",
      "rabsca": "Rabsca",
      "hatenna": "Hatenna",
      "charcadet": "Charcadet",
      "silcoon": "Silcoon",
      "applin": "Applin",
      "herdier": "Herdier",
      "tranquill": "Tranquill",
      "dottler": "Dottler",
      "arrokuda": "Arrokuda",
      "tarountula": "Tarountula",
      "rolycoly": "Rolycoly",
      "vanillish": "Vanillish",
      "tynamo": "Tynamo",
      "yamper": "Yamper",
      "cetoddle": "Cetoddle",
      "basculegion-male": "Basculegion-Male",
      "smoliv": "Smoliv",
      "squawkabilly-green-plumage": "Squawkabilly-Green-Plumage",
      "dartrix": "Dartrix",
      "floette": "Floette",
      "skiploom": "Skiploom",
      "pumpkaboo-average": "Pumpkaboo-Average",
      "wiglett": "Wiglett",
      "kirlia": "Kirlia",
      "spewpa": "Spewpa",
      "toxel": "Toxel",
      "brionne": "Brionne",
      "flittle": "Flittle",
      "maushold-family-of-four": "Maushold-Family-of-Four",
      "rookidee": "Rookidee",
      "nickit": "Nickit",
      "wooloo": "Wooloo",
      "skwovet": "Skwovet",
      "boldore": "Boldore",
      "oinkologne-male": "Oinkologne-Male",
      "pawmo": "Pawmo",
      "sinistea": "Sinistea",
      "cascoon": "Cascoon",
      "carkol": "Carkol",
      "blipbug": "Blipbug",
      "nacli": "Nacli",
      "tadbulb": "Tadbulb",
      "feebas": "Feebas",
      "sirfetchd": "Sirfetchd",
      "greavard": "Greavard",
      "rellor": "Rellor",
      "popplio": "Popplio",
      "capsakid": "Capsakid",
      "spidops": "Spidops",
      "cosmog": "Cosmog",
      "swadloon": "Swadloon",
      "minior-red-meteor": "Minior-Red-Meteor",
      "dreepy": "Dreepy",
      "milcery": "Milcery",
      "gimmighoul": "Gimmighoul",
      "clobbopus": "Clobbopus",
      "nuzleaf": "Nuzleaf",
      "klawf": "Klawf",
      "metapod": "Metapod",
      "snom": "Snom",
      "arctibax": "Arctibax",
      "pawmi": "Pawmi",
      "cosmoem": "Cosmoem",
      "tandemaus": "Tandemaus",
      "poltchageist": "Poltchageist",
      "wyrdeer": "Wyrdeer",
      "floragato": "Floragato",
      "lechonk": "Lechonk",
      "drizzile": "Drizzile",
      "sprigatito": "Sprigatito"
    };

    const slugName = await this.normalizePokemonName(pokemon.name);
    const smogonName = SMOGON_NAME_OVERRIDES[slugName.toLowerCase()] || slugName;

    const genNumbers = Array.from({ length: 9 }, (_, i) => 9 - i); // 9 → 1
    const allSets: any[] = [];

    // 1. Recoger TODOS los sets de TODAS las generaciones
    for (const genNum of genNumbers) {
      const gen = this.gens.get(genNum);
      const genSets = await this.smogon.sets(gen, smogonName);
      if (genSets && genSets.length > 0) {
        allSets.push(...genSets.map(s => ({ ...s, gen: genNum })));
      }
    }

    if (allSets.length === 0) return [];

    // 2. Evitar duplicados (mismo buildText)
    const uniqueBuilds = new Map<string, any>();

    for (const set of allSets) {
      const buildText = this.toBuildText(pokemon.name, set);
      if (!uniqueBuilds.has(buildText)) {
        uniqueBuilds.set(buildText, set);
      }
    }

    // 3. Guardar en BD
    const savedBuilds: PokemonBuild[] = [];

    for (const set of uniqueBuilds.values()) {
      const buildText = this.toBuildText(pokemon.name, set);

      const build = this.buildRepo.create({
        pokemon,
        buildText,
        // 🔥 futuro: generation: set.gen
      });

      await this.buildRepo.save(build);
      savedBuilds.push(build);
    }

    return savedBuilds;
  }

  private normalizeMegaSpeciesId(id: string): string {
    // charizardmegax → charizard-mega-x
    return id
      .replace(/megax$/, '-mega-x')
      .replace(/megay$/, '-mega-y')
      .replace(/mega$/, '-mega');
  }

  private denormalizeMegaSlugForDex(slug: string): string {
    return slug
      .replace('-mega-x', 'megax')
      .replace('-mega-y', 'megay')
      .replace('-mega', 'mega');
  }

  async reassignMegaBuilds(): Promise<void> {
    const megaForms = Dex.species.all()
      .filter(s => s.isMega)
      .map(s => this.normalizeMegaSpeciesId(s.id));

    for (const megaSlug of megaForms) {
      const megaPokemon = await this.pokemonRepo.findOne({
        where: { name: megaSlug },
        relations: ['builds'],
      });
      if (!megaPokemon) {
        continue
      }else{
        megaPokemon.isMega = true;
        await this.pokemonRepo.save(megaPokemon);
      }

      // 🔥 CAMBIO CLAVE AQUÍ
      const dexMegaId = this.denormalizeMegaSlugForDex(megaSlug);
      const megaSpecies = Dex.species.get(dexMegaId);

      const expectedMegaStone = megaSpecies.requiredItem
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      if (!expectedMegaStone) continue;

      const baseName = megaSlug.replace(/-mega(-x|-y)?$/, '');
      const basePokemon = await this.pokemonRepo.findOne({
        where: { name: baseName },
        relations: ['builds'],
      });
      if (!basePokemon || !basePokemon.builds?.length) continue;

      const megaBuilds = basePokemon.builds.filter(build => {
        const match = build.buildText.match(/@ (.+)/);
        if (!match) return false;

        const itemId = match[1]
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');

        return itemId === expectedMegaStone;
      });

      if (!megaBuilds.length) continue;

      for (const build of megaBuilds) {
        build.pokemon = megaPokemon;
        await this.buildRepo.save(build);
      }

      await this.buildRepo.delete({
        pokemon: { id: basePokemon.id },
        id: In(megaBuilds.map(b => b.id)),
      });
    }
  }



  /**
   * Convierte un set en el formato de texto requerido
   */
  private toBuildText(name: string, set: any): string {
    const evs = set.evs || {};
    const ivs = set.ivs || {};
    const moves = set.moves || [];

    const stat = (abbr: string, value?: number) =>
      value !== undefined ? `${value} ${abbr}` : null;

    const evLine = [
      stat('HP', evs.hp),
      stat('Atk', evs.atk),
      stat('Def', evs.def),
      stat('SpA', evs.spa),
      stat('SpD', evs.spd),
      stat('Spe', evs.spe),
    ].filter(Boolean).join(' / ');

    const ivLine = [
      stat('HP', ivs.hp),
      stat('Atk', ivs.atk),
      stat('Def', ivs.def),
      stat('SpA', ivs.spa),
      stat('SpD', ivs.spd),
      stat('Spe', ivs.spe),
    ].filter(Boolean).join(' / ');

    return `
${name} @ ${set.item || '—'}
Ability: ${set.ability || '—'}
EVs: ${evLine || '—'}
IVs: ${ivLine || '—'}
Tera Type: ${set.teraType || '—'}
${set.nature || '—'} Nature
Moves:
${moves.map((m: string) => ` - ${m}`).join('\n')}
`.trim();
  }
}

