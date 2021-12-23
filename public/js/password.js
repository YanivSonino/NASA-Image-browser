(()=>{
    document.addEventListener('DOMContentLoaded', function (){
        document.getElementById('form').addEventListener('submit', (event) =>{
            event.preventDefault()


            let password = document.getElementById('Password');
            let confirmPassword = document.getElementById('ConfirmPassword');

            //Initialize password error.
            confirmPassword.classList.remove('is-invalid');

            //Checks that the password and the confirm password are equals validation.
            if(password.value !== confirmPassword.value){
                confirmPassword.classList.add('is-invalid');
                return;
            }

            fetch(`/api/email/${document.getElementById('Email').value}`)
                .then(status)
                .then(json)
                .then(res => {
                    // Checks if the email is already caught.
                    if(res.code === false){
                        alert("Something went wrong");
                        window.location.href = res.url;
                        return;
                    }
                    event.target.submit();
                })
                .catch(err => {
                    alert("The connection with server has been lost, please check your network connection or try again later");
                })
        })
    })

    //Checks response status code.
    function status(res) {
        if (res.status >= 200 && res.status <= 300) {
            return Promise.resolve(res);
        } else
            return  Promise.reject("Error");
    }

    //Casting the promise to json.
    function json(res){
        return res.json();
    }
})()

