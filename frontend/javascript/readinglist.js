/*Att läsa-listan */
let userReadingDiv = document.querySelector(".user-reading-div");
let userReadingList = document.querySelector("#reading-ul");
let deleteBtn;

/*Skriver ut användarens böcker i en lista*/
let renderReadingList = async () => {
    if (sessionStorage.getItem("token")) {
        let response = await axios.get(
            "http://localhost:1337/api/users/me?populate=deep,3",
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );

        let books = response.data.books;

        books.forEach(book => {
            let li = document.createElement("li");
            li.innerHTML = `<img src="http://localhost:1337${book.cover.url}" alt="" height="200"><br>${book.title} <br> ${book.author}`

            let deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = `Ta bort från läslista`;

            li.append(deleteBtn);
            userReadingList.append(li);
            userReadingDiv.append(userReadingList);

            deleteBtn.addEventListener("click", () => {
                deleteBook(book)
            });

        });
    };
};

renderReadingList();



let deleteBook = async (book) => {
    await axios.put(`http://localhost:1337/api/books/${book.id}/?populate=*`, {
        data: {
            "users": {
                "disconnect": [sessionStorage.getItem("loginId")],
            }
        },
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });

    userReadingList.innerText = "";
    renderReadingList();
}