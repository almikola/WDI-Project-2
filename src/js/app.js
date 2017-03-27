const App = App || {};
const google = google;

// -  APP init --------------------------------------------

App.init = function() {
  this.apiUrl = `${window.location.origin}/api`;
  this.$main = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.seeAll').on('click', this.seeAll.bind(this));
  $('.filter-map').on('submit', this.setFilter);
  $('.modal-content').on('submit', 'form', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

// - REGISTER ------------------------------------------

App.register = function(e){
  if(e) e.preventDefault();
  $('.modal-content').html(`
    <form method="post" action="/register">
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">Register</h4>
    </div>
    <div class="modal-body">
    <div class="form-group">
    <input class="form-control" type="text" name="user[username]" placeholder="Username">
    </div>
    <div class="form-group">
    <input class="form-control" type="email" name="user[email]" placeholder="Email">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[password]" placeholder="Password">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
    </div>
    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <input class="btn btn-primary" type="submit" value="Register">
    </div>
    </form>`);
  $('.modal').modal('show');
};

  // - LOGGING IN ----------------------------------------

App.login = function(e) {
  e.preventDefault();
  $('.modal-content').html(`
      <form method="post" action="/login">
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Login</h4>
      </div>
      <div class="modal-body">
      <div class="form-group">
      <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      <input class="btn btn-primary" type="submit" value="Login">
      </div>
      </form>`);
  $('.modal').modal('show');
};

    // - LOG OUT -----------------------------------------------

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

    // - TOKEN -------------------------------------------------

App.handleForm = function(e){
  e.preventDefault();
  $('.modal').modal('hide');

  const url = `${App.apiUrl}${$(this).attr('action')}`;
  const method = $(this).attr('method');
  const data = $(this).serialize();

  return App.ajaxRequest(url, method, data, data => {
    if (data.token) App.setToken(data.token);
    App.loggedInState();
  });
};

App.ajaxRequest = function(url, method, data, callback) {
  return $.ajax({
    url,
    method,
    data,
    beforeSend: App.setRequestHeader.bind(this)
  })
      .done(callback)
      .fail(err => {
        console.log(err);
      });
};

App.setRequestHeader = function(xhr) {
  return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
};

App.setToken = function(token) {
  return window.localStorage.setItem('token', token);
};

App.getToken = function() {
  return window.localStorage.getItem('token');
};

App.removeToken = function(){
  return window.localStorage.clear();
};


    // - STATES --------------------------------------------------

App.loggedInState = function() {
  $('.loggedIn').show();
  $('.loggedOut').hide();
  $('#update').addClass('blue');
  this.$main.html('<div id="map-canvas"></div>');
  App.mapSetup();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('#map-canvas').hide();
  $('.loggedOut').show();
  $('#update').removeClass('blue');
};

    // - MAKE THE MAP ----------------------------------------------------------

App.mapSetup = function() {
  App.apiUrl = `${window.location.origin}/api`;
  App.data = [];
  App.markers = [];
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#e9e9e9'
          },
          {
            'lightness': 17
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#f5f5f5'
          },
          {
            'lightness': 20
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ffffff'
          },
          {
            'lightness': 17
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#ffffff'
          },
          {
            'lightness': 29
          },
          {
            'weight': 0.2
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#ffffff'
          },
          {
            'lightness': 18
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#ffffff'
          },
          {
            'lightness': 16
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#f5f5f5'
          },
          {
            'lightness': 21
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#dedede'
          },
          {
            'lightness': 21
          }
        ]
      },
      {
        'elementType': 'labels.text.stroke',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'color': '#ffffff'
          },
          {
            'lightness': 16
          }
        ]
      },
      {
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'saturation': 36
          },
          {
            'color': '#333333'
          },
          {
            'lightness': 40
          }
        ]
      },
      {
        'elementType': 'labels.icon',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'transit',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#f2f2f2'
          },
          {
            'lightness': 19
          }
        ]
      },
      {
        'featureType': 'administrative',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#fefefe'
          },
          {
            'lightness': 20
          }
        ]
      },
      {
        'featureType': 'administrative',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#fefefe'
          },
          {
            'lightness': 17
          },
          {
            'weight': 1.2
          }
        ]
      }
    ]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.addArt();
};

App.addArt = function() {
  $.get({
    url: `${App.apiUrl}/art/`,
    beforeSend: App.setRequestHeader.bind(App)
  }).done(data => {
    const geoCoder = new google.maps.Geocoder();
    $.each(data.arts, function(index, art){
      setTimeout(function(){
        geoCoder.geocode({'address': art.location }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            art.lat = results[0].geometry.location.lat();
            art.lng = results[0].geometry.location.lng();
            const latlng = new google.maps.LatLng(art.lat, art.lng);

            const marker = new google.maps.Marker({
              position: latlng,
              map: App.map,
              animation: google.maps.Animation.DROP,
              icon: {
                url: '/images/paintbrush.png',
                scaledSize: new google.maps.Size(50, 50)
              }
            });
            App.markers.push(marker);
            App.data.push(art);
            App.addModalWindow(art, marker);
          }
        });
      }, 200*index);
    });
  });
};

App.addModalWindow = function(art, marker){
  google.maps.event.addListener(marker, 'click', () => {
    if ($('.modal').is(':visible')) $('.modal').modal('hide');
    $('.modal-content').html(`
          <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <p class="modal-title"><strong>${art.artStolen.replace(/\n/g, '<br>').replace(/'G<br>'/g, 'G.')}</strong></p>
          </div>
          <div class="modal-body">
          <img src="${art.image}"></ br>
          <ul class="list-inline">
          <li><strong>Where:</strong> ${art.location}</li>
          <li><strong>When:</strong> ${art.year}</li>
          <li><strong>Worth:</strong> ${art.worth}</li>
          </ul>
          <p>${art.description}</p>
          </div>
          <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

          </div>
          `);
    $('.modal').modal('show');
  });
};

App.showArt = function(art){
  this.infoWindow.setContent(`<h3>${ art.artStolen }</h3>`);
};

      // - SEE ALL FUNCTION -----------------------------------------------

App.seeAll = function(){
  $('.country').val('');
  $('.artist').val('');
  App.addArt();
};

App.artIndex = function(e) {
  if (e) e.preventDefautl();
  const url = `${this.apiUrl}/art`;

  return this.ajaxRequest(url, 'get', null, data => {
    console.log(data);
  });
};

      // - REMOVER MARKERS ----------------------------------------------

App.removeMarkers = function() {
  $.each(App.markers, (index, marker) => {
    marker.setMap(null);
  });
};

      // - SEARCH FUNCTION ----------------------------------------------

App.setFilter = function(e) {
  if (e) e.preventDefault();

  if ($('.country').val() || $('.artist').val()) {
    if($('.country').val()) {
      const input = $('.country').val();
      App.filterMap(input, 'location');
    } else {
      const input = $('.artist').val();
      App.filterMap(input, 'artStolen');
    }
  }
};

App.filterMap = function(input, field) {
  $('.artist, .country').val('');

  const filter       = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  const filteredData = App.data.filter(art => {
    if (field === 'location') {
      if(art.location.split(', ')[1] === filter) return art;
    } else {
      if(art.artStolen.includes(filter)) return art;
    }
  });

  App.removeMarkers();

  $.each(filteredData, (index, art) => {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(art.lat, art.lng),
      map: App.map,
      icon: {
        url: '/images/paintbrush.png',
        scaledSize: new google.maps.Size(50, 50)
      }
    });

    App.markers.push(marker);
    App.addModalWindow(art, marker);
  });
};

$(App.init.bind(App));
