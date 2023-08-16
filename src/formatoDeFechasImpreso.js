export function fechasImpresas(ingreso, salida) {
    const diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const meses = ['January ', 'February', 'March', ' April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'];

    let ingresoReal = new Date(ingreso);
    let salidaReal = new Date(salida);

    let diaSemanaCheckIn = diasSemana[ingresoReal.getDay()];
    let diaCheckIn = (ingreso.split("-"))[2];
    let mesCheckIn = meses[ingresoReal.getMonth()];
    let añoCheckIn = ingresoReal.getFullYear();

    let diaSemanaCheckOut = diasSemana[salidaReal.getDay()];
    let diaCheckOut = (salida.split("-"))[2];
    let mesCheckOut = meses[salidaReal.getMonth()];
    let añoCheckOut = salidaReal.getFullYear();

    let fechaFormateada = `, From ${diaSemanaCheckIn}, ${mesCheckIn} ${diaCheckIn}, ${añoCheckIn}, to ${diaSemanaCheckOut}, ${mesCheckOut} ${diaCheckOut}, ${añoCheckOut}.`;

    return fechaFormateada;
}
