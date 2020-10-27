let Parser = require('binary-parser').Parser;
let StringOptions = {length: 255, zeroTerminated: true};

module.exports = PacketModels = {
    header: new Parser()
        .string('command', StringOptions),

    hi: new Parser()
        .string('command', StringOptions)
        .string('username', StringOptions)
};