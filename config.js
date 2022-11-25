function localizarUbicacion() {
  //Llama los componentes del Home - I call the script
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  const ciudad = document.querySelector("#ciudad");

  //Setea los componentes en blanco al comenzar el programa - Set blank components at program start
  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    //Set latitud y longitud - latitude and longitude
    const latitud = position.coords.latitude;
    const longitud = position.coords.longitude;

    //ver latitud y longitud con link - see latitude and longitude with link
    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitud}/${longitud}`;
    mapLink.textContent = `Latitud: ${latitud} °, Longitud: ${longitud} °`;

    //Con el API de google se traen los datos exactos de la dirección utilizando latitud y longitd
    //With the Google API the exact data of the address is brought using latitude and longitd
    //Realizo la consulta al API - I make the query to the API
    var Http = new XMLHttpRequest();
    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      latitud +
      "," +
      longitud +
      "&key={GOOGLE_API_KEY}"; //Se genera desde google - It is generated from google
    Http.open("POST", url);
    Http.send();
    Http.onreadystatechange = (e) => {
      //Cuando la consulta es exitosa setea los datos necesarios de la respuesta
      //When the query is successful, set the necessary data for the response.
      if (
        Http.readyState === 4 &&
        Http.status === 200 &&
        Http.responseText != null
      ) {
        //Parseo la respuesta a JSON porque llega en string
        //I parse the response to JSON because it arrives in string
        let respuestaJson = JSON.parse(Http.responseText);
        console.log(respuestaJson);
        let ciudad =
          respuestaJson["results"][1]["address_components"][4].long_name;
        let provincia =
          respuestaJson["results"][1]["address_components"][5].long_name;
        let pais =
          respuestaJson["results"][1]["address_components"][6].long_name;
        //   let cp = respuestaJson["results"][1]["address_components"][7].long_name;
        conexionDesde.textContent =
          "Solicitud enviada desde " +
          ciudad +
          ", " +
          provincia +
          ", " +
          pais +
          ".";
      }
    };
  }

  //Error en caso que el usuario rechace la geolocalización - Error in case the user rejects the geolocation
  function error() {
    status.textContent = "Geolocalización rechazada";
  }

  //Error en caso que el usuario tenga un navegador no soportado por la geolocalización
  //Error in case the user has a browser not supported by geolocation
  if (!navigator.geolocation) {
    status.textContent = "Geolocalización no soportada por el navegador";
  } else {
    status.textContent = "Cargando";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

document
  .querySelector("#find-me")
  .addEventListener("click", localizarUbicacion);
