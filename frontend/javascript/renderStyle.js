let applyTheme = async () => {
    let response = await axios.get("http://localhost:1337/api/color-theme");
    let theme = response.data.data.attributes.Colortheme;
    document.querySelector(".body-wrapper").classList.add(theme)
}

applyTheme();