// api key
const key = 'LBXLGGGLHCVTA6MUI2PB';
// const placesKey = 'AIzaSyDW1KtYBTG9atRt_8QhxWi2GhO6uSBrzs0';
// const placesKey2 = 'AIzaSyCWWEVzZHQvwp5dhHJMTaDRVnATsYWKGXY';
// const placesKey3 = 'AIzaSyDliDoQC8OLbasGSdT_p5C55583bJ4q1eo';
const placesKeypaid = 'AIzaSyCSYp0PROxz6148kSPkdUSJZj61kwy3Quo'
let hotelArray = [];
let restaurantArray = [];
let nightlifeArray = [];

//////////////this populates the category array//////////////
categoryArray = [];
$.ajax({
  url: `https://www.eventbriteapi.com/v3/categories/?token=${key}`,
  // Input the method type here (Hint: 'GET', 'POST', 'PUT', 'DELETE')
  method: 'GET'
}).then(function (response) {


  for (let i = 0; i < response.categories.length; i++) {
    let categories = {
      name: "",
      id: "",
    };
    categories.name = response.categories[i].name;
    categories.id = response.categories[i].id;
    // console.log(categories);
    categoryArray.push(categories);
  }

});
//CATEGORIES// //CATEGORIES// //CATEGORIES// //CATEGORIES// 
let eventArray = [];


const searchFunction = function (e) {
  e.preventDefault();
  hotelArray = [];
  restaurantArray = [];
  nightlifeArray = [];
  const city = $('#cityForm').val().trim();
  // let city = prompt("asdf");
  eventArray = [];
  // taking the value entered into the city field and storing it//
  const catID = $('#inputState').val();
  $.ajax({
    url: `https://www.eventbriteapi.com/v3/events/search/?location.address=${city}&expand=organizer,venue&token=${key}`,
    method: 'GET'
  }).then(function (res) {
    for (var i = 0; i < res.events.length; i++) {
      // console.log(typeof(res.events[i].category_id));
      // console.log(res);
      //    console.log(res.events[i].start.timezone);
      if (`${catID}` === res.events[i].category_id) {
        eventArray.push(res.events[i])
      }
    }
    console.log(eventArray);
    //   $('#id').append(`<div class="class"></div>`)
    console.log(city);
    console.log(catID);

    $('#cityForm').empty();
    $("#inputState").val();
    // $("select#inputState").change(resetFieldToDefault);

    render();
  });
}
/////RENDER FUNCTION/////


const render = function () {
  let content = '';
  $('#results').empty();
  if (eventArray.length === 0) {
    content = `<div class="row animated slideInLeft">
        <div class="card-body col-12 animated slideInLeft"><h5>No Results Found</h5></div></div>`;
  }
  else {
    for (let i = 0; i < eventArray.length; i++) {
      content += `<div class="row animate slideInLeft">
            <div class="card col-md-4 col-12 animated slideInLeft">
            <a href="${eventArray[i].url}" target="_blank"> <img class="card-img-top" src="${eventArray[i].logo.url}" alt="Card image"></a>
            </div>
            <div class="card-body col-md-4 col-12 animated slideInLeft" id="results-body">
                <h5 class="card-title">${eventArray[i].name.text}</h5>`;
      if (eventArray[i].description.text !== null) {
        content += `<p class="card-text">${eventArray[i].description.text}</p>
                    <a href="${eventArray[i].url}" target="_blank" class="dynamic btn btn-primary">Buy Tickets!</a>`
      }
      else {
        content += `<p class="card-text">Please join us for this amazing event!</p>
                    <a href="${eventArray[i].url}" target="_blank" class="btn btn-primary">Buy Tickets!</a>`
      }
      content += `</div><div class="accordion col-md-4 col-12 animated slideInLeft" id="nearby">
            <div class="card">
              <div class="card-header" id="headingHotel">
                <h5 class="mb-0">
                  <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseHotel${i}" aria-expanded="false" aria-controls="collapseHotel">
                    Nearby Hotels
                  </button>
                </h5>
              </div>
          
              <div id="collapseHotel${i}" class="collapse show" aria-labelledby="headingHotel" data-parent="#nearby">
                <div class="card-body" id="hotelData${i}">
                  
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingRest">
                <h5 class="mb-0">
                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseRest${i}" aria-expanded="false" aria-controls="collapseRest">
                    Nearby Restaurants
                  </button>
                </h5>
              </div>
              <div id="collapseRest${i}" class="collapse" aria-labelledby="headingRest" data-parent="#nearby">
                <div class="card-body" id="restaurantData${i}">
                  
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header" id="headingNightlife">
                <h5 class="mb-0">
                  <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseNightlife${i}" aria-expanded="false" aria-controls="collapseNightlife">
                    Nearby Nightlife
                  </button>
                </h5>
              </div>
              <div id="collapseNightlife${i}" class="collapse" aria-labelledby="headingNightlife" data-parent="#nearby">
                <div class="card-body" id="nightlifeData${i}">
                  
                </div>
              </div>
            </div>
          </div>
        </div>`
    }
  }
  $('#results').append(content);
  getFoursquareHotel();
  getFoursquareFood();
  getFoursquareNightlife();
  $(document).ajaxStop(function () {
    let counter = 0;
    // console.log(hotelArray);  
    for (let i=0;i<eventArray.length;i++){
        $(`#hotelData${i}`).empty();
        $(`#restaurantData${i}`).empty();
        $(`#nightlifeData${i}`).empty();
    }
    for (let i=0;i<eventArray.length;i++){
      for (let j=0;j<hotelArray[i].length;j++){
        $(`#hotelData${i}`).append(`<p>${hotelArray[i][j].name}</p>`);
        $(`#restaurantData${i}`).append(`<p>${restaurantArray[i][j].name}</p>`);
        $(`#nightlifeData${i}`).append(`<p>${nightlifeArray[i][j].name}</p>`);
      }
    }
  })
}



