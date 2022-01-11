(function (){
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById("Register").addEventListener("click",(e)=>{
            //When the user click on the register button moves to the register form.
            fetch("/register").then((res)=>{
                window.location.href = res.url;
            })
        })
    });
})()
