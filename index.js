const mdns = require('multicast-dns')({
    multicast: true, // use udp multicasting
    port: 5353, // set the udp port
    ip: '224.0.0.251', // set the udp ip
    loopback: true, // receive your own packets
    reuseAddr: true // set the reuseAddr option when creating the socket (requires node >=0.11.13)
});
const txt = require('dns-txt')();

mdns.on('response', function (response) {
    console.log('got a response packet:', response);
});

mdns.on('query', function (query) {
    //console.log('got a query packet:', query);
    mdns.respond({
        answers: [{
            name: '_rosa._udp.local', ttl: 10, type: 'PTR', data: 'TTry._rosa._udp.local'
        }, {
            name: '_services._dns-sd._udp.local', ttl: 10, type: 'PTR', data: '_rosa._udp.local'
        }, {
            name: 'TTry.local',
            type: 'A',
            ttl: 120,
            flush: true,
            data: '192.168.4.134'
        }
        ], additionals: [
            {
                name: 'TTry._rosa._udp.local',
                type: 'TXT',
                ttl: 60,
                data: txt.encode({x:'hello'})
            }, {
                name: 'TTry._rosa._udp.local',
                type: 'SRV',
                ttl: 60,
                flush: true,
                data: {
                    port: 9999,
                    weigth: 0,
                    priority: 0,
                    target: 'TTry.local'
                }
            }, {
                name: 'TTry.local',
                type: 'A',
                ttl: 120,
                flush: true,
                data: '192.168.4.134'
            }
        ]
    });

});

