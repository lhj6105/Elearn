$(function () {
    $(".courseware-name a").click(function () {
        $.ajax({
            url:"/courseware/download_nums/",
            type:"post",
            data:{
                "cid": $("input[name='courseware-id']").val(),
                "csrfmiddlewaretoken":$("input[name='csrfmiddlewaretoken']").val(),
            },
            success:function (data) {
                if(data["status"] === true){
                   console.log("下载成功!")
                }
                else{
                    console.log("下载失败!")
                }
            }
        })
    })
});