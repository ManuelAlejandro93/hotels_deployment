import { llamarJSON } from "./api.js";

// Imprimir todas las cards //
async function imprimirTodasLasCards(main) {
  main.innerHTML = "";
  let arreglo = await llamarJSON();
  arreglo.forEach(e => {
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


async function imprimirCardsFiltradasPorPrecio(main, precioIngresado) {
  let arreglo = await llamarJSON();
  let arregloFiltrado = arreglo.filter(
    e => e.price === precioIngresado
  )

  main.innerHTML = "";

  arregloFiltrado.forEach(e => {
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

export { imprimirTodasLasCards, imprimirCardsFiltradasPorPrecio };