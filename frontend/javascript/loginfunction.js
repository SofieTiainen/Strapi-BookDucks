/*Öppna/stänga login-boxen*/
let openLoginBtn = document.querySelector("#open-login-box");
let closeLoginBtn = document.querySelector("#close-login-box");
let loginBox = document.querySelector(".login-open-close-box");

let openLogin = () => {
    loginBox.style.display = "block";
}
let closeLogin = () => {
    loginBox.style.display = "none";
}

openLoginBtn.addEventListener("click", openLogin);
closeLoginBtn.addEventListener("click", closeLogin);

/*Variabler för loginfältet */
let loginBtn = document.querySelector("#loginBtn");
let h2 = document.querySelector("#h2");
let welcomeMsg = document.querySelector("#welcome-username");
let userName = document.querySelector("#loginUsername");
let passWord = document.querySelector("#loginPassword");
let logoutBtn = document.querySelector("#logoutBtn");


let login = async () => {
    try {
        let response = await axios.post("http://localhost:1337/api/auth/local", {
            identifier: userName.value,
            password: passWord.value,
        });

        if (response.statusText === "OK") {
            sessionStorage.setItem("token", response.data.jwt);
            sessionStorage.setItem("loginId", response.data.user.id);
            sessionStorage.setItem("username", response.data.user.username);
            closeLogin();
            renderPage();
            location.reload();
        }

    } catch (error) {
        console.log("Error: ", error)
    }

    renderPage();
};



let renderPage = async () => {
    if (sessionStorage.getItem("token")) {
        welcomeMsg.innerHTML = `${sessionStorage.getItem("username")}`
        h2.style.display = "block";
        openLoginBtn.style.display = "none";
        logoutBtn.style.display = "block";
    } else {
        welcomeMsg.innerHTML = "";
        logoutBtn.style.display = "none";
        openLoginBtn.style.display = "block";
        h2.style.display = "none";
    }
}

let logout = () => {
    sessionStorage.clear();
    renderPage();
    location.reload();
}


renderPage();

loginBtn.addEventListener("click", login)
logoutBtn.addEventListener("click", logout)


