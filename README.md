# :construction: peerservers :construction:
Peerservers is a work in progress effort to enable peer-to-peer communication between browsers without any centralized tracker servers.

One of the challenges with P2P applications, particularly for web browsers, is the requirement for centralized WebRTC signaling servers. What that means is web browser peers cannot talk to each other unless they share the same signaling server. That is is a big impediment to the realization of true decentralization. 

Peerservers wants to solve this by decentralizing the need for individual signaling servers altogether by decentralizing the tracker servers themselves.

The basic idea is that peerservers nodes use the bittorrent mainline DHT as a way to store information about the applications, nodes and peers, then relay the WebRTC signaling from peers on one node to peers on another node based on an application specific infohash.

When this project is successful, the next phase will be to explore how to use this concept to extend [bittorrent-tracker](bittorrent-tracker link) to (optionally) enable this same kind of functionality for anyone who wants to run a tracker; ideally to (optionally) fully distribute all webtorrent tracker servers using this approach (a lofty goal, I know!).

## :construction: Status :construction:
Currently under active development and is in R&D status. 

It is unviable for use as of this revision. Please check back later!

## How it works (or, as of this version, how it **will work**)
Peerservers connects peers together based on a unique appplication name regardless of which node the peer contacted first.

Peerservers addresses this using a novel approach. Each peerservers node uses the bittorrent mainline DHT as a store for  each application and the nodes responsible for for that aapplication. When a new peer joins Node **N**, that node uses [dht-keyvalue](https://github.com/draeder/dht-keyvalue) to lookup that application on the DHT network. If the application doesn't already exist, that node creates a new DHT record for the application with the peer ID.

As more peers connect to other peerservers nodes, the nodes lookup the DHT record to find out which other nodes are aware of the application the peers want to connect to. The new peers then create a WebRTC offer using [simple-peer](simplepeer link) and send it to the node those are on. That node opens a websockets connection for each other node that has peers for the application and transmits the offer. Those nodes forward the offer to the peers connected to them. The peers respond with an answer and the peers are then connected.

Since the peers are now connected, peerservers nodes disconnect the websockets connection because it is no longer needed.
