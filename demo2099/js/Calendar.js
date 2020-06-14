



/*
author:demo
群组https://t.me/demo2099
一言修改
 */
 const api1 = "https://www.sortime.com/api/v2/perpetualcalendar/";
const api3 = "https://v1.hitokoto.cn/?encode=json";
var api1 = {
        url: `https://www.sortime.com/api/v2/perpetualcalendar/`,
    };
var api3 = {
        url: `https://v1.hitokoto.cn/?encode=json`,
    };	
  $task.fetch(api1).then(res => {

        try {
		  $task.fetch(api3).then(response => {
          var objk = JSON.parse(response.body);
  var hit = objk.hitokoto
  
		var obj = JSON.parse(res.body);
    //console.log(obj);
    var year = obj.result.result.year;
    var month = obj.result.result.month;
    var day = obj.result.result.day;
    var week = obj.result.result.week;
    var lunar = obj.result.result.huangli.nongli;
   
   
    var title = year+" 年 "+month+" 月 "+day+" 日 "+"星期"+week;
    if(obj.result.result.hasOwnProperty("jieqi")){
      var jieqi = obj.result.result.jieqi;
      var subtitle = lunar+" "+jieqi;
    }else{
      var subtitle = lunar;
    };
    if(obj.result.result.hasOwnProperty("festival")){
      var festival = obj.result.result.festival.solar[0];
      var mation = "贴心提醒您今天是:"+festival+"\n一言:${hit}";
      };
		
$notify(
            `一言`,
            "",
            "贴心提醒您今天是:"+festival+"\n一言:${hit}"
          );
console.log(`更新数据成功${response.body}`)
   

    }, reason => {
       console.log(`提交记录获取报错`)
    });
		
console.log(`更新数据成功${response.body}`)
        } catch (e) {
            console.log(`提交记录获取报错${JSON.stringify(e)}`)
        }

    }, reason => {
       console.log(`提交记录获取报错`)
    });
 

/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
    您也可直接在tg中联系@wechatu
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// 判断request还是respons
// down方法重写
var $done = (obj={}) => {
    var isRequest = typeof $request != "undefined";
    if (isQuantumultX) {
        return isRequest ? $done({}) : ""
    }
    if (isSurge) {
        return isRequest ? $done({}) : $done()
    }
}
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
