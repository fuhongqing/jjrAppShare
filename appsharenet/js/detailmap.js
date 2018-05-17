$(function () {
    var searchArr=location.search.slice(1).split('&');
    var name='dfgf';//decodeURIComponent(searchArr[0].split('=')[1]);
    var address='电视广告';//decodeURIComponent(searchArr[1].split('=')[1]);
    var thisLongitude=121.351868;//searchArr[2].split('=')[1];
    var thisLatitude=31.228855;//searchArr[3].split('=')[1];
    var search= '';
    var origin='';
    var regin='';
    var content=`
    <div id="infoContent">
       <div class="left">
        <p>${name}</p>
        <p>${address}</p>
       </div>
        <div id="goHere" onclick="$('.modal').show()">到这里去</div>
        <span class="caret"></span>
    </div>
    `;
    //根字体大小设置
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px';
    //返回
    $('header').on('click','.backImg',function () {
        history.back();
    });
    var map = new BMap.Map("attrMap", {
        minZoom: 14,
        maxZoom: 20,
        enableMapClick: false
    });
    var geocoder = new BMap.Geocoder();
    if(thisLongitude=='null'||thisLatitude=='null'){//121.351868  31.228855
        //获取起始地址经纬度
        geocoder.getPoint(address, function(point){
                if(point) {
                    thisLongitude = point.lng;
                    thisLatitude = point.lat;
                    callback();
                }
            },address);
    }else{
        callback();
    }
    function callback() {
        var point = new BMap.Point(thisLongitude,thisLatitude);
        map.centerAndZoom(point, 15);
        var myIcon=new BMap.Icon("img/home_ic_map_red.png", new BMap.Size(22, 35));
        var marker = new BMap.Marker(point,{icon:myIcon});
        map.addOverlay(marker);
        map.panTo(point);
        //缩放控件
        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM}));
        //比例尺控件
        var scaleCtrl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            offset: new BMap.Size(10,10)});
        map.addControl(scaleCtrl);
        map.enableDragging();
        var geolocation = new BMap.Geolocation();
        function curPos(){
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    // map.clearOverlays();
                    // map.panTo(r.point);
                    // var marker = new BMap.Marker(r.point,{icon:myIcon});
                    // map.addOverlay(marker);
                    // var myCompOverlay = new SquareOverlay(r.point, 280,'rgba(0,0,0,.6)');
                    // map.addOverlay(myCompOverlay);
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function(rs) {
                        var addComp = rs.addressComponents;
                        origin=addComp.district+addComp.street;
                        regin=addComp.province;
                    });
                    // setTimeout(function(){
                    //     var convertor = new BMap.Convertor();
                    //     var pointArr = [];
                    //     pointArr.push(new BMap.Point(x,y));
                    //     convertor.translate(pointArr, 3, 5, translateCallback);
                    // }, 1000);
                }else {
                    alert('failed'+this.getStatus()+'定位失败');
                }
            }, {enableHighAccuracy: true});
        }
        curPos();
        //坐标转换完之后的回调函数
        // translateCallback = function (data){
        //     if(data.status === 0) {
        //         map.clearOverlays();
        //         map.panTo(data.points[0]);
        //         var marker = new BMap.Marker(data.points[0],{icon:myIcon});
        //         map.addOverlay(marker);
        //         center=data.points[0];
        //         var myCompOverlay = new SquareOverlay(data.points[0], 280,'rgba(0,0,0,.6)');
        //         map.addOverlay(myCompOverlay);
        //     }
        // };
        // 定义自定义覆盖物的构造函数
        function SquareOverlay(center, length, color){
            this._center = center;
            this._length = length;
            this._color = color;
        }
