(function () {
  var api = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
  var mainList = document.querySelector('.suggestions');
  var textbox = document.getElementsByTagName('input');
  var data = [];

  function getValFromSearch () {
    textbox[0].addEventListener('keyup', function (e) {
      var val = e.target.value;

      clearResults();

      // Clear search data when no input in text box
      if (val.length === 0) {
        clearResults();
        return;
      }

      var filterData = search(val);
      addFilterToChild(filterData);
    });
  }

  function clearResults () {
    while (mainList.firstChild) {
      mainList.removeChild(mainList.firstChild);
    }
  }

  function addFilterToChild (filterData) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < filterData.length; i++) {
      var item = filterData[i];
      var li = document.createElement('li');

      var cityState = '<span>' + item.city + '</span>';
      var pop = '<span class="population">' + item.pop + '</span>';

      li.innerHTML = cityState + pop;
      frag.appendChild(li);
    }

    mainList.appendChild(frag);
  }

  function loadJsonDataToArray (json) {
    return json.map(function (item) {
      return {
        city: item.city + ', ' + item.state,
        pop: item.population
      };
    });
  }

  function search (val) {
    return data.filter(function (item) {
      return item.city.match(new RegExp(val, 'ig'));
    });
  }

  fetch(api)
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      data = loadJsonDataToArray(json);
      getValFromSearch();
    });

})();
