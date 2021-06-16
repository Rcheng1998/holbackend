const router = require('express').Router();
const request = require('request');
const async = require('async')
const axios = require('axios')

router.get("/:twitchName"), async (req, res) => {
    const twitchName = req.parmas.twitchName
    const broadcastRes = await axios.get('https://api.twitch.tv/helix/search/channels?query=' + twitchName, {
        headers: {
            'Client-ID': 'ba4gwr5z6aaz5ka6g5a7x2bt7m1t5h',
            'Authorization': 'Bearer ' + '7uvunv50xf3d3cnzywpcwwkeoin385'
        }
    });

    res.send(broadcastRes.data)
}

module.exports = router; 