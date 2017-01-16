const App = App || {};
const google = google;


App.mapSetup = function() {
  App.apiUrl = 'http://localhost:3000/api';
  const canvas = document.getElementById('map-canvas');
  const mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP
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
      console.log(art);
      setTimeout(function(){
        geoCoder.geocode({'address': art.location }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const latlng = new google.maps.LatLng(lat, lng);
            const marker = new google.maps.Marker({
              position: latlng,
              map: App.map,
              animation: google.maps.Animation.DROP
            });

            App.addInfoWindow(art, marker);
          }
        });
      }, 200*index);
    });
  });
};



App.addInfoWindow = function(art, marker){
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined')
      this.infoWindow.close();
    var contentString = '';
    contentString += `<h3>${ art.artStolen }</h3><br>
    <p>Where: ${ art.location }</p><br>
    <p>When: ${ art.year }</p><br>
    <p>Worth: ${ art.worth }</p><br>
    <p>Description: ${ art.description }</p><br>
    <button class='showArt'>Find out more</button>`;

    this.infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
    // $('.showArt').on('click', (App.showArt.bind(this)));
    this.infoWindow.open(this.map, marker);
  });
  $('main').on('click', '.showArt', App.showArt.bind(this));
};


App.showArt = function(art){
  this.infoWindow.setContent(`<h3>${ art.artStolen }</h3>`);
};


App.init = function() {
  this.apiUrl = 'http://localhost:3000/api';
  this.$main = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  // $('.usersIndex').on('click', this.artIndex.bind(this));
  $('.modal-content').on('submit', 'form', this.handleForm);


  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.loggedInState = function() {
  console.log('loggedin');
  $('.loggedIn').show();
  $('.loggedOut').hide();
  // this.artIndex();
  this.$main.html('<div id="map-canvas"></div>');
  App.mapSetup();
};

App.loggedOutState = function(){
  $('.loggedIn').hide();
  $('#map-canvas').hide();
  $('.loggedOut').show();
};

App.register = function(e){
  if(e) e.preventDefault();
  $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h2>Register</h2>
    <form method="post" action="/register">
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
    <input class="btn btn-primary" type="submit" value="Register">
    </form>
    `);
  $('.modal').modal('show');
};

App.login = function(e) {
  e.preventDefault();
  $('.modal-content').html(`
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h2>Login</h2>
      <form method="post" action="/login">
      <div class="form-group">
      <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
      </form>
      `);
  $('.modal').modal('show');
};

App.logout = function(e){
  e.preventDefault();
  this.removeToken();
  this.loggedOutState();
};

App.artIndex = function(e) {
  console.log('this is runningNow');
  if (e) e.preventDefautl();
  const url = `${this.apiUrl}/art`;

  return this.ajaxRequest(url, 'get', null, data => {
    console.log(data);
  });
};

App.handleForm = function(e){
  console.log('should preventDefault');
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
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function(xhr) {
  console.log('setting header');
  return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
};

App.setToken = function(token) {
  console.log('token set');
  return window.localStorage.setItem('token', token);
};

App.getToken = function() {
  console.log('token got');
  return window.localStorage.getItem('token');
};

App.removeToken = function(){
  console.log('token removed');
  return window.localStorage.clear();
};

$(App.init.bind(App));
