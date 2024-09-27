import { sortObjectArrayByProperty } from "./sortObjectArrayByProperty";

const countryTitle = {
  germany: "Germany",
  afghanistan: "Afghanistan",
  egypt: "Egypt",
  albania: "Albania",
  algeria: "Algeria",
  americanSamoa: "American Samoa",
  americanVirginIslands: "American Virgin Islands",
  angola: "Angola",
  anguilla: "Anguilla",
  antarctica: "Antarctica",
  antiguaAndBarbuda: "Antigua and Barbuda",
  equatorialGuinea: "Equatorial Guinea",
  argentina: "Argentina",
  armenia: "Armenia",
  aruba: "Aruba",
  azerbaijan: "Azerbaijan",
  ethiopia: "Ethiopia",
  australia: "Australia",
  bahamas: "Bahamas",
  bahrain: "Bahrain",
  bangladesh: "Bangladesh",
  barbados: "Barbados",
  belarus: "Belarus",
  belgium: "Belgium",
  belize: "Belize",
  benin: "Benin",
  bermuda: "Bermuda",
  bhutan: "Bhutan",
  bolivia: "Bolivia",
  bosniaAndHerzegovina: "Bosnia and Herzegovina",
  botswana: "Botswana",
  bouvetinsel: "Bouvetinsel",
  brazil: "Brazil",
  britishVirginIslands: "British Virgin Islands",
  brunei: "Brunei",
  bulgaria: "Bulgaria",
  burkinaFaso: "Burkina Faso",
  burundi: "Burundi",
  chile: "Chile",
  china: "China",
  cookIslands: "Cook Islands",
  costaRica: "Costa Rica",
  curacao: "Curacao",
  denmark: "Denmark",
  democraticRepublicOfTheCongo: "Democratic Republic of the Congo",
  dominica: "Dominica",
  dominicanRepublic: "Dominican Republic",
  djibouti: "Djibouti",
  ecuador: "Ecuador",
  elSalvador: "El Salvador",
  ivoryCoast: "Ivory Coast",
  eritrea: "Eritrea",
  estonia: "Estonia",
  falklandIslands: "Falkland Islands",
  faroeIslands: "Faroe Islands",
  fiji: "Fiji",
  finland: "Finland",
  france: "France",
  frenchGuiana: "French Guiana",
  frenchPolynesia: "French Polynesia",
  gabon: "Gabon",
  gambia: "Gambia",
  georgia: "Georgia",
  ghana: "Ghana",
  gibraltar: "Gibraltar",
  grenada: "Grenada",
  greece: "Greece",
  greenland: "Greenland",
  guadeloupe: "Guadeloupe",
  guam: "Guam",
  guatemala: "Guatemala",
  guinea: "Guinea",
  guineaBissau: "Guinea-Bissau",
  guyana: "Guyana",
  haiti: "Haiti",
  honduras: "Honduras",
  hongKong: "Hong Kong",
  india: "India",
  indonesia: "Indonesia",
  islandMan: "Island Man",
  iraq: "Iraq",
  iran: "Iran",
  ireland: "Ireland",
  iceland: "Iceland",
  israel: "Israel",
  italy: "Italy",
  jamaica: "Jamaica",
  japan: "Japan",
  jemen: "Yemen",
  jersey: "Jersey",
  jordan: "Jordan",
  caymanIslands: "Cayman Islands",
  cambodia: "Cambodia",
  cameroon: "Cameroon",
  canada: "Canada",
  capeVerde: "Cape Verde",
  kazakhstan: "Kazakhstan",
  qatar: "Qatar",
  kenya: "Kenya",
  kyrgyzstan: "Kyrgyzstan",
  kiribati: "Kiribati",
  cocosIslands: "Cocos Islands",
  colombia: "Colombia",
  comoros: "Comoros",
  kosovo: "Kosovo",
  croatia: "Croatia",
  cuba: "Cuba",
  kuwait: "Kuwait",
  laos: "Laos",
  lesotho: "Lesotho",
  latvia: "Latvia",
  lebanon: "Lebanon",
  liberia: "Liberia",
  libya: "Libya",
  liechtenstein: "Liechtenstein",
  lithuania: "Lithuania",
  luxembourg: "Luxembourg",
  macau: "Macau",
  madagascar: "Madagascar",
  malawi: "Malawi",
  malaysia: "Malaysia",
  maldives: "Maldives",
  mali: "Mali",
  malta: "Malta",
  morocco: "Morocco",
  marshallIslands: "Marshall Islands",
  martinique: "Martinique",
  mauritania: "Mauritania",
  mauritius: "Mauritius",
  mayotte: "Mayotte",
  macedonia: "Macedonia",
  mexico: "Mexico",
  micronesia: "Micronesia",
  moldova: "Moldova",
  monaco: "Monaco",
  mongolia: "Mongolia",
  montenegro: "Montenegro",
  montserrat: "Montserrat",
  mozambique: "Mozambique",
  myanmar: "Myanmar",
  namibia: "Namibia",
  nauru: "Nauru",
  nepal: "Nepal",
  newCaledonia: "New Caledonia",
  newZealand: "New Zealand",
  nicaragua: "Nicaragua",
  netherlands: "Netherlands",
  netherlandsAntilles: "Netherlands Antilles",
  niger: "Niger",
  nigeria: "Nigeria",
  niue: "Niue",
  northernMarianaIslands: "Northern Mariana Islands",
  northKorea: "North Korea",
  norfolkIsland: "Norfolk Island",
  norway: "Norway",
  oman: "Oman",
  austria: "Austria",
  pakistan: "Pakistan",
  palestine: "Palestine",
  palau: "Palau",
  panama: "Panama",
  papuaNewGuinea: "Papua New Guinea",
  paraguay: "Paraguay",
  peru: "Peru",
  philippines: "Philippines",
  poland: "Poland",
  portugal: "Portugal",
  puertoRico: "Puerto Rico",
  reunion: "Reunion",
  republicOfTheCongo: "Republic of the Congo",
  rwanda: "Rwanda",
  romania: "Romania",
  russia: "Russia",
  solomonIslands: "Solomon Islands",
  zambia: "Zambia",
  samoa: "Samoa",
  sanMarino: "San Marino",
  saoTomeAndPrincipe: "Sao Tome and Principe",
  saudiArabia: "Saudi Arabia",
  sweden: "Sweden",
  switzerland: "Switzerland",
  senegal: "Senegal",
  serbia: "Serbia",
  seychelles: "Seychelles",
  sierraLeone: "Sierra Leone",
  zimbabwe: "Zimbabwe",
  singapore: "Singapore",
  sintMaarten: "Sint Maarten",
  slovakia: "Slovakia",
  slovenia: "Slovenia",
  somalia: "Somalia",
  spain: "Spain",
  sriLanka: "Sri Lanka",
  stHelena: "St. Helena",
  stKittsAndNevis: "St. Kitts and Nevis",
  stLucia: "St. Lucia",
  stPierreAndMiquelon: "St. Pierre and Miquelon",
  stVincentAndTheGrenadines: "St. Vincent and the Grenadines",
  southAfrica: "South Africa",
  southKorea: "South Korea",
  sudan: "Sudan",
  southGeorgiaAndTheSouthSandwichIslands:
    "South Georgia and the South Sandwich Islands",
  southSudan: "South Sudan",
  suriname: "Suriname",
  swaziland: "Swaziland",
  syria: "Syria",
  tajikistan: "Tajikistan",
  taiwan: "Taiwan",
  tanzania: "Tanzania",
  thailand: "Thailand",
  togo: "Togo",
  tokelau: "Tokelau",
  tonga: "Tonga",
  trinidadAndTobago: "Trinidad and Tobago",
  chad: "Chad",
  czechRepublic: "Czech Republic",
  tunisia: "Tunisia",
  turkey: "Turkey",
  turkmenistan: "Turkmenistan",
  turksAndCaicosIslands: "Turks and Caicos Islands",
  tuvalu: "Tuvalu",
  uganda: "Uganda",
  ukraine: "Ukraine",
  hungary: "Hungary",
  uruguay: "Uruguay",
  uzbekistan: "Uzbekistan",
  vanuatu: "Vanuatu",
  vaticanCity: "Vatican City",
  venezuela: "Venezuela",
  unitedArabEmirates: "United Arab Emirates",
  unitedStatesOfAmerica: "United States of America",
  unitedKingdom: "United Kingdom",
  vietnam: "Vietnam",
  wallisAndFutuna: "Wallis and Futuna",
  christmasIsland: "Christmas Island",
  westernSahara: "Western Sahara",
  centralAfricanRepublic: "Central African Republic",
  cyprus: "Cyprus",
};

