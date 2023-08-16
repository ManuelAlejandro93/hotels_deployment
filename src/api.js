async function llamarJSON() {
    let response = await fetch("https://6256097e8646add390e01d99.mockapi.io/hotels/reservation/hotels");
    let json = await response.json();
    return await json;
}

export {llamarJSON}