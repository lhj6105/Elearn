$(function () {
    $(".courseware-name a").click(function () {
        var courseware_id=$(this).children("input[name='courseware-id']").val();
        $.ajax({
            url:"/courseware/download_nums/",
            type:"post",
            data:{
                "courseware-id": courseware_id,
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