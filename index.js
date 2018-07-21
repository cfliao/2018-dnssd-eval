const mdns = require('multicast-dns')();
const txt = require('dns-txt')();

mdns.on('response', function (response) {
    console.log('got a response packet:', response);
});

mdns.on('query', function (query) {

    mdns.respond({
        answers: [{ // _my-service 是 service type; MyInstance 是 instance name這個名稱要和下面TXT與SRV Records的name值一模一樣
            name: '_my-service._udp.local', ttl: 10, type: 'PTR', data: 'MyInstance._my-service._udp.local'
        }, {// _services._dns-sd._udp.local是用來讓browser列舉全域服務使用，一定要有
            name: '_services._dns-sd._udp.local', ttl: 10, type: 'PTR', data: '_my-service._udp.local'
        }
        ], additionals: [
            {
                name: 'MyInstance._my-service._udp.local',
                type: 'TXT',
                ttl: 10,
                data: txt.encode({x:'hello'})// 將key:value填入JSON物件，才能正常運作
            }, {
                name: 'MyInstance._my-service._udp.local',
                type: 'SRV',
                ttl: 10, // 此值一定不能為0，否則browser無法正常運作
                flush: true,
                data: {
                    port: 9999,
                    target: 'MyInstance.local' // 格式: InstanceName.local
                }
            }, {
                name: 'MyInstance.local',
                type: 'A',
                ttl: 10,
                flush: true,
                data: '192.168.4.134' // 格式: InstanceName.local
            }
        ]
    });

});

