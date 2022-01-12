const APIKEY = "DCEmPiFAakpWWrNly0x6lKpxYBaW5zXVO7ryD5Qe";

class Mission{
    constructor(rover) {
        this.name = rover.name;
        this.landingDate = rover.landing_date;
        this.maxDate = rover.max_date;
        this.maxSol = rover.max_sol;
        this.cameras = []
        for (let cam of rover.cameras) {
            this.cameras.push(new Camera(cam));
        }
    }

    getName(){return this.name;}
    getLandingDate(){return this.landingDate;}
    getMaxDate(){return this.maxDate;}
    getMaxSol(){return this.maxSol;}
    getCameras(){return this.cameras;}
}

class Camera{
    constructor(camera) {
        this.name = camera.name;
        this.id = camera.id;
    }
    getCameraName(){return this.name;}
}


let ValidationModule = ()=> {

    /**
     * Function that checks all the necessary validation for user inputs.
     * @param missions - All missions of the current rover
     * @param date - date of current rover
     * @param rover - current rover
     * @param camera - current camera
     * @returns {{valid: boolean, dateKind: string}}
     * indicates if user input is validate and give the kind of the date
     */
    function validate(missions, date, rover, camera){
        let status = {
            valid: true,
            dateKind: ""
        }
        let values = [date, rover, camera];
        let validators = [validateUserDateInput, validateUserMissionInput, validateUserCameraInput];

        //Initialize all the error message of each field of the form.
        for(let value of [date, rover, camera]) {
            if (value.classList.contains("is-invalid")) {
                value.classList.remove("is-invalid");
                value.parentElement.lastChild.remove();
            }
        }

        let currentMission = missions.find(missionToCheck=>missionToCheck.getName() === rover.value);

        //Checks validation for each field of the form.
        for(let i = 0; i < values.length; ++i){
            let validatorRes = validators[i](currentMission, values[i].value);
            //Extracts the date kind.
            if(i === 0)
                status.dateKind = validatorRes.dateKind;

            if(!validatorRes.valid){
                values[i].classList.add("is-invalid");
                values[i].parentElement.innerHTML += errorProvider(validatorRes.massage);
                status.valid = false;
            }
        }

        return status;
    }

    /**
     * @param massage - message with error to user
     * @returns {string}
     */
    function errorProvider(massage){
        return `
        <div class="text-danger">${massage}</div>`;
    }


    /**
     * The function get the requested mission and the requested date and check if the date is a valid date
     * and checks if the requested date is valid for the requested rover.
     * @param mission - mission that choose by the user
     * @param date - date that choose by the user
     * @returns {{valid: boolean, dateKind: string, massage: string}}
     */
    function validateUserDateInput(mission, date){
        date = date.trim();
        let status = {
            valid: true,
            massage: "",
            dateKind: ""
        }
        let validEarthDateRegex = new RegExp(
            /^(\d{1,4})-(((12|10|0?([13578]))-([1-2][0-9]|3[0-1]|0?[1-9]))|((0?([469]|11))-([1-2][0-9]|30|0?[1-9]))|(0?2-([1-2][0-9]|0?[1-9])))$/);

        let validateSol = new RegExp(/^\d+$/);

        if(date === ""){
            status.valid = false;
            status.massage = "Input Required";
        }
        else if(validEarthDateRegex.test(date)){
            status.dateKind = "earth_date";
            //Checking if user chose a rover
            if(mission === undefined)
                return status;


            //Checks if the requested date is valid for the requested rover.
            let res = validateEarthDate(mission, date);

            if(res === "valid")
                return status;

            (res === "under") ?
                status.massage = `The mission you've selected requires a date after ${mission.getLandingDate()}`:
                status.massage = `The mission you've selected requires a date before ${mission.getMaxDate()}`;

            status.valid = false;
            return status;
        }
        else if(validateSol.test(date)){
            status.dateKind = "sol";
            if(mission === undefined)
                return status;
            if(0 <= parseInt(date, 10) && parseInt(date, 10) <= parseInt(mission.getMaxSol(), 10))
                return status;

            (parseInt(date,10) > 0) ?
                status.massage = `The mission you've selected requires a sol date before ${mission.getMaxSol()}`:
                status.massage = `The mission you've selected requires a sol date after 0`;

            status.valid = false;
        }
        else {
            status.valid = false;
            status.massage = "Please enter a SOL number or a valid earth date";
        }
        return status;
    }

    /**
     * Function that checks validation for the requested rover.
     * @param mission - current mission
     * @param roverName - current rover name
     * @returns {{valid: boolean, massage: string}}
     */
    function validateUserMissionInput(mission, roverName){

        let status = {
            valid: true,
            massage: ""
        }

        if(roverName === "Choose Rover"){
            status.valid = false;
            status.massage = "Please choose a rover";
        }

        return status;
    }

    /**
     * Function that checks validation for the requested camera.
     * @param mission - mission that choose by the user
     * @param camera - camera that choose by the user
     * @returns {{valid: boolean, massage: string}}
     */
    function validateUserCameraInput(mission, camera){
        let status = {
            valid: true,
            massage: ""
        }

        if(camera === "Choose Camera"){
            status.valid = false;
            status.massage = "Please choose a Camera";
            return status;
        }
        //Checking if user chose a rover
        if(mission === undefined)
            return status;


        for(let missionCamera of mission.getCameras()) {
            if (camera === missionCamera.getCameraName())
                return status;
        }
        status.valid = false;
        status.massage = `Camera ${camera} is not part of the rover ${mission.getName()}`;
        return status;
    }

    /**
     * Function that checks validation for date of kind earth date.
     * @param mission - mission that choose by the user
     * @param date - date that choose by the user
     * @returns {string|string}
     */
    function validateEarthDate(mission, date){
        //Split the input date, max date and landing date to year, month and day and casting to integers.
        let parseToInt = item => parseInt(item, 10);
        let splitInput = date.split('-').map(parseToInt);
        let splitLandingDate = mission.getLandingDate().split('-').map(parseToInt);
        let splitMaxDate = mission.getMaxDate().split('-').map(parseToInt);

        //For each part of the date.
        for(let i = 0; i < splitInput.length; ++i) {
            //Check if the date is in the range of the requested rover.
            if (splitLandingDate[i] <= splitInput[i] && splitInput[i] <= splitMaxDate[i]) {
                //If the date is equal in the current part, continue to the next part.
                if (splitLandingDate[i] === splitInput[i] || splitInput[i] === splitMaxDate[i])
                    continue;
                break;
            }
            return (splitLandingDate[i] - splitInput[i] > 0) ? "under":"above";
        }

        return "valid";
    }

    return {
        validate: validate
    };
}

