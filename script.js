const WORKER_URL =
    "https://food-calorie-ai.aryantiwari935962.workers.dev";


const cameraInput =
    document.getElementById("cameraInput");

const galleryInput =
    document.getElementById("galleryInput");

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

const addMealBtn =
    document.getElementById("addMealBtn");

const dailyCalories =
    document.getElementById("dailyCalories");

const progressBar =
    document.getElementById("progressBar");

const remainingCalories =
    document.getElementById("remainingCalories");

const servingSize =
    document.getElementById("servingSize");

const portionButtons =
    document.querySelectorAll(".portion");


/* -------------------------------
   NUTRITION DATABASE
-------------------------------- */

const nutrition = {

    apple: {
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3
    },

    banana: {
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4
    },

    rice: {
        name: "Rice",
        calories: 205,
        protein: 4,
        carbs: 45,
        fat: 0.4
    },

    chicken: {
        name: "Chicken",
        calories: 335,
        protein: 31,
        carbs: 0,
        fat: 22
    },

    pizza: {
        name: "Pizza",
        calories: 285,
        protein: 12,
        carbs: 36,
        fat: 10
    },

    burger: {
        name: "Burger",
        calories: 354,
        protein: 17,
        carbs: 30,
        fat: 20
    },

    pasta: {
        name: "Pasta",
        calories: 250,
        protein: 9,
        carbs: 43,
        fat: 4
    },

    egg: {
        name: "Egg",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fat: 5
    },

    salad: {
        name: "Salad",
        calories: 120,
        protein: 4,
        carbs: 15,
        fat: 5
    },

    sandwich: {
        name: "Sandwich",
        calories: 300,
        protein: 14,
        carbs: 35,
        fat: 12
    },

    paneer: {
        name: "Paneer",
        calories: 265,
        protein: 18,
        carbs: 6,
        fat: 20
    },

    dal: {
        name: "Dal",
        calories: 180,
        protein: 9,
        carbs: 28,
        fat: 4
    },

    roti: {
        name: "Roti",
        calories: 120,
        protein: 3,
        carbs: 18,
        fat: 3
    },

    dosa: {
        name: "Dosa",
        calories: 168,
        protein: 4,
        carbs: 28,
        fat: 5
    },

    idli: {
        name: "Idli",
        calories: 58,
        protein: 2,
        carbs: 12,
        fat: 0.4
    },

    poha: {
        name: "Poha",
        calories: 180,
        protein: 4,
        carbs: 30,
        fat: 5
    },

    samosa: {
        name: "Samosa",
        calories: 260,
        protein: 5,
        carbs: 30,
        fat: 13
    }

};


/* -------------------------------
   PORTION
-------------------------------- */

const portions = {
    small: 0.7,
    medium: 1,
    large: 1.4
};

let selectedFood = null;
let selectedPortion = "medium";


/* -------------------------------
   DAILY CALORIES
-------------------------------- */

const dailyTarget = 2000;

let todayCalories =
    Number(localStorage.getItem("todayCalories")) || 0;


/* -------------------------------
   IMAGE → BASE64
-------------------------------- */

function imageToBase64(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();

        reader.onload = function() {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}


/* -------------------------------
   IMAGE HANDLING
-------------------------------- */

function handleImage(file) {

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Please select an image.");

        return;
    }

    previewImage.src =
        URL.createObjectURL(file);

    previewSection.classList.remove("hidden");

    resultSection.classList.add("hidden");

    if (foodSelection) {
        foodSelection.classList.add("hidden");
    }

}


cameraInput.addEventListener(
    "change",
    function() {
        handleImage(cameraInput.files[0]);
    }
);


galleryInput.addEventListener(
    "change",
    function() {
        handleImage(galleryInput.files[0]);
    }
);


/* -------------------------------
   AI ANALYSIS
-------------------------------- */

analyzeBtn.addEventListener(
    "click",
    async function() {

        const file =
            cameraInput.files[0] ||
            galleryInput.files[0];


        if (!file) {

            alert(
                "Please take or select a food photo first."
            );

            return;
        }


        analyzeBtn.disabled = true;

        analyzeBtn.textContent =
            "🤖 AI is analyzing...";


        try {

            const image =
                await imageToBase64(file);


            const response =
                await fetch(
                    WORKER_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            image: image
                        })
                    }
                );


            const predictions =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    predictions.error ||
                    "AI request failed"
                );

            }


            processPrediction(predictions);


        } catch (error) {

            console.error(error);

            alert(
                "AI analysis failed.\n\n" +
                error.message
            );

        }


        analyzeBtn.disabled = false;

        analyzeBtn.textContent =
            "🔍 Analyze Food";

    }
);


/* -------------------------------
   PROCESS AI RESULT
-------------------------------- */

