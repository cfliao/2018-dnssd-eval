# mDNS/dns-sd

* mDNS群播位址是**224.0.0.251**，port **5353**

## 藉由service type找到service instance
* 先發送一個PTR到群播位址
  
``` 
&lt;service&gt;.&lt;transport&gt;.&lt;domain&gt;
例如: _my-service._udp.local PTR IN MyInstance._my-service._udp.local
```
_my-service是service，_udp是transport，local是domain。dns-sd中，
PTR record用於表示「服務-實例」的mapping，因此上面的例子是代表MyInstance._my-service._udp.local
是_my-service._udp.local服務的一個實例。

**_services._dns-sd._udp.local** 是一個特殊的service type，用來列舉區網內所有服務。
```
例如: _services._dns-sd._udp.local PTR IN _my-service._udp.local
```
## 取得Service instance 的host name與port
接下來被找到的instance會送出SRV。藉由SRV，可提供真正instance所在地的domain name和port number。格式如下:
```
格式: &lt;service&gt;.&lt;transport&gt;.&lt;domain&gt; TTL class SRV priority weight port target
MyInstance._my-service._udp.local 10 IN SRV 0 0 9999 MyInstance.local
```
在dns-sd中，priority和weight是無效的。

## 取得Service instance的詳細資訊
此外，藉由TXT，可以key-value型式提供服務更詳細的資訊。根據這些資訊，服務要求者可以更詳細地評估此service instance是否適合其需求。
TXT的data區段必須依規範予以編碼。

在實作上，我們使用dns-txt，它的encode方法接受一個物件做為參數，所以使用時要先將我們要為此instance設定的key-value pairs寫成JSON物件型式，再做為參數傳入。
例如:
```javascript 1.6
const txt = require('dns-txt')();
txt.encode({x:'hello'})
```
上面的結果相當於傳入**x=hello**。

## note
由上面的討論可知，從dns-sd中client可以得知的是service type、ip/port與詳細key-value資訊。它和UPnP最大的不同是UPnP還提供了呼叫其remote methods的 api signatures。
這部份可以在txt區段中，加入description.xml的uri來補足。但SSDP的部份似乎是完全可以取代。如果是不需要RPC call的服務發現使用場景來說，dns-sd似乎是一個具有相當彈性的輕量級服務協定。