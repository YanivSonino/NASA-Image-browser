(()=>{
    document.addEventListener('DOMContentLoaded', function (){
        document.getElementById('form').addEventListener('submit', (event) =>{
            event.preventDefault();

            let email = document.getElementById('Email');
            email.classList.remove('is-invalid');

            fetch(`/api/email/${email.value}`)
                .then(status)
                .then(json)
                .then(res => {
                    // Checks if the email is already caught.
                    if(res.code === false){
                        email.classList.add('is-invalid');
                        return;
                    }
                    event.target.submit();
                })
                .catch(err => {
                    alert("The connection with server has been lost, please check your network connection or try again later")
                })
        })
        document.getElementById('form').addEventListener('reset', (event) =>{
            let name = document.getElementById("FirstName");
            let lastName = document.getElementById("LastName");
            let Email = document.getElementById("Email");

            for(let value of [name,lastName,Email]){
                if (value.classList.contains("is-invalid")) {
                    value.classList.remove("is-invalid");
                }
            }
            document.getElementById('form').reset();
        })
    })


    /**
     * Checks response status code.
     * @param res
     * @returns {Promise<never>|Promise<unknown>}
     */
    function status(res) {
        if (res.status >= 200 && res.status <= 300) {
            return Promise.resolve(res);
        } else
            return  Promise.reject("Error");
    }

    /**
     * Casting the promise to json.
     * @param res
     * @returns {*}
     */
    function json(res){
        return res.json();
    }
})()

