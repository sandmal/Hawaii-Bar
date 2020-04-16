//fetch api
const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/';

//fetch  drinks from api
async function getDrinks(name) {
  try {
    const res = await axios.get(`${BASE_URL}/filter.php?i=${name}`);
    return res.data.drinks;
  } catch (e) {
    console.error(e);
  }
}

//lookup drinks from id
async function lookupID(drinkID) {
  try {
    const res = await axios.get(`${BASE_URL}/lookup.php?i=${drinkID}`);
    return res.data.drinks[0];
  } catch (e) {
    console.error(e);
  }
}

//lookup drink by name
async function lookupDrink(name) {
  try {
    const res = await axios.get(`${BASE_URL}/search.php?s=${name}`);
    return res.data.drinks;
  } catch (e) {
    console.error(e);
  }
}

//create error message
function errorMessage(search) {
  $('#container').empty();
  const ul = $('<ul>');
  const header = $('<h1>').text(`The search "${search}" returned no results..`);
  const image = $('<img>').attr(
    'src',
    'https://cdn.pixabay.com/photo/2018/10/01/21/03/shattered-3717287_1280.png'
  );
  ul.append($('<li>').append(header).append(image));
  $('#container').append(ul);
}

//footer placement
function footerPlacement() {
  return $('.footer').css('position', 'relative');
}

//create drinkslist
function createDrinkList(drinks) {
  $('#container').empty();
  footerPlacement();
  const ul = $('<ul>');
  for (const drink of drinks) {
    const header = $('<h1>').text(drink.strDrink);
    const image = $('<img>').attr('src', drink.strDrinkThumb);
    const button = $('<button>').text('drink instructions');
    const span = $('<span>');

    async function drinkInstructions() {
      const details = await lookupID(drink.idDrink);
      const instructions = details.strInstructions;
      span.toggleClass('description');
      span.text('');

      if (span.hasClass('description')) {
        span.text(instructions);
        button.text('Hide Drink Instructions');
      } else {
        button.text('drink instructions');
      }
    }

    ul.append($('<li>').append(header).append(image).append(span).append(button));
    button.on('click', drinkInstructions);
  }
  $('#container').append(ul);
}

//render output
async function render() {
  const select = $('#drink');

  //search by drink type
  $('#drinkBtn').on('click', async () => {
    const searchValue = $('#search').val();
    if (searchValue.length > 0) {
      const drink = await lookupDrink(searchValue);
      if (drink !== null) {
        createDrinkList(drink);
      } else {
        errorMessage(searchValue);
        $('#search').val('').focus();
      }
      footerPlacement();
    }
  });

  select.on('change', async (event) => {
    if (event.target.selectedOptions.length > 0) {
      createDrinkList(await getDrinks(event.target.selectedOptions[0].textContent));
    }
  });
}
render();
