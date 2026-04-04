// ===============================
// Cargar CSV y máquinas
// ===============================
let maquinas = [];

fetch("buscador_maquinas.csv?v=" + new Date().getTime())
    .then(r => r.ok ? r.text() : Promise.reject("No se pudo cargar CSV"))
    .then(texto => {
        const filas = texto.split(/\r?\n/).filter(f => f.trim() !== "");
        maquinas = filas.map(fila => {
            const c = fila.split(";");
            return {
                maquina: c[0]?.trim() || "",
                locacion: c[1]?.trim() || "",
                sector: c[2]?.trim() || "",
                zona: c[3]?.trim() || "",
                modelo: c[4]?.trim() || "",
                juego: c[5]?.trim() || "",
                denominacion: c[6]?.trim() || ""
            };
        });
        console.log("Máquinas cargadas:", maquinas.length);
    })
    .catch(e => console.error(e));


// ===============================
// PLANOS
// ===============================
const planos = {
    "54": "planos/M7.jpg",
    "55": "planos/M7.jpg",
    "56": "planos/M7.jpg",
    "63": "planos/M7.jpg",
    "39": "planos/G4-Centro.png",
    "41": "planos/G4-Centro.png",
    "42": "planos/G4-Centro.png",
    "57": "planos/G4-Centro.png",
    "46": "planos/G4-Norte.png",
    "43": "planos/G4-Norte.png",
    "48": "planos/G4-Sur.png",
    "47": "planos/G4-Sur.png",
    "45": "planos/G4-Sur.png",
    "49": "planos/Entre-Piso.jpg",
    "51": "planos/VIP.jpg",
    "11": "planos/Sub-esp.png",
    "12": "planos/Sub-esp.png",
    "13": "planos/Sub-esp.png",
    "14": "planos/Sub-esp.png",
    "15": "planos/Sub-esp.png",
    "16": "planos/Sub-esp.png",
    "17": "planos/Sub-esp.png",
    "18": "planos/Sub-esp.png",
    "19": "planos/Sub-esp.png",
    "20": "planos/Sub-esp.png",
    "21": "planos/balcon-esp.png",
    "22": "planos/balcon-esp.png",
    "62": "planos/dolar.jpg"
};


// ===============================
// BUSCAR MAQUINA
// ===============================
function buscarMaquina() {

    const valor = document.getElementById("valorBusqueda").value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    if (!valor) {
        resultado.innerHTML = "<p class='mensaje-error'>Ingresá un valor</p>";
        return;
    }

    const esZona = /^\d{2}$/.test(valor) && maquinas.some(m => m.zona === valor);
    if (esZona) {
        mostrarPlano(valor);
        return;
    }

    const encontrados = maquinas.filter(m =>
        [m.maquina, m.locacion, m.modelo, m.juego, m.zona]
            .some(x => (x || "").toLowerCase().includes(valor))
    );

    if (!encontrados.length) {
        resultado.innerHTML = "<p class='mensaje-error'>No se encontraron resultados</p>";
        return;
    }

    encontrados.forEach((m, i) => {
        const card = document.createElement("div");
        card.classList.add("tarjeta");

        card.innerHTML = `
            <h3>MAQUINA ${m.maquina}</h3>
            <p><strong>LOCACION:</strong> ${m.locacion}</p>
            <p><strong>SECTOR:</strong> ${m.sector}</p>
            <p><strong>ZONA:</strong> <span class="zona-link" onclick="mostrarPlano('${m.zona}')">${m.zona}</span></p>
            <p><strong>MODELO:</strong> ${m.modelo}</p>
            <p><strong>JUEGO:</strong> ${m.juego}</p>
            <p><strong>DENOMINACIÓN:</strong> ${m.denominacion || "No especificada"}</p>
        `;

        resultado.appendChild(card);
        setTimeout(() => card.classList.add("mostrar"), i * 100);
    });
}


// ===============================
// MOSTRAR PLANO 
// ===============================


function mostrarPlano(zona) {
    zona = zona.trim();
    const plano = planos[zona];

    if (!plano) {
        alert("No hay plano para esta zona");
        return;
    }

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top:0; left:0;
        width:100%; height:100%;
        background: rgba(0,0,0,0.95);
        z-index:1000;
    `;

    const contenedor = document.createElement("div");
    contenedor.style.cssText = `
        width:100%;
        height:100%;
        overflow:auto;
        position: relative;
    `;

    const img = document.createElement("img");
    img.src = plano;
    img.style.display = "block";

    let escala = 0.7;
    img.style.width = (escala * 100) + "%";

    contenedor.addEventListener("wheel", (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            escala += e.deltaY < 0 ? 0.15 : -0.15;
            escala = Math.min(Math.max(escala, 0.5), 4);
            img.style.width = (escala * 100) + "%";
        }
    });

    const btn = document.createElement("button");
    btn.innerText = "← Volver";

btn.style.cssText = `
    position:absolute;
    bottom:20px;
    right:20px;
    padding:16px 22px;
    font-size:26px;
    font-weight:bold;
    background: #ff7a00;
    color:white;
    border:none;
    border-radius:10px;
    cursor:pointer;
    z-index:10;
`;

btn.style.width = "auto";
btn.style.maxWidth = "none";
btn.style.margin = "0";

btn.onclick = () => overlay.remove();

    contenedor.appendChild(img);
    overlay.appendChild(contenedor);
    overlay.appendChild(btn);

    document.body.appendChild(overlay);
}


// ===============================
// MOSTRAR KIOSK 
// ===============================
function mostrarPlanoKiosk(plano) {

    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top:0; left:0;
        width:100%; height:100%;
        background: rgba(0,0,0,0.95);
        z-index:1000;
    `;

    const contenedor = document.createElement("div");
    contenedor.style.cssText = `
        width:100%;
        height:100%;
        overflow:auto;
        position: relative;
    `;

    const img = document.createElement("img");
    img.src = plano;
    img.style.display = "block";
    img.style.width = "auto";
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90vh";
    img.style.margin = "0 auto";
    img.style.display = "block";

    const btn = document.createElement("button");
    btn.innerText = "Volver";
    btn.style.cssText = `
        position:absolute;
        bottom:20px;
        right:20px;
        padding:12px 20px;
        font-size:16px;
        background: orange;
        color:white;
        border:none;
        border-radius:6px;
    `;

    btn.onclick = (e) => {
        e.stopPropagation();
        overlay.remove();
    };

    contenedor.appendChild(img);
    contenedor.appendChild(btn);
    overlay.appendChild(contenedor);

    document.body.appendChild(overlay);
}


// ===============================
// BUSQUEDA GENERAL
// ===============================
function buscarGeneral() {
    const valor = document.getElementById("valorBusqueda").value.trim();
    if (/^K0*\d{1,2}$/i.test(valor)) {
        buscarKiosk();
    } else {
        buscarMaquina();
    }
}


// ===============================
// NUEVA BUSQUEDA
// ===============================
function nuevaBusqueda() {
    const input = document.getElementById("valorBusqueda");
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "";
    input.value = "";
    input.focus();

    window.scrollTo(0, 0);
}


// ===============================
// EVENTOS
// ===============================
window.addEventListener("load", () => {

    document.getElementById("btnBuscar")
        .addEventListener("click", buscarGeneral);

    document.getElementById("btnNuevaBusqueda")
        ?.addEventListener("click", nuevaBusqueda);

    document.getElementById("valorBusqueda")
        .addEventListener("keypress", e => {
            if (e.key === "Enter") buscarGeneral();
        });
});