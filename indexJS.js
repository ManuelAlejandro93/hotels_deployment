import { llamarJSON } from "./src/api.js";
import { imprimirTodasLasCards, imprimirCardsFiltradasPorPrecio } from "./src/funciones.js";
import { fechasImpresas } from "./src/formatoDeFechasImpreso.js";

let header = document.getElementsByClassName("header")[0];

header.innerHTML = `
<div class="contenedorDeHeader">
        <h1 class="h1">Book it!</h1>
        <div class="contenedorFiltros">
          <div class="flexFiltros">
            <select class="filtro selectCountry" name="selectCountry">
              <option value="allcountries">All Countries</option>
              <option value="argentina">Argetina</option>
              <option value="brasil">Brasil</option>
              <option value="chile">Chile</option>
              <option value="uruguay">Uruguay</option>
            </select>
            <input class="filtro checkIn" type="date" />
            <input class="filtro checkOut" type="date" />
            <select class="filtro prices" name="selectPrice">
              <option value="0">AllPrices</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
            </select>
            <select class="filtro sizes" name="selectSize">
              <option value="allsizes">AllSizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button class="clear">Clear</button>
          </div>
        </div>
        <div class="contenedorTexto">
          <p class="textoFijo">We have found for you...</p>
          <p class="textoDinamico">
            All sizes hotels of all category prices, in all countries.
          </p>
        </div>
      </div>`;

// Trayendo variables del DOM.

let main = document.getElementsByClassName("main")[0];
let checkIn = document.getElementsByClassName("checkIn")[0];
let checkOut = document.getElementsByClassName("checkOut")[0];
let precioIngresado = document.getElementsByClassName("prices")[0];
let botonClear = document.getElementsByClassName("clear")[0];
let textoDinamico = document.getElementsByClassName("textoDinamico")[0];

// Estableciendo por defecto los valores del texto 
//dinámico.
let textoFiltroFechas = "";
textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;



// Establecer las fechas mínimas de CheckIn.
// y de CheckOut.
// Estas no puede ser menor a la fecha de hoy.

let hoy = new Date();
let dd = String(hoy.getDate()).padStart(2, '0');
let mm = String(hoy.getMonth() + 1).padStart(2, '0');
let yyyy = hoy.getFullYear();
let fechaActual = yyyy + '-' + mm + '-' + dd;
checkIn.setAttribute("min", fechaActual);
checkOut.setAttribute("min", fechaActual);

// llamo a la función que imprime todas las cards por default.
imprimirTodasLasCards(main);

//AddEventListener para los cambios en los precios.

