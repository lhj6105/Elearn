$(function () {
    $(".pagination").find("li[class='page_number active']").each(function () {
        var a = $(this).find("a:first")[0];
        if ($(a).attr("href").split("/")[1] === location.pathname.split("/")[1]) {
            $(".nav li:nth-child(2)").addClass("active");
            $(".nav li:nth-child(2)").children("a").css("background-color", "#23b8ff");
        }
    })
})