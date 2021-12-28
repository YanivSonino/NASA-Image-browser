const APIKEY = "DCEmPiFAakpWWrNly0x6lKpxYBaW5zXVO7ryD5Qe"

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

    //Function that checks all the necessary validation for user inputs.
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

    function errorProvider(massage){
        return `
        <div class="text-danger">${massage}</div>`;
    }

    //The function get the requested mission and the requested date and check if the date is a valid date
    //and checks if the requested date is valid for the requested rover.
    function validateUserDateInput(mission, date){
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

    //Function that checks validation for the requested rover.
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
    //Function that checks validation for the requested camera.
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
    //Function that checks validation for date of kind earth date.
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
    let saveImages = new Set();

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
            alert("The connection with the NASA server has been lost, please check your network connection or try again later")
            document.querySelector("body").innerHTML = `<h1 class="text-center">404<br> Page Not Found</h1>`;
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
        document.getElementById("Results").innerHTML = "<div class='col-4 text-center'><img class='float d-block w-25' src='images/loading-buffering.gif'></div>";
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
                <img class="w-100" src="${pic.img_src}">
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

        //Checks if the current image is already saved in the favorites list.
        if(saveImages.has(pic.id)) {
            imageContainer.innerHTML += `
            <button type="button" class="btn-primary btn-lg rounded m-1" data-bs-toggle="modal" data-bs-target="#savedImageModal">
                        Save
            </button>`
        }
        else {
            //Build a save button for saving the image in the favorites list.
            let SaveButton = document.createElement("button");
            SaveButton.setAttribute("type", "button");
            SaveButton.setAttribute("class", "btn-primary btn-lg rounded m-1");
            SaveButton.innerText = "Save";
            SaveButton.addEventListener("click", (event) => {
                saveImage(event, pic)
            })
            imageContainer.appendChild(SaveButton);
        }
        return imageContainer;
    }

    //Saved the request image and it details in the favorites list and add the image to the carousel.
    function saveImage(event, pic) {

        saveImages.add(pic.id);

        let imageList = document.getElementById("FavoritesList");

        let line = document.createElement("li");
        line.innerHTML = `
                <a href="${pic.img_src}" target="_blank">Image ID: ${pic.id}</a>
                <p>Earth date: ${pic.earth_date}, Sol: ${pic.sol}, Camera: ${pic.camera.name}</p>`

        imageList.appendChild(line);

        addToCarousel(pic);

        //Change the save button to modal button that indicate about already saved image.
        let parent = event.target.parentElement;
        parent.removeChild(event.target);
        parent.innerHTML += `
            <button type="button" class="btn-primary btn-lg rounded m-1" data-bs-toggle="modal" data-bs-target="#savedImageModal">
                        Save
            </button>`
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

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById("SearchForm").addEventListener("submit",onSubmit);
        document.getElementById("SearchForm").addEventListener("reset",()=>{
            document.getElementById("Results").innerHTML = "";
        });
        document.getElementById("StartSlide").addEventListener("click", ()=>{
            if(saveImages.size > 0) {
                document.getElementById("CarouselContainer").classList.remove("d-none");
            }
        });
        document.getElementById("StopSlide").addEventListener("click", ()=>{
            document.getElementById("CarouselContainer").classList.add("d-none");
        })
    });
})()