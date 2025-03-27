document.addEventListener("DOMContentLoaded", () => {
    fetch("db.json")
        .then(response => response.json())
        .then(data => {
            displayCars(data.cars, "self-drive", ".selfdrive-cards");
            displayCars(data.cars, "guided", ".guided-cards");
            displayCars(data.cars, "group-travel", ".grouptravel-cards");
        });

    //Fetch Cars
    document.getElementById("add-car-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const newCar = {
            name: document.getElementById("car-name").value,
            model: document.getElementById("car-model").value,
            hire_price_per_day: parseInt(document.getElementById("car-price").value),
            category: document.getElementById("car-category").value.toLowerCase(),
            description: document.getElementById("car-description").value,
            image: document.getElementById("car-image").value
        }

        fetch("http://localhost:3000/cars", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCar)
        })
            .then(response => response.json())
            .then(addedCar => {
                console.log("Car added:", addedCar);
                displayCars([addedCar], addedCar.category, `.${addedCar.category}-cards`);
                document.getElementById("add-car-form").reset();
            })
            .catch(error => console.error(error));
    })

    //Add New Car Form shows when button pressed, otherwise not shown
    const form = document.getElementById("add-car-form");
    const showFormBtn = document.getElementById("show-form-btn");
    const hideFormBtn = document.getElementById("hide-form-btn");

    showFormBtn.addEventListener("click", function () {
        form.style.display = "block";
        showFormBtn.style.display = "none";
    });

    hideFormBtn.addEventListener("click", function () {
        form.style.display = "none";
        showFormBtn.style.display = "block";
    });

    //Display Car
    function displayCars(cars, category, sectionSelector) {
        const section = document.querySelector(sectionSelector);
        section.innerHTML = "";

        const sectionCars = cars.filter(car => car.category === category)
        sectionCars.forEach(car => {
            const carCard = document.createElement("div");
            carCard.classList.add("card")
            carCard.innerHTML = `
            <div class="card">
                <img src ="${car.image}" alt="${car.name}">
                <div class="car-name">${car.name} (${car.model})</div>
                <div class="car-price">Kes ${car.hire_price_per_day}</div>
                <button class="edit-btn" data-id="${car.id}">Edit</button>
                <button class="delete-btn" data-id="${car.id}">Delete</button>
            </div>
            `;

            section.appendChild(carCard)
        });
        document.querySelectorAll(".edit-btn").forEach(button => {
            button.addEventListener("click", event => {
                const carId = event.target.getAttribute("data-id");
                editCar(carId);
            });
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", event => {
                const carId = event.target.getAttribute("data-id");
                deleteCar(carId);
            });
        });
    }

    //Open Edit Car Modal
    function editCar(carId) {
        fetch(`http://localhost:3000/cars/${carId}`)
            .then(response => response.json())
            .then(car => {
                document.getElementById("edit-car-name").value = car.name;
                document.getElementById("edit-car-model").value = car.model;
                document.getElementById("edit-car-price").value = car.hire_price_per_day;
                document.getElementById("edit-car-category").value = car.category;
                document.getElementById("edit-car-image").value = car.image;
                document.getElementById("edit-car-image").disabled = true;

                document.getElementById("save-changes-btn").setAttribute("data-id", car.id);

                document.getElementById("edit-modal").style.display = "block";
            })
            .catch(error => console.error(error));
    }

    //Edit Car
    document.getElementById("save-changes-btn").addEventListener("click", () => {
        const carId = document.getElementById("save-changes-btn").getAttribute("data-id");

        const updatedCar = {
            name: document.getElementById("edit-car-name").value,
            model: document.getElementById("edit-car-model").value,
            hire_price_per_day: parseInt(document.getElementById("edit-car-price").value),
            category: document.getElementById("edit-car-category").value,
            image: document.getElementById("edit-car-image").value
        };

        fetch(`http://localhost:3000/cars/${carId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCar)
        })
            .then(response => response.json())
            .then(updatedCar => {
                console.log("Car updated:", updatedCar);
                document.getElementById("edit-modal").style.display = "none";
                location.reload();
            })
            .catch(error => console.error(error));
    });

    document.querySelector(".close-modal").addEventListener("click", () => {
        document.getElementById("edit-modal").style.display = "none";
    });

    //Delete Car
    function deleteCar(carId) {

        fetch(`http://localhost:3000/cars/${carId}`, {
            method: "DELETE"
        })
            .then(() => {
                console.log(`Car ${carId} deleted`);
            })
            .catch(error => console.error(error));
    }
})



