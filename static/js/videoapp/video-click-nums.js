$(function () {
    $(".item-img-link").click(function () {
        $.ajax({
        url: "/video/clicknums/",
        type: "post",
        data: {
            "courseid": $(this).children("input[name='courseid']").val(),
            "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            console.log(data["status"])
        }
    })
    });
    $(".item-tt-link").click(function () {
        $.ajax({
        url: "/video/clicknums/",
        type: "post",
        data: {
            "courseid": $(this).children("input[name='courseid']").val(),
            "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            console.log(data["status"])
        }
    })
    });
    $(".item-carouel-img-link").click(function () {
        $.ajax({
        url: "/video/clicknums/",
        type: "post",
        data: {
            "courseid": $(this).children("input[name='courseid']").val(),
            "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
        },
        success: function (data) {
            console.log(data["status"])
        }
    })
    })
});