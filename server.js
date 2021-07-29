const crypto = require('crypto')
const dhtKv = require('dht-keyvalue')
const express = require("express");
const io = require('socket.io')() // create a socket.io server
const path = require("path");
const app = express();

let server = app.listen(3000)

app.use(express.static(path.join(__dirname, "public")));

io.attach(server,{
 cors: {
  origin: "*",
  methods: ["GET", "POST"],
  transports: ['websocket', 'polling'],
  credentials: true
 },
 allowEIO3: true
})

let node
let appName
let apps = []
let peers = []
let pairs = []
let p = []

let opts = {
 keep: true, // default = true. Keep the DHT object alive in the mainline bittorrent network
 keepalive: 3600000 // default = 3600000. Interval to refresh the DHT object (milliseconds)
}

const dkv = new dhtKv(opts)

server.on('listening', ()=>{
 if(server.address().address === '::'){
  node = `ws://localhost:${server.address().port}`
  console.log('listening on', node)
 }
})

io.on('connection', socket => {
 console.log('connected')
 socket.emit('init')

 socket.on('init', data => {
  data = JSON.parse(data)
  console.log('got here', data)
  // Handle new nodes
  if(data.type === 'node'){
   let address = data.node
  }

  // Handle new peers
  if(data.type === 'peer'){
   appName = sha(data.appName)

   console.log('Peer connected for app Id:', appName)

   if(apps.length === 0) apps.push({appName: appName})
   apps.forEach(app => {
    if(!app) apps.push({appName: appName})
   })

   dkv.put([{key: appName}], (err, hash, key) => {
    console.log('Put successful', key, hash)

    dkv.get(key, (err, value) => {
     console.log(value)
    })

    let newValue = [{nodes: node, peers: [socket.id]}] // need to sort out how to add a peer here
    dkv.update(key, newValue, updated => {
     if(updated === true){
      dkv.get(key, (err, value) => {
       console.log(value)
      })
     }
    })

   })

   console.log(apps)

  }

 })

})

function sha(string){
 let shasum = crypto.createHash('sha1')
 shasum.update(string)
 
 return shasum.digest('hex')
}