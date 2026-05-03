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
    "51": "planos/VIP.png",
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
// KIOSK
// ===============================

const planosKiosk = {
    "K17": "kiosk/Kiosk-sub-espe.jpg",
    "K18": "kiosk/Kiosk-sub-espe.jpg",
    "K27": "kiosk/Kiosk-sub-espe.jpg",
    "K34": "kiosk/Kiosk-sub-espe.jpg",
    "K24": "kiosk/Kiosk-G4.jpg",
    "K30": "kiosk/Kiosk-G4.jpg",
    "K31": "kiosk/Kiosk-G4.jpg",
    "K25": "kiosk/Kiosk-EP.jpg",
    "K28": "kiosk/Kiosk-EP.jpg",
    "K22": "kiosk/Kiosk-Digital.jpg",
    "K16": "kiosk/M11-Libertador.jpg",
    "K20": "kiosk/M11-Libertador.jpg",
    "K7": "kiosk/M11-Pista.jpg",
    "K8": "kiosk/M11-Pista.jpg",
    "K10": "kiosk/M11-Pista.jpg",
    "K6": "kiosk/M15.jpg",
    "K33": "kiosk/Balcon-esp.jpg"
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
        m.maquina.toLowerCase() === valor ||
        m.locacion.toLowerCase() === valor ||
        m.modelo.toLowerCase().includes(valor) ||
        m.juego.toLowerCase().includes(valor) ||
        m.zona.toLowerCase().includes(valor)
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
        overflow: auto;
        z-index:1000;
    `;

    const contenedor = document.createElement("div");
    contenedor.style.cssText = `
        width:100%;
        min-height:100%;
        position: relative;
        padding:20px;
    `;

    const img = document.createElement("img");
    img.src = plano;
    img.style.display = "block";
    img.style.height = "auto";

    if (window.innerWidth < 768) {
        img.style.width = "120%";
        img.style.maxHeight = "95vh";
        img.style.margin = "5vh auto";
    } else {
        img.style.width = "70%";
    }

    let escala = 1;
    img.addEventListener("wheel", (e) => {
        e.preventDefault();
        escala += e.deltaY < 0 ? 0.15 : -0.15;
        escala = Math.min(Math.max(escala, 0.5), 4);
        img.style.width = (escala * 100) + "%";
    });

    const btn = document.createElement("button");
    btn.innerText = "← Volver";
    btn.style.cssText = `
        position: fixed;
        bottom:20px;
        right:20px;
        background:rgb(42, 55, 243);
        color:white;
        border:none;
        border-radius:10px;
        cursor:pointer;
        z-index:1001;
        font-size:${window.innerWidth < 768 ? "20px" : "26px"};
        padding:${window.innerWidth < 768 ? "12px 18px" : "18px"};
    `;

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
        display:flex;
        justify-content:center;
        padding:20px;
    `;

    const img = document.createElement("img");
    img.src = plano;
    img.style.display = "block";
    img.style.margin = "auto";
    img.style.height = "auto";

    img.style.width = window.innerWidth < 768 ? "95%" :
        (plano.includes("Kiosk-sub-espe.jpg") || plano.includes("Kiosk-G4.jpg"))
    ? "60%"
    : "30%"

    const btn = document.createElement("button");
    btn.innerText = "← Volver";
    btn.style.cssText = `
        position: fixed;
        bottom:20px;
        right:20px;
        background:orange;
        color:white;
        border:none;
        border-radius:10px;
        cursor:pointer;
        z-index:1001;
        font-size:${window.innerWidth < 600 ? "20px" : "26px"};
        padding:${window.innerWidth < 600 ? "12px 18px" : "18px"};
    `;

    btn.onclick = () => {
        overlay.remove();
        btn.blur();
    };

    contenedor.appendChild(img);
    overlay.appendChild(contenedor);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
}

// ===============================
// BUSCAR KIOSK
// ===============================

function buscarKiosk() {
    const valor = document.getElementById("valorBusqueda").value.trim().toUpperCase();
    const plano = planosKiosk[valor];
    if (!plano) {
        alert("No se encontró el kiosk");
        return;
    }
    mostrarPlanoKiosk(plano);
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