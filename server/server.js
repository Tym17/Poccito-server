const config = require('./config.json');
let client_inst = new require('./client.js');
let net = require('net');
require('./packetModels.js');
require('./utils.js');

let clients = {
    all: []
};
let npcs = {
    all: []
};
let givenIds = 0;

// Add some npcs
npcs.all.push({
    id: 0,
    name: 'Joe',
    x: 100, 
    y: 150,
    going: false, 
    behaviour: it => {
        if (it.going) {
            it.x += 5;
        } else {
            it.x -= 5;
        }
        if (it.x < 100 || it.x > 200) {
            it.going = !it.going;
        }
    }
});

npcs.all.push({
    id: 1,
    name: 'Jeff',
    x: 200,
    y: 100,
    behaviour: it => {
        random = utils.getRandomInt(0, 4);
        switch (random) {
            case 0:
            it.x += 5;
            break;
            case 1:
            it.y += 5;
            break;
            case 2:
            it.x -= 5;
            break;
            case 3:
            it.y -= 5;
            break;
        }
    }
});

net.createServer(socket => {
    console.log('Client connected');
    let client = new client_inst();
    client.id = givenIds++;
    console.log('  ->  Gave Id ' + client.id);
    client.socket = socket;
    // Tell client about other players
    clients.all.forEach(c => {
        client.socket.write(`NEW ${c.id} ${c.x} ${c.y} ${c.name}${config.endofpacket}`);
        console.log('populating...');
    })
    clients.all.push(client);

    // Tell client about NPCs
    npcs.all.forEach(npc => {
        client.socket.write(`NPC ${npc.id} ${npc.x} ${npc.y} ${npc.name}${config.endofpacket}`);
    });

    socket.on('end', client.end(client, clients));
    socket.on('error', client.error(client, clients));
    socket.on('data', client.data(client, clients));

}).listen(config.port);

console.log('Initialized');
let loop = () => {
    npcs.all.forEach(npc => {
        npc.behaviour(npc)
        clients.all.forEach(c => {
            c.socket.write(`NPOS ${npc.id} ${npc.x} ${npc.y}${config.endofpacket}`);
        });
    });
    
    setTimeout(loop, 1000);
};

loop();