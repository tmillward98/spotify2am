# spotify2am
Automatically transfer playlists from Spotify to Amazon Music

This project is still in development, and hence unfinished. The current configuration of the project does work for transferring playlists.

# How to use
To use this project, setup a .env file with the following variables

AMAZON_MUSIC = https://music.amazon.co.uk/
CHROME_PATH = C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
AM_USER = YOUR AMAZON MUSIC USERNAME HERE
AM_PASS = YOUR AMAZON MUSIC PASSWORD HERE

SP_ID = YOUR SPOTIFY ID HERE
SP_TOKEN = YOUR SPOTIFY OAUTH2 TOKEN HERE

Once this is done, run the index.js to create files containing search criteria for the scraper. Pass the scraper one of these files, along with setting the toTransfer variable with the playlist name. 

I appreciate the current setup is undesirable, but will be improved in future iterations with actual user interface. 
