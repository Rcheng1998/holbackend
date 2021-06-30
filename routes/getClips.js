const router = require('express').Router();
const request = require('request');
const async = require('async')
const axios = require('axios')
const mergeJson = require("underscore")
const merge = require('merge')
require('dotenv').config()

router.get("/twitchClips/:broadcasterID", async (req, res) => {
    const broadcasterID = req.params.broadcasterID

    const twitchRes = await axios.get('https://api.twitch.tv/helix/clips?broadcaster_id=' + broadcasterID + '&first=100&after=eyJiIjpudWxsLCJhIjp7IkN1cnNvciI6Ik1UQXcifX0', {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_OATH_KEY
        }
    });

    res.send(twitchRes.data)
});

router.get("/channel/:twitchName", async (req, res) => {
    const twitchName = req.params.twitchName.toLowerCase()
    const responseJSON = { "data": [] }
    const broadcastRes = await axios.get('https://api.twitch.tv/helix/search/channels?query=' + twitchName, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_OATH_KEY
        }
    });

    for(i=0; i < broadcastRes.data.data.length; i++){
        console.log(broadcastRes.data.data[i].broadcaster_login)
        if(twitchName === broadcastRes.data.data[i].broadcaster_login){
            responseJSON.data.push(broadcastRes.data.data[i])
        }
    }

    let broadcasterID = responseJSON.data[0].id
    console.log(broadcasterID)

    const twitchRes = await axios.get('https://api.twitch.tv/helix/clips?broadcaster_id=' + broadcasterID + '&first=100', {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_OATH_KEY
        }
    });

    let pagination = twitchRes.data.pagination.cursor
    console.log('pagination', pagination)

    const moreTwitchRes = await axios.get('https://api.twitch.tv/helix/clips?broadcaster_id=' + broadcasterID + '&first=100' + '&after=' + pagination, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_OATH_KEY
        }
    });

    let merge = [...(twitchRes.data.data), ...(moreTwitchRes.data.data)]
    console.log(merge.length)

    if(merge.length === 0){
        res.sendStatus(404)
    }
    
    res.send(merge)
});

router.get("/profilepicture/:twitchName", async (req, res) => {
    const twitchName = req.params.twitchName.toLowerCase()

    const pictureRes = await axios.get('https://api.twitch.tv/helix/users?login=' + twitchName, {
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': 'Bearer ' + process.env.TWITCH_OATH_KEY
        }
    });

    res.send(pictureRes.data)
});

module.exports = router; 