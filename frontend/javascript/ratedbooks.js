/*Olika vyer av profilsidan om utloggad/inloggad*/
if (sessionStorage.getItem("token")) {
    document.querySelector(".user-view-profile-side").style.display = "block";
    document.querySelector(".public-view-profile-side").style.display = "none";
} else {
    document.querySelector(".user-view-profile-side").style.display = "none";
    document.querySelector(".public-view-profile-side").style.display = "block";
}

/*Betygsatta böcker-div och ul*/
let userRatedBooks = document.querySelector(".user-rated-books-div");
let userRatedUl = document.querySelector(".rating-ul");

/*Knappar för att växla mellan Att-Läsa lista eller betygsatta böcker */
let readingListBtn = document.querySelector("#reading-list-btn");
let ratedBooksBtn = document.querySelector("#rated-books-btn");

readingListBtn.addEventListener("click", () => {
    document.querySelector(".user-reading-div").style.display = "block";
    userRatedBooks.style.display = "none";
})

ratedBooksBtn.addEventListener("click", () => {
    document.querySelector(".user-reading-div").style.display = "none";
    userRatedBooks.style.display = "block";
})


/*Hämtar alla ratings för varje bok*/
let getAllRates = async () => {
    let response = await axios.get("http://localhost:1337/api/books?populate=deep,3");
    let books = response.data.data;
    console.log("Från getAllRates: ", books)
    getAllRatesForUser(books);
}

getAllRates();


let userBooks = [];

/*För varje bok, hämtar vi ett id för varje rating som gjorts. Om ratingens id kommer från den inloggade användaren, pushar vi den boken och betyget till arrayen userBooks*/
let getAllRatesForUser = async (array) => {
    array.forEach(book => {
        let userratings = book.attributes.userrating;
        userratings.forEach(rating => {
            let id = rating.users_permissions_user.data?.id?.toString();

            if (id == sessionStorage.getItem("loginId")) {

                userBooks.push({
                    book: book,
                    userrating: rating.UserRating
                });

                let li = document.createElement("li");
                li.innerHTML += `${book.attributes.title}. Författare: ${book.attributes.author} Ditt betyg: ${rating.UserRating}/10 `;

                userRatedUl.append(li);
                userRatedBooks.append(userRatedUl);

            }
        })
    });

    let sortRatedBooksSelect = document.querySelector("#sortBooks");

    sortRatedBooksSelect.addEventListener("change", () => {
        userRatedUl.innerHTML = ``;
        let value = sortRatedBooksSelect.value;
        let sortedBooks = [...userBooks];

        if (value === "title_A_Ö") {
            sortedBooks.sort((a, b) => {
                return a.book.attributes.title.localeCompare(b.book.attributes.title);
            });

            renderRatedBooks(sortedBooks);

        } else if (value === "title_Ö_A") {
            sortedBooks.sort((a, b) => {
                return b.book.attributes.title.localeCompare(a.book.attributes.title);
            });
            renderRatedBooks(sortedBooks);

        } else if (value === "author_A_Ö") {
            sortedBooks.sort((a, b) => {
                return a.book.attributes.author.localeCompare(b.book.attributes.author);
            });
            renderRatedBooks(sortedBooks);

        } else if (value === "author_Ö_A") {
            sortedBooks.sort((a, b) => {
                return b.book.attributes.author.localeCompare(a.book.attributes.author);
            });
            renderRatedBooks(sortedBooks);

        } else if (value === "rate_high_low") {
            sortedBooks.sort((a, b) => {
                return b.userrating - a.userrating;
            });
            renderRatedBooks(sortedBooks);

        } else if (value === "rate_low_high") {
            sortedBooks.sort((a, b) => {
                return a.userrating - b.userrating;
            });
            renderRatedBooks(sortedBooks);
        }
    })
}

let renderRatedBooks = (arrays) => {
    arrays.forEach(book => {
        let li = document.createElement("li");
        li.innerHTML = `${book.book.attributes.title}. Författare: ${book.book.attributes.author}. Ditt betyg: ${book.userrating}`;
        userRatedUl.append(li);
    })
}
