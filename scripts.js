
// ==================== LÓGICA DEL MENÚ MÓVIL ====================
function inicializarMenuMovil() {
    const botonMenu = document.getElementById("alternar-menu");
    const menuNavegacion = document.getElementById("menu-principal");

    if (!botonMenu || !menuNavegacion) {
        return;
    }

    const iconoMenu = botonMenu.querySelector("i");
    const enlacesNavegacion = menuNavegacion.querySelectorAll(".navegacion__enlace");
    const consultaMovil = window.matchMedia("(max-width: 760px)");

    function establecerMenuAbierto(estaAbierto) {
        const debeAbrirse = estaAbierto && consultaMovil.matches;
        menuNavegacion.classList.toggle("abierto", debeAbrirse);
        document.body.classList.toggle("menu-abierto", debeAbrirse);
        botonMenu.setAttribute("aria-expanded", String(debeAbrirse));
        botonMenu.setAttribute("aria-label", debeAbrirse ? "Cerrar menú" : "Abrir menú");
        iconoMenu.classList.toggle("fa-bars", !debeAbrirse);
        iconoMenu.classList.toggle("fa-xmark", debeAbrirse);
    }

    botonMenu.addEventListener("click", function () {
        establecerMenuAbierto(botonMenu.getAttribute("aria-expanded") !== "true");
    });

    enlacesNavegacion.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            establecerMenuAbierto(false);
        });
    });

    document.addEventListener("pointerdown", function (evento) {
        const elementoPulsado = evento.target;
        const menuEstaAbierto = botonMenu.getAttribute("aria-expanded") === "true";

        if (
            menuEstaAbierto
            && elementoPulsado instanceof Node
            && !menuNavegacion.contains(elementoPulsado)
            && !botonMenu.contains(elementoPulsado)
        ) {
            establecerMenuAbierto(false);
        }
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") {
            establecerMenuAbierto(false);
            botonMenu.focus();
        }
    });

    window.addEventListener("resize", function () {
        if (!consultaMovil.matches) {
            establecerMenuAbierto(false);
        }
    });
}

// ==================== NAVEGACIÓN ACTIVA ====================
function inicializarNavegacionActiva() {
    const nombrePagina = window.location.pathname.split("/").pop() || "index.html";
    const paginaActual = ["campeche.html", "direcciones.html"].includes(nombrePagina)
        ? "comunidades.html"
        : nombrePagina;
    const enlacesNavegacion = document.querySelectorAll(".navegacion__enlace");

    enlacesNavegacion.forEach(function (enlace) {
        const paginaEnlace = enlace.getAttribute("href").split("#")[0];
        const esPaginaActual = paginaEnlace === paginaActual;
        enlace.classList.toggle("activo", esPaginaActual);

        if (esPaginaActual) {
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.removeAttribute("aria-current");
        }
    });
}

// ==================== REPORTE COMUNITARIO DESCARGABLE ====================
function inicializarReporteComunitario() {
    const formulario = document.getElementById("formulario-reporte");
    const resultado = document.getElementById("resultado-reporte");
    const botonDescarga = document.getElementById("descargar-reporte");

    if (!formulario || !resultado || !botonDescarga) {
        return;
    }

    let textoReporte = "";

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!formulario.reportValidity()) {
            return;
        }

        const datosFormulario = new FormData(formulario);
        const fecha = new Date().toLocaleDateString("es-VE");
        textoReporte = [
            "REPORTE COMUNITARIO DE RESIDUOS",
            "Fecha de elaboración: " + fecha,
            "",
            "Organismo destinatario sugerido: " + datosFormulario.get("organismo"),
            "Ubicación o referencia: " + datosFormulario.get("ubicacion").trim(),
            "Fecha de observación: " + datosFormulario.get("fecha-observacion"),
            "Tipo de problema: " + datosFormulario.get("situacion"),
            "Solicitud de atención: " + datosFormulario.get("atencion-solicitada"),
            "Descripción: " + datosFormulario.get("descripcion").trim(),
            "",
            "Este reporte fue preparado por EcoCampeche como apoyo para documentar una situación comunitaria. Verifique la información y adjunte fotografías fechadas antes de entregarlo a las autoridades competentes."
        ].join("\n");

        resultado.textContent = "Reporte listo. Descárgalo y adjunta fotografías del lugar desde un sitio seguro. No se envió información a ningún servidor.";
        resultado.classList.add("visible");
        botonDescarga.hidden = false;
        botonDescarga.focus();
    });

    botonDescarga.addEventListener("click", function () {
        if (!textoReporte) {
            return;
        }

        const archivo = new Blob([textoReporte], { type: "text/plain;charset=utf-8" });
        const direccionArchivo = URL.createObjectURL(archivo);
        const enlaceDescarga = document.createElement("a");
        enlaceDescarga.href = direccionArchivo;
        enlaceDescarga.download = "reporte-comunitario-ecocampeche.txt";
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        enlaceDescarga.remove();
        window.setTimeout(function () {
            URL.revokeObjectURL(direccionArchivo);
        }, 1000);
    });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", function () {
    inicializarMenuMovil();
    inicializarNavegacionActiva();
    inicializarReporteComunitario();
});
