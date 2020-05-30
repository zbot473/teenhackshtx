const express = require("express")
const app = express()

const fetch = require('node-fetch');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}
app.use("/assets", express.static("assets/"))

app.use(express.static("client/"));

app.get("/api/entries", async (req, res) => {
    const resp = await fetch("https://console.echoar.xyz/query?key=steep-thunder-4720")
    const json = await resp.json()
    keys = Object.keys(json.db)
    var ret = []

    for (let i = 0, len = keys.length; i < keys.length; i++) {
        ret.push({ key: keys[i], name: json.db[keys[i]].additionalData.name })
    }
    res.json(ret)
    console.log(json.db)
})

app.listen(8080)