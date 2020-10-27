const config = require('./config.json');

module.exports = function(){
    this.x = 50;
    this.y = 50;
    this.id = -1;
    this.socket = null;
    this.name = null;

    this.data = function (client, clients) {
        return (data) => {
            console.log('Incoming:', data);
            let header = PacketModels.header.parse(data);
            console.log('[Interpreted : ' + header.command + ']');
            let args = header.command.split(' ');
            let others = clients.all.filter(gc => gc !== client);

            switch (args[0].toUpperCase()) {
                case 'HI':
                    client.socket.write(`HELLO ${client.id} ${client.x} ${client.y}${config.endofpacket}`);
                    client.name = args[1];
                    console.log('Responded Hello');
                    others.forEach(o => {
                        o.socket.write(`NEW ${client.id} ${client.x} ${client.y} ${client.name}${config.endofpacket}`);
                        console.log(`Told user ${o.id} about the newbie`);
                    });
                    break;
                case 'MV':
                    switch (args[1].toUpperCase()) {
                        case 'UP':
                            client.y -= 5;
                            break;
                        case 'DOWN':
                            client.y += 5;
                            break;
                        case 'LEFT':
                            client.x -= 5;
                            break;
                        case 'RIGHT':
                            client.x += 5;
                            break;
                    }
                    clients.all.forEach(c => {
                        c.socket.write(`PPOS ${client.id} ${client.x} ${client.y}${config.endofpacket}`);
                    });
                    console.log('Moved');
                    break;
            }
        };
    },

    this.error = function (client, clients) {
        return (err) => {
            if( err.code === 'ECONNRESET') {
                console.log('Client connection reseted.');
            } else {
                console.log('Client had an error', err);
            }
            clients.all = clients.all.filter(goodClient => goodClient !== client);
            clients.all.forEach(c => {
                c.socket.write(`QUIT ${client.id}${config.endofpacket}`);
            });
        };
    },
    
    this.end = function (client, clients) {
        return () => {
            console.log('Disconnected');
            clients.all = clients.all.filter(goodClient => goodClient !== client);
            clients.all.forEach(c => {
                c.socket.write(`QUIT ${client.id}${config.endofpacket}`);
            });
        };
    }
}