///////FOURSQUARE Hotels
function getFoursquareHotel() {
  const hotel = "4bf58dd8d48988d1fa931735";
  for (let i = 0; i < eventArray.length; i++) {
    let coords = `${eventArray[i].venue.address.latitude},${eventArray[i].venue.address.longitude}`
    var url = `https://api.foursquare.com/v2/venues/search?v=20161016&ll=${coords}&query=park&intent=browse&radius=16000&categoryId=${hotel}&limit=5&client_id=0ODJZDHLKB0H32NCNULADKFHVKHCVACX3DZJVYLPZYQYF4XO&client_secret=DKA4ZIWNG5QGLKGJ0LYJQKRIEZLRFEWOHERYXQGKF2FHFC0X`;

    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        var venues = data.response.venues;
        hotelArray.push(venues);
        // console.log(hotelArray);
      }
    });
  };
}

///////FOURSQUARE Food
function getFoursquareFood() {
  const food = "4d4b7105d754a06374d81259";

  for (let i = 0; i < eventArray.length; i++) {
    let coords = `${eventArray[i].venue.address.latitude},${eventArray[i].venue.address.longitude}`
    var url = `https://api.foursquare.com/v2/venues/search?v=20161016&ll=${coords}&query=park&intent=browse&radius=16000&categoryId=${food}&limit=5&client_id=0ODJZDHLKB0H32NCNULADKFHVKHCVACX3DZJVYLPZYQYF4XO&client_secret=DKA4ZIWNG5QGLKGJ0LYJQKRIEZLRFEWOHERYXQGKF2FHFC0X`;

    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        var venues = data.response.venues;
        // console.log(data);
        restaurantArray.push(venues);
    }
    });
  };
}

///////FOURSQUARE Nightlife
function getFoursquareNightlife() {
  const nightlife = "4d4b7105d754a06376d81259"
  for (let i = 0; i < eventArray.length; i++) {
    let coords = `${eventArray[i].venue.address.latitude},${eventArray[i].venue.address.longitude}`
    var url = `https://api.foursquare.com/v2/venues/search?v=20161016&ll=${coords}&query=park&intent=browse&radius=16000&categoryId=${nightlife}&limit=5&client_id=0ODJZDHLKB0H32NCNULADKFHVKHCVACX3DZJVYLPZYQYF4XO&client_secret=DKA4ZIWNG5QGLKGJ0LYJQKRIEZLRFEWOHERYXQGKF2FHFC0X`;

    $.ajax({
      url: url,
      dataType: 'json',
      success: function (data) {
        var venues = data.response.venues;
        // console.log(data);
       nightlifeArray.push(venues);
    }
    });
  }
}

// function animate(element, animation) {

// }


$('#searchBtn').on('click', searchFunction);