// ===============================
// VARIABLE GLOBAL
// ===============================
let maquinas = [];


// ===============================
// CARGAR CSV
// ===============================
fetch("buscador_maquinas.csv?v=" + new Date().getTime())
.then(response => {

    if (!response.ok) {
        throw new Error("No se pudo cargar el CSV");
    }

    return response.text();

})
.then(texto => {

    const filas = texto
        .split(/\r?\n/)
        .filter(f => f.trim() !== "");

    maquinas = filas.map(fila => {

        const columnas = fila.split(";");

return {

    maquina: columnas[0] ? columnas[0].trim() : "",
    locacion: columnas[1] ? columnas[1].trim() : "",
    moneda: columnas[2] ? columnas[2].trim() : "",
    zona: columnas[3] ? columnas[3].trim() : "",
    modelo: columnas[4] ? columnas[4].trim() : "",
    juego: columnas[5] ? columnas[5].trim() : "",
    denominacion: columnas[6] ? columnas[6].trim() : ""

};

    });

    console.log("Máquinas cargadas:", maquinas.length);
    console.log("Ejemplo:", maquinas[0]);

})
.catch(error => {
    console.error("Error cargando CSV:", error);
});


// ===============================
// PLANOS
// ===============================
const planos = {

    "54": "planos/M7.jpg",
    "55": "planos/M7.jpg",
    "56": "planos/M7.jpg",
    "63": "planos/M7.jpg",

    "39": "planos/G4-Centro.jpg",
    "41": "planos/G4-Centro.jpg",
    "42": "planos/G4-Centro.jpg",
    "57": "planos/G4-Centro.jpg",

    "46": "planos/G4-Norte.jpg",
    "43": "planos/G4-Norte.jpg",

    "48": "planos/G4-Sur.jpg",
    "47": "planos/G4-Sur.jpg",
    "45": "planos/G4-Sur.jpg",

    "49": "planos/Entre-piso.jpg",
    "51": "planos/VIP.jpg",

    "11": "planos/PB-esp.jpg",
    "12": "planos/PB-esp.jpg",
    "13": "planos/PB-esp.jpg",
    "14": "planos/PB-esp.jpg",
    "15": "planos/PB-esp.jpg",
    "16": "planos/PB-esp.jpg",
    "17": "planos/PB-esp.jpg",
    "18": "planos/PB-esp.jpg",
    "19": "planos/PB-esp.jpg",
    "20": "planos/PB-esp.jpg",

    "21": "planos/balcon-esp.png",
    "22": "planos/balcon-esp.png",

    "62": "planos/dolar.jpg"
};


// ===============================
// BUSCAR MAQUINA
// ===============================
function buscarMaquina() {

    const valor = document
        .getElementById("valorBusqueda")
        .value
        .trim()
        .toLowerCase();

    const resultado = document.getElementById("resultado");

    // LIMPIA RESULTADOS ANTERIORES
    resultado.innerHTML = "";

    // ACTUALIZA URL
    const url = new URL(window.location);
    url.searchParams.set("buscar", valor);
    window.history.pushState({}, "", url);

    const encontrados = maquinas.filter(m => {

    const maquina = String(m.maquina).toLowerCase();
    const locacion = String(m.locacion).toLowerCase();
    const moneda = String(m.moneda).toLowerCase();
    const modelo = String(m.modelo).toLowerCase();
    const juego = String(m.juego).toLowerCase();

    return (
        maquina.includes(valor) ||
        locacion.includes(valor) ||
        moneda.includes(valor) ||
        modelo.includes(valor) ||
        juego.includes(valor)
    );

});

    encontrados.forEach((m, index) => {

        const card = document.createElement("div");
        card.classList.add("tarjeta");

        card.innerHTML = `
            <h3>MAQUINA ${m.maquina}</h3>

            <p><strong>LOCACION:</strong> ${m.locacion}</p>

            <p><strong>SECTOR:</strong> ${m.sector}</p>

            <p><strong>ZONA:</strong>
            <span class="zona-link" onclick="mostrarPlano('${m.zona}')">
            ${m.zona}
            </span>
            </p>

            <p><strong>MODELO:</strong> ${m.modelo}</p>

            <p><strong>JUEGO:</strong> ${m.juego}</p>

            <p><strong>DENOMINACIÓN:</strong> ${m.denominacion || "No especificada"}</p>
        `;

        resultado.appendChild(card);

        setTimeout(() => {
            card.classList.add("mostrar");
        }, index * 120);

    });

}


// ===============================
// MOSTRAR PLANO
// ===============================
function mostrarPlano(zona) {

    zona = zona.toString().trim().replace(/[^0-9]/g,"");

    console.log("Zona buscada:", zona);

    const plano = planos[zona];

    console.log("Plano encontrado:", plano);

    if (!plano) {
        alert("No hay plano para esta zona");
        return;
    }

    const overlay = document.createElement("div");

    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.90)";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 1000;

    const img = document.createElement("img");

    img.src = plano;
    img.style.maxWidth = "90vw";
    img.style.maxHeight = "80vh";

    const btnCerrar = document.createElement("button");

    btnCerrar.innerText = "Volver al buscador";

    btnCerrar.style.marginTop = "20px";
    btnCerrar.style.padding = "12px 25px";
    btnCerrar.style.fontSize = "16px";
    btnCerrar.style.borderRadius = "8px";
    btnCerrar.style.border = "none";
    btnCerrar.style.cursor = "pointer";
    btnCerrar.style.background = "#4b6584";
    btnCerrar.style.color = "white";

    btnCerrar.onclick = () => {
        document.body.removeChild(overlay);
    };

    overlay.appendChild(img);
    overlay.appendChild(btnCerrar);

    document.body.appendChild(overlay);

}


// ===============================
// ENTER PARA BUSCAR
// ===============================
document.getElementById("valorBusqueda")
.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        buscarMaquina();
    }

});


// ===============================
// NUEVA BUSQUEDA
// ===============================
function nuevaBusqueda() {

    document.getElementById("valorBusqueda").value = "";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("valorBusqueda").focus();

}


// ===============================
// BUSCAR DESDE URL
// ===============================
window.addEventListener("load", () => {

    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get("buscar");

    if (busqueda) {

        document.getElementById("valorBusqueda").value = busqueda;

        setTimeout(() => {
            buscarMaquina();
        }, 200);

    }

});