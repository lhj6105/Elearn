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
        } else if ($(this).children("a").html() === "添加作业") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-add-questions").removeAttr("hidden")
        } else if ($(this).children("a").html() === "我的作业") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-myhomework").removeAttr("hidden")
        } else if ($(this).children("a").html() === "批改作业") {
            $(".mine-item-title li").removeAttr("style");
            $(this).css("background-color", "#23b8ff");
            $(".mine-item-content").children("div").attr("hidden", "hidden");
            $(".mine-item-correct-homework").removeAttr("hidden")
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

    $(".add-homework").click(function () {
        $(".mine-item-add-questions").attr("hidden", "hidden");
        $(".mine-item-add-homework").removeAttr("hidden");
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
                        }, 5000);
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

    //增加作业
    $(".upload-homework").click(function () {
        if ($("input[name='homework-name']").val() === "") {
            $(".homework-name-tip").css("display", "inline-block")
        } else {
            var formData = new FormData($('#upload-homework')[0]);
            $.ajax({
                type: "POST",
                url: "/homework/upload/",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data["status"] === "success") {
                        $("input[name='homework-name']").val("");
                        $("input[name='homework-id']").val("");
                        $("input[name='homework-desc']").val("");
                        $(".upload-homework-error").css("display", "none");
                        $(".upload-homework-success").css("display", "block");
                        setTimeout(function () {
                            $(".upload-homework-success").css("display", "none");
                            window.location.href = "http://localhost:8000/mine";
                        }, 2000);
                    } else if (data["status"] === "error") {
                        $(".upload-homework-success").css("display", "none");
                        $(".upload-homework-error").css("display", "block");
                        setTimeout(function () {
                            $(".upload-homework-error").css("display", "none");
                        }, 5000);
                    }
                }
            });
        }
    });

    //增加判断题
    $(".add-pd-question").click(function () {
        if ($("select[name='homework-select'] option:selected").val() === undefined) {
            $(".homework-select-tip").css("display", "block")
        } else if ($("textarea[name='pd-question']").val() === "") {
            $(".pd-question-tip").css("display", "block")
        } else if ($("input[name='pd-anwser']:checked").val() === undefined) {
            $(".pd-anwser-tip").css("display", "block")
        } else {
            $.ajax({
                url: "/homework/addpd/",
                type: "post",
                data: {
                    "homework": $("select[name='homework-select'] option:selected").val(),
                    "pd-question": $("textarea[name='pd-question']").val(),
                    "pd-anwser": $("input[name='pd-anwser']:checked").val(),
                    "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                },
                success: function (data) {
                    if (data["status"] === "success") {
                        $("textarea[name='pd-question']").val("");
                        $("input[name='pd-anwser']").removeAttr("checked");
                        $(".add-question-error").css("display", "none");
                        $(".add-question-success").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-success").css("display", "none");
                        }, 5000);
                    } else if (data["status"] === "error") {
                        $(".add-question-success").css("display", "none");
                        $(".add-question-error").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-error").css("display", "none");
                        }, 5000);
                    }
                }
            })
        }
    });
    $("select[name='homework-select']").change(function () {
        $(".homework-select-tip").css("display", "none")
    });
    $("textarea[name='pd-question']").change(function () {
        $(".pd-question-tip").css("display", "none")
    });
    $("input[name='pd-anwser']").change(function () {
        $(".pd-anwser-tip").css("display", "none")
    });

    //增加选择题
    $(".add-xz-question").click(function () {
        if ($("select[name='homework-select'] option:selected").val() === undefined) {
            $(".homework-select-tip").css("display", "block")
        } else if ($("textarea[name='xz-question']").val() === "") {
            $(".xz-question-tip").css("display", "block")
        } else if ($("input[name='xz-anwser-A']").val() === "") {
            $(".xz-anwser-A-tip").css("display", "block")
        } else if ($("input[name='xz-anwser-B']").val() === "") {
            $(".xz-anwser-B-tip").css("display", "block")
        } else if ($("input[name='xz-anwser-C']").val() === "") {
            $(".xz-anwser-C-tip").css("display", "block")
        } else if ($("input[name='xz-anwser-D']").val() === "") {
            $(".xz-anwser-D-tip").css("display", "block")
        } else if ($("input[name='xz-anwser']:checked").val() === undefined) {
            $(".xz-anwser-tip").css("display", "block")
        } else {
            $.ajax({
                url: "/homework/addxz/",
                type: "post",
                data: {
                    "homework": $("select[name='homework-select'] option:selected").val(),
                    "xz-question": $("textarea[name='xz-question']").val(),
                    "xz-anwser-A": $("input[name='xz-anwser-A']").val(),
                    "xz-anwser-B": $("input[name='xz-anwser-B']").val(),
                    "xz-anwser-C": $("input[name='xz-anwser-C']").val(),
                    "xz-anwser-D": $("input[name='xz-anwser-D']").val(),
                    "xz-anwser": $("input[name='xz-anwser']:checked").val(),
                    "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                },
                success: function (data) {
                    if (data["status"] === "success") {
                        $("textarea[name='xz-question']").val("");
                        $("input[name='xz-anwser-A']").val("");
                        $("input[name='xz-anwser-B']").val("");
                        $("input[name='xz-anwser-C']").val("");
                        $("input[name='xz-anwser-D']").val("");
                        $("input[name='xz-anwser']").removeAttr("checked");
                        $(".add-question-error").css("display", "none");
                        $(".add-question-success").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-success").css("display", "none");
                        }, 5000);
                    } else if (data["status"] === "error") {
                        $(".add-question-success").css("display", "none");
                        $(".add-question-error").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-error").css("display", "none");
                        }, 5000);
                    }
                }
            })
        }
    });
    $("textarea[name='xz-question']").change(function () {
        $(".xz-question-tip").css("display", "none")
    });
    $("input[name='xz-anwser-A']").change(function () {
        $(".xz-anwser-A-tip").css("display", "none")
    });
    $("input[name='xz-anwser-B']").change(function () {
        $(".xz-anwser-B-tip").css("display", "none")
    });
    $("input[name='xz-anwser-C']").change(function () {
        $(".xz-anwser-C-tip").css("display", "none")
    });
    $("input[name='xz-anwser-D']").change(function () {
        $(".xz-anwser-D-tip").css("display", "none")
    });
    $("input[name='xz-anwser']").change(function () {
        $(".xz-anwser-tip").css("display", "none")
    });


    //简答题
    $(".add-jd-question").click(function () {
        if ($("select[name='homework-select'] option:selected").val() === undefined) {
            $(".homework-select-tip").css("display", "block")
        } else if ($("textarea[name='jd-question']").val() === "") {
            $(".jd-question-tip").css("display", "block")
        } else {
            $.ajax({
                url: "/homework/addjd/",
                type: "post",
                data: {
                    "homework": $("select[name='homework-select'] option:selected").val(),
                    "jd-question": $("textarea[name='jd-question']").val(),
                    "jd-anwser": $("textarea[name='jd-anwser']").val(),
                    "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                },
                success: function (data) {
                    if (data["status"] === "success") {
                        $("textarea[name='jd-question']").val("");
                        $("textarea[name='jd-anwser']").val("");
                        $(".add-question-error").css("display", "none");
                        $(".add-question-success").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-success").css("display", "none");
                        }, 5000);
                    } else if (data["status"] === "error") {
                        $(".add-question-success").css("display", "none");
                        $(".add-question-error").css("display", "block");
                        setTimeout(function () {
                            $(".add-question-error").css("display", "none");
                        }, 5000);
                    }
                }
            })
        }
    });
    $("textarea[name='jd-question']").change(function () {
        $(".jd-question-tip").css("display", "none")
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
    });
    $("input[name='homework-name']").change(function () {
        $(".homework-name-tip").css("display", "none")
    });


    //增加的题目类型标题颜色和显示内容
    $(".pd").click(function () {
        $(this).css("color", "#12a7ff");
        $(".xz").css("color", "#333333");
        $(".jd").css("color", "#333333");
        $(".mine-item-xz").attr("hidden", "hidden");
        $(".mine-item-jd").attr("hidden", "hidden");
        $(".mine-item-pd").removeAttr("hidden")
    });
    $(".xz").click(function () {
        $(this).css("color", "#12a7ff");
        $(".pd").css("color", "#333333");
        $(".jd").css("color", "#333333");
        $(".mine-item-pd").attr("hidden", "hidden");
        $(".mine-item-jd").attr("hidden", "hidden");
        $(".mine-item-xz").removeAttr("hidden")
    });
    $(".jd").click(function () {
        $(this).css("color", "#12a7ff");
        $(".pd").css("color", "#333333");
        $(".xz").css("color", "#333333");
        $(".mine-item-pd").attr("hidden", "hidden");
        $(".mine-item-xz").attr("hidden", "hidden");
        $(".mine-item-jd").removeAttr("hidden")
    });


    $(".release-homework").click(function () {
        $.ajax({
            url: "/homework/release/",
            type: "post",
            data: {
                "homeworkid": $(this).val(),
                "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val()
            },
            success: function (data) {
                if (data["status"] === "success") {
                    alert("发布成功");
                    window.location.href="http://localhost:8000/mine/"
                } else {
                    alert("发布失败，请重新发布")
                }
            }
        })
    })
});

