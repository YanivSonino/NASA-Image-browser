


export function initForm(...Values) {
    for(let value of Values){
        if (value.classList.contains("is-invalid")) {
            value.classList.remove("is-invalid");
            value.parentElement.lastChild.remove();
        }
    }
}
