let chosenBookDiv = document.querySelector(".chosen-book-div")

/*Söker upp bokens ID från URL:en */
let urlParams = new URLSearchParams(window.location.search);
let bookId = urlParams.get("id");

/*Hämtar info om vald bok när man klickar på länken*/
let getOneBook = async (id) => {
    let response = await axios.get(`http://localhost:1337/api/books/${id}?populate=*`);
    let book = response.data.data;
    renderBook(book)
}

getOneBook(bookId)


/*Skriver ut boken*/
let renderBook = async (book) => {
    let div = document.createElement("div");
    console.log(book.attributes)
    let { title, author, pages, releasedate, cover, rating } = book.attributes;

    div.innerHTML = `${title} <br> Av: ${author} <br> <img src="http://localhost:1337${cover.data.attributes.url}" height="500" alt=""><br>Antal sidor: ${pages} <br> Utgivningsdatum: ${releasedate} <br> Genomsnittligt betyg: ${rating}/10 <br>`
    chosenBookDiv.append(div);

    if (sessionStorage.getItem("token")) {
        let addBtn = document.createElement("button");
        addBtn.classList.add("addToList");

        addBtn.innerText = "Lägg till i läslista"
        addBtn.addEventListener("click", () => {
            addfunction(book)
        })

        div.append(addBtn)
    }
}

let addfunction = (book) => {
    console.log("Vald bok att lägga i läslistan", book)
}

