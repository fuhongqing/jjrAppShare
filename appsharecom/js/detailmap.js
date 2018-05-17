$(function() {
    var searchArr = location.search.slice(1).split('&');
    var name = decodeURIComponent(searchArr[0].split('=')[1]);
    var address = decodeURIComponent(searchArr[1].split('=')[1]);
    var thisLongitude = searchArr[2].split('=')[1];
    var thisLatitude = searchArr[3].split('=')[1];
    var search = '';
    var origin = '';
    var regin = '';
    var content = ("\n    <div id=\"infoContent\">\n       <div class=\"left\">\n        <p>" + name + "</p>\n        <p>" + address + "</p>\n       </div>\n        <div id=\"goHere\" onclick=\"$('.modal').show()\">到这里去</div>\n        <span class=\"caret\"></span>\n    </div>\n    ");
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px';
    $('header').on('click', '.backImg', function() {
        history.back();
    });
    var map = new BMap.Map("attrMap", {
        minZoom: 14,
        maxZoom: 20,
        enableMapClick: false
    });
    var geocoder = new BMap.Geocoder();
    if (thisLongitude == 'null' || thisLatitude == 'null') {
        geocoder.getPoint(address, function(point) {
            if (point) {
                thisLongitude = point.lng;
                thisLatitude = point.lat;
                callback();
            }
        }, address);
    } else {
        callback();
    }
    function callback() {
        var point = new BMap.Point(thisLongitude, thisLatitude);
        map.centerAndZoom(point, 15);
        var myIcon = new BMap.Icon("img/home_ic_map_red.png", new BMap.Size(22, 35));
        var marker = new BMap.Marker(point, {icon: myIcon});
        map.addOverlay(marker);
        map.panTo(point);
        map.addControl(new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        }));
        var scaleCtrl = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            offset: new BMap.Size(10, 10)
        });
        map.addControl(scaleCtrl);
        map.enableDragging();
        var geolocation = new BMap.Geolocation();
        function curPos() {
            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(r.point, function(rs) {
                        var addComp = rs.addressComponents;
                        origin = addComp.district + addComp.street;
                        regin = addComp.province;
                    });
                } else {
                    alert('failed' + this.getStatus() + '定位失败');
                }
            }, {enableHighAccuracy: true});
        }
        curPos();
        function SquareOverlay(center, length, color) {
            this._center = center;
            this._length = length;
            this._color = color;
        }
        SquareOverlay.prototype = new BMap.Overlay();
        SquareOverlay.prototype.initialize = function(map) {
            this._map = map;
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.width = this._length + "px";
            div.style.height = "80px";
            div.style.background = this._color;
            div.style.padding = "0 8px";
            div.style.whiteSpace = "wrap";
            div.style.MozUserSelect = "none";
            div.style.borderRadius = "4px";
            div.innerHTML = content;
            map.getPanes().markerPane.appendChild(div);
            this._div = div;
            return div;
        };
        SquareOverlay.prototype.draw = function() {
            var position = this._map.pointToOverlayPixel(this._center);
            this._div.style.left = position.x - this._length / 2 - 8 + "px";
            this._div.style.top = position.y - 96 + "px";
        };
        var myCompOverlay = new SquareOverlay(point, 280, 'rgba(0,0,0,.6)');
        map.addOverlay(myCompOverlay);
        map.addEventListener("touchstart", function(e) {
            var element = e.domEvent.srcElement;
            element.click();
        });
        function getSquareBounds(centerPoi, r) {
            var a = Math.sqrt(2) * r;
            var mPoi = getMecator(centerPoi);
            var x0 = mPoi.x,
                y0 = mPoi.y;
            var x1 = x0 + a / 2,
                y1 = y0 + a / 2;
            var x2 = x0 - a / 2,
                y2 = y0 - a / 2;
            var ne = getPoi(new BMap.Pixel(x1, y1)),
                sw = getPoi(new BMap.Pixel(x2, y2));
            return new BMap.Bounds(sw, ne);
        }
        function getMecator(poi) {
            return map.getMapType().getProjection().lngLatToPoint(poi);
        }
        function getPoi(mecator) {
            return map.getMapType().getProjection().pointToLngLat(mecator);
        }
        function Search(search, mPoint) {
            map.clearOverlays();
            var circle = new BMap.Circle(mPoint, 1500, {
                stroke: "white",
                strokeWeight: 1,
                fillOpacity: 0.3,
                strokeOpacity: 0.3
            });
            map.addOverlay(circle);
            var local = new BMap.LocalSearch(map, {renderOptions: {
                    map: map,
                    autoViewport: false
                }});
            var bounds = getSquareBounds(circle.getCenter(), circle.getRadius());
            local.searchInBounds(search, bounds);
            map.addOverlay(marker);
        }
        $('footer').on('click', '.traffic', function() {
            $(this).addClass('pActive').siblings().removeClass('pActive');
            search = '交通';
            Search(search, point);
        }).on('click', '.educate', function() {
            $(this).addClass('pActive').siblings().removeClass('pActive');
            search = '教育';
            Search(search, point);
        }).on('click', '.shopping', function() {
            $(this).addClass('pActive').siblings().removeClass('pActive');
            search = '购物';
            Search(search, point);
        }).on('click', '.medical', function() {
            $(this).addClass('pActive').siblings().removeClass('pActive');
            search = '医疗';
            Search(search, point);
        });
        $('#cancel').on('click', function() {
            $('.modal').hide();
        });
        function bd09togcj02(bd_lon, bd_lat) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bd_lon - 0.0065;
            var y = bd_lat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var gg_lng = z * Math.cos(theta);
            var gg_lat = z * Math.sin(theta);
            return [gg_lng, gg_lat];
        }
        document.getElementById("gaodeMap").onclick = function() {
            var thisPoint = bd09togcj02(thisLongitude, thisLatitude);
            $(location).attr('href', 'http://uri.amap.com/marker?position=' + thisPoint[0] + ',' + thisPoint[1]);
        };
        document.getElementById("baiduMap").onclick = function() {
            $(location).attr('href', 'http://api.map.baidu.com/marker?location=' + thisLatitude + ',' + thisLongitude + '&title=目的地&content=' + address + '&output=html');
        };
    }
});