//Main module.
(function () {

    let missions = [];
    let saveImagesID = new Set();

    //Sent first Get request to NASA server to get the available missions and cameras.
    /**
     * @param res          Information about the object.
     * @param res.rovers   Information about the object's members.
     */
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${APIKEY}`)
        .then(status)
        .then(json)
        .then(res =>{
            let RoverSelect = document.getElementById("Rover");
            let CameraSelect = document.getElementById("Camera");

            //Adds all possible rovers to the form.
            for(let i = 0; i < res.rovers.length - 1; ++i){
                missions.push(new Mission(res.rovers[i]));
                RoverSelect.innerHTML += `<option>${res.rovers[i].name} </option>`;
            }

            //Build a Set with all available cameras.
            let CameraSet = new Set();
            missions.forEach((mission)=>{
                mission.cameras.forEach((camera)=> {
                    CameraSet.add(camera.getCameraName())
                });
            });

            //Adds all possible cameras to the form.
            for(let camera of CameraSet) {
                CameraSelect.innerHTML += `<option>${camera}</option>`;
            }
        })
        .catch(err => {
            document.querySelector("body").innerHTML = `<h1 class="text-center">404<br> Page Not Found</h1>`;
            alert("The connection with the NASA server has been lost, please check your network connection or try again later");
        })

    fetch('/api/getImages')
        .then(status)
        .then(json)
        .then(res => {
            res.images.forEach(image => {
                image.id = image.imageID;
                image.camera = {name: image.camera};
                addImageToFavorite(image);
            })
            document.getElementById('LoadingBuffer').classList.add('d-none')

        })
        .catch(err => {
            document.querySelector("body").innerHTML = `<h1 class="text-center">404<br> Page Not Found</h1>`;
            alert("The connection with the NASA server has been lost, please check your network connection or try again later");
        })


    /**
     * @param res.photos   Information about the object's members.
     * @param event
     */

    //Function that handles search request of the user.
    function onSubmit(event){
        event.preventDefault();


        //Gets the relevant search fields.
        let date = document.getElementById("Date");
        let rover = document.getElementById("Rover");
        let camera = document.getElementById("Camera");

        //Checks validation of all the search fields.
        let validatorRes = ValidationModule().validate(missions, date, rover, camera);

        if(!validatorRes.valid) {
            return;
        }

        //Sends GET request to NASA's server for getting all the photo for the requested search values.
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.value}/photos?${validatorRes.dateKind}=${date.value}&camera=${camera.value}&api_key=${APIKEY}`
        document.getElementById("Results").innerHTML = "<div class='col-4 text-center'><img alt='loading buffer' class='float d-block w-100' src='images/loading-buffering.gif'></div>";
        fetch(url)
            .then(status)
            .then(json)
            .then(res =>{
                let Results = document.getElementById("Results");
                Results.innerHTML = ""

                //Indicates no images found.
                if(res.photos.length === 0){
                    Results.innerHTML = `
                    <div class="alert alert-warning" role="alert">
                      No images found!
                    </div>`
                }

                //Build NasaImageComponent for each image was found in NASA's server.
                res.photos.forEach(pic=>{
                    Results.appendChild(NasaImageComponent(pic));
                })
            })
            .catch(err => {
                alert("The connection with the NASA's server has been lost, please check your network connection or try again later")
                document.getElementById("Results").innerHTML = "";
            })
    }

    //Checks response status code.
    function status(res) {
        console.log(res.status);
        if (res.status >= 200 && res.status <= 300) {
            return Promise.resolve(res);
        } else
            return  Promise.reject("Error");
    }

    //Casting the promise to json.
    function json(res){
        return res.json();
    }

    //Build component of image that include the image and it details and two button, one for saving in favorites
    //and another for open image in full size.
    function NasaImageComponent(pic){
        let imageContainer = document.createElement("div");
        imageContainer.setAttribute("class", "border mt-3 col-md-4");

        imageContainer.innerHTML = `
                <img alt="${pic.rover.name} image of camera ${pic.camera.name}" class="w-100" src="${pic.img_src}">
                <h5>
                    Earth date: ${pic.earth_date} <br>
                    Sol: ${pic.sol} <br class="p-1">
                    Camera: ${pic.camera.name} <br>
                    Mission: ${pic.rover.name} <br>
                </h5>
                `

        //Full size button.
        imageContainer.innerHTML +=`
            <a id="full_size" class="text-decoration-none link-light btn-secondary btn-lg rounded m-1"
               href='${pic.img_src}' target="_blank">Full size</a>`

        //Build a save button for saving the image in the favorites list.
        let SaveButton = document.createElement("button");
        SaveButton.setAttribute("type", "button");
        SaveButton.setAttribute("class", "btn-primary btn-lg rounded m-1");
        SaveButton.innerText = "Save";

        SaveButton.addEventListener("click", (event) => {
            saveImage(event, pic)
        })
        imageContainer.appendChild(SaveButton);

        return imageContainer;
    }

    //Saved the request image, and it details in the favorites list and add the image to the carousel.
    function saveImage(event, pic) {
        let params = {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageID: pic.id,
                img_src: pic.img_src,
                sol: pic.sol,
                earth_date: pic.earth_date,
                camera: pic.camera.name
            })
        }

        fetch("api/save", params)
            .then(status)
            .then(json)
            .then(res =>{
                if(res.code){
                    addImageToFavorite(pic)
                }
                else{
                    let alreadySavedModal = new bootstrap.Modal(document.getElementById("savedImageModal"));
                    alreadySavedModal.show()
                }
            })
            .catch(err => {console.log(err)})
    }

    function addImageToFavorite(pic){
        saveImagesID.add(pic.id);
        let imageList = document.getElementById("FavoritesList");
        let line = document.createElement("li");
        line.setAttribute("id", `${pic.id}`);

        let link = document.createElement("a")
        link.setAttribute("href",`${pic.img_src}`);
        link.setAttribute("target","_blank");
        link.innerText = `Image ID: ${pic.id}`
        line.appendChild(link);

        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("class", "bg-danger rounded");

        deleteButton.innerText = `X`;

        deleteButton.addEventListener("click", function listener(event){
            document.getElementById("hiddenID").value = `${pic.id}`;
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#DeleteModal");
            deleteButton.removeEventListener("click", listener);
            deleteButton.click();
        })

        line.appendChild(deleteButton);

        let details = document.createElement("p");
        details.innerText = `Earth date: ${pic.earth_date}, Sol: ${pic.sol}, Camera: ${pic.camera.name}`
        line.appendChild(details);

        imageList.appendChild(line)
        addToCarousel(pic);
    }

    //Function that add image to the carousel.
    function addToCarousel(pic){
        let carousel = document.getElementById("Carousel");

        //Build a carousel item for the requested image.
        carousel.innerHTML += `
                    <div class="carousel-item">
                        <img src="${pic.img_src}" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-md-block">
                            <h5>${pic.camera.name}</h5>
                            <p>Earth date: ${pic.earth_date}</p>
                            <a id="full_size" class="text-decoration-none link-light btn-primary btn-lg rounded m-1" href='${pic.img_src}' target="_blank">Full size</a>
                        </div>
                    </div>`

        if(carousel.children.length === 1)
            carousel.firstElementChild.classList.add("active");
    }

    function deleteImage(event){
        const imageID = document.getElementById("hiddenID").value;
        fetch(`api/delete/${imageID}`, {method: "DELETE"})
            .then(status)
            .then(json)
            .then(res=>{
                if(res){
                    const imageBlock = document.getElementById(imageID);
                    imageBlock.parentElement.removeChild(imageBlock);
                }
            })
            .catch(err=>{
                document.querySelector("body").innerHTML = `<h1 class="text-center">404<br> Page Not Found</h1>`;
                alert("The connection with the NASA server has been lost, please check your network connection or try again later");
            })
    }

    function resetList(){
        fetch('api/reset',{method:'DELETE'})
            .then(status)
            .then(json)
            .then(res=>{
                if(res.code){
                    document.getElementById("FavoritesList").innerHTML = "";
                    saveImagesID.clear();
                    alert("Favorite list has been reset")
                }
                else{
                    alert("Favorite list is already clear")
                }
            })
            .catch(err => {
                document.querySelector("body").innerHTML = `<h1 class="text-center">404<br> Page Not Found</h1>`;
                alert("The connection with the NASA server has been lost, please check your network connection or try again later");
            })
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById("SearchForm").addEventListener("submit",onSubmit);
        document.getElementById("SearchForm").addEventListener("reset",()=>{
            let date = document.getElementById("Date");
            let rover = document.getElementById("Rover");
            let camera = document.getElementById("Camera");

            //Initialize all the error message of each field of the form.
            for(let value of [date,rover,camera]) {
                if (value.classList.contains("is-invalid")) {
                    value.classList.remove("is-invalid");
                    value.parentElement.lastChild.remove();
                }
            }
            document.getElementById("Results").innerHTML = "";
            document.getElementById("SearchForm").reset();
        });
        document.getElementById("StartSlide").addEventListener("click", ()=>{
            if(saveImagesID.size > 0) {
                document.getElementById("CarouselContainer").classList.remove("d-none");
            }
        });
        document.getElementById("StopSlide").addEventListener("click", ()=>{
            document.getElementById("CarouselContainer").classList.add("d-none");
        });
        document.getElementById("ResetList").addEventListener("click", resetList);
        document.getElementById("Delete").addEventListener("click", deleteImage);
    });
})()