precioIngresado.addEventListener("change", async (e) => {
  let precioIngresado = Number(e.target.value);
  if (precioIngresado === 1 && checkOut.value.length === 0) {
    imprimirCardsFiltradasPorPrecio(main, precioIngresado);
  } else if (precioIngresado === 2 && checkOut.value.length === 0) {
    imprimirCardsFiltradasPorPrecio(main, precioIngresado);
  } else if (precioIngresado === 3 && checkOut.value.length === 0) {
    imprimirCardsFiltradasPorPrecio(main, precioIngresado);
  } else if (precioIngresado === 4 && checkOut.value.length === 0) {
    imprimirCardsFiltradasPorPrecio(main, precioIngresado);
  } else if (precioIngresado === 0 && checkOut.value.length === 0) {
    imprimirTodasLasCards(main);
  } else if (precioIngresado === 1 && checkOut.value.length !== 0) {
    // traigo el arreglo filtrado por checkout
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
      hotel => hotel.price === 1)
    if (hotelesCheckOutMasPrecio < 1) {
      alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
    }

    main.innerHTML = "";

    hotelesCheckOutMasPrecio.forEach(e => {
      let card = document.createElement("div");
      card.classList.add("divMain");
      card.style.backgroundImage = `url("${e.photo}")`;
      let h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.innerText = e.name;

      let contenedorArriba = document.createElement("div");
      contenedorArriba.classList.add("contenedorArriba");

      let p = document.createElement("p");
      p.classList.add("p");
      p.innerText = e.country;

      let img = document.createElement("img");
      img.classList.add("img");

      if (e.country.toLowerCase() === "argentina") {
        img.setAttribute("src", "./assets/banderaArgentina.png");
      } else if (e.country.toLowerCase() === "chile") {
        img.setAttribute("src", "./assets/banderaChile.jpg");
      } else if (e.country.toLowerCase() === "brasil") {
        img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
      } else if (e.country.toLowerCase() === "uruguay") {
        img.setAttribute("src", "./assets/banderaUruguay.jpg");
      }

      contenedorArriba.append(img, p);

      let contenedorAbajo = document.createElement("div");
      contenedorAbajo.classList.add("contenedorAbajo");

      let pAbajo = document.createElement("p");
      pAbajo.classList.add("pAbajo");
      pAbajo.innerText = `${e.rooms} Rooms`;

      let precioAbajo = document.createElement("p");
      precioAbajo.classList.add("precioAbajo");

      if (e.price === 1) {
        precioAbajo.innerText = "$";
      } else if (e.price === 2) {
        precioAbajo.innerText = "$$";
      } else if (e.price === 3) {
        precioAbajo.innerText = "$$$";
      } else if (e.price === 4) {
        precioAbajo.innerText = "$$$$";
      }

      contenedorAbajo.append(pAbajo, precioAbajo);
      card.append(h2, contenedorArriba, contenedorAbajo);
      main.appendChild(card);
    });
  } else if (precioIngresado === 2 && checkOut.value.length !== 0) {
    // traigo el arreglo filtrado por checkout
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
      hotel => hotel.price === 2)
    if (hotelesCheckOutMasPrecio < 1) {
      alert("No existe un hotel disponible con estas caracteristicas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
    }

    main.innerHTML = "";

    hotelesCheckOutMasPrecio.forEach(e => {
      let card = document.createElement("div");
      card.classList.add("divMain");
      card.style.backgroundImage = `url("${e.photo}")`;
      let h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.innerText = e.name;

      let contenedorArriba = document.createElement("div");
      contenedorArriba.classList.add("contenedorArriba");

      let p = document.createElement("p");
      p.classList.add("p");
      p.innerText = e.country;

      let img = document.createElement("img");
      img.classList.add("img");

      if (e.country.toLowerCase() === "argentina") {
        img.setAttribute("src", "./assets/banderaArgentina.png");
      } else if (e.country.toLowerCase() === "chile") {
        img.setAttribute("src", "./assets/banderaChile.jpg");
      } else if (e.country.toLowerCase() === "brasil") {
        img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
      } else if (e.country.toLowerCase() === "uruguay") {
        img.setAttribute("src", "./assets/banderaUruguay.jpg");
      }

      contenedorArriba.append(img, p);

      let contenedorAbajo = document.createElement("div");
      contenedorAbajo.classList.add("contenedorAbajo");

      let pAbajo = document.createElement("p");
      pAbajo.classList.add("pAbajo");
      pAbajo.innerText = `${e.rooms} Rooms`;

      let precioAbajo = document.createElement("p");
      precioAbajo.classList.add("precioAbajo");

      if (e.price === 1) {
        precioAbajo.innerText = "$";
      } else if (e.price === 2) {
        precioAbajo.innerText = "$$";
      } else if (e.price === 3) {
        precioAbajo.innerText = "$$$";
      } else if (e.price === 4) {
        precioAbajo.innerText = "$$$$";
      }

      contenedorAbajo.append(pAbajo, precioAbajo);
      card.append(h2, contenedorArriba, contenedorAbajo);
      main.appendChild(card);
    });
  } else if (precioIngresado === 3 && checkOut.value.length !== 0) {
    // traigo el arreglo filtrado por checkout
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
      hotel => hotel.price === 3)
    if (hotelesCheckOutMasPrecio < 1) {
      alert("No existe un hotel disponible con estas caracteristicas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
    }

    main.innerHTML = "";

    hotelesCheckOutMasPrecio.forEach(e => {
      let card = document.createElement("div");
      card.classList.add("divMain");
      card.style.backgroundImage = `url("${e.photo}")`;
      let h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.innerText = e.name;

      let contenedorArriba = document.createElement("div");
      contenedorArriba.classList.add("contenedorArriba");

      let p = document.createElement("p");
      p.classList.add("p");
      p.innerText = e.country;

      let img = document.createElement("img");
      img.classList.add("img");

      if (e.country.toLowerCase() === "argentina") {
        img.setAttribute("src", "./assets/banderaArgentina.png");
      } else if (e.country.toLowerCase() === "chile") {
        img.setAttribute("src", "./assets/banderaChile.jpg");
      } else if (e.country.toLowerCase() === "brasil") {
        img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
      } else if (e.country.toLowerCase() === "uruguay") {
        img.setAttribute("src", "./assets/banderaUruguay.jpg");
      }

      contenedorArriba.append(img, p);

      let contenedorAbajo = document.createElement("div");
      contenedorAbajo.classList.add("contenedorAbajo");

      let pAbajo = document.createElement("p");
      pAbajo.classList.add("pAbajo");
      pAbajo.innerText = `${e.rooms} Rooms`;

      let precioAbajo = document.createElement("p");
      precioAbajo.classList.add("precioAbajo");

      if (e.price === 1) {
        precioAbajo.innerText = "$";
      } else if (e.price === 2) {
        precioAbajo.innerText = "$$";
      } else if (e.price === 3) {
        precioAbajo.innerText = "$$$";
      } else if (e.price === 4) {
        precioAbajo.innerText = "$$$$";
      }

      contenedorAbajo.append(pAbajo, precioAbajo);
      card.append(h2, contenedorArriba, contenedorAbajo);
      main.appendChild(card);
    });
  } else if (precioIngresado === 4 && checkOut.value.length !== 0) {
    // traigo el arreglo filtrado por checkout
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
      hotel => hotel.price === 4)
    if (hotelesCheckOutMasPrecio < 1) {
      alert("No existe un hotel disponible con estas caracteristicas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
    }

    main.innerHTML = "";

    hotelesCheckOutMasPrecio.forEach(e => {
      let card = document.createElement("div");
      card.classList.add("divMain");
      card.style.backgroundImage = `url("${e.photo}")`;
      let h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.innerText = e.name;

      let contenedorArriba = document.createElement("div");
      contenedorArriba.classList.add("contenedorArriba");

      let p = document.createElement("p");
      p.classList.add("p");
      p.innerText = e.country;

      let img = document.createElement("img");
      img.classList.add("img");

      if (e.country.toLowerCase() === "argentina") {
        img.setAttribute("src", "./assets/banderaArgentina.png");
      } else if (e.country.toLowerCase() === "chile") {
        img.setAttribute("src", "./assets/banderaChile.jpg");
      } else if (e.country.toLowerCase() === "brasil") {
        img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
      } else if (e.country.toLowerCase() === "uruguay") {
        img.setAttribute("src", "./assets/banderaUruguay.jpg");
      }

      contenedorArriba.append(img, p);

      let contenedorAbajo = document.createElement("div");
      contenedorAbajo.classList.add("contenedorAbajo");

      let pAbajo = document.createElement("p");
      pAbajo.classList.add("pAbajo");
      pAbajo.innerText = `${e.rooms} Rooms`;

      let precioAbajo = document.createElement("p");
      precioAbajo.classList.add("precioAbajo");

      if (e.price === 1) {
        precioAbajo.innerText = "$";
      } else if (e.price === 2) {
        precioAbajo.innerText = "$$";
      } else if (e.price === 3) {
        precioAbajo.innerText = "$$$";
      } else if (e.price === 4) {
        precioAbajo.innerText = "$$$$";
      }

      contenedorAbajo.append(pAbajo, precioAbajo);
      card.append(h2, contenedorArriba, contenedorAbajo);
      main.appendChild(card);
    });
  } else if (precioIngresado === 0 && checkOut.value.length !== 0) {
    // traigo el arreglo filtrado por checkout
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    // Como todos los precios de hoteles son válidos. No necesito hacer un filtrado por precios. 

    if (arregloHotelesDisponiblesPorCheckOut < 1) {
      alert("No existe un hotel disponible con estas caracteristicas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
    }

    main.innerHTML = "";

    arregloHotelesDisponiblesPorCheckOut.forEach(e => {
      let card = document.createElement("div");
      card.classList.add("divMain");
      card.style.backgroundImage = `url("${e.photo}")`;
      let h2 = document.createElement("h2");
      h2.classList.add("h2");
      h2.innerText = e.name;

      let contenedorArriba = document.createElement("div");
      contenedorArriba.classList.add("contenedorArriba");

      let p = document.createElement("p");
      p.classList.add("p");
      p.innerText = e.country;

      let img = document.createElement("img");
      img.classList.add("img");

      if (e.country.toLowerCase() === "argentina") {
        img.setAttribute("src", "./assets/banderaArgentina.png");
      } else if (e.country.toLowerCase() === "chile") {
        img.setAttribute("src", "./assets/banderaChile.jpg");
      } else if (e.country.toLowerCase() === "brasil") {
        img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
      } else if (e.country.toLowerCase() === "uruguay") {
        img.setAttribute("src", "./assets/banderaUruguay.jpg");
      }

      contenedorArriba.append(img, p);

      let contenedorAbajo = document.createElement("div");
      contenedorAbajo.classList.add("contenedorAbajo");

      let pAbajo = document.createElement("p");
      pAbajo.classList.add("pAbajo");
      pAbajo.innerText = `${e.rooms} Rooms`;

      let precioAbajo = document.createElement("p");
      precioAbajo.classList.add("precioAbajo");

      if (e.price === 1) {
        precioAbajo.innerText = "$";
      } else if (e.price === 2) {
        precioAbajo.innerText = "$$";
      } else if (e.price === 3) {
        precioAbajo.innerText = "$$$";
      } else if (e.price === 4) {
        precioAbajo.innerText = "$$$$";
      }

      contenedorAbajo.append(pAbajo, precioAbajo);
      card.append(h2, contenedorArriba, contenedorAbajo);
      main.appendChild(card);
    });
  }

}
)

