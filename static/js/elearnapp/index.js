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


    $(".r-st").change(function () {
        if ($(this).val() == "teacher") {
            $(".v-code").removeAttr("hidden"); //如果选择教师注册，显示注册码输入框
            $(".r-st[value='student']").removeAttr("checked");
            $(".r-st[value='teacher']").attr('checked', 'checked')
        }
        else {
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
                var s_r_selection_id = $(".r-st:checked").val();
                if (s_reg_number.length < 8) {
                    $(".r-number-tip").html("不能小于8位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (s_reg_number.length > 15) {
                    $(".r-number-tip").html("不能大于15位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (/^[0-9]+$/.test(s_reg_number)) {
                    if (s_reg_password.length < 6) {
                        $(".r-password-tip").html("不能小于6位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if (s_reg_password.length > 15) {
                        $(".r-password-tip").html("不能大于15位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if ($("input[name='register-password']").val() != $("input[name='register-password-2']").val()) {
                        $(".r-password-tip-2").html("两次输入的密码不一致");
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
                                "s_reg_password": s_reg_password, "s_r_selection_id": s_r_selection_id,
                                "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val()
                            },
                            success: function (data) {
                                if (data["status"] == "ok") {
                                    $(".tips").html("<div>注册成功！</div><br><div><span id='mes'>3</span>秒后自动跳转...</div>");
                                    $(".tips").css({"text-align": "center", "font-size": "20px"});

                                    var tt = 3;

                                    function a() {
                                        if (tt == 1) {
                                            $("#allvideo").removeAttr("hidden");
                                            window.location.reload() //注册成功后定时刷新网页
                                        } else {
                                            tt--;
                                            $("#mes").html(tt);
                                        }
                                    }

                                    setInterval(a, 1000);

                                } else if (data["status"] == "error") {
                                    $(".r-number-tip").html("学号已存在<a id='reset' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>不是本人？请联系管理员</a>");

                                    $("input[name='register-number']").change(function () {
                                        $(".r-number-tip").html("")
                                    });
                                } else if (data["status"] == "stop") {
                                    $(".r-name-tip").html("服务器出错，请重新提交");
                                    $("input[name='register-name']").change(function () {
                                        $(".r-name-tip").html("")
                                    });
                                }
                            }
                        });
                    }
                } else {
                    $(".r-number-tip").html("必须全为数字");
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
                var t_r_selection_id = $(".r-st:checked").val();
                if (t_reg_number.length < 8) {
                    $(".r-number-tip").html("不能小于8位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (t_reg_number.length > 15) {
                    $(".r-number-tip").html("不能大于15位");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                } else if (/^[0-9]+$/.test(t_reg_number)) {
                    if (t_reg_password.length < 6) {
                        $(".r-password-tip").html("不能小于6位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else if (t_reg_password.length > 15) {
                        $(".r-password-tip").html("不能大于15位");
                        $("input[name='register-password']").change(function () {
                            $(".r-password-tip").html("")
                        });
                    } else {
                        if ($("input[name='code-tip']").val() != "") {
                            if ($("input[name='register-password']").val() != $("input[name='register-password-2']").val()) {
                                $(".r-password-tip-2").html("两次输入的密码不一致");
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
                                        "t_reg_password": t_reg_password, "t_r_selection_id": t_r_selection_id,
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
                                                $(".r-number-tip").html("学号已存在<a id='reset' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>不是本人？请联系管理员</a>");

                                                $("input[name='register-number']").change(function () {
                                                    $(".r-number-tip").html("")
                                                });
                                            } else if (data["status"] == "stop") {
                                                $(".r-name-tip").html("服务器出错，请重新提交");
                                                $("input[name='register-name']").change(function () {
                                                    $(".r-name-tip").html("")
                                                });
                                            }
                                        } else if (data["code"] == "error") {
                                            $(".code-tip").html("注册码不正确");
                                            $("input[name='code-tip']").change(function () {
                                                $(".code-tip").html("")
                                            })
                                        }
                                    }
                                });
                            }

                        } else {
                            $(".code-tip").html("注册码不能为空");
                            $("input[name='code-tip']").change(function () {
                                $(".code-tip").html("")
                            })
                        }

                    }
                } else {
                    $(".r-number-tip").html("必须全为数字");
                    $("input[name='register-number']").change(function () {
                        $(".r-number-tip").html("")
                    });
                }
            } else {
                $(".r-password-tip-2").html("请选择你的身份"); //两个身份都未选择时提示
                $(".r-st").change(function () {
                    $(".r-password-tip-2").html("");
                })
            }
        }

        //如果注册信息有一个为空执行else
        else {
            //判断哪一个为空
            if ($("input[name='register-name']").val() == "") {
                $(".r-name-tip").html("姓名不能为空")
            }
            if ($("input[name='register-number']").val() == "") {
                $(".r-number-tip").html("学号不能为空")
            }
            if ($("input[name='register-password']").val() == "") {
                $(".r-password-tip").html("密码不能为空")
            }
            if ($("input[name='register-password-2']").val() == "") {
                $(".r-password-tip-2").html("此处不能为空")
            }

            $("input[name='register-name']").change(function () {
                if ($(this).val() == "") {
                    $(".r-name-tip").html("姓名不能为空")
                } else {
                    $(".r-name-tip").html("")
                }
            });
            $("input[name='register-number']").change(function () {
                if ($(this).val() == "") {
                    $(".r-number-tip").html("学号不能为空")
                } else {
                    $(".r-number-tip").html("")
                }
            });
            $("input[name='register-password']").change(function () {
                if ($(this).val() == "") {
                    $(".r-password-tip").html("密码不能为空")
                } else {
                    $(".r-password-tip").html("")
                }
            });
            $("input[name='register-password-2']").change(function () {
                if ($(this).val() == "") {
                    $(".r-password-tip-2").html("此处不能为空")
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
        }
        else {
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
                var s_l_selection_id = $(".l-st:checked").val();
                $.ajax({
                    url: "/mine/studentlogin/",
                    type: "post",
                    data: {
                        "s_log_number": s_log_number,
                        "s_log_password": s_log_password,
                        "s_l_selection_id": s_l_selection_id,
                        "csrfmiddlewaretoken": $("input[name='csrfmiddlewaretoken']").val(),
                    },
                    success: function (data) {
                        if (data["status"] == "log_ok") {
                            $(".tips2").html("<div>登录成功！</div><br><div><span id='l_mes'>1</span>秒后自动跳转...</div>");
                            $(".tips2").css({"text-align": "center", "font-size": "20px"});

                            var tt = 1;

                            function b() {
                                if (tt == 1) {
                                    $("#allvideo").removeAttr("hidden");
                                    window.location.reload() //注册成功后定时刷新网页
                                } else {
                                    tt--;
                                    $("#l_mes").html(tt);
                                }
                            }

                            setInterval(b, 1000);
                        } else if (data["status"] == "log_error") {
                            $(".l-password-tip").html("密码错误<a hidden data-toggle='modal' id='forget' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>忘记密码请联系管理员</a>");

                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_stop") {
                            $(".l-password-tip").html("服务器出错，请重新登录");
                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_empty") {
                            $(".l-number-tip").html("学号不存在，请先注册");
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
                var t_l_selection_id = $(".l-st:checked").val();
                $.ajax({
                    url: "/mine/teacherlogin/",
                    type: "post",
                    data: {
                        "t_log_number": t_log_number,
                        "t_log_password": t_log_password,
                        "t_l_selection_id": t_l_selection_id,
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
                            $(".l-password-tip").html("密码错误<a data-toggle='modal' id='forget' href='javascript:void(0)' style='display: block;text-decoration: none;text-align: right;margin-top: -20px;'>忘记密码请联系管理员</a>");

                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_stop") {
                            $(".l-password-tip").html("服务器出错，请重新登录");
                            $("input[name='login-password']").change(function () {
                                $(".l-password-tip").html("")
                            })
                        } else if (data["status"] == "log_empty") {
                            $(".l-number-tip").html("学号不存在，请先注册");
                            $("input[name='login-number']").change(function () {
                                $(".l-number-tip").html("")
                            })
                        }
                    }
                });
            } else {
                $(".l-password-tip").html("请选择你的身份"); //两个身份都未选择时提示
                $(".tt").change(function () {
                    $(".l-password-tip").html("");
                })
            }
        }
        //如果登录信息有一个为空执行else
        else {
            //判断哪一个为空
            if ($("input[name='login-number']").val() == "") {
                $(".l-number-tip").html("学号不能为空")
            }
            if ($("input[name='login-password']").val() == "") {
                $(".l-password-tip").html("密码不能为空")
            }

            $("input[name='login-number']").change(function () {
                if ($(this).val() == "") {
                    $(".l-number-tip").html("学号不能为空")
                } else {
                    $(".l-number-tip").html("")
                }
            });
            $("input[name='login-password']").change(function () {
                if ($(this).val() == "") {
                    $(".l-password-tip").html("密码不能为空")
                } else {
                    $(".l-password-tip").html("")
                }
            })
        }
    })
});