(function (){
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById("Register_btn").addEventListener("click",(e)=>{
            fetch("/register").then((res)=>{
                window.location.href = res.url;
            })
        })
        document.getElementById("SignIn_btn").addEventListener("click",(e)=>{
            fetch("/login").then((res)=>{
                window.location.href = res.url;
            })
        })
    });
})()
