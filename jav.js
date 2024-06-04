$(document).ready(function () {
    $('#searchButton').click(function () {
        const query = $('#searchInput').val();
        searchMeals(query);
    });

    function searchMeals(query) {
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
            method: 'GET',
            success: function (data) {
                displayMeals(data.meals);
            }
        });
    }

    function displayMeals(meals) {
        const menuContainer = $('#menuContainer');
        menuContainer.empty();
        if (meals) {
            meals.forEach(meal => {
                const mealCard = `<div class="col-md-4">
                                    <div class="card" data-id="${meal.idMeal}">
                                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                        <div class="card-body">
                                            <h5 class="card-title">${meal.strMeal}</h5>
                                        </div>
                                    </div>
                                  </div>`;
                menuContainer.append(mealCard);
            });

            $('.card').click(function () {
                const mealId = $(this).data('id');
                getMealDetails(mealId);
            });
        } else {
            menuContainer.append('<p>No meals found.</p>');
        }
    }

    function getMealDetails(id) {
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
            method: 'GET',
            success: function (data) {
                const meal = data.meals[0];
                $('#mealModalLabel').text(meal.strMeal);
                $('#mealTitle').text(meal.strMeal);
                $('#mealImage').attr('src', meal.strMealThumb);
                $('#mealInstructions').html(formatIngredients(meal));
                $('#mealModal').modal('show');
            }
        });
    }

    function formatIngredients(meal) {
        let ingredients = '<ul>';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients += `<li>${ingredient} - ${measure}</li>`;
            }
        }
        ingredients += '</ul>';
        return ingredients;
    }
});
