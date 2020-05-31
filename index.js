require('dotenv/config')
var fs = require("fs")
var request=require("request")
var playlist_url = "https://api.spotify.com/v1/users/" +process.env.SP_ID+ "/playlists";


request({url:playlist_url, headers:{"Authorization":process.env.SP_TOKEN}}, function(err, res) {


    if(res){
        var playlists = JSON.parse(res.body);
        console.log(JSON.stringify(playlists.items, null, ""));
        var playlist_url = playlists.items[0].href;

        for (var i = 0; i < playlists.items.length; i++) {
            let logger = fs.createWriteStream(playlists.items[i].name, {flags: 'a'});
            playlist_url = playlists.items[i].href;
            request({url:playlist_url, headers:{"Authorization":process.env.SP_TOKEN}}, function(err, res) {
                if(res){
                    var playlist = JSON.parse(res.body);
                    playlist.tracks.items.forEach(function(track){
                        logger.write(track.track.name + " ");
                        track.track.artists.forEach(function(artist){
                            logger.write(artist.name + " ");
                        }) 
                        logger.write("\n");
                    })
                }
            });
        }


    }
});
