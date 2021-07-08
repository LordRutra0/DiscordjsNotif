async function updateVideo(){

    const puppeteer = require('puppeteer');
    const fs = require('fs');


    (async () => {
        const browser = await puppeteer.launch({headless: false}); 
        const page = await browser.newPage();
        await page.goto('https://www.youtube.com/channel/UC3IpBfNEN88CfF31Vo5lJmA/videos');

        console.log('puppeteer')


        //clique sur le boutton "j'accepte"
        await page.click('.qqtRac > form > div > div > button > span') 

        await page.waitForNavigation()


        var List_videos = await page.evaluate(()=>{

            var LesVideos = { "title":[], "src":[]}
            var elements = document.querySelectorAll('#items ytd-grid-video-renderer');

            for (let index = 0; index < 3; index++) {   
                
                LesVideos["title"].push(elements[index].querySelector('#video-title').textContent)
                LesVideos["src"].push(elements[index].querySelector('div ytd-thumbnail a').href )


                
            }
            return LesVideos 
        });

        
        WriteFiles('videosUpdate.json',List_videos)

        
        await browser.close();  

       
        
    })();

    return;

   

}




function EnvoieNotif(){

    const Discord = require("discord.js");
    const fs = require('fs');
    const client = new Discord.Client();

    const listUpdate = require("./videosUpdate.json");
    const listJson = require("./youtube.json");

    console.log(listJson)

    const bot = new Discord.Client();

    bot.login("ton token ici");


    bot.on('ready', () => {

        
        //si 1 video a été ajouté
        if ( listJson["src"][0] == listUpdate["src"][1] && listJson["src"][1] == listUpdate["src"][2]) {
            
            bot.channels.cache.get("l'id de ton salon discord").send("LordRutra vient de sortir une vidéo,"+ listUpdate["title"][0] +", regardez la si vous avez le temps :smile: \n"+ listUpdate["src"][0])

            WriteFiles('youtube.json',listUpdate)
        }
        //si 2 videos publiées
        else if ( listJson["src"][0] == listUpdate["src"][2]) {
            
            bot.channels.cache.get("l'id de ton salon discord").send("LordRutra vient de sortir 2 vidéos,"+ listUpdate["title"][0] +"ainsi que,"+listUpdate["title"][1]+", regardez les si vous avez le temps :smile: \n"+ listUpdate["src"][0] +"\n"+ listUpdate["src"][1])

            WriteFiles('youtube.json',listUpdate)
        }
        else{

            WriteFiles('youtube.json',listUpdate)

        }

        
        return null;

    })

    


}


setInterval(function(){
    updateVideo()

    setTimeout(function(){EnvoieNotif();}, 60000)

    

}, 600000) //60000



function WriteFiles(file, data){

    const fs = require('fs');

    fs.writeFile(file, JSON.stringify(data, null, 4), (err)=>{
        if(err)
        console.log(err)
    })

}

