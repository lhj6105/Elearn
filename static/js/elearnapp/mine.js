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
        $(".mine-item-upload-video").attr("hidden", "hidden");
        $(".mine-item-add-course").removeAttr("hidden");
    });

    $(".upload").click(function () {
        if ($("input[name='courseware-name']").val() === "") {
            $(".courseware-name-tip").css("display", "inline-block")
        }else if($("input[name='courseware-file']").val() === ""){
            $(".courseware-file-tip").css("display", "inline-block")
        }else {
            var formData = new FormData($('#upload-courseware')[0]);
            $.ajax({
                type: "POST",
                url: "/courseware/upload/",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if(data["status"] === "success"){
                        $("input[name='courseware-name']").val("");
                        $("input[name='courseware-file']").val("");
                        $(".upload-error").css("display", "none");
                        $(".upload-success").css("display", "block");
                    }
                    else if(data["status"] === "error"){
                        $(".upload-success").css("display", "none");
                        $(".upload-error").css("display", "block")
                    }
                }
            });
        }
    });

    $("input[name='courseware-name']").change(function () {
        $(".courseware-name-tip").css("display", "none")
    });
    $("input[name='courseware-file']").change(function () {
        $(".courseware-file-tip").css("display", "none")
    })

});

