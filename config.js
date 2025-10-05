require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  SECRET_CHANNEL_ID: process.env.SECRET_CHANNEL_ID,

  // Ustozlar usernamelari
  TEACHERS: [
    "@ministry_me",
    "@Umrbek070",
    "@Mavluda_02_70",
    "@Dilmurod_Ruzmetov",
    "@mdavud1707",
    "@Yagona_9591",
    "@gulhayoismoilova",
    "@ruslanovnas19",
    "@polvonnazirovna_r",
    "@kamilova03",
    "@Doniyor201994",
    "@Qwwssscg",
    "@Truth_seeker2704",
    "@sharipova_0303",
    "@polvon_drummer",
    "@Dilrabo912",
    "@zebo_baxodirovna",
    "@Shakhrukh29",
    "@N89908",
    "@zarinabonu_2001",
    "@qadamugli",
    "@redjepova_d",
    "@Otabek183",
    "@Umarbek3121",
    "@marhabo2",
    "@V_E_N_U_S6",
    "@Sevara198825",
    "@SultanaMexriddin",
    "@NurimovaH",
    "@Bekchanovahadicha91",
    "@Otabek_Rozmatov",
    "@Chorniyglazaa",
    "@maqsudovnamsh",
    "@Mavi_03m",
    "@Mardon9090",
    "@liliya_savsangul",
    "@union_school_khorazm",
    "@Madina_Raximova",
    "@Otabek_Jumanazarov",
    "@jahanrus",
    "@Fresstylewrestling",
    "@Ddil_ya",
    "@HikmatAllabergenov",
    "@B_math_master",
    "@kalandarov81",
    "@Zebo_Baxodirovna_PhD_dotsent",
    "@Komilova_sh_7"
  ],
  // O‘quvchilar (sinflar bo‘yicha)
  STUDENTS: {
  "1A": [
    "Baxtiyorov Shahniyor",
    "Rustamov Shohjahon",
    "Agajanova Xonzoda",
    "Azimboyeva Sabina",
    "Farxadova Zarnigor",
    "Shavkatov Shavkatbek",
    "Rustamova Lolaxon",
    "Ruzmatova Parizoda",
    "Soburov Jasurbek",
    "Soburov Shoxjahon",
    "Ergashova Sultona",
    "Shavkatov Abdulaziz",
    "Shonazarov Shohjahon",
    "Shonazarova Diyora",
    "Xudayberganova Mexrinoz",
    "Davronbekov Dilmurod",
    "Amidullaev Jasurbek",
    "Fayzullayev Mirziyo",
    "Yusupov Amrshoh",
    "Baxtiyarov Saida'zam"
  ],
  "1B": [
    "Baxtiyorov Azizbek",
    "Amanbayeva Indira",
    "Duschanov Firdavs",
    "Ulug'bekova Umira",
    "Erkinova E'zoza",
    "Bahodirov Jasurbek",
    "Qurdoshboyev Sardorbek",
    "Ziynatova Muslima"
  ],
  "2A": [
    "Azimboyev Amirbek",
    "Xalmuminov Mironshox",
    "Otabekov Oxunjon",
    "Sultanbayev Ibrohim",
    "Sultanbekova Xadichabonu",
    "Baxtiyorov Islom",
    "Xasanbayev Bilolbek",
    "Agajanov Amirxon",
    "Sultonov Ma`ruf",
    "Botirov Behruzbek",
    "Yusupova Farzonabonu"
  ],
  "2B": [
    "Baxodirova Charosxon",
    "Baxodirov Akbar",
    "Sabiryazov Shohjahon",
    "Qadirova Maftuna",
    "Rajabbayev Mehriddin",
    "Sheripbayev Ulug`bek",
    "Alisherov Xumoyun",
    "karimberganova Munisa"
  ],
  "3A": [
    "Baxtiyarov Musobek",
    "Babajanov Maqsaddin",
    "Satipov Muhammadali"
  ],
  "3B": [
    "Alisherova Guli",
    "Adilbekov Dilshodbek",
    "Murodbekov Bunyod",
    "Sheribov Yahyobek",
    "Muhammedov Abdurahmon",
    "Maratov Islombek",
    "Yusupboyev Qutlimurod",
    "Maxsudbekova Munisa",
    "Baxtiyorov Mustafo",
    "Fayzullayeva Shukurjon",
    "Ulug`bekova Mexrimox"
  ],
  "4A": [
    "Davletov Diyorbek",
    "Xudayberganova Shahina",
    "Bazarbayev Mirali",
    "Baxtiyarov Saidakram",
    "Sharipov Elbek",
    "Ahmedov Anvar"
  ],
  "4B": [
    "Atanazarov Abdulaziz",
    "Baxtiyorova Hilola",
    "Xasanov Sulaymon",
    "Baxadirov Shohruh",
    "Baltayev Sulaymon",
    "Shermatov Quvonchbek",
    "Xushnudbekova Habiba"
  ],
  "5A": [
    "Shakirov Sherali",
    "Shonazarova Dinora",
    "Baxtiyorova Muborak",
    "Abidova Sagdiana",
    "Murodbekov Mustafo",
    "Baxtiyorova Hadicha",
    "Abdullayeva Sabina",
    "Abdusheripova Nozima"
  ],
  "6A": [
    "Allaberganov Shahriyor",
    "Jumaniyazova Shahina",
    "Kodirberdiyev Ibrohim",
    "Allaberganov Sulaymon",
    "Muxametov Akrombek"
  ],
  "6B": [
    "Nizomaddinov Shohzodbek",
    "Raximiy Islombek",
    "Xasanova Zuhra",
    "Rustamov Bunyodbek",
    "Bekturdiyev Imomiddin",
    "Botirov Hamdambek"
  ],
  "7A": [
    "Atanazarova Jasmina",
    "Ruzmetov Shohjaxon",
    "Muxametova Mushtariy",
    "Shakirjonov Saidmuxammad",
    "Abdullayeva Parizod"
  ],
  "7B": [
    "Atanazarova Saodat",
    "Iskandarova Dilnoza",
    "Baxtiyorov Mahmudbek",
    "Muhammedova Nafisa",
    "Shakirov Mustafo",
    "Ergashov Mexriddin",
    "Baxadirova Sayyora",
    "Bahodirova Zebiniso",
    "Maxsudbekov Muhammadali"
  ],
  "8A": [
    "Ruslanov Otabek",
    "Ramatjonov Asilbek",
    "Rakhmanov Sobirjon",
    "Taxirov Temurbek",
    "Abdusharipova Dilnoza",
    "Yuldasheva Ziynatjon",
    "Baxtiyorova Tabassum",
    "Ruzmetova Parizoda",
    "Rustambekova Sabina",
    "Yuldoshova Shaxinabonu",
    "Yuldoshov Javoxir",
    "Matniyazova Kamola"
  ],
  "8B": [
    "Djumaniyazov Akbar",
    "Babadjanov Amir",
    "Otaxonova Xonzoda",
    "Iskandarov Abdulaziz",
    "Bekchanov Asadbek",
    "Rajabov Azizbek",
    "Marksov Shoxjaxon",
    "Xudayberganova Nozima",
    "Madaminov Maqsad"
  ],
  "9A": [
    "Muxametova Nozima",
    "Ozodboyev Diyorbek",
    "Rajabboyev Sulaymon"
  ],
  "9B": [
    "Atajonov Nurmuhammad",
    "Shanazarova Dilnura",
    "Qabuljanova Farangiz",
    "Allaberganov Sherzod",
    "Djumaniyazov Rahmatulloh"
  ],
  "10A": [
    "Ruslanova Jasmina",
    "Kutlimurodov Asadbek"
  ],
  "10B": [
    "Yusupov Asadbek",
    "Sadullayev Bexruzbek",
    "Farxodov Shohjaxon",
    "Madaminov Javohir",
    "Odamboyev Islombek",
    "Baxadirova Shabnam",
    "Saparbayev Shohruh",
    "Shermatova Munisa"
  ],
  "11A": [
    "Rustamboyeva Soliyajon",
    "Qurbonboyev Islom",
    "Rahimboyev Xushnudbek",
    "Ravshanbekov Firdavs"
  ],
  "11B": [
    "Taxirov Jahongir",
    "Karimboyev Elxon"
  ]
}

};
