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


    //上传课程
    $(".upload-course").click(function () {
        if ($("input[name='course-name']").val() === "") {
            $(".course-name-tip").css("display", "inline-block");
            return false;
        } else if ($("input[name='course-file']").val() === "") {
            $(".course-file-tip").css("display", "inline-block");
            return false;
        } else {
            var formData = new FormData($('#upload-course')[0]);
            $.ajax({
                type: "POST",
                url: "/video/uploadcourse/",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data["status"] === "success") {
                        $("input[name='course-name']").val("");
                        $("input[name='course-desc']").val("");
                        $("input[name='course-file']").val("");
                        $(".upload-course-error").css("display", "none");
                        $(".upload-course-success").css("display", "block");

                        setTimeout(function () {
                            $(".upload-course-success").css("display", "none");
                            window.location.href = "http://localhost:8000/mine";
                        }, 2000);
                    } else if (data["status"] === "error") {
                        $(".upload-course-success").css("display", "none");
                        $(".upload-course-error").css("display", "block");
                        setTimeout(function () {
                            $(".upload-course-error").css("display", "none");
                        }, 3000);
                    }
                }
            });
        }
    });

    //上传视频
    $(".upload-video").click(function () {
        if ($("select[name='course-select'] option:selected").val() === undefined) {
            $(".option-tip2").css("display", "none");
            $(".option-tip").css("display", "inline-block");
        } else if ($("input[name='video-name']").val() === "") {
            $(".video-name-tip").css("display", "inline-block");
        } else if ($("input[name='video-file']").val() === "") {
            $(".video-file-tip").css("display", "inline-block");
        } else {
            var formData = new FormData($('#upload-video')[0]);
            $.ajax({
                type: "POST",
                url: "/video/uploadvideo/",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data["status"] === "success") {
                        $("input[name='video-name']").val("");
                        $("input[name='video-file']").val("");
                        $(".upload-video-error").css("display", "none");
                        $(".upload-video-success").css("display", "block");
                        setTimeout(function () {
                            $(".upload-video-success").css("display", "none");
                        }, 5000);
                    } else if (data["status"] === "error") {
                        $(".upload-video-success").css("display", "none");
                        $(".upload-video-error").css("display", "block");
                        setTimeout(function () {
                            $(".upload-video-error").css("display", "none");
                        }, 5000);
                    }
                }
            });
        }
    });

    //上传课件
    $(".upload").click(function () {
        if ($("input[name='courseware-name']").val() === "") {
            $(".courseware-name-tip").css("display", "inline-block")
        } else if ($("input[name='courseware-file']").val() === "") {
            $(".courseware-file-tip").css("display", "inline-block")
        } else {
            var formData = new FormData($('#upload-courseware')[0]);
            $.ajax({
                type: "POST",
                url: "/courseware/upload/",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data["status"] === "success") {
                        $("input[name='courseware-name']").val("");
                        $("input[name='courseware-file']").val("");
                        $(".upload-error").css("display", "none");
                        $(".upload-success").css("display", "block");
                        setTimeout(function () {
                            $(".upload-success").css("display", "none");
                        }, 5000);
                    } else if (data["status"] === "error") {
                        $(".upload-success").css("display", "none");
                        $(".upload-error").css("display", "block");
                        setTimeout(function () {
                            $(".upload-error").css("display", "none");
                        }, 5000);
                    }
                }
            });
        }
    });


    $("select[name='course-select']").change(function () {
        $(".option-tip").css("display", "none");
        $(".option-tip2").css("display", "inline-block");
    });
    $("input[name='video-name']").change(function () {
        $(".video-name-tip").css("display", "none");
    });
    $("input[name='video-file']").change(function () {
        $(".video-file-tip").css("display", "none");
    });
    $("input[name='course-name']").change(function () {
        $(".course-name-tip").css("display", "none");
    });
    $("input[name='course-file']").change(function () {
        $(".course-file-tip").css("display", "none");
    });
    $("input[name='courseware-name']").change(function () {
        $(".courseware-name-tip").css("display", "none")
    });
    $("input[name='courseware-file']").change(function () {
        $(".courseware-file-tip").css("display", "none")
    })
})
;
