/* =================================
   FOOD CALORIE SCANNER
   STAGE 1
   Manual Food Selection
================================= */


/* ---------- ELEMENTS ---------- */

const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");

const previewSection =
    document.getElementById("previewSection");

const previewImage =
    document.getElementById("previewImage");

const removeImage =
    document.getElementById("removeImage");

const analyzeBtn =
    document.getElementById("analyzeBtn");

const foodSelection =
    document.getElementById("foodSelection");

const foodList =
    document.getElementById("foodList");

const foodSearch =
    document.getElementById("foodSearch");

const resultSection =
    document.getElementById("resultSection");

const foodName =
    document.getElementById("foodName");

const calories =
    document.getElementById("calories");

const protein =
    document.getElementById("protein");

const carbs =
    document.getElementById("carbs");

const fat =
    document.getElementById("fat");

const dailyCalories =
    document.getElementById("dailyCalories");

const progressBar =
    document.getElementById("progressBar");

const remainingCalories =
    document.getElementById("remainingCalories");

const portionButtons =
    document.querySelectorAll(".portion");


/* ---------- FOOD DATABASE ---------- */

const foods = [

    {
        name: "Apple",
        icon: "🍎",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3
    },

    {
        name: "Banana",
        icon: "🍌",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4
    },

    {
        name: "Rice",
        icon: "🍚",
        calories: 205,
        protein: 4,
        carbs: 45,
        fat: 0.4
    },

    {
        name: "Chicken",
        icon: "🍗",
        calories: 335,
        protein: 31,
        carbs: 0,
        fat: 22
    },

    {
        name: "Egg",
        icon: "🥚",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fat: 5
    },

    {
        name: "Pizza",
        icon: "🍕",
        calories: 285,
        protein: 12,
        carbs: 36,
        fat: 10
    },

    {
        name: "Burger",
        icon: "🍔",
        calories: 354,
        protein: 17,
        carbs: 30,
        fat: 20
    },

    {
        name: "Pasta",
        icon: "🍝",
        calories: 250,
        protein: 9,
        carbs: 43,
        fat: 4
    },

    {
        name: "Salad",
        icon: "🥗",
        calories: 120,
        protein: 4,
        carbs: 15,
        fat: 5
    },

    {
        name: "Sandwich",
        icon: "🥪",
        calories: 300,
        protein: 14,
        carbs: 35,
        fat: 12
    },

    {
        name: "Dal",
        icon: "🍲",
        calories: 180,
        protein: 9,
        carbs: 28,
        fat: 4
    },

    {
        name: "Roti",
        icon: "🫓",
        calories: 120,
        protein: 3,
        carbs: 18,
        fat: 3
    },

    {
        name: "Paneer",
        icon: "🧀",
        calories: 265,
        protein: 18,
        carbs: 6,
        fat: 20
    },

    {
        name: "Idli",
        icon: "🥣",
        calories: 58,
        protein: 2,
        carbs: 12,
        fat: 0.4
    },

    {
        name: "Dosa",
        icon: "🥞",
        calories: 168,
        protein: 4,
        carbs: 28,
        fat: 5
    },

    {
        name: "Poha",
        icon: "🍚",
        calories: 180,
        protein: 4,
        carbs: 30,
        fat: 5
    },

    {
        name: "Samosa",
        icon: "🥟",
        calories: 260,
        protein: 5,
        carbs: 30,
        fat: 13
    },

    {
        name: "French Fries",
        icon: "🍟",
        calories: 312,
        protein: 3.4,
        carbs: 41,
        fat: 15
    },

    {
        name: "Milk",
        icon: "🥛",
        calories: 122,
        protein: 8,
        carbs: 12,
        fat: 5
    },

    {
        name: "Yogurt",
        icon: "🥛",
        calories: 100,
        protein: 5,
        carbs: 8,
        fat: 5
    }

];


/* ---------- DAILY CALORIES ---------- */

let todayCalories =
    Number(localStorage.getItem("todayCalories")) || 0;

const dailyTarget = 2000;


/* ---------- DISPLAY FOOD LIST ---------- */

