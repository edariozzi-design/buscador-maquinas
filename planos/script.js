// ===============================
// Cargar CSV y máquinas
// ===============================
let maquinas = [];

fetch("/buscador_maquinas.csv?v=" + new Date().getTime())
.then(r => r.ok ? r.text() : Promise.reject("No se pudo cargar CSV"))
.then(texto => {
    const filas = texto.split(/\r?\n/).filter(f => f.trim() !== "");
    maquinas = filas.map(fila => {
        const c = fila.split(";");
        return {
            maquina: c[0]?.trim() || "",
            locacion: c[1]?.trim() || "",
            moneda: c[2]?.trim() || "",
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
// Planos con rutas absolutas
// ===============================
const planos = {
    "54": "/planos/M7.jpg",
    "55": "/planos/M7.jpg",
    "56": "/planos/M7.jpg",
    "63": "/planos/M7.jpg",
    "39": "/planos/G4-Centro.jpg",
    "41": "/planos/G4-Centro.jpg",
    "42": "/planos/G4-Centro.jpg",
    "57": "/planos/G4-Centro.jpg",
    "46": "/planos/G4-Norte.jpg",
    "43": "/planos/G4-Norte.jpg",
    "48": "/planos/G4-Sur.jpg",
    "47": "/planos/G4-Sur.jpg",
    "45": "/planos/G4-Sur.jpg",
    "49": "/planos/Entre-piso.jpg",
    "51": "/planos/VIP.jpg",
    "11": "/planos/PB-esp.jpg",
    "12": "/planos/PB-esp.jpg",
    "13": "/planos/PB-esp.jpg",
    "14": "/planos/PB-esp.jpg",
    "15": "/planos/PB-esp.jpg",
    "16": "/planos/PB-esp.jpg",
    "17": "/planos/PB-esp.jpg",
    "18": "/planos/PB-esp.jpg",
    "19": "/planos/PB-esp.jpg",
    "20": "/planos/PB-esp.jpg",
    "21": "/planos/balcon-esp.png",
    "22": "/planos/balcon-esp.png",
    "62": "/planos/dolar.jpg"
};

// ===============================
// Funciones de búsqueda
// ===============================
function buscarMaquina() {
    const valor = document.getElementById("valorBusqueda").value.trim().toLowerCase();
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "";

    const url = new URL(window.location);
    url.searchParams.set("buscar", valor);
    window.history.pushState({}, "", url);

    const encontrados = maquinas.filter(m => 
        [m.maquina, m.locacion, m.moneda, m.modelo, m.juego].some(x => (x||"").toLowerCase().includes(valor))
    );

    if (!encontrados.length) {
        resultado.innerHTML = "<p>No se encontraron resultados</p>";
        return;
    }

    encontrados.forEach((m,i) => {
        const card = document.createElement("div");
        card.classList.add("tarjeta");
        card.innerHTML = `
            <h3>MAQUINA ${m.maquina}</h3>
            <p><strong>LOCACION:</strong> ${m.locacion}</p>
            <p><strong>MONEDA:</strong> ${m.moneda}</p>
            <p><strong>ZONA:</strong> <span class="zona-link" onclick="mostrarPlano('${m.zona}')">${m.zona}</span></p>
            <p><strong>MODELO:</strong> ${m.modelo}</p>
            <p><strong>JUEGO:</strong> ${m.juego}</p>
            <p><strong>DENOMINACIÓN:</strong> ${m.denominacion || "No especificada"}</p>
        `;
        resultado.appendChild(card);
        setTimeout(()=>card.classList.add("mostrar"), i*120);
    });
}

function mostrarPlano(zona){
    zona = zona.trim();
    const plano = planos[zona];
    if(!plano){ alert("No hay plano para esta zona"); return; }

    const overlay = document.createElement("div");
    overlay.style.position="fixed"; overlay.style.top=0; overlay.style.left=0;
    overlay.style.width="100%"; overlay.style.height="100%";
    overlay.style.background="rgba(0,0,0,0.9)";
    overlay.style.display="flex"; overlay.style.flexDirection="column";
    overlay.style.alignItems="center"; overlay.style.justifyContent="center";
    overlay.style.zIndex=1000;

    const img = document.createElement("img");
    img.src=plano; img.style.maxWidth="90vw"; img.style.maxHeight="80vh";

    const btn = document.createElement("button");
    btn.innerText="Volver al buscador"; 
    btn.style.marginTop="20px"; btn.style.padding="12px 25px";
    btn.style.fontSize="16px"; btn.style.borderRadius="8px";
    btn.style.border="none"; btn.style.cursor="pointer";
    btn.style.background="#4b6584"; btn.style.color="white";
    btn.onclick=()=>document.body.removeChild(overlay);

    overlay.appendChild(img); overlay.appendChild(btn);
    document.body.appendChild(overlay);
}

function nuevaBusqueda(){
    document.getElementById("valorBusqueda").value="";
    document.getElementById("resultado").innerHTML="";
    document.getElementById("valorBusqueda").focus();
}

document.getElementById("valorBusqueda").addEventListener("keypress", e=>{
    if(e.key==="Enter") buscarMaquina();
});

window.addEventListener("load", ()=>{
    const busqueda = new URLSearchParams(window.location.search).get("buscar");
    if(busqueda){ document.getElementById("valorBusqueda").value=busqueda; setTimeout(()=>buscarMaquina(),200); }
});