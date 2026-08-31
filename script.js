/* =================================
   FOOD CALORIE SCANNER
   Main JavaScript
================================= */


/* ---------- ELEMENTS ---------- */

const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");

const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");

const removeImage = document.getElementById("removeImage");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultSection = document.getElementById("resultSection");

const foodName = document.getElementById("foodName");
const calories = document.getElementById("calories");

const protein = document.getElementById("protein");
const carbs = document.getElementById("carbs");
const fat = document.getElementById("fat");

const dailyCalories = document.getElementById("dailyCalories");
const progressBar = document.getElementById("progressBar");
const remainingCalories = document.getElementById("remainingCalories");

const portionButtons = document.querySelectorAll(".portion");


/* ---------- FOOD DATA ---------- */

/*
   This is a lightweight demo database.
   We will improve food recognition later.
*/

const foods = [

    {
        name: "Pizza",
        calories: 285,
        protein: 12,
        carbs: 36,
        fat: 10
    },

    {
        name: "Burger",
        calories: 354,
        protein: 17,
        carbs: 30,
        fat: 20
    },

    {
        name: "Rice",
        calories: 205,
        protein: 4,
        carbs: 45,
        fat: 0.4
    },

    {
        name: "Salad",
        calories: 120,
        protein: 4,
        carbs: 15,
        fat: 5
    },

    {
        name: "Pasta",
        calories: 250,
        protein: 9,
        carbs: 43,
        fat: 4
    },

    {
        name: "Sandwich",
        calories: 300,
        protein: 14,
        carbs: 35,
        fat: 12
    },

    {
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3
    },

    {
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4
    },

    {
        name: "Egg",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fat: 5
    },

    {
        name: "Chicken",
        calories: 335,
        protein: 31,
        carbs: 0,
        fat: 22
    }

];


/* ---------- DAILY CALORIES ---------- */

let todayCalories =
    Number(localStorage.getItem("todayCalories")) || 0;

const dailyTarget = 2000;


/* ---------- IMAGE SELECTION ---------- */

function handleImage(file) {

    if (!file) {
        return;
    }

    /* Check if selected file is an image */

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        return;
    }


    /* Create temporary image URL */

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewSection.classList.remove("hidden");

    resultSection.classList.add("hidden");

    /* Scroll to preview */

    setTimeout(function () {

        previewSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* ---------- CAMERA ---------- */

cameraInput.addEventListener(
    "change",
    function () {

        const file = cameraInput.files[0];

        handleImage(file);

    }
);


/* ---------- GALLERY ---------- */

galleryInput.addEventListener(
    "change",
    function () {

        const file = galleryInput.files[0];

        handleImage(file);

    }
);


/* ---------- REMOVE IMAGE ---------- */

removeImage.addEventListener(
    "click",
    function () {

        previewImage.src = "";

        cameraInput.value = "";
        galleryInput.value = "";

        previewSection.classList.add("hidden");

        resultSection.classList.add("hidden");

    }
);


/* ---------- ANALYZE FOOD ---------- */

analyzeBtn.addEventListener(
    "click",
    function () {

        if (!previewImage.src) {

            alert("Please select a food image first.");

            return;
        }


        /*
           Show loading state
        */

        analyzeBtn.textContent = "⏳ Analyzing...";

        analyzeBtn.disabled = true;


        setTimeout(function () {

            /*
               Select a demo food.

               Later we can replace this
               with actual AI image recognition.
            */

            const randomFood =
                foods[Math.floor(Math.random() * foods.length)];


            displayFood(randomFood);


            analyzeBtn.textContent =
                "✓ Analysis Complete";

            analyzeBtn.disabled = false;


        }, 1200);

    }
);


/* ---------- DISPLAY FOOD ---------- */

function displayFood(food) {

    foodName.textContent = food.name;

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
       Add calories to today's total
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

    }, 200);

}


/* ---------- PORTION SIZE ---------- */

portionButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            portionButtons.forEach(
                function (item) {

                    item.classList.remove("active");

                }
            );


            button.classList.add("active");


            const size =
                button.dataset.size;


            adjustPortion(size);

        }
    );

});


/* ---------- ADJUST PORTION ---------- */

function adjustPortion(size) {

    const currentCalories =
        parseFloat(
            calories.textContent
        );


    if (!currentCalories) {
        return;
    }


    /*
       Base calories are calculated
       using the medium portion.
    */

    let multiplier = 1;


    if (size === "small") {
        multiplier = 0.7;
    }

    if (size === "medium") {
        multiplier = 1;
    }

    if (size === "large") {
        multiplier = 1.4;
    }


    /*
       This is only a visual estimate
       for the prototype.
    */

    const selectedFood =
        foods.find(function (food) {

            return food.name ===
                foodName.textContent;

        });


    if (!selectedFood) {
        return;
    }


    const newCalories =
        Math.round(
            selectedFood.calories *
            multiplier
        );


    calories.textContent =
        newCalories + " kcal";


    protein.textContent =
        Math.round(
            selectedFood.protein *
            multiplier
        ) + " g";


    carbs.textContent =
        Math.round(
            selectedFood.carbs *
            multiplier
        ) + " g";


    fat.textContent =
        Math.round(
            selectedFood.fat *
            multiplier
        ) + " g";

}


/* ---------- DAILY CALORIE DISPLAY ---------- */

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

    } else {

        remainingCalories.textContent =
            "⚠️ Daily calorie target reached";

        progressBar.style.background =
            "#ff3333";

    }

}


/* ---------- INITIAL LOAD ---------- */

updateDailyCalories();