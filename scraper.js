require('dotenv/config')
const puppeteer = require("puppeteer");
const fs = require('fs');
const readline = require('readline');

let toTranser = ""
let songs = [];

async function amHandler(playlists) {

    try {
        const browser = await puppeteer.launch({ headless: false, executablePath: process.env.CHROME_PATH, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await amLogin(process.env.AMAZON_MUSIC, page)
        await amCreatePlaylist(page, toTranser);
        await sleep(2000);
        await loadPlaylist(toTranser);

        for(i = 0; i < songs.length; i++) {
            await amAddSong(page, toTransfer, songs[i]);
        }

        await endProcess(browser);
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        console.log("Process complete");
    }
}

async function amLogin(url, page) {
    try {
        await page.goto(url, {waitUntil: 'networkidle0'});
        let elements = await page.$x('/html/body/div[6]/div[1]/section/ul/li[1]/a');
        await elements[0].click();
        await page.waitForNavigation();
        await page.type('#ap_email', process.env.AM_USER);
        await page.type('#ap_password', process.env.AM_PASS);
        elements = await page.$x('/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div/form/div/div/div/div[3]/span/span/input');
        await elements[0].click();
        await page.waitForNavigation({waitUntil: 'networkidle0'});
    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        console.log("Completed Login");
    }
}

async function amCreatePlaylist(page, plName) {
    try {
        console.log("Creating play list " + plName);
        let elements = await page.$x('//*[@id="newPlaylist"]');
        await elements[0].click();
        await sleep(1000);
        await page.type('#newPlaylistName', plName);
        elements = await page.$x('//*[@id="savePlaylistDialog"]/a');
        await elements[0].click();
    }
    catch (err){
        console.error(err.message);
    }
    finally {
        console.log("Created playlist");
    }

}

async function amAddSong(page, plName, song)  {
    try {
        console.log("Attemping to add " + song + " to " + plName + "...");
        await page.type('#searchMusic', song);
        await page.keyboard.press('Enter');
        await sleep(2000);
        let elements = await page.$x('//*[@class="card trackCard"]/div[@class="shoveler"]/div[@class="shovelerContent"]/div[@class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 contentPage trackPage alphaPage transition"]/div[@class="horizontalTile TILE"]/div[@class="rightSection"]/span[@class="playerIconDotMenu"]');
        await elements[0].click();
        await sleep(2000);
        elements = await page.$x('//*[@id="contextMenu"]/li[2]/div/span');
        await elements[0].click();
        await sleep(2000);
        xpath = "//li[@class='selectDropdownOption']/span[contains(text(),'" + plName + "')]";
        elements = await page.$x(xpath);
        console.log(elements.length);
        if(elements.length != 0) {
            await elements[0].click();
        }
        else {
            console.log("Failed to find path");
        }

    }
    catch (err) {
        console.log(err.message);
        return;
    }
    finally {
        console.log("Song added successfully");
    }

}

async function endProcess(browser) {
    browser.close();
    console.log("Browser exited");
}

async function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

async function loadPlaylist(fileName) {
    const fileStream = fs.createReadStream(fileName);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      songs.push(line);
    }


  }

amHandler(null);