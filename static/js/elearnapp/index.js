$(function () {
    $(".nav").find("li").each(function () {
        var a = $(this).find("a:first")[0];
        if ($(a).attr("href") === location.pathname) {
            $(this).addClass("active");
            $(this).children("a").css("background-color", "#23b8ff")
        } else {
            $(this).removeClass("active");
            $(this).children("a").css("background-color", "#ffffff")
        }

        if ($(a).attr("href") === "/" + location.pathname.split("/")[1] + "/") {
            $(this).addClass("active");
            $(this).children("a").css("background-color", "#23b8ff")
        } else {
            $(this).removeClass("active");
            $(this).children("a").css("background-color", "#ffffff")
        }
    });

    $('#register').click(function () {
        $('#registerModal').modal('show') //注册弹出框
    });
    $('#goregister').click(function () {
        $('#registerModal').modal('show') //注册弹出框
    });

    $('#login').click(function () {
        $('#loginModal').modal('show') //登录弹出框
    });
    $('#gologin').click(function () {
        $('#loginModal').modal('show') //登录弹出框
    });

    $('#resetpassword').click(function () {
        $('#resetPasswordModal').modal('show') //修改密码弹出框
    });

    $('.dropdown-toggle').mouseover(function () {
        $(this).attr("aria-expanded", true);
        $(".personal-center").addClass("open")
    });
    $(".dropdown-menu li").mouseover(function () {
        $(this).children('a').css("color", "#12a7ff");
    });
    $(".dropdown-menu li").mouseout(function () {
        $(this).children('a').css("color", "#333333");
    });

    $('#resethead').click(function () {
        $('#resetheadModal').modal('show') //修改头像弹出框
    });

    $(".r-st").change(function () {
        if ($(this).val() == "teacher") {
            $(".v-code").removeAttr("hidden"); //如果选择教师注册，显示注册码输入框
            $(".r-st[value='student']").removeAttr("checked");
            $(".r-st[value='teacher']").attr('checked', 'checked')
        } else {
            $(".v-code").attr("hidden", "hidden"); //如果选择教师注册，隐藏注册码输入框
            $(".r-st[value='student']").attr('checked', 'checked');
            $(".r-st[value='teacher']").removeAttr("checked")
        }
    });


    //注册验证
    $(".register-submit").click(function () {

        //如果注册信息没有一个为空执行if
        if ($("input[name='register-name']").val() != "" && $("input[name='register-number']").val() != ""
            && $("input[name='register-password']").val() != "" && $("input[name='register-password-2']").val() != "") {
            $(".r-name-tip").html("");
            $(".r-number-tip").html(""); //清空三个提示
            $(".r-password-tip").html("");

            //如果选择学生注册
            if ($(".r-st:checked").val() == "student") {
                var s_reg_name = $("input[name='register-name']").val();
                var s_reg_number = $("input[name='register-number']").val();
                var s_reg_password = $("input[name='register-password']").val();
                var s_reg_selection_id = $(".r-st:checked").val();
                if (s_reg_number.length < 8) {
                    $(".r-number-tip").css("display", "block").html("不能小于8位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (s_reg_number.length > 15) {
                    $(".r-number-tip").css("display", "block").html("不能大于15位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (/^[0-9]+$/.test(s_reg_number)) {
                    if (s_reg_password.length < 6) {
                        $(".r-password-tip").css("display", "block").html("不能小于6位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if (s_reg_password.length > 15) {
                        $(".r-password-tip").css("display", "block").html("不能大于15位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if ($("input[name='register-password']").val() != $("input[name='register-password-2']").val()) {
                        $(".r-password-tip-2").css("display", "block").html("两次输入的密码不一致");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip-2").html("")
                        });
                        $("input[name='register-password-2']").change(function () {
                            $(".r-password-tip-2").html("")
                        });
                    } else {
                        $.ajax({
                            url: "/mine/studentregister/",
                            type: "post",
                            data: {
                                "s_reg_name": s_reg_name, "s_reg_number": s_reg_number,
                                "s_reg_password": s_reg_password, "s_reg_selection_id": s_reg_selection_id,
                                "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val()
                            },
                            success: function (data) {
                                if (data["status"] == "ok") {
                                    $(".tips").html("<div>注册成功！</div><br><div><span id='mes'>3</span>秒后自动跳转...</div>");
                                    $(".tips").css({"text-align": "center", "font-size": "20px"});

                                    var tt = 3;

                                    function a() {
                                        if (tt == 1) {
                                            window.location.reload() //注册成功后定时刷新网页
                                        } else {
                                            tt--;
                                            $("#mes").html(tt);
                                        }
                                    }

                                    setInterval(a, 1000);

                                } else if (data["status"] == "error") {
                                    $(".r-number-tip").css("display", "block").html("学号已存在<a id='reset' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>不是本人？请联系管理员</a>");

                                    $("input[name='register-number']").change(function () {
                                        $(".r-number-tip").html("")
                                    });
                                } else if (data["status"] == "stop") {
                                    $(".r-name-tip").css("display", "block").html("服务器出错，请重新提交");
                                    $("input[name='register-name']").change(function () {
                                        $(".r-name-tip").html("")
                                    });
                                }
                            }
                        });
                    }
                } else {
                    $(".r-number-tip").css("display", "block").html("必须全为数字");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                }

            }
            //如果选择教师注册
            else if ($(".r-st:checked").val() == "teacher") {
                var t_reg_name = $("input[name='register-name']").val();
                var t_reg_number = $("input[name='register-number']").val();
                var t_reg_password = $("input[name='register-password']").val();
                var t_reg_selection_id = $(".r-st:checked").val();
                if (t_reg_number.length < 8) {
                    $(".r-number-tip").css("display", "block").html("不能小于8位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (t_reg_number.length > 15) {
                    $(".r-number-tip").css("display", "block").html("不能大于15位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (/^[0-9]+$/.test(t_reg_number)) {
                    if (t_reg_password.length < 6) {
                        $(".r-password-tip").css("display", "block").html("不能小于6位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if (t_reg_password.length > 15) {
                        $(".r-password-tip").css("display", "block").html("不能大于15位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else {
                        if ($("input[name='code-tip']").val() != "") {
                            if ($("input[name='register-password']").val() != $("input[name='register-password-2']").val()) {
                                $(".r-password-tip-2").css("display", "block").html("两次输入的密码不一致");
                                $("input[name='register-password']").change(function () {
                                    $(".r-password-tip-2").html("")
                                });
                                $("input[name='register-password-2']").change(function () {
                                    $(".r-password-tip-2").html("")
                                });
                            } else {
                                $.ajax({
                                    url: "/mine/teacherregister/",
                                    type: "post",
                                    data: {
                                        "t_reg_name": t_reg_name, "t_reg_number": t_reg_number,
                                        "t_reg_password": t_reg_password, "t_reg_selection_id": t_reg_selection_id,
                                        "t_reg_code": $("input[name='code-tip']").val(),
                                        "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val()
                                    },
                                    success: function (data) {
                                        if (data["code"] == "ok") {
                                            if (data["status"] == "ok") {
                                                $(".tips").html("<div>注册成功！</div><br><div><span id='mes'>3</span>秒后自动跳转...</div>");
                                                $(".tips").css({"text-align": "center", "font-size": "20px"});

                                                var tt = 3;

                                                function a() {
                                                    if (tt == 1) {
                                                        window.location.reload() //注册成功后定时刷新网页
                                                    } else {
                                                        tt--;
                                                        $("#mes").html(tt);
                                                    }
                                                }

                                                setInterval(a, 1000);

                                            } else if (data["status"] == "error") {
                                                $(".r-number-tip").css("display", "block").html("学号已存在<a id='reset' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>不是本人？请联系管理员</a>");

                                                $("input[name='register-number']").change(function () {
                                                    $(".r-number-tip").html("")
                                                });
                                            } else if (data["status"] == "stop") {
                                                $(".r-name-tip").css("display", "block").html("服务器出错，请重新提交");
                                                $("input[name='register-name']").change(function () {
                                                    $(".r-name-tip").html("")
                                                });
                                            }
                                        } else if (data["code"] == "error") {
                                            $(".code-tip").css("display", "block").html("注册码不正确");
                                            $("input[name='code-tip']").change(function () {
                                                $(".code-tip").html("")
                                            })
                                        }
                                    }
                                });
                            }

                        } else {
                            $(".code-tip").css("display", "block").html("注册码不能为空");
                            $("input[name='code-tip']").change(function () {
                                $(".code-tip").html("")
                            })
                        }

                    }
                } else {
                    $(".r-number-tip").css("display", "block").html("必须全为数字");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                }
            } else {
                $(".r-password-tip-2").css("display", "block").html("请选择你的身份"); //两个身份都未选择时提示
                $(".r-st").change(function () {
                    $(".r-password-tip-2").html("");
                })
            }
        }

        //如果注册信息有一个为空执行else
        else {
            //判断哪一个为空
            if ($("input[name='register-name']").val() == "") {
                $(".r-name-tip").css("display", "block").html("姓名不能为空")
            }
            if ($("input[name='register-number']").val() == "") {
                $(".r-number-tip").css("display", "block").html("学号不能为空")
            }
            if ($("input[name='register-password']").val() == "") {
                $(".r-password-tip").css("display", "block").html("密码不能为空")
            }
            if ($("input[name='register-password-2']").val() == "") {
                $(".r-password-tip-2").css("display", "block").html("此处不能为空")
            }

            $("input[name='register-name']").change(function () {
                if ($(this).val() == "") {
                    $(".r-name-tip").css("display", "block").html("姓名不能为空")
                } else {
                    $(".r-name-tip").html("")
                }
            });
            $("input[name='register-number']").change(function () {
                if ($(this).val() == "") {
                    $(".r-number-tip").css("display", "block").html("学号不能为空")
                } else {
                    $(".r-number-tip").html("")
                }
            });
            $("input[name='register-password']").change(function () {
                if ($(this).val() == "") {
                    $(".r-password-tip").css("display", "block").html("密码不能为空")
                } else {
                    $(".r-password-tip").html("")
                }
            });
            $("input[name='register-password-2']").change(function () {
                if ($(this).val() == "") {
                    $(".r-password-tip-2").css("display", "block").html("此处不能为空")
                } else {
                    $(".r-password-tip-2").html("")
                }
            })
        }
    });


    $(".l-st").change(function () {
        if ($(this).val() == "teacher") {
            $(".l-st[value='student']").removeAttr("checked");
            $(".l-st[value='teacher']").attr('checked', 'checked')
        } else {
            $(".l-st[value='student']").attr('checked', 'checked');
            $(".l-st[value='teacher']").removeAttr("checked")
        }
    });


    //登录验证
    $(".login-submit").click(function () {
        //如果登录信息没有一个为空执行if
        if ($("input[name='login-number']").val() != "" && $("input[name='login-password']").val() != "") {
            $(".l-number-tip").html("");
            $(".l-password-tip").html("");
            //如果选择学生登录
            if ($(".l-st:checked").val() == "student") {
                var s_log_number = $("input[name='login-number']").val();
                var s_log_password = $("input[name='login-password']").val();
                var s_log_selection_id = $(".l-st:checked").val();
                $.ajax({
                    url: "/mine/studentlogin/",
                    type: "post",
                    data: {
                        "s_log_number": s_log_number,
                        "s_log_password": s_log_password,
                        "s_log_selection_id": s_log_selection_id,
                        "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                    },
                    success: function (data) {
                        if (data["status"] == "log_ok") {
                            $(".tips2").html("<div>登录成功！</div><br><div><span id='l_mes'>1</span>秒后自动跳转...</div>");
                            $(".tips2").css({"text-align": "center", "font-size": "20px"});

                            var tt = 1;

                            function b() {
                                if (tt == 1) {
                                    window.location.reload() //注册成功后定时刷新网页
                                } else {
                                    tt--;
                                    $("#l_mes").html(tt);
                                }
                            }

                            setInterval(b, 1000);
                        } else if (data["status"] == "log_error") {
                            $(".l-password-tip").css("display", "block").html("密码错误<a hidden data-toggle='modal' id='forget' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>忘记密码请联系管理员</a>");

                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_stop") {
                            $(".l-password-tip").css("display", "block").html("服务器出错，请重新登录");
                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_empty") {
                            $(".l-number-tip").css("display", "block").html("学号不存在，请先注册");
                            $("input[name='login-number']").change(function () {
                                $(".l-number-tip").html("")
                            })
                        }
                    }
                })

            }
            //如果选择教师登录
            else if ($(".l-st:checked").val() == "teacher") {
                var t_log_number = $("input[name='login-number']").val();
                var t_log_password = $("input[name='login-password']").val();
                var t_log_selection_id = $(".l-st:checked").val();
                $.ajax({
                    url: "/mine/teacherlogin/",
                    type: "post",
                    data: {
                        "t_log_number": t_log_number,
                        "t_log_password": t_log_password,
                        "t_log_selection_id": t_log_selection_id,
                        "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                    },
                    success: function (data) {
                        if (data["status"] == "log_ok") {
                            $(".tips2").html("<div>登录成功！</div><br><div><span id='l_mes'>1</span>秒后自动跳转...</div>");
                            $(".tips2").css({"text-align": "center", "font-size": "20px"});

                            var tt = 1;

                            function b() {
                                if (tt == 1) {
                                    window.location.reload() //注册成功后定时刷新网页
                                } else {
                                    tt--;
                                    $("#l_mes").html(tt);
                                }
                            }

                            setInterval(b, 1000);
                        } else if (data["status"] == "log_error") {
                            $(".l-password-tip").css("display", "block").html("密码错误<a data-toggle='modal' id='forget' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>忘记密码请联系管理员</a>");

                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_stop") {
                            $(".l-password-tip").css("display", "block").html("服务器出错，请重新登录");
                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_empty") {
                            $(".l-number-tip").css("display", "block").html("学号不存在，请先注册");
                            $("input[name='login-number']").change(function () {
                                $(".l-number-tip").html("")
                            })
                        }
                    }
                });
            } else {
                $(".l-password-tip").css("display", "block").html("请选择你的身份"); //两个身份都未选择时提示
                $(".tt").change(function () {
                    $(".l-password-tip").html("");
                })
            }
        }
        //如果登录信息有一个为空执行else
        else {
            //判断哪一个为空
            if ($("input[name='login-number']").val() == "") {
                $(".l-number-tip").css("display", "block").html("学号不能为空")
            }
            if ($("input[name='login-password']").val() == "") {
                $(".l-password-tip").css("display", "block").html("密码不能为空")
            }

            $("input[name='login-number']").change(function () {
                if ($(this).val() == "") {
                    $(".l-number-tip").css("display", "block").html("学号不能为空")
                } else {
                    $(".l-number-tip").html("")
                }
            });
            $("input[name='login-password']").change(function () {
                if ($(this).val() == "") {
                    $(".l-password-tip").css("display", "block").html("密码不能为空")
                } else {
                    $(".l-password-tip").html("")
                }
            })
        }
    });

    // 修改密码
    $(".reset-password-submit").click(function () {
        var reset_password_1 = $("input[name='reset-password-1']").val();
        var reset_password_2 = $("input[name='reset-password-2']").val();
        if (reset_password_1 !== "" && reset_password_2 !== "") {
            if (reset_password_1.length < 6) {
                $(".reset-password-tip-1").css("display", "block").html("不能小于6位");
                $("input[name='register-password']").change(function () {
                    $(".reset-password-tip-1").html("")
                });
            } else if (reset_password_1.length > 15) {
                $(".reset-password-tip-1").css("display", "block").html("不能大于15位");
                $("input[name='register-password']").change(function () {
                    $(".reset-password-tip-1").html("")
                });
            } else if (reset_password_1 !== reset_password_2) {
                $(".reset-password-tip-2").css("display", "block").html("两次输入的密码不一致");
                $("input[name='reset-password-1']").change(function () {
                    $(".reset-password-tip-2").html("")
                });
                $("input[name='reset-password-2']").change(function () {
                    $(".reset-password-tip-2").html("")
                });
            } else {
                $.ajax({
                    url: "/mine/resetpassword/",
                    type: "post",
                    data: {
                        "reset_password_1": reset_password_1,
                        "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val()
                    },
                    success: function (data) {
                        if (data["status"] == "success") {
                            $(".tips3").html("<div>修改成功！</div><br><div><span id='mes'>3</span>秒后自动跳转...</div>");
                            $(".tips3").css({"text-align": "center", "font-size": "20px"});

                            var tt = 3;

                            function a() {
                                if (tt == 1) {
                                    window.location.reload() //修改成功后定时刷新网页
                                } else {
                                    tt--;
                                    $("#mes").html(tt);
                                }
                            }

                            setInterval(a, 1000);
                        } else if (data["status"] == "error") {
                            $(".reset-password-tip-2").css("display", "block").html("不能修改<a id='reset' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>请联系管理员</a>");

                            $("input[name='reset-password-1']").change(function () {
                                $(".reset-password-tip-1").html("")
                            });
                            $("input[name='reset-password-2']").change(function () {
                                $(".reset-password-tip-2").html("")
                            });
                        } else if (data["status"] == "stop") {
                            $(".reset-password-tip-2").css("display", "block").html("服务器出错，请重新提交");
                            $("input[name='reset-password-1']").change(function () {
                                $(".reset-password-tip-1").html("")
                            });
                            $("input[name='reset-password-2']").change(function () {
                                $(".reset-password-tip-2").html("")
                            });
                        }
                    }
                });
            }
        } else {
            if ($("input[name='reset-password-1']").val() === "") {
                $(".reset-password-tip-1").css("display", "block").html("密码不能为空")
            }
            if ($("input[name='reset-password-2']").val() === "") {
                $(".reset-password-tip-2").css("display", "block").html("密码不能为空")
            }
            $("input[name='reset-password-1']").change(function () {
                if ($(this).val() === "") {
                    $(".reset-password-tip-1").css("display", "block").html("密码不能为空")
                } else {
                    $(".reset-password-tip-1").html("")
                }
            });
            $("input[name='reset-password-2']").change(function () {
                if ($(this).val() === "") {
                    $(".reset-password-tip-2").css("display", "block").html("密码不能为空")
                } else {
                    $(".reset-password-tip-2").html("")
                }
            });
        }
    });

    $(".login-password-eye").click(function () {
        var login_password_eye_icon = $(".login-password-eye-icon");
        if (login_password_eye_icon.hasClass("glyphicon-eye-close")) {
            login_password_eye_icon.removeClass("glyphicon-eye-close");
            login_password_eye_icon.addClass("glyphicon-eye-open");
            $("input[name='login-password']").attr("type", "text")
        } else if (login_password_eye_icon.hasClass("glyphicon-eye-open")) {
            login_password_eye_icon.removeClass("glyphicon-eye-open");
            login_password_eye_icon.addClass("glyphicon-eye-close");
            $("input[name='login-password']").attr("type", "password")
        }
    });
    $(".register-password-eye-1").click(function () {
        var register_password_eye_icon_1 = $(".register-password-eye-icon-1");
        if (register_password_eye_icon_1.hasClass("glyphicon-eye-close")) {
            register_password_eye_icon_1.removeClass("glyphicon-eye-close");
            register_password_eye_icon_1.addClass("glyphicon-eye-open");
            $("input[name='register-password']").attr("type", "text")
        } else if (register_password_eye_icon_1.hasClass("glyphicon-eye-open")) {
            register_password_eye_icon_1.removeClass("glyphicon-eye-open");
            register_password_eye_icon_1.addClass("glyphicon-eye-close");
            $("input[name='register-password']").attr("type", "password")
        }
    });
    $(".register-password-eye-2").click(function () {
        var register_password_eye_icon_2 = $(".register-password-eye-icon-2");
        if (register_password_eye_icon_2.hasClass("glyphicon-eye-close")) {
            register_password_eye_icon_2.removeClass("glyphicon-eye-close");
            register_password_eye_icon_2.addClass("glyphicon-eye-open");
            $("input[name='register-password-2']").attr("type", "text")
        } else if (register_password_eye_icon_2.hasClass("glyphicon-eye-open")) {
            register_password_eye_icon_2.removeClass("glyphicon-eye-open");
            register_password_eye_icon_2.addClass("glyphicon-eye-close");
            $("input[name='register-password-2']").attr("type", "password")
        }
    });
    $(".reset-password-eye-1").click(function () {
        var reset_password_eye_icon_1 = $(".reset-password-eye-icon-1");
        if (reset_password_eye_icon_1.hasClass("glyphicon-eye-close")) {
            reset_password_eye_icon_1.removeClass("glyphicon-eye-close");
            reset_password_eye_icon_1.addClass("glyphicon-eye-open");
            $("input[name='reset-password-1']").attr("type", "text")
        } else if (reset_password_eye_icon_1.hasClass("glyphicon-eye-open")) {
            reset_password_eye_icon_1.removeClass("glyphicon-eye-open");
            reset_password_eye_icon_1.addClass("glyphicon-eye-close");
            $("input[name='reset-password-1']").attr("type", "password")
        }
    });

    $(".reset-password-eye-2").click(function () {
        var reset_password_eye_icon_2 = $(".reset-password-eye-icon-2");
        if (reset_password_eye_icon_2.hasClass("glyphicon-eye-close")) {
            reset_password_eye_icon_2.removeClass("glyphicon-eye-close");
            reset_password_eye_icon_2.addClass("glyphicon-eye-open");
            $("input[name='reset-password-2']").attr("type", "text")
        } else if (reset_password_eye_icon_2.hasClass("glyphicon-eye-open")) {
            reset_password_eye_icon_2.removeClass("glyphicon-eye-open");
            reset_password_eye_icon_2.addClass("glyphicon-eye-close");
            $("input[name='reset-password-2']").attr("type", "password")
        }
    });
    $(".head-picture-submit").click(function () {
        var head_picture = $("input[name='head-picture']").val();
        var formData = new FormData($('#head-picture-form')[0]);
        if (head_picture !== "") {
            $.ajax({
                url: "/mine/headpicture/",
                type: "post",
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                // data: {
                //     "head_picture": head_picture,
                //     "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                // },
                success: function (data) {
                    if (data["status"] === "success") {
                        $(".profile-photo").attr("src", "/static/" + data["photo"]);
                        $('#resetheadModal').modal('hide') //修改头像弹出框
                    } else if (data["status"] === "error") {
                        $(".head-picture-error-tip").css("display", "block")
                    } else if (data["status"] === "stop") {
                        $(".head-picture-error-tip").css("display", "block")
                    }
                }
            })
        } else {
            $(".head-picture-tip").css("display", "block")
        }
    });
    $("input[name='head-picture']").change(function () {
        if ($("input[name='head-picture']").val() !== "") {
            $(".head-picture-tip").css("display", "none");
        }
        $(".head-picture-error-tip").css("display", "none")
    })
});
//判断浏览器是否支持FileReader接口
if (typeof FileReader == 'undefined') {
    document.getElementById("xmTanDiv").InnerHTML = "<h1>当前浏览器不支持FileReader接口</h1>";
    //使选择控件不可操作
    document.getElementById("xdaTanFileImg").setAttribute("disabled", "disabled");
}

//选择图片，马上预览
function xmTanUploadImg(obj) {
    var file = obj.files[0];

    // console.log(obj);
    // console.log(file);
    // console.log("file.size = " + file.size);  //file.size 单位为byte
    if (file.size <= 524288) {
        var reader = new FileReader();
        //读取文件过程方法
        // reader.onloadstart = function (e) {
        //     console.log("开始读取....");
        // };
        // reader.onprogress = function (e) {
        //     console.log("正在读取中....");
        // };
        // reader.onabort = function (e) {
        //     console.log("中断读取....");
        // };
        // reader.onerror = function (e) {
        //     console.log("读取异常....");
        // };
        reader.onload = function (e) {
            // console.log("成功读取....");
            var img = document.getElementById("xmTanImg");
            $(".preview-picture").css("display","block");
            $(".head-content").css("height","600px");
            img.height = "284";
            img.width = "284";
            img.src = e.target.result;
            //或者 img.src = this.result;  //e.target == this
        };
        reader.readAsDataURL(file)
    } else {
        $("input[name='head-picture']").val("");
        alert("图片不能大于512KB");
    }
}
