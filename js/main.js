var loadFlag = true;
var poemFlag = 0;
var initLoad = 16; // 初始化加载条数
var count = initLoad; // 已加载条数
var showCount = 5; // 每次加载展示条数
$.get("data.json", function(data) { // 首次加载请求数据
    setTimeout(function() {
        $(".init-loading").hide(0);
        $(".content").show(0);
        $(".loadtip").show(0);
        // 初始化循环数据
        var _title = $('<h3>' + data.poem[poemFlag].title + '</3>')
        $(".content").append(_title);
        for(var i = 0; i < initLoad; i++) {
            var _item = $('<p>' + data.poem[poemFlag].content[i] + '</p>');
            $(".content").append(_item);
        }
        $(".swiper-slide").css('height', $(".content-wrap")[0].offsetHeight); // 设置滚动区域高度

        // swiper初始化
        var mySwiper = new Swiper('.swiper-container', {
            scrollbar: '.swiper-scrollbar',
            direction: 'vertical',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            // 监听滚动事件
            onTouchEnd: function(swiper) {
                var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
                var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;

                // 上拉加载
                if(mySwiper.translate <= _viewHeight - _contentHeight - 40 && loadFlag) {
                    // console.log("已经到达底部！");
                    $(".loadtip").html('正在加载...');
                    $.get("data.json", function(data) {
                        setTimeout(function() {

                            goLoad();

                            for(var i = 0; i < showCount; i++) {
                                var _item = $('<p>' + data.poem[poemFlag].content[i + count] + '</p>');
                                $(".content").append(_item);
                            }
                            count += showCount;

                            goLoad();

                            $(".swiper-slide").css('height', $(".content-wrap")[0].offsetHeight); // 设置滚动区域高度
                            mySwiper.update(); // 重新计算高度;
                        }, 800);
                    }, "json");

                    function goLoad() {
                        if(count > data.poem[poemFlag].content.length - showCount) {
                            showCount = data.poem[poemFlag].content.length - count;
                        }
                        if(showCount == 0) {
                            loadFlag = false;
                            $(".loadtip").html('已经没有更多数据了');
                        } else {
                            $(".loadtip").html('上拉加载更多');
                        }
                    }
                }

                // 下拉刷新
                if(mySwiper.translate >= 50) {
                    $(".refreshtip").hide(0);
                    $(".init-loading").html('正在刷新...').show(0);
                    $(".loadtip").html('上拉加载更多');
                    $(".content").html('').hide(0);
                    $(".loadtip").hide(0);
                    loadFlag = true;
                    poemFlag = 1;
                    count = 16;
                    initLoad = 16; // 初始化加载条数
                    showCount = 5; // 每次加载展示条数

                    setTimeout(function() {
                        $(".refreshtip").show(0);
                        $(".init-loading").hide(0);
                        $(".content").show(0);
                        $(".loadtip").show(0);
                        // 请求第二首诗的数据
                        var _title = $('<h3>' + data.poem[poemFlag].title + '</3>')
                        $(".content").append(_title);
                        for(var i = 0; i < initLoad; i++) {
                            var _item = $('<p>' + data.poem[poemFlag].content[i] + '</p>');
                            $(".content").append(_item);
                        }
                        $(".swiper-slide").css('height', $(".content-wrap")[0].offsetHeight); // 设置滚动区域高度
                        mySwiper.update(); // 重新计算高度;
                    }, 1000);

                }
            },
            onTouchMove: function(swiper) {
                if(mySwiper.translate >= 15 && mySwiper.translate < 40) {
                    // console.log("下拉可以刷新");
                    $(".refreshtip").html('下拉可以刷新  &darr;');

                } else if(mySwiper.translate >= 50) {
                    $(".refreshtip").html('释放立即刷新 &uarr;');
                }
            }
        });
    }, 1000);
}, "json");