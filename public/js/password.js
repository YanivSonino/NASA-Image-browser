(function (){
    document.addEventListener('DOMContentLoaded',function() {
        document.getElementById("SubmitPassword").addEventListener("submit", onSubmit)
    })

    function onSubmit(e)
    {
        e.preventDefault();
        fetch("/password",{method: 'POST'})
            .then(res=>console.log(res));
    }

})()