function displayFoodList(searchText = "") {

    foodList.innerHTML = "";

    const search =
        searchText.toLowerCase().trim();

    const filteredFoods =
        foods.filter(function (food) {

            return food.name
                .toLowerCase()
                .includes(search);

        });


    if (filteredFoods.length === 0) {

        foodList.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                color: #777;
                padding: 20px;
            ">
                No food found.
            </p>
        `;

        return;
    }


    filteredFoods.forEach(function (food) {

        const button =
            document.createElement("button");

        button.className = "food-option";

        button.innerHTML = `
            <div class="food-icon">
                ${food.icon}
            </div>

            <strong>
                ${food.name}
            </strong>

            <small>
                ${food.calories} kcal
            </small>
        `;


        button.addEventListener(
            "click",
            function () {

                selectFood(food);

            }
        );


        foodList.appendChild(button);

    });

}


/* ---------- CAMERA ---------- */

cameraInput.addEventListener(
    "change",
    function () {

        handleImage(cameraInput.files[0]);

    }
);


/* ---------- GALLERY ---------- */

galleryInput.addEventListener(
    "change",
    function () {

        handleImage(galleryInput.files[0]);

    }
);


/* ---------- HANDLE IMAGE ---------- */

function handleImage(file) {

    if (!file) {
        return;
    }


    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        return;
    }


    const imageURL =
        URL.createObjectURL(file);


    previewImage.src = imageURL;

    previewSection.classList.remove("hidden");

    foodSelection.classList.add("hidden");

    resultSection.classList.add("hidden");


    setTimeout(function () {

        previewSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* ---------- ANALYZE BUTTON ---------- */

analyzeBtn.addEventListener(
    "click",
    function () {

        if (!previewImage.src) {

            alert(
                "Please select a food image first."
            );

            return;
        }


        /*
           Stage 1:
           Open food selection instead
           of randomly choosing food.
        */

        foodSelection.classList.remove("hidden");

        resultSection.classList.add("hidden");

        displayFoodList();


        setTimeout(function () {

            foodSelection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 150);

    }
);


/* ---------- FOOD SEARCH ---------- */

foodSearch.addEventListener(
    "input",
    function () {

        displayFoodList(
            foodSearch.value
        );

    }
);


/* ---------- SELECT FOOD ---------- */

function selectFood(food) {

    foodSelection.classList.add("hidden");

    displayFood(food);

}


/* ---------- DISPLAY RESULT ---------- */

function displayFood(food) {

    foodName.textContent =
        food.name;

    calories.textContent =
        food.calories + " kcal";

    protein.textContent =
        food.protein + " g";

    carbs.textContent =
        food.carbs + " g";

    fat.textContent =
        food.fat + " g";


    resultSection.classList.remove("hidden");


    /*
       Add calories to daily total.
    */

    todayCalories += food.calories;


    localStorage.setItem(
        "todayCalories",
        todayCalories
    );


    updateDailyCalories();


    setTimeout(function () {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 150);

}


/* ---------- REMOVE IMAGE ---------- */

removeImage.addEventListener(
    "click",
    function () {

        previewImage.src = "";

        cameraInput.value = "";

        galleryInput.value = "";

        previewSection.classList.add("hidden");

        foodSelection.classList.add("hidden");

        resultSection.classList.add("hidden");

    }
);


/* ---------- PORTION SIZE ---------- */

portionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                portionButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add("active");


                const size =
                    button.dataset.size;


                adjustPortion(size);

            }
        );

    }
);


/* ---------- PORTION CALCULATION ---------- */

function adjustPortion(size) {

    const selectedName =
        foodName.textContent;


    const food =
        foods.find(function (item) {

            return item.name ===
                selectedName;

        });


    if (!food) {
        return;
    }


    let multiplier = 1;


    if (size === "small") {

        multiplier = 0.7;

    } else if (size === "medium") {

        multiplier = 1;

    } else if (size === "large") {

        multiplier = 1.4;

    }


    calories.textContent =
        Math.round(
            food.calories * multiplier
        ) + " kcal";


    protein.textContent =
        Math.round(
            food.protein * multiplier
        ) + " g";


    carbs.textContent =
        Math.round(
            food.carbs * multiplier
        ) + " g";


    fat.textContent =
        Math.round(
            food.fat * multiplier
        ) + " g";

}


/* ---------- DAILY CALORIES ---------- */

function updateDailyCalories() {

    dailyCalories.textContent =
        Math.round(todayCalories);


    let percentage =
        (todayCalories / dailyTarget) * 100;


    if (percentage > 100) {

        percentage = 100;

    }


    progressBar.style.width =
        percentage + "%";


    const remaining =
        dailyTarget - todayCalories;


    if (remaining > 0) {

        remainingCalories.textContent =
            Math.round(remaining) +
            " kcal remaining today";

        progressBar.style.background =
            "#168a3b";

    } else {

        remainingCalories.textContent =
            "⚠️ Daily calorie target reached";

        progressBar.style.background =
            "#ff3333";

    }

}


/* ---------- INITIALIZE ---------- */

displayFoodList();

updateDailyCalories();