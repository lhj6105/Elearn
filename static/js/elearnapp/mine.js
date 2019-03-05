$(function () {
    $(".mine-item-title li").click(function () {
        if ($(this).children("a").html() === "上传视频") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-upload-video").removeAttr("hidden")
        } else if ($(this).children("a").html() === "上传课件") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-upload-courseware").removeAttr("hidden")
        } else if ($(this).children("a").html() === "我的作业") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-homework").removeAttr("hidden")
        } else if ($(this).children("a").html() === "学习详情") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-student-details").removeAttr("hidden")
        } else if ($(this).children("a").html() === "学生分数") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-student-score").removeAttr("hidden")
        }
    });

    $(".add-course").click(function () {
        $(".mine-item-upload-video").attr("hidden","hidden");
        $(".mine-item-add-course").removeAttr("hidden");
    })
});

