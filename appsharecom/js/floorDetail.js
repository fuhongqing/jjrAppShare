$(function() {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 + 'px';
    function showTips(text) {
        $('.modal').fadeIn();
        $('.toast').html(text);
        setTimeout(function() {
            $('.modal').fadeOut();
        }, 1000);
    }
    function showBigImg(imgSrc) {
        $('.imgModal').fadeIn();
        $('.imgToast').html(imgSrc);
    }
    function contactToolbar(curId) {
        var top = document.getElementById(curId).getBoundingClientRect().top;
        if (top < 100 && top > 80) {
            $('#navbars>li.' + curId).addClass('active').siblings().removeClass('active');
        }
    }
    var idArr = ['commissionInfo', 'preferential', 'sellPoints', 'renderings', 'progress', 'declaration', 'guess'];
    $('#topTool,#swiperTitle').on('click', '.backImg', function() {
        history.back();
    });
    $('#navbars').on('click', 'li', function() {
        $('#floorDetail').css({'top': '0'});
        $(this).addClass('active').siblings().removeClass('active');
        switch ($(this).index()) {
            case 5:
                $('#floorDetail').animate({'top': '0rem'}, 50);
                break;
            case 6:
                $('#floorDetail').animate({'top': '0rem'}, 50);
                break;
            default:
                $('#floorDetail').animate({'top': '1rem'}, 50);
                break;
        }
    });
    $('#floorInfo>div:first-child').click(function() {
        $('#floorDetail').hide();
        $('#lpxq').show();
    });
    $('#floorInfo').on('click', '.attress', function() {
        var lng = $(this).children('.attressLeft').attr('id');
        var lat = $(this).children('.attressRight').attr('id');
        var address = $(this).children('.attressLeft').children('span').html();
        var name = $(this).prev().prev().find('.propertyName').html();
        $(location).attr('href', 'detailmap.jsp?name=' + name + '&address=' + address + '&lng=' + lng + '&lat=' + lat);
    });
    $('#lpxq').on('click', '.back', function() {
        $('#floorDetail').show();
        $('#lpxq').hide();
        getFloorDetail();
    });
    $('#preferential>div').on('click', '.more', function() {
        $('#floorDetail').hide();
        $('#preferentialMore').show();
    });
    $('#preferentialMore').on('click', '.back', function() {
        $('#floorDetail').show();
        $('#preferentialMore').hide();
        getFloorDetail();
    });
    $(document).scroll(function() {
        contactToolbar(idArr[0]);
        contactToolbar(idArr[1]);
        contactToolbar(idArr[2]);
        contactToolbar(idArr[3]);
        contactToolbar(idArr[4]);
        contactToolbar(idArr[5]);
        contactToolbar(idArr[6]);
        var scrollTop = $(this).scrollTop();
        if (scrollTop) {
            $('#swiperTitle').css('visibility', 'visible');
            $('.scrollAuto').css('visibility', 'visible');
        } else {
            $('#floorDetail').css({'top': '0'});
            $('#floorDetail>header').show();
            $('#swiperTitle').css('visibility', 'hidden');
            $('.scrollAuto').css('visibility', 'hidden');
        }
    });
    var searchArr = location.search.slice(1).split('&');
    var wxAppId = 'wx54409552def47f3f',
        floorUrl = 'http://agent2.ehaofang.com/efapp2/',
        weixinUrl = 'http://weixin.ehaofang.com/efangnet/',
        imgUrl = "http://images.ehaofang.com/",
        propertyId = searchArr[0].split('=')[1],
        memberId = searchArr[1].split('=')[1],
        propertyName = '';
    var noDataHtml = "<div class=\"noData\">暂无更多楼盘信息</div>";
    var initImg = 'img/all_bg_wait_best@2x.png';
    $('#propertyImg').on('click', '.back', function() {
        $('#floorDetail').show();
        $('#propertyImg').hide();
        getFloorDetail();
    });
    function weixin(data) {
        wx.config({
            debug: false,
            appId: wxAppId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: ['getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        });
        wx.ready(function() {
            wx.getLocation({
                type: 'wgs84',
                success: function(res) {
                    getFloorDetail(res);
                }
            });
        });
        wx.error(function(res) {
            console.log(res);
        });
    }
    function getDistance(itemPoint, pointOrigin) {
        var map = new BMap.Map('');
        var pointB = new BMap.Point(itemPoint.Longitude, itemPoint.Latitude);
        var distance = ~~(map.getDistance(pointOrigin, pointB));
        return distance;
    }
    PostData(weixinUrl + "weixin/member/demo.html", {url: window.location.href}, weixin);
    function sellState(t) {
        switch (t) {
            case 1:
                return t = "待售";
                break;
            case 2:
                return t = "在售";
                break;
            case 4:
                return t = "售罄";
                break;
            default:
                return t = "其他";
                break;
        }
    }
    function buildingType(n) {
        var arr = n.split(",");
        var arrHtml = [];
        for (var i = 0,
                 l = arr.length; i < l; i++) {
            switch (arr[i]) {
                case "1":
                    arrHtml.push("住宅");
                    break;
                case "2":
                    arrHtml.push("别墅");
                    break;
                case "3":
                    arrHtml.push("公寓");
                    break;
                case "4":
                    arrHtml.push("商铺");
                    break;
                case "5":
                    arrHtml.push("写字楼");
                    break;
                case "6":
                    arrHtml.push("洋房");
                    break;
                default:
                    break;
            }
        }
        return arrHtml.join("；");
    }
    function feature(n) {
        if (!n) {
            return "";
        }
        var arr = n.split(",");
        var arrHtml = [];
        for (var i = 0,
                 l = arr.length; i < l; i++) {
            switch (arr[i]) {
                case "1":
                    arrHtml.push("学区房");
                    break;
                case "2":
                    arrHtml.push("养老房");
                    break;
                case "3":
                    arrHtml.push("轨交房");
                    break;
                case "4":
                    arrHtml.push("景区房");
                    break;
                case "5":
                    arrHtml.push("商超房");
                    break;
                case "7":
                    arrHtml.push("人车分流");
                    break;
                case "8":
                    arrHtml.push("低密度");
                    break;
                case "9":
                    arrHtml.push("大型社区");
                    break;
                case "10":
                    arrHtml.push("投资地产");
                    break;
                case "11":
                    arrHtml.push("降价房源");
                    break;
                case "12":
                    arrHtml.push("火爆热盘");
                    break;
                default:
                    break;
            }
        }
        return arrHtml.join("；");
    }
    function PropertyImage(data) {
        if (data.list.PropertyImage.length) {
            var resetActive = function(n) {
                for (var i = 0,
                         l = elDom.length; i < l; i++) {
                    if (i == n) {
                        elDom[i].className = "slide active";
                    } else {
                        elDom[i].className = "slide";
                    }
                }
            };
            var _data = data.list.PropertyImage;
            var KeyImg = [];
            var KeyImg1,
                KeyImg1l,
                KeyImg2,
                KeyImg2l,
                KeyImg3,
                KeyImg3l,
                KeyImg4,
                KeyImg4l,
                slide1,
                slide2,
                slide3,
                slide4;
            for (var i = 0,
                     l = _data.length; i < l; i++) {
                var Type = _data[i]["Type"];
                if (_data[i]["KeyImg"]) {
                    switch (Type) {
                        case 1:
                            slide1 = document.createElement("span");
                            slide1.className = "slide active";
                            KeyImg1 = _data[i]["KeyImg"].split(",");
                            KeyImg1l = KeyImg1.length;
                            slide1.innerHTML = "效果图(" + KeyImg1l + ")";
                            break;
                        case 2:
                            slide2 = document.createElement("span");
                            slide2.className = "slide";
                            KeyImg2 = _data[i]["KeyImg"].split(",");
                            KeyImg2l = KeyImg2.length;
                            slide2.innerHTML = "实景图(" + KeyImg2l + ")";
                            break;
                        case 3:
                            slide3 = document.createElement("span");
                            slide3.className = "slide";
                            KeyImg3 = _data[i]["KeyImg"].split(",");
                            KeyImg3l = KeyImg3.length;
                            slide3.innerHTML = "交通图(" + KeyImg3l + ")";
                            break;
                        case 4:
                            slide4 = document.createElement("span");
                            slide4.className = "slide";
                            KeyImg4 = _data[i]["KeyImg"].split(",");
                            KeyImg4l = KeyImg4.length;
                            slide4.innerHTML = "样板间(" + KeyImg4l + ")";
                            break;
                        default:
                            break;
                    }
                }
            }
            if (KeyImg1) {
                KeyImg.push(KeyImg1);
            }
            if (KeyImg2) {
                KeyImg.push(KeyImg2);
            }
            if (KeyImg3) {
                KeyImg.push(KeyImg3);
            }
            if (KeyImg4) {
                KeyImg.push(KeyImg4);
            }
            KeyImg = KeyImg.join(",");
            KeyImg = KeyImg.split(",");
            var lists = [];
            for (var j = 0,
                     k = KeyImg.length; j < k; j++) {
                var list = "<div class='swiper-slide'>" + "<img class='swiper-lazy' data-src='" + KeyImg[j] + "' />" + "</div>";
                lists.push(list);
            }
            lists = lists.join("");
            document.getElementById("PropertyImage").innerHTML = lists;
            if (slide1) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide1);
            }
            if (slide2) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide2);
            }
            if (slide3) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide3);
            }
            if (slide4) {
                document.getElementsByClassName("append-buttons")[0].appendChild(slide4);
            }
            var swiper_PropertyImage = new Swiper('.swiper-container_PropertyImage', {
                zoom: true,
                lazy: {loadPrevNext: true},
                observer: true,
                observeParents: true,
                on: {slideChangeTransitionEnd: function() {
                        document.getElementsByClassName("PropertyImage-num")[0].innerHTML = this.activeIndex + 1 + "/" + KeyImg.length;
                    }}
            });
            var elDom = document.getElementsByClassName("slide");
            document.getElementsByClassName("PropertyImage-num")[0].innerHTML = 1 + "/" + KeyImg.length;
            if (slide1) {
                slide1.onclick = function() {
                    resetActive(0);
                    swiper_PropertyImage.slideTo(0, 0);
                };
            }
            if (slide2) {
                slide2.onclick = function() {
                    resetActive(1);
                    swiper_PropertyImage.slideTo(KeyImg1l, 0);
                };
            }
            if (slide3) {
                slide3.onclick = function() {
                    resetActive(2);
                    swiper_PropertyImage.slideTo(KeyImg3l, 0);
                };
            }
            if (slide4) {
                slide4.onclick = function() {
                    resetActive(3);
                    swiper_PropertyImage.slideTo(KeyImg4l, 0);
                };
            }
        }
    }
    function PostData(url, data, callback) {
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            success: function(data) {
                callback(data);
            },
            error: function() {
                showTips('请求失败');
            }
        });
    }
    function fmtDate(obj) {
        var date = new Date(obj);
        var y = 1900 + date.getYear();
        var m = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
    }
    function getFloorDetail(res) {
        $.ajax({
            type: 'post',
            url: floorUrl + 'Project/projectdetails',
            data: {
                propertyID: propertyId,
                memberId: memberId
            },
            success: function(data) {
                $('#loading').hide();
                var floorDetailData = data.xmxq;
                var messData = data.mess;
                var midImgList = data.midimglist;
                var yjfasize = data.yjfasize;
                var zlhx = data.zlhx;
                var photoNum = data.photoNum;
                var anChangTuiJian = data.anChangTuiJian_1;
                if (photoNum) {
                    var spanHtml = '';
                    $('#topPages>p').text('查看相册(' + data.photoNum + ')');
                    for (var i = 0; i < photoNum; i++) {
                        spanHtml += "\n                        <span></span>   \n                        ";
                    }
                    $('#topPages>div').html(spanHtml);
                } else {
                    $('#topPages>p').text('查看相册()');
                    $('#topPages>div').html('<span></span>');
                }
                var tgxqsize = data.tgxqsize;
                if (tgxqsize) {
                    $('#preferential .more>span').text(tgxqsize + '套方案');
                }
                var tgxq = data.tgxq;
                if (tgxq.length) {
                    var tgxqHtml = '',
                        tgxqMoreHtml = '';
                    var noMoreHtml = '<li><span class="line"></span><sapn>已经到底啦</sapn><span class="line"></span></li>';
                    $.each(tgxq, function(i) {
                        if (!tgxq[i].BuildingType) {
                            tgxq[i].BuildingType = '';
                        }
                        if (!tgxq[i].DetailName) {
                            tgxq[i].DetailName = '';
                        }
                        tgxqHtml += ("\n                        <li>\n                            <span>" + tgxq[i].BuildingType + "</span>\n                            <span>" + tgxq[i].DetailName + "</span>\n                        </li>\n                        ");
                        tgxqMoreHtml += ("\n                        <li><span>" + tgxq[i].BuildingType + "</span><span>" + tgxq[i].DetailName + "</span></li>\n                        ");
                    });
                    $('#preferential>ul').html(tgxqHtml);
                    $('#preferentialMore>ul').html(tgxqMoreHtml + noMoreHtml);
                } else {
                    $('#preferential>ul').text('暂无数据');
                    $('#preferentialMore>ul').text('暂无数据');
                }
                if (!midImgList.length) {
                    $('#floorDetail .swiper-wrapper').html(("<li><img src=\"" + initImg + "\" alt=\"\"></li>"));
                } else {
                    var midImgHtml = '';
                    $.each(midImgList, function(i) {
                        midImgHtml += ("\n                         <li class=\"swiper-slide\">\n                         \n                         <img data-src=\"" + (imgUrl + midImgList[i]) + "\" class=\"swiper-lazy\" alt=\"\">\n                         </li>  \n                        ");
                    });
                    $('#floorDetail .swiper-wrapper').html(midImgHtml);
                    var mySwiper = new Swiper('.headerImg', {
                        zoom: true,
                        direction: 'horizontal',
                        lazy: {loadPrevNext: true}
                    });
                }
                if (floorDetailData.length) {
                    var callback = function() {
                        $.get(url, function(data) {
                            if (data.status === 0) {
                                pointOrigin = new BMap.Point(data.result[0].x, data.result[0].y);
                                _distance = getDistance({
                                    Longitude: thisLongitude,
                                    Latitude: thisLatitude
                                }, pointOrigin);
                                if (!floorDetailData[0].Address) {
                                    floorDetailData[0].Address = '';
                                }
                                if (String(_distance).length > 3) {
                                    _distance = Math.round(_distance / 1000) + 'km';
                                } else {
                                    _distance = _distance + 'm';
                                }
                                var attressHtml = ("\n                    <div class=\"attressLeft\" id=\"" + floorDetailData[0].Longitude + "\">\n                                <img src=\"img/project_ic_location_big@2x.png\" alt=\"\"><span>" + floorDetailData[0].Address + "</span>\n                            </div>\n                               <div class=\"attressRight\" id=\"" + floorDetailData[0].Latitude + "\"  style=\"float: right\">\n                                <span>" + _distance + "</span>\n                                <img src=\"img/home_ic_more_small@2x.png\" alt=\"\">\n                            </div>   \n                    ");
                                $('#floorInfo>.attress').html(attressHtml);
                            }
                        }, 'jsonp');
                    };
                    propertyName = floorDetailData[0].PropertyName;
                    if (!propertyName) {
                        propertyName = '';
                    }
                    var averagePrice = floorDetailData[0].AveragePrice;
                    if (!averagePrice) {
                        averagePrice = '暂无定价';
                    } else {
                        averagePrice = averagePrice + '元/㎡';
                    }
                    var floorInfoHtml = ("\n                    <p><span class=\"propertyName\">" + propertyName + "</span><span class=\"floorState\">" + sellState(floorDetailData[0].SellState) + "</span></p>\n                    <p>均价:" + averagePrice + "</p>\n                    ");
                    $('#floorInfo .nameLeft').html(floorInfoHtml);
                    var swiperTitleHtml = ("\n                    <div class=\"img backImg\" onclick=\"history.back()\"><img src=\"img/topbar_ic_back_black@2x.png\" alt=\"\"></div>\n                    <div>" + propertyName + "</div>\n                    <div class=\"img\"><img src=\"img/topbar_ic_share_black@2x.png\" alt=\"\"></div>\n                    ");
                    $('#swiperTitle').html(swiperTitleHtml);
                    if (floorDetailData[0].minAcreage == null) {
                        floorDetailData[0].minAcreage = '';
                    }
                    if (floorDetailData[0].maxAcreage == null) {
                        floorDetailData[0].maxAcreage = '';
                    }
                    var itemsHtml = ("\n                    <span>项目属性：</span><span>" + floorDetailData[0].minAcreage + "-" + floorDetailData[0].maxAcreage + "㎡；</span><span>" + buildingType(floorDetailData[0].BuildingType) + "</span><span>" + feature(floorDetailData[0].Feature) + "</span>\n                    ");
                    $('#floorInfo>.items').html(itemsHtml);
                    var x = res.longitude;
                    var y = res.latitude;
                    var pointOrigin,
                        _distance;
                    var url = "http://api.map.baidu.com/geoconv/v1/?coords=" + x + "," + y + "&from=1&to=5&ak=CB2ede775afeb6e413abd40261396a69";
                    var geocoder = new BMap.Geocoder();
                    var thisLongitude = floorDetailData[0].Longitude,
                        thisLatitude = floorDetailData[0].Latitude;
                    if (!thisLongitude || !thisLatitude) {
                        geocoder.getPoint(floorDetailData[0].Address, function(point) {
                            if (point) {
                                thisLongitude = point.lng;
                                thisLatitude = point.lat;
                                callback();
                            }
                        }, floorDetailData[0].Address);
                    } else {
                        callback();
                    }
                    var hasSellPoints = 0;
                    if (floorDetailData[0].Advantage) {
                        $('#sellPoints .advantage').text(floorDetailData[0].Advantage);
                    } else {
                        hasSellPoints += 1;
                        $('#sellPoints .advantage').text('暂无');
                    }
                    if (floorDetailData[0].Attribute) {
                        $('#sellPoints .attribute').text(floorDetailData[0].Attribute);
                    } else {
                        hasSellPoints += 1;
                        $('#sellPoints .attribute').text('暂无');
                    }
                    if (floorDetailData[0].Process) {
                        $('#sellPoints .process').text(floorDetailData[0].Process);
                    } else {
                        hasSellPoints += 1;
                        $('#sellPoints .process').text('暂无');
                    }
                    if (floorDetailData[0].TheWords) {
                        $('#sellPoints .theWords').text(floorDetailData[0].TheWords);
                    } else {
                        hasSellPoints += 1;
                        $('#sellPoints .theWords').text('暂无');
                    }
                    if (hasSellPoints == 4) {
                        $('#sellPoints>ul').html(noDataHtml);
                    }
                    if (!floorDetailData[0].OpenTime) {
                        floorDetailData[0].OpenTime = '';
                    }
                    if (!floorDetailData[0].FinishTime) {
                        floorDetailData[0].FinishTime = '';
                    }
                    if (!floorDetailData[0].CheckTime) {
                        floorDetailData[0].CheckTime = '';
                    }
                    var item1Html = ("\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">开盘时间</div>\n                        <div class=\"lpxq-group_value\">" + fmtDate(floorDetailData[0].OpenTime) + "</div>\n                    </div>\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">竣工时间</div>\n                        <div class=\"lpxq-group_value\">" + fmtDate(floorDetailData[0].FinishTime) + "</div>\n                    </div>\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">交房时间</div>\n                        <div class=\"lpxq-group_value\">" + fmtDate(floorDetailData[0].CheckTime) + "</div>\n                    </div>\n                    ");
                    $('#item1').html(item1Html);
                    if (!floorDetailData[0].Developer) {
                        floorDetailData[0].Developer = '';
                    }
                    if (!floorDetailData[0].PropertyCorp) {
                        floorDetailData[0].PropertyCorp = '';
                    }
                    var item2Html = ("\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">开发商</div>\n                        <div class=\"lpxq-group_value\">" + floorDetailData[0].Developer + "</div>\n                    </div>\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">物业公司</div>\n                        <div class=\"lpxq-group_value\">" + floorDetailData[0].PropertyCorp + "</div>\n                    </div>\n                    <div class=\"lpxq-item\">\n                        <div class=\"lpxq-group_name\">建筑类型</div>\n                        <div class=\"lpxq-group_value\">" + buildingType(floorDetailData[0].BuildingType) + "</div>\n                    </div>\n                    ");
                    $('#item2').html(item2Html);
                    if (floorDetailData[0].BuildingTotal == null) {
                        floorDetailData[0].BuildingTotal = '';
                    }
                    if (floorDetailData[0].Acreage1 == null) {
                        floorDetailData[0].Acreage1 = '';
                    }
                    if (floorDetailData[0].Acreage2 == null) {
                        floorDetailData[0].Acreage2 = '';
                    }
                    if (!floorDetailData[0].CubageRatio) {
                        floorDetailData[0].CubageRatio = '';
                    }
                    if (!floorDetailData[0].VirescenceRatio) {
                        floorDetailData[0].VirescenceRatio = '';
                    }
                    if (!floorDetailData[0].ParkingSpace) {
                        floorDetailData[0].ParkingSpace = '';
                    }
                    if (floorDetailData[0].OverheadCost == null) {
                        floorDetailData[0].OverheadCost = '';
                    }
                    if (!floorDetailData[0].Address) {
                        floorDetailData[0].Address = '';
                    }
                    var item3Html = ("\n                    <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">栋楼总数</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].BuildingTotal + "</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">占地面积</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].Acreage1 + "㎡</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">建筑面积</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].Acreage2 + "㎡</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">容积率</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].CubageRatio + "</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">绿化率</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].VirescenceRatio + "</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">停车位</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].ParkingSpace + "</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">物业费</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].OverheadCost + "</div>\n            </div>\n            <div class=\"lpxq-item\">\n                <div class=\"lpxq-group_name\">楼盘地址</div>\n                <div class=\"lpxq-group_value\">" + floorDetailData[0].Address + "</div>\n            </div>\n                    ");
                    $('#item3').html(item3Html);
                }
                if (zlhx.length) {
                    var zlhxHtml = '';
                    $.each(zlhx, function(i) {
                        if (!zlhx[i].HouseModel) {
                            zlhx[i].HouseModel = '';
                        }
                        if (zlhx[i].Room1 == null) {
                            zlhx[i].Room1 = '';
                        }
                        if (zlhx[i].Room2 == null) {
                            zlhx[i].Room2 = '';
                        }
                        if (zlhx[i].Room3 == null) {
                            zlhx[i].Room3 = '';
                        }
                        if (zlhx[i].Acreage == null) {
                            zlhx[i].Acreage = '';
                        }
                        if (!zlhx[i].Remark) {
                            zlhx[i].Remark = '';
                        }
                        if (!zlhx[i].Decoration) {
                            zlhx[i].Decoration = '';
                        }
                        if (zlhx[i].SalePrice == null) {
                            zlhx[i].SalePrice = '';
                        }
                        zlhxHtml += ("\n                            <ul class=\"swiper-slide\">\n                                <li class=\"slideImg\">\n                                  <img src=\"" + (!zlhx[i].MainImage ? initImg : imgUrl + zlhx[i].MainImage) + "\" alt=\"\"/>\n                                  <div></div>\n                                </li>\n                                <li class=\"status\"><span>" + zlhx[i].HouseModel + "</span><span>" + sellState(floorDetailData[0].SellState) + "</span></li>\n                                <li>" + zlhx[i].Room1 + "室" + zlhx[i].Room2 + "厅" + zlhx[i].Room3 + "卫·" + zlhx[i].Acreage + "㎡·" + zlhx[i].Remark + "·" + zlhx[i].Decoration + "</li>\n                                <li>" + zlhx[i].SalePrice + "万起</li>\n                            </ul>\n                            ");
                    });
                    $('#renderings>.items').html(zlhxHtml);
                    $('#renderings').on('click', '.slideImg', function() {
                        $('#swiperTitle').css('visibility', 'hidden');
                        $('.scrollAuto').css('visibility', 'hidden');
                        var bigImgSrc = $(this).children('img').attr('src');
                        showBigImg(("<img src=\"" + bigImgSrc + "\" />"));
                    });
                    $('.imgModal').click(function() {
                        $(this).hide();
                    });
                } else {
                    $('#renderings>.items').html(noDataHtml);
                }
                if (anChangTuiJian) {
                    if (!anChangTuiJian[0].name) {
                        anChangTuiJian[0].name = '';
                    }
                    if (!anChangTuiJian[0].mobile) {
                        anChangTuiJian[0].mobile = '';
                    }
                    var consultHtml = ("\n                    <div>\n                        <span>" + anChangTuiJian[0].name + "</span><span>" + anChangTuiJian[0].mobile + "</span>\n                    </div>\n                    <div id=\"tel\"><a href=\"tel:" + anChangTuiJian[0].mobile + "\">联系他</a></div>\n                    ");
                    $('#floorDetail>footer').html(consultHtml);
                }
            },
            error: function() {
                showTips('请求失败');
            }
        });
    }
    getFloorDetail();
    $('#floorDetail').on('click', '.headerImg', function(e) {
        e.stopPropagation();
        $('#propertyImg .append-buttons').html('');
        PostData(floorUrl + "Project/PropertyImage", "propertyId=" + propertyId, PropertyImage);
        $('#floorDetail').hide();
        $('#propertyImg').show();
    });
});
