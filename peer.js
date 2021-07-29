// simulate a client in node
const io = require('socket.io-client')

let socket = io('ws://localhost:3000')

socket.on('connection', socket => {
 console.log('connected')
})

let appName = 'My awesome app!'

socket.on('init', ()=> {
 let data = {
  type: 'peer', 
  appName: appName
 }
 socket.emit('init', JSON.stringify(data))
})