var colorList = [
    'black',
    'white',
    'red',
    'yellow',
    'blue',
    'green',
    'orange',
    'purple',
    'aqua',
    'lime',
    'chocolate',
    'goldenrod'
];

for (let color of colorList) {
    let child = $(`<div id=${color}></div>`)
    child.addClass('col-xs-1');
    child.css({
        'background-color': color
    });
    $('#color').append(child);
}

var canvas = $('<canvas id="canvas"></canvas>');
canvas.attr({
    width: window.innerWidth * 0.655,
    height: window.innerHeight * 0.6,
})
$('#board').append(canvas);
var can = canvas[0];
var ctx = can.getContext("2d");
ctx.strokeStyle = 'black'; //初始化
var tools = {
    tool: 'pencil',
    graphic: "",
    color: '',
}

var flag = false; //鼠标开关
var x, y, point = ''; // 初始化起点坐标值及保存点
var fontsize = "8px", // 初始化字体属性
    fontfamily = "Arial",
    fontweight = "",
    fontstyle = "";
var fontTip = $("<textarea rows='3' cols='20' style='background:transparent;position:absolute;display:none;'></textarea>"); // 初始化文本输入框
$("#board").append(fontTip);
$('.panel-heading').on('click', function() {
    $('.panel-heading').css('background-color', '#F5F5F5')
    $(this).css('background-color', '#aaa');
    tools.tool = $(this).find('a').attr("id");
    if ($(this).find('a').attr("id") == "trash") {
        ctx.clearRect(0, 0, can.width, can.height);
        point = '';
    }
});
//按钮选择图形
$('#graphic>button').on('click', function() {
    tools.tool = 'pencil';
    tools.graphic = $(this).attr("id");
});
$('#pencil').on('click', function() {
    tools.tool = 'pencil';
    tools.graphic = '';
});
//按钮选择颜色
$('#color>div').on('click', function() {
    tools.color = $(this).attr("id");
    ctx.fillStyle = tools.color;
});
//选择字体属性
$('#fontsize>li>a,#fontfamily>li>a,#bold,#italic').on('click', function(e) {
    e.preventDefault();
    tools.tool = 'word';
    var val = $(this).attr('id');
    switch ($(this).parents("ul").attr("id")) {
        case "fontsize":
            fontsize = val;
            $(this).parents("ul").prev('button').html(val + "<span class='caret'></span>");
            break;
        case "fontfamily":
            fontfamily = val;
            $(this).parents("ul").prev('button').html(val + "<span class='caret'></span>");
            break;
    }
    switch (val) {
        case "bold":
            if (fontweight == "") {
                fontweight = "bold";
                $(this).attr("style", "background-color:#9d9d9d;color:#ffffff");
            } else {
                fontweight = "";
                $(this).removeAttr("style");
            }
            break;
        case "italic":
            if (fontstyle == "") {
                fontstyle = "italic";
                $(this).attr("style", "background-color:#9d9d9d;color:#ffffff");
            } else {
                fontstyle = "";
                $(this).removeAttr("style");
            }
            break;
    }
});
//开始绘制图形
$("canvas").mousedown(function(e) {
    flag = true; // 绘制开始
    // 获取起点坐标值
    x = e.offsetX;
    y = e.offsetY;
}).mouseup(function(e) {
    flag = false; // 绘制完毕
    point = can.toDataURL();
    fontTip.focus();
}).mousemove(function(e) {
    if (tools.tool == "pencil" && tools.graphic == "") {
        drawPencil(e);
    } else if (tools.tool == "pencil" && tools.graphic == "line") {
        drawLine(e);
    } else if (tools.tool == "pencil" && tools.graphic == "rect") {
        drawRect(e);
    } else if (tools.tool == "pencil" && tools.graphic == "circle") {
        drawCircle(e);
    } else if (tools.tool == "pencil" && tools.graphic == "triangle") {
        drawTriangle(e);
    } else if (tools.tool == "eraser") {
        clearDraw(e);
    } else if (tools.tool == "word") {
        inputWord(e);
    }
});

function loadImg() {
    var img = new Image();
    img.src = point;
    ctx.drawImage(img, 0, 0, can.width, can.height);
}
//绘制画笔
function drawPencil(e) {
    ctx.save();
    ctx.strokeStyle = tools.color;
    if (flag) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
    ctx.restore();
}
//绘制直线
function drawLine(e) {
    if (flag) {
        ctx.clearRect(0, 0, can.width, can.height);
        loadImg(); // 载入上次保存点
        ctx.save();
        ctx.strokeStyle = tools.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.restore();
    }
}
//绘制矩形
function drawRect(e) {
    if (flag) {
        ctx.clearRect(0, 0, can.width, can.height);
        loadImg();
        ctx.beginPath();
        ctx.rect(x, y, e.offsetX - x, e.offsetY - y); //以鼠标按下为起点，移动距离为宽高画矩形
        if (tools.color != "") {
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
        }
    }
}
// 绘制圆形
function drawCircle(e) {
    if (flag) {
        var rx = (e.offsetX - x) / 2;
        var ry = (e.offsetY - y) / 2;
        var r = Math.sqrt(rx * rx + ry * ry);
        ctx.clearRect(0, 0, can.width, can.height);
        loadImg();
        ctx.beginPath();
        ctx.arc(rx + x, ry + y, r, 0, Math.PI * 2); //以鼠标按下为起点，移动距离的一半为圆心画圆
        if (tools.color != "") {
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
        }
    }
}
// 绘制三角形
function drawTriangle(e) {
    if (flag) {
        ctx.clearRect(0, 0, can.width, can.height);
        loadImg();
        ctx.beginPath();
        ctx.moveTo(x, e.offsetY); //鼠标位置为左下角
        ctx.lineTo((x + e.offsetX) / 2, y);
        ctx.lineTo(e.offsetX, event.offsetY); //对称位置为右下角
        ctx.lineTo(x, e.offsetY);
        if (tools.color != "") {
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.stroke();
        }
    }
}
// 文字输入
function inputWord(e) {
    if (flag) {
        fontTip.css({ //设置文字样式
            top: y,
            left: x + 15,
            width: e.offsetX - x,
            height: e.offsetY - y,
            fontSize: fontsize,
            fontFamily: fontfamily,
            color: tools.color,
            fontStyle: fontstyle,
            fontWeight: fontweight,
        }).show();
    }
}
// 绘制文字
function drawWord(e) {
    var words = fontTip.val().trim();
    if (fontTip.css("display") != "none" && words) {
        var offset1 = canvas.offset();
        var offset2 = fontTip.offset();

        ctx.fillStyle = tools.color;
        ctx.font = fontstyle + " " + fontweight + " " + fontsize + " " + fontfamily;
        if (isNaN(fontsize)) {
            var size = Number(fontsize.substring(0, fontsize.length - 2)); //字体大小数字
        }
        //画字，因为鼠标点击画布才会画字，此时x,y会改变，所以不能用
        //此时用了offset属性判断位置，并做了适量偏移
        ctx.fillText(words, offset2.left - offset1.left + 2, offset2.top - offset1.top + size + 4);
        fontTip.val("");
    }
    fontTip.hide();
}
fontTip.blur(drawWord);
// 橡皮擦
function clearDraw(e) {
    if (flag) {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loadImg();
        ctx.lineWidth = 10;
        ctx.strokeStyle = "white";
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.restore();
    } else {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
}