// 继承API的BMap.Overlay
        SquareOverlay.prototype = new BMap.Overlay();
        // 实现初始化方法
        SquareOverlay.prototype.initialize = function(map){
// 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.style.position = "absolute";
            // 可以根据参数设置元素外观
            div.style.width = this._length + "px";
            div.style.height = "80px";
            div.style.background = this._color;
            div.style.padding = "0 8px";
            div.style.whiteSpace = "wrap";
            div.style.MozUserSelect = "none";
            div.style.borderRadius = "4px";
            div.innerHTML=content;
            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
            return div;
        };
        // 实现绘制方法
        SquareOverlay.prototype.draw = function(){
// 根据地理坐标转换为像素坐标，并设置给容器
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 - 8 + "px";
            this._div.style.top = position.y - 96 + "px";
        };
        var myCompOverlay = new SquareOverlay(point, 280,'rgba(0,0,0,.6)');
        map.addOverlay(myCompOverlay);
        //解决自定义覆盖物点击事件失效问题
        map.addEventListener("touchstart",function(e){
            var element= e.domEvent.srcElement;
            element.click();
        });
        //附近周边搜索服务
        function getSquareBounds(centerPoi,r){
            var a = Math.sqrt(2) * r; //正方形边长
            var mPoi = getMecator(centerPoi);
            var x0 = mPoi.x, y0 = mPoi.y;
            var x1 = x0 + a / 2 , y1 = y0 + a / 2;//东北点
            var x2 = x0 - a / 2 , y2 = y0 - a / 2;//西南点
            var ne = getPoi(new BMap.Pixel(x1, y1)), sw = getPoi(new BMap.Pixel(x2, y2));
            return new BMap.Bounds(sw, ne);
        }
        //根据球面坐标获得平面坐标。
        function getMecator(poi){
            return map.getMapType().getProjection().lngLatToPoint(poi);
        }
        //根据平面坐标获得球面坐标。
        function getPoi(mecator){
            return map.getMapType().getProjection().pointToLngLat(mecator);
        }

        function Search(search,mPoint){
            map.clearOverlays();
            var circle = new BMap.Circle(mPoint,1500,{stroke:"white",strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
            map.addOverlay(circle);
            var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}});
            var bounds = getSquareBounds(circle.getCenter(),circle.getRadius());
            local.searchInBounds(search,bounds);
            map.addOverlay(marker);
            /*
            map.centerAndZoom(mPoint, 16);
            var local = new BMap.LocalSearch(map, {
                renderOptions: {map: map, panel: "r-result"}
            });
            local.search(search);
            */
        }
        $('footer').on('click','.traffic',function () {
            $(this).addClass('pActive').siblings().removeClass('pActive');
            search='交通';
            Search(search,point);
        })
            .on('click','.educate',function () {
                $(this).addClass('pActive').siblings().removeClass('pActive');
                search='教育';
                Search(search,point);
            })
            .on('click','.shopping',function () {
                $(this).addClass('pActive').siblings().removeClass('pActive');
                search='购物';
                Search(search,point);
            })
            .on('click','.medical',function () {
                $(this).addClass('pActive').siblings().removeClass('pActive');
                search='医疗';
                Search(search,point);
            });
        //取消
        $('#cancel').on('click',function () {
            $('.modal').hide();
        });
        //本百度坐标转高德坐标
        function bd09togcj02(bd_lon, bd_lat) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bd_lon - 0.0065;
            var y = bd_lat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var gg_lng = z * Math.cos(theta);
            var gg_lat = z * Math.sin(theta);
            return [gg_lng, gg_lat]
        }
        document.getElementById("gaodeMap").onclick = function(){
            var thisPoint=bd09togcj02(thisLongitude, thisLatitude);
            $(location).attr('href','http://uri.amap.com/marker?position='+thisPoint[0]+','+thisPoint[1]);
            // var u = navigator.userAgent;
            // if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
            //     window.location = "androidamap://navi";
            //     setTimeout(function() {
            //         window.location =  'http://mapdownload.autonavi.com/mobileapk/apk/Amap_V8.50.0.2169_android_C3060_\n' +
            //             '(Build1524114420).apk';
            //     },3000);
            // }
            // if (/(iPhone|iPad|iPod|iOS)/i.test(u)){
            //     window.location = "iosamap://navi";
            //     setTimeout(function() {
            //         window.location ="https://itunes.apple.com/cn/app/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE-%E7%B2%BE%E5%87%86%E5%AF%BC%E8%88%AA-%E5%87%BA%E8%A1%8C%E5%BF%85%E5%A4%87/id461703208?mt=8";
            //     },3000);
            // }
        };
        document.getElementById("baiduMap").onclick = function(){
            $(location).attr('href','http://api.map.baidu.com/marker?location='+thisLatitude+','+thisLongitude+'&title=目的地&content='+address+'&output=html');
            // var u = navigator.userAgent;
            // if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
            //     window.location = "baidumap://";
            //     setTimeout(function() {
            //         window.location = "http://p.gdown.baidu.com/0c43b1e549cb818a5e848cdfdc7924755786f2b84278812975cf9198fdef68ecde262f106bb20ab45219f9d0916d6f5dbecb73e5c0f2a3bc73615b050fc68bac69c12d64d2a2fbf03933eebbde0b70f6a180de048e3d70cd4d945a5c5d7157c332bb6a5d3e84c49660393da5bf4915030300836f32321a543ea0ddc472a063aeb3007887a3bf74fa7828132a31b168ed1530aded71b718f13a1332759d48997942557e6cfee3ed091538926fee90cd0009749d5540f4b9e204b0514927ec232063a028e0367360e500ec9748c01a703e4daa055ed658ff6b53a3a198f0aab43a19a7e4a55a6bc21eb1255282439002705fad6513f552209a";
            //     },3000);
            // }
            // if (/(iPhone|iPad|iPod|iOS)/i.test(u)){
            //     window.location = "baidumap://map/direction?origin="+origin+"&destination="+address+"&mode=driving&region="+regin;
            //     setTimeout(function() {
            //         window.location ="http://count.liqucn.com/d.php?id=11052&urlos=ios&down_type=itunes&from_type=web&down_type=itunes";
            //     },3000);
            // }
        }
    }
});