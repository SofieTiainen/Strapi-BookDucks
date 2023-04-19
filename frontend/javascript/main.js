let allBooksDiv = document.querySelector(".all-books-div");

let getAllBooksRating = async () => {
    let response = await axios.get("http://localhost:1337/api/books?populate=deep,3");
    let books = response.data.data;
    books.forEach(book => {
        rating = book.attributes.userrating;
        let bookRating = [];
        rating.forEach(rating => {
            bookRating.push(rating.UserRating)
        })

        let sum = bookRating.reduce((total, rating) => total + rating, 0);
        let avrageRating = sum / bookRating.length;
        let roundedAvrage = Math.round(avrageRating);

        putAllBooksRating(book, roundedAvrage);

    })
}

getAllBooksRating();

let putAllBooksRating = async (book, roundedAvrage) => {
    await axios.put(`http://localhost:1337/api/books/${book?.id}/`, {
        data: {
            rating: roundedAvrage,
        },
    });
}


let getAllBooks = async () => {
    let response = await axios.get("http://localhost:1337/api/books?populate=*");
    let books = response.data.data;
    renderAllBooks(books);
}

getAllBooks();


let renderAllBooks = async (array) => {
    array.forEach(book => {
        let { title, author, rating } = book.attributes;

        let div = document.createElement("div");
        div.classList.add("book-div");

        let link = document.createElement("a");
        link.href = `chosenbook.html?id=${book.id}`;
        link.innerHTML = `<img src="http://localhost:1337${book.attributes.cover?.data?.attributes?.url}" height="300" alt=""><br><strong>${title}</strong><br> ${author}`



        let ratingBox = document.createElement("div");
        ratingBox.classList.add("rating-box");
        if (rating === null) {
            ratingBox.innerHTML = `Inget betyg än`
        } else {
            ratingBox.innerHTML = `Betyg ${rating}/10`
        }



        let starDiv = document.createElement("div");
        starDiv.classList.add("stars");

        for (let i = 0; i < 10; i++) {
            let star = document.createElement("i");
            star.classList.add("fa-solid", "fa-star");
            star.setAttribute("value", i + 1);
            if (i < rating) {
                star.classList.add("rated");
            }
            starDiv.appendChild(star);
        }

        ratingBox.prepend(starDiv);
        div.prepend(link);
        div.append(ratingBox);
        allBooksDiv.append(div);

        if (sessionStorage.getItem("token")) {
            let addBtn = document.createElement("input");
            addBtn.type = "checkbox";
            addBtn.classList.add("addToList");
            addBtn.id = "addToListCheckbox";

            let addBtnLabel = document.createElement("label");
            addBtnLabel.htmlFor = "addToListCheckbox";
            addBtnLabel.innerText = `Lägg till i läslista`;

            let btnDiv = document.createElement("div");
            starDiv.append(btnDiv)

            addBtn.addEventListener("click", () => {
                addBook(book)
                setTimeout(() => {
                    addBtnLabel.innerText = `Tillagd i din Att läsa lista`;
                }, 1000);
            })

            let stars = div.querySelectorAll(".stars i");
            inloggedRating(book, stars, btnDiv);

            addBtnLabel.append(addBtn)
            div.append(addBtnLabel)
        }
    });
}


let inloggedRating = (book, stars, element) => {
    stars.forEach((star, index1) => {
        star.addEventListener("click", () => {
            element.innerHTML = "";
            let rateBtn = document.createElement("button");
            rateBtn.innerText = "Skicka in betyg"
            element.append(rateBtn)

            rateBtn.addEventListener("click", () => {
                rateBook(book, star.getAttribute("value"))
                allBooksDiv.innerHTML = "";
            })

            stars.forEach(function (star, index2) {
                if (index1 >= index2) {
                    star.classList.add("active");
                } else {
                    star.classList.remove("active");
                }
            });
        });
    });
}

let rateBook = async (book, rate) => {

    let response = await axios.get(`http://localhost:1337/api/books/${book.id}/?populate=deep,3`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });

    let bookData = response.data.data;

    let existingRating = "";
    bookData.attributes.userrating.forEach((rating) => {
        if (rating.users_permissions_user.data.id.toString() === sessionStorage.getItem("loginId")) {
            existingRating = rating;
        }
    });

    if (existingRating) {
        let ratingId = existingRating.id;

        await axios.put(
            `http://localhost:1337/api/books/${book.id}/?populate=deep,3`,
            {
                data: {
                    "userrating": [
                        ...book.attributes.userrating,
                        {
                            id: ratingId,
                            "UserRating": rate,
                            "users_permissions_user": {
                                id: sessionStorage.getItem("loginId"),
                            },
                            "book": book,
                        },
                    ],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }

        );
        getAllBooks();
        return ratingId;

    } else {
        await axios.put(
            `http://localhost:1337/api/books/${book.id}/?populate=deep,3`,
            {
                data: {
                    "userrating": [
                        ...book.attributes.userrating,
                        {
                            "UserRating": rate,
                            "users_permissions_user": {
                                id: sessionStorage.getItem("loginId"),
                            },
                            "book": book,
                        },
                    ],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }
        );
        getAllBooks();


    }


};


let addBook = async (book) => {
    try {
        let response = await axios.put(`http://localhost:1337/api/books/${book.id}/?populate=*`, {
            data: {
                "users": {
                    "connect": [sessionStorage.getItem("loginId"), ...book.attributes.users.data],
                }
            },
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        console.log("Responsen från addBook: ", response)
    } catch (error) {
        console.log("Error: ", error)
    }
}