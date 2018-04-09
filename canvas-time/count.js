var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 708;
var radius = 8
var MARGIN_LEFT = 60;
var MARGIN_TOP = 30;
var endTime = new Date();
// 倒计时一个小时 倒计时使用
//endTime.setTime(endTime.getTime() + 3600 * 1000)
var curShowTimeSeconds = 0
var balls = []
// 小球颜色
const colors = ["#EE82EE", "#EEB422", "#D1EEEE", "#ADFF2F", "#836FFF", "#1E90FF", "#CD2990", "#1874CD", "#A2B5CD", "#B8B8B8"]


window.onload = function () {
    var canvas = document.getElementById('canvas')
    var context = canvas.getContext('2d')
    WINDOW_WIDTH = document.documentElement.clientWidth || document.body.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight || document.body.clientHeight;

    // 左右边距是十分之一
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10)
    // 中间占五分之四 15+95=108
    radius = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurrentTimeSeconds()
    setInterval(function () {
        render(context)
        update()
    }, 50)
}

// 小球绘制
function render(context) {
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT) //刷新矩形，不然每一次定时器刷新会叠加
    var hour = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hour * 3600) / 60)
    var seconds = curShowTimeSeconds % 60
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hour / 10), context)
    renderDigit(MARGIN_LEFT + 15 * (radius + 1), MARGIN_TOP, parseInt(hour % 10), context)
    renderDigit(MARGIN_LEFT + 30 * (radius + 1), MARGIN_TOP, 10, context)
    renderDigit(MARGIN_LEFT + 39 * (radius + 1), MARGIN_TOP, parseInt(minutes / 10), context)
    renderDigit(MARGIN_LEFT + 54 * (radius + 1), MARGIN_TOP, parseInt(minutes % 10), context)
    renderDigit(MARGIN_LEFT + 69 * (radius + 1), MARGIN_TOP, 10, context)
    renderDigit(MARGIN_LEFT + 78 * (radius + 1), MARGIN_TOP, parseInt(seconds / 10), context)
    renderDigit(MARGIN_LEFT + 93 * (radius + 1), MARGIN_TOP, parseInt(seconds % 10), context)

    for (var i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color
        context.beginPath()
        context.arc(balls[i].x, balls[i].y, radius, 0, 2 * Math.PI, true)
        context.closePath()
        context.fill()

    }

}

function getCurrentTimeSeconds() {
    var curTime = new Date()
    // 倒计时使用
    // var ret = endTime.getTime() - curTime.getTime()
    // ret = Math.round(ret / 1000)
    // return ret >= 0 ? ret : 0

    // 时钟计时器 ---今天走过了多少秒
    var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds()
    return ret
}

// 计算下一秒和这一秒是不是不同，不同的话说明更新了
function update() {
    var nextShowTimeSeconds = getCurrentTimeSeconds()
    var nextHour = parseInt(nextShowTimeSeconds / 3600)
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHour * 3600) / 60)
    var nextSeconds = nextShowTimeSeconds % 60

    var curHour = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHour * 3600) / 60)
    var curSeconds = curShowTimeSeconds % 60
    if (nextSeconds != curSeconds) {
        // 改变的时候产生小球
        //小时十位数
        if (parseInt(curHour / 10) != parseInt(nextHour / 10)) {
            // 如果小时改变的时候添加小球
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHour / 10))
        }
        //小时个位数
        if (parseInt(curHour % 10) != parseInt(nextHour % 10)) {
            addBalls(MARGIN_LEFT + 15 * (radius + 1), MARGIN_TOP, parseInt(curHour / 10))
        }
        // 分钟十位数
        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            // 如果小时改变的时候添加小球
            addBalls(MARGIN_LEFT + 39 * (radius + 1), MARGIN_TOP, parseInt(curMinutes / 10))
        }
        //分钟个位数
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (radius + 1), MARGIN_TOP, parseInt(curMinutes / 10))
        }
        // 秒钟十位数
        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            // 如果小时改变的时候添加小球
            addBalls(MARGIN_LEFT + 78 * (radius + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        //秒钟个位数
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (radius + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        curShowTimeSeconds = nextShowTimeSeconds
    }
    updateBalls()
    console.log(balls.length)
}

// 更新小球状态
function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - radius) {
            balls[i].y = WINDOW_HEIGHT - radius;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }
    // 去掉滚出画布的小球
    var cnt = 0
    for (var i = 0; i < balls.length; i++) {
        // 留在画布中的小球
        if (balls[i].x + radius > 0 && balls[i].x - radius < WINDOW_WIDTH) {
            balls[cnt++] = balls[i]
        }
    }
    while (balls.length > Math.min(300, cnt)) {
        // 删除不在cnt 范围内的小球
        balls.pop()
    }
}

// 产生小球
function addBalls(x, y, num) {

    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                // 添加小球
                var aball = {
                    x: x + j * 2 * (radius + 1) + (radius + 1),
                    y: y + i * 2 * (radius + 1) + (radius + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aball)
            }
        }
    }

}

function renderDigit(x, y, num, context) {
    context.fillStyle = "#ffcd32"
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] === 1) {
                context.beginPath()
                context.arc(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius, 0, 2 * Math.PI)
                context.closePath()
                context.fill()
            }
        }
    }
}
