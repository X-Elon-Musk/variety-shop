var onOff = true,
    index = -1;
$(".search").keyup(function (ev) {
    ev = ev || event;
    if (ev.keyCode !== 38 && ev.keyCode !== 40 && ev.keyCode !== 13) {
        index = -1;
        $.ajax({
            type: "POST",
            url: './js/data.js',
            success: function(data){
                var information=eval(data);
                callback(information);
            }
        });
    }
}).blur(function () {
    if (onOff) {
        $(".items").css({
            display: "none"
        })
    }
});
$(".items").mouseover(function () {
    onOff = false;
}).mouseout(function () {
    onOff = true;
});
$(".search").keydown(function (ev) {
    ev = ev || event;
    switch (ev.keyCode) {
        case 38:
            index--;
            if (index < 0) {
                index = $(".items").children().length - 1;
            }
            keyDownControl(index);
            break;
        case 40:
            index++;
            index %= $(".items").children().length;
            keyDownControl(index);
            break;
        case 13:
            $(".search").val($(".select").html());
            $(".items").children().removeClass("select");
            $(".items").css({
                display: "none"
            })
            ajax();
            break;
    }
    itemClick();
})
function callback(data) {
    $(".items").css({
        display: "block"
    })
    var str = "";
    for (var i = 0; i < data.length; i++) {
        str += "<li class='item'><div class='itemName'>" + data[i].name + "</div><div class='itemInformation'><span>" + data[i].number + ",</span><span>" + data[i].phone + ",</span><span>" + data[i].company + ",</span></div></li>";
    }
    $(".items").html(str);
    itemClick();
}
function keyDownControl(index) {
    addClass(index);
    $(".search").val($(".select .itemName").html());
}
function addClass(index) {
    $(".items").children().removeClass("select");
    $(".items").children().eq(index).addClass("select");
}
function itemClick() {
    $(".items").children().click(function () {
        addClass($(this).index());
        $(".search").val($(this).find(".itemName").html());
        $(".items").css({
            display: "none"
        })
    });
}