export const getCountries = () => {
  const countries = [
    { label: countryTitle.india, iso2: "IN", iso3: "IND" },
    { label: countryTitle.afghanistan, iso2: "AF", iso3: "AFG" },
    { label: countryTitle.egypt, iso2: "EG", iso3: "EGY" },
    { label: countryTitle.albania, iso2: "AL", iso3: "ALB" },
    { label: countryTitle.algeria, iso2: "DZ", iso3: "DZA" },
    { label: countryTitle.americanSamoa, iso2: "AS", iso3: "ASM" },
    { label: countryTitle.americanVirginIslands, iso2: "VI", iso3: "VIR" },
    { label: countryTitle.angola, iso2: "AO", iso3: "AGO" },
    { label: countryTitle.anguilla, iso2: "AI", iso3: "AIA" },
    { label: countryTitle.antarctica, iso2: "AQ", iso3: "ATA" },
    { label: countryTitle.antiguaAndBarbuda, iso2: "AG", iso3: "ATG" },
    { label: countryTitle.equatorialGuinea, iso2: "GQ", iso3: "GNQ" },
    { label: countryTitle.argentina, iso2: "AR", iso3: "ARG" },
    { label: countryTitle.armenia, iso2: "AM", iso3: "ARM" },
    { label: countryTitle.aruba, iso2: "AW", iso3: "ABW" },
    { label: countryTitle.azerbaijan, iso2: "AZ", iso3: "AZE" },
    { label: countryTitle.ethiopia, iso2: "ET", iso3: "ETH" },
    { label: countryTitle.australia, iso2: "AU", iso3: "AUS", currency: "AUD" },
    { label: countryTitle.bahamas, iso2: "BS", iso3: "BHS" },
    { label: countryTitle.bahrain, iso2: "BH", iso3: "BHR", currency: "BHD" },
    { label: countryTitle.bangladesh, iso2: "BD", iso3: "BGD" },
    { label: countryTitle.barbados, iso2: "BB", iso3: "BRB" },
    { label: countryTitle.belarus, iso2: "BY", iso3: "BLR" },
    { label: countryTitle.belgium, iso2: "BE", iso3: "BEL" },
    { label: countryTitle.belize, iso2: "BZ", iso3: "BLZ" },
    { label: countryTitle.benin, iso2: "BJ", iso3: "BEN" },
    { label: countryTitle.bermuda, iso2: "BM", iso3: "BMU" },
    { label: countryTitle.bhutan, iso2: "BT", iso3: "BTN" },
    { label: countryTitle.bolivia, iso2: "BO", iso3: "BOL" },
    { label: countryTitle.bosniaAndHerzegovina, iso2: "BA", iso3: "BIH" },
    { label: countryTitle.botswana, iso2: "BW", iso3: "BWA" },
    { label: countryTitle.bouvetinsel, iso2: "BV", iso3: "BVT" },
    { label: countryTitle.brazil, iso2: "BR", iso3: "BRA" },
    { label: countryTitle.britishVirginIslands, iso2: "VG", iso3: "VGB" },
    { label: countryTitle.brunei, iso2: "BN", iso3: "BRN" },
    { label: countryTitle.bulgaria, iso2: "BG", iso3: "BGR" },
    { label: countryTitle.burkinaFaso, iso2: "BF", iso3: "BFA" },
    { label: countryTitle.burundi, iso2: "BI", iso3: "BDI" },
    { label: countryTitle.chile, iso2: "CL", iso3: "CHL" },
    { label: countryTitle.china, iso2: "CN", iso3: "CHN" },
    { label: countryTitle.cookIslands, iso2: "CK", iso3: "COK" },
    { label: countryTitle.costaRica, iso2: "CR", iso3: "CRI" },
    { label: countryTitle.curacao, iso2: "CW", iso3: "CUW" },
    { label: countryTitle.denmark, iso2: "DK", iso3: "DNK" },
    {
      label: countryTitle.democraticRepublicOfTheCongo,
      iso2: "CD",
      iso3: "COD",
    },
    { label: countryTitle.dominica, iso2: "DM", iso3: "DMA" },
    { label: countryTitle.dominicanRepublic, iso2: "DO", iso3: "DOM" },
    { label: countryTitle.djibouti, iso2: "DJ", iso3: "DJI" },
    { label: countryTitle.ecuador, iso2: "EC", iso3: "ECU" },
    { label: countryTitle.elSalvador, iso2: "SV", iso3: "SLV" },
    { label: countryTitle.ivoryCoast, iso2: "CI", iso3: "CIV" },
    { label: countryTitle.eritrea, iso2: "ER", iso3: "ERI" },
    { label: countryTitle.estonia, iso2: "EE", iso3: "EST" },
    { label: countryTitle.falklandIslands, iso2: "FK", iso3: "FLK" },
    { label: countryTitle.faroeIslands, iso2: "FO", iso3: "FRO" },
    { label: countryTitle.fiji, iso2: "FJ", iso3: "FJI" },
    { label: countryTitle.finland, iso2: "FI", iso3: "FIN" },
    { label: countryTitle.france, iso2: "FR", iso3: "FRA" },
    { label: countryTitle.frenchGuiana, iso2: "GF", iso3: "GUF" },
    { label: countryTitle.frenchPolynesia, iso2: "PF", iso3: "PYF" },
    { label: countryTitle.gabon, iso2: "GA", iso3: "GAB" },
    { label: countryTitle.gambia, iso2: "GM", iso3: "GMB" },
    { label: countryTitle.georgia, iso2: "GE", iso3: "GEO" },
    { label: countryTitle.ghana, iso2: "GH", iso3: "GHA" },
    { label: countryTitle.gibraltar, iso2: "GI", iso3: "GIB" },
    { label: countryTitle.grenada, iso2: "GD", iso3: "GRD" },
    { label: countryTitle.greece, iso2: "GR", iso3: "GRC" },
    { label: countryTitle.greenland, iso2: "GL", iso3: "GRL" },
    { label: countryTitle.guadeloupe, iso2: "GP", iso3: "GLP" },
    { label: countryTitle.guam, iso2: "GU", iso3: "GUM" },
    { label: countryTitle.guatemala, iso2: "GT", iso3: "GTM" },

    { label: countryTitle.guinea, iso2: "GN", iso3: "GIN" },

    { label: countryTitle.guineaBissau, iso2: "GW", iso3: "GNB" },

    { label: countryTitle.guyana, iso2: "GY", iso3: "GUY" },

    { label: countryTitle.haiti, iso2: "HT", iso3: "HTI" },

    { label: countryTitle.honduras, iso2: "HN", iso3: "HND" },

    { label: countryTitle.hongKong, iso2: "HK", iso3: "HKG" },

    { label: countryTitle.germany, iso2: "DE", iso3: "DEU", currency: "EUR" },

    { label: countryTitle.indonesia, iso2: "ID", iso3: "IDN" },

    { label: countryTitle.islandMan, iso2: "IM", iso3: "IMN" },

    { label: countryTitle.iraq, iso2: "IQ", iso3: "IRQ" },

    { label: countryTitle.iran, iso2: "IR", iso3: "IRN" },

    { label: countryTitle.ireland, iso2: "IE", iso3: "IRL" },

    { label: countryTitle.iceland, iso2: "IS", iso3: "ISL" },

    { label: countryTitle.israel, iso2: "IL", iso3: "ISR" },

    { label: countryTitle.italy, iso2: "IT", iso3: "ITA" },

    { label: countryTitle.jamaica, iso2: "JM", iso3: "JAM" },

    { label: countryTitle.japan, iso2: "JP", iso3: "JPN" },

    { label: countryTitle.jemen, iso2: "YE", iso3: "YEM" },

    { label: countryTitle.jersey, iso2: "JE", iso3: "JEY" },

    { label: countryTitle.jordan, iso2: "JO", iso3: "JOR" },

    { label: countryTitle.caymanIslands, iso2: "KY", iso3: "CYM" },

    { label: countryTitle.cambodia, iso2: "KH", iso3: "KHM" },

    { label: countryTitle.cameroon, iso2: "CM", iso3: "CMR" },

    { label: countryTitle.canada, iso2: "CA", iso3: "CAN", currency: "CAD" },

    { label: countryTitle.capeVerde, iso2: "CV", iso3: "CPV" },

    { label: countryTitle.kazakhstan, iso2: "KZ", iso3: "KAZ" },

    { label: countryTitle.qatar, iso2: "QA", iso3: "QAT", currency: "QAR" },

    { label: countryTitle.kenya, iso2: "KE", iso3: "KEN" },

    { label: countryTitle.kyrgyzstan, iso2: "KG", iso3: "KGZ" },

    { label: countryTitle.kiribati, iso2: "KI", iso3: "KIR" },

    { label: countryTitle.cocosIslands, iso2: "CC", iso3: "CCK" },

    { label: countryTitle.colombia, iso2: "CO", iso3: "COL" },

    { label: countryTitle.comoros, iso2: "KM", iso3: "COM" },

    { label: countryTitle.kosovo, iso2: "XK", iso3: "" },

    { label: countryTitle.croatia, iso2: "HR", iso3: "HRV" },

    { label: countryTitle.cuba, iso2: "CU", iso3: "CUB" },

    { label: countryTitle.kuwait, iso2: "KW", iso3: "KWT", currency: "KWD" },

    { label: countryTitle.laos, iso2: "LA", iso3: "LAO" },

    { label: countryTitle.lesotho, iso2: "LS", iso3: "LSO" },

    { label: countryTitle.latvia, iso2: "LV", iso3: "LVA" },

    { label: countryTitle.lebanon, iso2: "LB", iso3: "LBN" },

    { label: countryTitle.liberia, iso2: "LR", iso3: "LBR" },

    { label: countryTitle.libya, iso2: "LY", iso3: "LBY" },

    { label: countryTitle.liechtenstein, iso2: "LI", iso3: "LIE" },

    { label: countryTitle.lithuania, iso2: "LT", iso3: "LTU" },

    { label: countryTitle.luxembourg, iso2: "LU", iso3: "LUX" },

    { label: countryTitle.macau, iso2: "MO", iso3: "MAC" },

    { label: countryTitle.madagascar, iso2: "MG", iso3: "MDG" },

    { label: countryTitle.malawi, iso2: "MW", iso3: "MWI" },

    { label: countryTitle.malaysia, iso2: "MY", iso3: "MYS" },

    { label: countryTitle.maldives, iso2: "MV", iso3: "MDV" },

    { label: countryTitle.mali, iso2: "ML", iso3: "MLI" },

    { label: countryTitle.malta, iso2: "MT", iso3: "MLT" },

    { label: countryTitle.morocco, iso2: "MA", iso3: "MAR" },

    { label: countryTitle.marshallIslands, iso2: "MH", iso3: "MHL" },

    { label: countryTitle.martinique, iso2: "MQ", iso3: "MTQ" },

    { label: countryTitle.mauritania, iso2: "MR", iso3: "MRT" },

    { label: countryTitle.mauritius, iso2: "MU", iso3: "MUS" },

    { label: countryTitle.mayotte, iso2: "YT", iso3: "MYT" },

    { label: countryTitle.macedonia, iso2: "MK", iso3: "MKD" },

    { label: countryTitle.mexico, iso2: "MX", iso3: "MEX" },

    { label: countryTitle.micronesia, iso2: "FM", iso3: "FSM" },

    { label: countryTitle.moldova, iso2: "MD", iso3: "MDA" },

    { label: countryTitle.monaco, iso2: "MC", iso3: "MCO" },

    { label: countryTitle.mongolia, iso2: "MN", iso3: "MNG" },

    { label: countryTitle.montenegro, iso2: "ME", iso3: "MNE" },

    { label: countryTitle.montserrat, iso2: "MS", iso3: "MSR" },

    { label: countryTitle.mozambique, iso2: "MZ", iso3: "MOZ" },

    { label: countryTitle.myanmar, iso2: "MM", iso3: "MMR", currency: "MYR" },

    { label: countryTitle.namibia, iso2: "NA", iso3: "NAM" },

    { label: countryTitle.nauru, iso2: "NR", iso3: "NRU" },

    { label: countryTitle.nepal, iso2: "NP", iso3: "NPL" },

    { label: countryTitle.newCaledonia, iso2: "NC", iso3: "NCL" },

    { label: countryTitle.newZealand, iso2: "NZ", iso3: "NZL" },

    { label: countryTitle.nicaragua, iso2: "NI", iso3: "NIC" },

    { label: countryTitle.netherlands, iso2: "NL", iso3: "NLD" },

    { label: countryTitle.netherlandsAntilles, iso2: "AN", iso3: "ANT" },

    { label: countryTitle.niger, iso2: "NE", iso3: "NER" },

    { label: countryTitle.nigeria, iso2: "NG", iso3: "NGA" },

    { label: countryTitle.niue, iso2: "NU", iso3: "NIU" },

    { label: countryTitle.northernMarianaIslands, iso2: "MP", iso3: "MNP" },

    { label: countryTitle.northKorea, iso2: "KP", iso3: "PRK" },

    { label: countryTitle.norfolkIsland, iso2: "NF", iso3: "NFK" },

    { label: countryTitle.norway, iso2: "NO", iso3: "NOR" },

    { label: countryTitle.oman, iso2: "OM", iso3: "OMN", currency: "OMR" },

    { label: countryTitle.austria, iso2: "AT", iso3: "AUT" },

    { label: countryTitle.pakistan, iso2: "PK", iso3: "PAK" },

    { label: countryTitle.palestine, iso2: "PS", iso3: "PSE" },

    { label: countryTitle.palau, iso2: "PW", iso3: "PLW" },

    { label: countryTitle.panama, iso2: "PA", iso3: "PAN" },

    { label: countryTitle.papuaNewGuinea, iso2: "PG", iso3: "PNG" },

    { label: countryTitle.paraguay, iso2: "PY", iso3: "PRY" },

    { label: countryTitle.peru, iso2: "PE", iso3: "PER" },

    {
      label: countryTitle.philippines,
      iso2: "PH",
      iso3: "PHL",
      currency: "PHP",
    },

    { label: countryTitle.poland, iso2: "PL", iso3: "POL" },

    { label: countryTitle.portugal, iso2: "PT", iso3: "PRT" },

    { label: countryTitle.puertoRico, iso2: "PR", iso3: "PRI" },

    { label: countryTitle.reunion, iso2: "RE", iso3: "REU" },

    { label: countryTitle.republicOfTheCongo, iso2: "CG", iso3: "COG" },

    { label: countryTitle.rwanda, iso2: "RW", iso3: "RWA" },

    { label: countryTitle.romania, iso2: "RO", iso3: "ROU" },

    { label: countryTitle.russia, iso2: "RU", iso3: "RUS" },

    { label: countryTitle.solomonIslands, iso2: "SB", iso3: "SLB" },

    { label: countryTitle.zambia, iso2: "ZM", iso3: "ZMB" },

    { label: countryTitle.samoa, iso2: "WS", iso3: "WSM" },

    { label: countryTitle.sanMarino, iso2: "SM", iso3: "SMR" },

    { label: countryTitle.saoTomeAndPrincipe, iso2: "ST", iso3: "STP" },

    {
      label: countryTitle.saudiArabia,
      iso2: "SA",
      iso3: "SAU",
      currency: "SAR",
    },

    { label: countryTitle.sweden, iso2: "SE", iso3: "SWE" },

    { label: countryTitle.switzerland, iso2: "CH", iso3: "CHE" },

    { label: countryTitle.senegal, iso2: "SN", iso3: "SEN" },

    { label: countryTitle.serbia, iso2: "RS", iso3: "SRB" },

    { label: countryTitle.seychelles, iso2: "SC", iso3: "SYC" },

    { label: countryTitle.sierraLeone, iso2: "SL", iso3: "SLE" },

    { label: countryTitle.zimbabwe, iso2: "ZW", iso3: "ZWE" },

    { label: countryTitle.singapore, iso2: "SG", iso3: "SGP", currency: "SGD" },

    { label: countryTitle.sintMaarten, iso2: "SX", iso3: "SXM" },

    { label: countryTitle.slovakia, iso2: "SK", iso3: "SVK" },

    { label: countryTitle.slovenia, iso2: "SI", iso3: "SVN" },

    { label: countryTitle.somalia, iso2: "SO", iso3: "SOM" },

    { label: countryTitle.spain, iso2: "ES", iso3: "ESP" },

    { label: countryTitle.sriLanka, iso2: "LK", iso3: "LKA" },

    { label: countryTitle.stHelena, iso2: "SH", iso3: "SHN" },

    { label: countryTitle.stKittsAndNevis, iso2: "KN", iso3: "KNA" },

    { label: countryTitle.stLucia, iso2: "LC", iso3: "LCA" },

    { label: countryTitle.stPierreAndMiquelon, iso2: "PM", iso3: "SPM" },

    { label: countryTitle.stVincentAndTheGrenadines, iso2: "VC", iso3: "VCT" },

    { label: countryTitle.southAfrica, iso2: "ZA", iso3: "ZAF" },

    { label: countryTitle.southKorea, iso2: "KR", iso3: "KOR" },

    { label: countryTitle.sudan, iso2: "SD", iso3: "SDN" },

    {
      label: countryTitle.southGeorgiaAndTheSouthSandwichIslands,
      iso2: "GS",
      iso3: "SGS",
    },

    { label: countryTitle.southSudan, iso2: "SS", iso3: "SSD" },

    { label: countryTitle.suriname, iso2: "SR", iso3: "SUR" },

    { label: countryTitle.swaziland, iso2: "SZ", iso3: "SWZ" },

    { label: countryTitle.syria, iso2: "SY", iso3: "SYR" },

    { label: countryTitle.tajikistan, iso2: "TJ", iso3: "TJK" },

    { label: countryTitle.taiwan, iso2: "TW", iso3: "TWN" },

    { label: countryTitle.tanzania, iso2: "TZ", iso3: "TZA" },

    { label: countryTitle.thailand, iso2: "TH", iso3: "THA" },

    { label: countryTitle.togo, iso2: "TG", iso3: "TGO" },

    { label: countryTitle.tokelau, iso2: "TK", iso3: "TKL" },

    { label: countryTitle.tonga, iso2: "TO", iso3: "TON" },

    { label: countryTitle.trinidadAndTobago, iso2: "TT", iso3: "TTO" },

    { label: countryTitle.chad, iso2: "TD", iso3: "TCD" },

    { label: countryTitle.czechRepublic, iso2: "CZ", iso3: "CZE" },

    { label: countryTitle.tunisia, iso2: "TN", iso3: "TUN" },

    { label: countryTitle.turkey, iso2: "TR", iso3: "TUR" },

    { label: countryTitle.turkmenistan, iso2: "TM", iso3: "TKM" },

    { label: countryTitle.turksAndCaicosIslands, iso2: "TC", iso3: "TCA" },

    { label: countryTitle.tuvalu, iso2: "TV", iso3: "TUV" },

    { label: countryTitle.uganda, iso2: "UG", iso3: "UGA" },

    { label: countryTitle.ukraine, iso2: "UA", iso3: "UKR" },

    { label: countryTitle.hungary, iso2: "HU", iso3: "HUN" },

    { label: countryTitle.uruguay, iso2: "UY", iso3: "URY" },
    { label: countryTitle.uzbekistan, iso2: "UZ", iso3: "UZB" },
    { label: countryTitle.vanuatu, iso2: "VU", iso3: "VUT" },
    { label: countryTitle.vaticanCity, iso2: "VA", iso3: "VAT" },
    { label: countryTitle.venezuela, iso2: "VE", iso3: "VEN" },
    {
      label: countryTitle.unitedArabEmirates,
      iso2: "AE",
      iso3: "ARE",
      currency: "AED",
    },
    {
      label: countryTitle.unitedStatesOfAmerica,
      iso2: "US",
      iso3: "USA",
      currency: "USD",
    },
    {
      label: countryTitle.unitedKingdom,
      iso2: "GB",
      iso3: "GBR",
      currency: "GBP",
    },
    { label: countryTitle.vietnam, iso2: "VN", iso3: "VNM" },
    { label: countryTitle.wallisAndFutuna, iso2: "WF", iso3: "WLF" },
    { label: countryTitle.christmasIsland, iso2: "CX", iso3: "CXR" },
    { label: countryTitle.westernSahara, iso2: "EH", iso3: "ESH" },
    { label: countryTitle.centralAfricanRepublic, iso2: "CF", iso3: "CAF" },
    { label: countryTitle.cyprus, iso2: "CY", iso3: "CYP" },
  ];
  const countriesSorted = sortObjectArrayByProperty(countries, "label");
  return countriesSorted;
};