//AddEventListener para el boton clear.

botonClear.addEventListener("click", () => {

  imprimirTodasLasCards(main);
  checkIn.setAttribute("min", fechaActual);
  checkOut.setAttribute("min", fechaActual);
  checkIn.removeAttribute("max");
  checkOut.removeAttribute("max");
  checkIn.value = checkIn.defaultValue;
  checkOut.value = checkOut.defaultValue;
  precioIngresado.selectedIndex = 0
  textoFiltroFechas = "";
  textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
})

checkIn.addEventListener("change", (e) => {
  // si a checkout no se le ha ingresado un valor.
  if (checkOut.value.length === 0) {
    checkOut.setAttribute("min", e.target.value);
  } else {
    textoDinamico.innerText = `All sizes hotels${fechasImpresas(e.target.value, checkOut.value)} in all countries.`;
  }
})

checkOut.addEventListener("change", async (e) => {
  // si a checkIn no se le ha ingresado un valor.
  if (checkIn.value.length === 0) {
    checkIn.setAttribute("max", checkOut.value);


    if (Number(precioIngresado.value) === 1 && checkOut.value.length !== 0) {
      // traigo el arreglo filtrado por checkout
      let arregloBruto = await llamarJSON()
      let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
      let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
      let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
        let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
        let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
        if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
          return true;
        }
      })

      let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 1)

      if (hotelesCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      hotelesCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }

    if (Number(precioIngresado.value) === 2 && checkOut.value.length !== 0) {
      // traigo el arreglo filtrado por checkout
      let arregloBruto = await llamarJSON()
      let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
      let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
      let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
        let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
        let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
        if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
          return true;
        }
      })

      let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 2)

      if (hotelesCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      hotelesCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }


    if (Number(precioIngresado.value) === 3 && checkOut.value.length !== 0) {
      // traigo el arreglo filtrado por checkout
      let arregloBruto = await llamarJSON()
      let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
      let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
      let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
        let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
        let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
        if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
          return true;
        }
      })

      let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 3)

      if (hotelesCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      hotelesCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }


    if (Number(precioIngresado.value) === 4 && checkOut.value.length !== 0) {
      // traigo el arreglo filtrado por checkout
      let arregloBruto = await llamarJSON()
      let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
      let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
      let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
        let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
        let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
        if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
          return true;
        }
      })

      let hotelesCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 4)

      if (hotelesCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      hotelesCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }


    if (Number(precioIngresado.value) === 0 && checkOut.value.length !== 0) {
      // traigo el arreglo filtrado por checkout
      let arregloBruto = await llamarJSON()
      let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
      let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
      let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
        let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
        let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
        if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
          return true;
        }
      })



      if (arregloHotelesDisponiblesPorCheckOut
        < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      arregloHotelesDisponiblesPorCheckOut
      .forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }


  } if (checkIn.value.length !== 0) {
    checkIn.setAttribute("max", checkOut.value);
    textoDinamico.innerText = `All sizes hotels${fechasImpresas(checkIn.value, e.target.value)} in all countries.`;
    //Solo traer el arreglo a partir del CheckOut.
    let arregloBruto = await llamarJSON()
    let fechaActualEnMS = (new Date(fechaActual)).getTime() + 86400000;
    let fechaCheckOutEn_ms = (new Date(checkOut.value)).getTime() + 86400000;
    let arregloHotelesDisponiblesPorCheckOut = arregloBruto.filter((e) => {
      let disponibilidadEnMs = e.availabilityTo - e.availabilityFrom;
      let fechaLimiteEn_ms = fechaActualEnMS + disponibilidadEnMs;
      if (fechaLimiteEn_ms >= fechaCheckOutEn_ms) {
        return true;
      }
    })

    if (arregloHotelesDisponiblesPorCheckOut.length < 1) {
      alert("No existe un hotel disponible para estas fechas. Ingrese los datos nuevamente.")
      imprimirTodasLasCards(main);
      checkIn.setAttribute("min", fechaActual);
      checkOut.setAttribute("min", fechaActual);
      checkIn.removeAttribute("max");
      checkOut.removeAttribute("max");
      checkIn.value = checkIn.defaultValue;
      checkOut.value = checkOut.defaultValue;
      precioIngresado.selectedIndex = 0
      textoFiltroFechas = "";
      textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;

    }


    if (arregloHotelesDisponiblesPorCheckOut.length >= 1 && Number(precioIngresado.value) === 0) {
      // traer aquí la impresión de los hoteles.

      main.innerHTML = "";

      arregloHotelesDisponiblesPorCheckOut.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });

    }

    if (arregloHotelesDisponiblesPorCheckOut.length >= 1 && Number(precioIngresado.value) === 1) {
      // voy a hallar los hoteles que dentro de "arregloHotelesDisponiblesPorCheckOut" tengan solo 1 dolar de valor.

      let arregloCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 1
      )

      if (arregloCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      arregloCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }

    if (arregloHotelesDisponiblesPorCheckOut.length >= 1 && Number(precioIngresado.value) === 2) {
      // voy a hallar los hoteles que dentro de "arregloHotelesDisponiblesPorCheckOut" tengan solo 1 dolar de valor.

      let arregloCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 2
      )

      if (arregloCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      arregloCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }


    if (arregloHotelesDisponiblesPorCheckOut.length >= 1 && Number(precioIngresado.value) === 3) {
      // voy a hallar los hoteles que dentro de "arregloHotelesDisponiblesPorCheckOut" tengan solo 1 dolar de valor.

      let arregloCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 3
      )

      if (arregloCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      arregloCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }

    if (arregloHotelesDisponiblesPorCheckOut.length >= 1 && Number(precioIngresado.value) === 4) {
      // voy a hallar los hoteles que dentro de "arregloHotelesDisponiblesPorCheckOut" tengan solo 1 dolar de valor.

      let arregloCheckOutMasPrecio = arregloHotelesDisponiblesPorCheckOut.filter(
        hotel => hotel.price === 4)

      if (arregloCheckOutMasPrecio < 1) {
        alert("No existe un hotel disponible para con estas caracteristicas. Ingrese los datos nuevamente.")
        imprimirTodasLasCards(main);
        checkIn.setAttribute("min", fechaActual);
        checkOut.setAttribute("min", fechaActual);
        checkIn.removeAttribute("max");
        checkOut.removeAttribute("max");
        checkIn.value = checkIn.defaultValue;
        checkOut.value = checkOut.defaultValue;
        precioIngresado.selectedIndex = 0
        textoFiltroFechas = "";
        textoDinamico.innerText = `All sizes hotels,${textoFiltroFechas} in all countries.`;
      }

      main.innerHTML = "";

      arregloCheckOutMasPrecio.forEach(e => {
        let card = document.createElement("div");
        card.classList.add("divMain");
        card.style.backgroundImage = `url("${e.photo}")`;
        let h2 = document.createElement("h2");
        h2.classList.add("h2");
        h2.innerText = e.name;

        let contenedorArriba = document.createElement("div");
        contenedorArriba.classList.add("contenedorArriba");

        let p = document.createElement("p");
        p.classList.add("p");
        p.innerText = e.country;

        let img = document.createElement("img");
        img.classList.add("img");

        if (e.country.toLowerCase() === "argentina") {
          img.setAttribute("src", "./assets/banderaArgentina.png");
        } else if (e.country.toLowerCase() === "chile") {
          img.setAttribute("src", "./assets/banderaChile.jpg");
        } else if (e.country.toLowerCase() === "brasil") {
          img.setAttribute("src", "./assets/banderaDeBrasil.jpg");
        } else if (e.country.toLowerCase() === "uruguay") {
          img.setAttribute("src", "./assets/banderaUruguay.jpg");
        }

        contenedorArriba.append(img, p);

        let contenedorAbajo = document.createElement("div");
        contenedorAbajo.classList.add("contenedorAbajo");

        let pAbajo = document.createElement("p");
        pAbajo.classList.add("pAbajo");
        pAbajo.innerText = `${e.rooms} Rooms`;

        let precioAbajo = document.createElement("p");
        precioAbajo.classList.add("precioAbajo");

        if (e.price === 1) {
          precioAbajo.innerText = "$";
        } else if (e.price === 2) {
          precioAbajo.innerText = "$$";
        } else if (e.price === 3) {
          precioAbajo.innerText = "$$$";
        } else if (e.price === 4) {
          precioAbajo.innerText = "$$$$";
        }

        contenedorAbajo.append(pAbajo, precioAbajo);
        card.append(h2, contenedorArriba, contenedorAbajo);
        main.appendChild(card);
      });
    }
































  }
})