// ===============================
// VARIABLE GLOBAL
// ===============================
let maquinas = [];

// ===============================
// CARGAR CSV
// ===============================
fetch("buscador_maquinas.csv?v=" + new Date().getTime())
.then(response => {
    if (!response.ok) throw new Error("No se pudo cargar el CSV");
    return response.text();
})
.then(texto => {
    const filas = texto.split(/\r?\n/).filter(f => f.trim() !== "");
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
})
.catch(error => console.error("Error cargando CSV:", error));

// ===============================
// PLANOS
// ===============================
const planos = {
    "M7": ["54","55","56","63"],
    "G4-Centro": ["39","41","42","57"],
    "G4-Norte": ["43","46"],
    "G4-Sur": ["45","47","48"],
    "PB-esp": ["11","12","13","14","15","16","17","18","19","20"],
    "balcon-esp": ["21","22"],
    "Entre-piso": ["49"],
    "VIP": ["51"],
    "dolar": ["62"]
};

// ===============================
// BUSCAR MAQUINA
// ===============================
function buscarMaquina() {
    const valor = document.getElementById("valorBusqueda").value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    // Actualiza URL
    const url = new URL(window.location);
    url.searchParams.set("buscar", valor);
    window.history.pushState({}, "", url);

    const encontrados = maquinas.filter(m => {
        const maquina = (m.maquina || "").toLowerCase();
        const locacion = (m.locacion || "").toLowerCase();
        const moneda = (m.moneda || "").toLowerCase();
        const modelo = (m.modelo || "").toLowerCase();
        const juego = (m.juego || "").toLowerCase();
        return maquina.includes(valor) || locacion.includes(valor) || moneda.includes(valor) || modelo.includes(valor) || juego.includes(valor);
    });

    if (encontrados.length === 0) {
        resultado.innerHTML = "<p>No se encontraron resultados</p>";
        return;
    }

    encontrados.forEach((m, index) => {
        const card = document.createElement("div");
        card.classList.add("tarjeta");
        card.innerHTML = `
            <h3>MAQUINA ${m.maquina}</h3>
            <p><strong>LOCACION:</strong> ${m.locacion}</p>
            <p><strong>MONEDA:</strong> ${m.moneda}</p>
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
        setTimeout(() => card.classList.add("mostrar"), index * 120);
    });
}

// ===============================
// MOSTRAR PLANO (prueba .jpg y .png)
// ===============================
function mostrarPlano(zona) {
    zona = String(zona).trim().replace(/[^0-9]/g,"");
    let planoEncontrado = null;

    for (const key in planos) {
        if (planos[key].includes(zona)) {
            // Probar primero JPG
            const jpg = `planos/${key}.jpg`;
            const png = `planos/${key}.png`;
            fetch(jpg, { method: "HEAD" })
            .then(res => {
                if (res.ok) abrirOverlay(jpg);
                else {
                    // Si JPG no existe, probar PNG
                    fetch(png, { method: "HEAD" })
                    .then(res2 => {
                        if (res2.ok) abrirOverlay(png);
                        else alert("No hay plano para esta zona");
                    });
                }
            });
            return; // salir del for
        }
    }
    alert("No hay plano para esta zona");
}

function abrirOverlay(plano) {
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
    btnCerrar.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(img);
    overlay.appendChild(btnCerrar);
    document.body.appendChild(overlay);
}

// ===============================
// ENTER PARA BUSCAR
// ===============================
document.getElementById("valorBusqueda")
.addEventListener("keypress", function(event){
    if(event.key === "Enter") buscarMaquina();
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
        setTimeout(() => buscarMaquina(), 200);
    }
});