function processPrediction(result) {

    let prediction = null;


    /*
       Hugging Face can return:
       [
         {
           label: "...",
           score: 0.95
         }
       ]
    */

    if (Array.isArray(result)) {

        prediction = result[0];

    }


    /*
       Some responses may wrap
       the prediction.
    */

    if (
        result.predictions &&
        Array.isArray(result.predictions)
    ) {

        prediction =
            result.predictions[0];

    }


    if (!prediction) {

        throw new Error(
            "AI returned an unexpected result."
        );

    }


    const label =
        prediction.label || "Unknown";


    const confidence =
        Number(prediction.score || 0);


    displayPrediction(
        label,
        confidence
    );

}


/* -------------------------------
   MATCH AI FOOD
-------------------------------- */

function findFood(label) {

    const text =
        label.toLowerCase();


    for (const key in nutrition) {

        if (
            text.includes(key) ||
            key.includes(text)
        ) {

            return nutrition[key];

        }

    }


    return null;

}


/* -------------------------------
   DISPLAY PREDICTION
-------------------------------- */

function displayPrediction(
    label,
    confidence
) {

    const food =
        findFood(label);


    resultSection.classList
        .remove("hidden");


    if (food) {

        selectedFood = food;

        selectedPortion = "medium";


        foodName.textContent =
            food.name;


        updateNutrition();


    } else {

        selectedFood = null;


        foodName.textContent =
            label;


        calories.textContent =
            "Not available";


        protein.textContent =
            "--";


        carbs.textContent =
            "--";


        fat.textContent =
            "--";

    }


    showConfidence(confidence);


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}
/* -------------------------------
   CONFIDENCE
-------------------------------- */

function showConfidence(score) {

    let confidenceElement =
        document.getElementById(
            "aiConfidence"
        );


    if (!confidenceElement) {

        confidenceElement =
            document.createElement("p");

        confidenceElement.id =
            "aiConfidence";

        confidenceElement.style =
            "font-size: 12px;" +
            "margin-top: 8px;" +
            "font-weight: bold;";


        resultSection.prepend(
            confidenceElement
        );

    }


    confidenceElement.textContent =
        "🤖 AI confidence: " +
        Math.round(score * 100) +
        "%";

}


/* -------------------------------
   NUTRITION
-------------------------------- */

function updateNutrition() {

    if (!selectedFood) return;


    const multiplier =
        portions[selectedPortion];


    calories.textContent =
        Math.round(
            selectedFood.calories *
            multiplier
        ) + " kcal";


    protein.textContent =
        Math.round(
            selectedFood.protein *
            multiplier * 10
        ) / 10 + " g";


    carbs.textContent =
        Math.round(
            selectedFood.carbs *
            multiplier * 10
        ) / 10 + " g";


    fat.textContent =
        Math.round(
            selectedFood.fat *
            multiplier * 10
        ) / 10 + " g";


    if (servingSize) {

        servingSize.textContent =
            Math.round(
                multiplier * 100
            ) + "%";

    }

}


/* -------------------------------
   PORTION BUTTONS
-------------------------------- */

portionButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                if (!selectedFood) return;


                portionButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedPortion =
                    button.dataset.size;


                updateNutrition();

            }
        );

    }
);


/* -------------------------------
   ADD MEAL
-------------------------------- */

if (addMealBtn) {

    addMealBtn.addEventListener(
        "click",
        function() {

            if (!selectedFood) {

                alert(
                    "Nutrition data is not available for this food."
                );

                return;
            }


            const multiplier =
                portions[selectedPortion];


            const mealCalories =
                Math.round(
                    selectedFood.calories *
                    multiplier
                );


            todayCalories +=
                mealCalories;


            localStorage.setItem(
                "todayCalories",
                todayCalories
            );


            updateDailyCalories();


            addMealBtn.textContent =
                "✓ Added to Today's Meals";


            addMealBtn.classList.add(
                "added"
            );

        }
    );

}


/* -------------------------------
   DAILY CALORIES
-------------------------------- */

function updateDailyCalories() {

    if (!dailyCalories) return;


    dailyCalories.textContent =
        Math.round(todayCalories);


    let percentage =
        (todayCalories / dailyTarget) *
        100;


    percentage =
        Math.min(percentage, 100);


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    if (remainingCalories) {

        const remaining =
            dailyTarget -
            todayCalories;


        if (remaining > 0) {

            remainingCalories.textContent =
                Math.round(remaining) +
                " kcal remaining today";

        } else {

            remainingCalories.textContent =
                "⚠️ Daily calorie target reached";

        }

    }

}


/* -------------------------------
   REMOVE IMAGE
-------------------------------- */

removeImage.addEventListener(
    "click",
    function() {

        previewImage.src = "";

        cameraInput.value = "";

        galleryInput.value = "";

        previewSection.classList
            .add("hidden");

        resultSection.classList
            .add("hidden");

        if (foodSelection) {

            foodSelection.classList
                .add("hidden");

        }

        selectedFood = null;

    }
);


/* -------------------------------
   START
-------------------------------- */

updateDailyCalories();