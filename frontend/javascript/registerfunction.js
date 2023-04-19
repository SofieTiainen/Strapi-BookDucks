let regUserName = document.querySelector("#registerUsername");
let regEmail = document.querySelector("#registerEmail");
let regPassWord = document.querySelector("#registerPassword");
let regBtn = document.querySelector("#registerBtn");
let h3 = document.querySelector("#h3");

let register = async () => {
    h3.innerText = "";
    try {
        await axios.post("http://localhost:1337/api/auth/local/register", {
            username: regUserName.value,
            email: regEmail.value,
            password: regPassWord.value,
        });
        h3.innerHTML = `Konto skapats, vänligen logga in`
        regUserName.value = "";
        regEmail.value = "";
        regPassWord.value = "";

    } catch (error) {
        let errors = error.response.data.error.details.errors;
        errors.forEach(error => {
            h3.innerHTML += `${error.message} <br>`
        });
    }
};

regBtn.addEventListener("click", register);