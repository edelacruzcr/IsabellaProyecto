
// Navegación
/** Controla el menú adaptable, sus submenús y el cierre con Escape o al tocar fuera. */
function inicializarMenuMovil() {
    const botonMenu = document.getElementById("alternar-menu");
    const menuNavegacion = document.getElementById("menu-principal");

    if (!botonMenu || !menuNavegacion) {
        return;
    }

    const iconoMenu = botonMenu.querySelector("i");
    const enlacesNavegacion = menuNavegacion.querySelectorAll(".navegacion__enlace");
    const menusDesplegables = menuNavegacion.querySelectorAll(".navegacion__desplegable");
    const consultaMovil = window.matchMedia("(max-width: 1080px)");

    menusDesplegables.forEach(function (menuDesplegable) {
        menuDesplegable.addEventListener("toggle", function () {
            if (!menuDesplegable.open) {
                return;
            }

            menusDesplegables.forEach(function (otroMenu) {
                if (otroMenu !== menuDesplegable) {
                    otroMenu.open = false;
                }
            });
        });
    });

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

/** Marca el enlace y la sección de navegación que corresponden a la URL actual. */
function inicializarNavegacionActiva() {
    const nombrePagina = window.location.pathname.split("/").pop() || "index.html";
    const hashActual = window.location.hash;

    const todosLosEnlaces = document.querySelectorAll(".navegacion__enlace");
    todosLosEnlaces.forEach(function (enlace) {
        const rutaHref = enlace.getAttribute("href") || "";
        const [paginaHref, hashHref] = rutaHref.split("#");
        const coincidePagina = (paginaHref === nombrePagina) || (!paginaHref && nombrePagina === "index.html");
        
        let coincide = false;
        if (coincidePagina) {
            if (hashHref) {
                coincide = hashActual === "#" + hashHref;
            } else {
                coincide = !hashActual || hashActual === "#contenido";
            }
        }

        enlace.classList.toggle("activo", coincide);
        if (coincide) {
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.removeAttribute("aria-current");
        }
    });

    const gruposDesplegables = document.querySelectorAll(".navegacion__grupo");
    gruposDesplegables.forEach(function (grupo) {
        const desplegable = grupo.querySelector(".navegacion__desplegable");
        if (!desplegable) return;

        const enlacesGrupo = grupo.querySelectorAll(".navegacion__submenu a");
        let grupoTienePaginaActual = false;

        enlacesGrupo.forEach(function (enlace) {
            const pagina = (enlace.getAttribute("href") || "").split("#")[0];
            if (pagina === nombrePagina || (nombrePagina === "" && pagina === "index.html")) {
                grupoTienePaginaActual = true;
            }
        });

        desplegable.classList.toggle("activo", grupoTienePaginaActual);
    });
}

// Reportes locales
/** Valida el formulario y genera un archivo local sin enviar datos. */
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

// Galería y carruseles
/** Abre las imágenes de la galería en un diálogo y devuelve el foco al cerrarlo. */
function inicializarVisorImagenes() {
    const galeria = document.querySelector('[aria-labelledby="titulo-galeria"]');
    const visor = document.getElementById("visor-imagen");

    if (!galeria || !(visor instanceof HTMLDialogElement)) {
        return;
    }

    const imagenVisor = visor.querySelector(".visor-imagen__foto");
    const descripcionVisor = visor.querySelector(".visor-imagen__descripcion");
    const botonCerrar = visor.querySelector(".visor-imagen__cerrar");
    
    const imagenes = galeria.querySelectorAll(".tarjeta__imagen");

    let imagenActiva = null;

    if (!imagenVisor || !descripcionVisor || !botonCerrar) {
        return;
    }

    function abrirVisor(imagen) {
        imagenActiva = imagen;
        imagenVisor.src = imagen.src;
        imagenVisor.alt = imagen.alt;
        descripcionVisor.textContent = imagen.closest("figure")?.querySelector("h3")?.textContent
            || imagen.alt;
        visor.showModal();
        botonCerrar.focus();
    }

    imagenes.forEach(function (imagen) {
        imagen.tabIndex = 0;
        imagen.setAttribute("role", "button");
        imagen.setAttribute("aria-haspopup", "dialog");
        imagen.setAttribute("aria-label", "Ampliar imagen: " + imagen.alt);

        imagen.addEventListener("click", function () {
            abrirVisor(imagen);
        });

        imagen.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirVisor(imagen);
            }
        });
    });

    botonCerrar.addEventListener("click", function () {
        visor.close();
    });

    visor.addEventListener("click", function (evento) {
        if (evento.target === visor) {
            visor.close();
        }
    });

    visor.addEventListener("close", function () {
        imagenActiva?.focus();
        imagenActiva = null;
        imagenVisor.removeAttribute("src");
    });
}

/** Inicializa los controles, indicadores, avance automático y gestos de los carruseles. */
function inicializarCarruselesSumergidos() {
    const carruseles = document.querySelectorAll(".carrusel-sumergido");

    carruseles.forEach(function (carrusel) {
        const diapositivas = carrusel.querySelectorAll(".carrusel-sumergido__diapositiva");
        const botonAnterior = carrusel.querySelector(".carrusel-sumergido__control--anterior");
        const botonSiguiente = carrusel.querySelector(".carrusel-sumergido__control--siguiente");
        const contenedorPuntos = carrusel.querySelector(".carrusel-sumergido__indicadores");

        if (diapositivas.length === 0) {
            return;
        }

        let indiceActual = 0;
        let temporizador = null;

        if (contenedorPuntos && contenedorPuntos.children.length === 0) {
            diapositivas.forEach(function (_, indice) {
                const punto = document.createElement("button");
                punto.type = "button";
                punto.className = "carrusel-sumergido__punto" + (indice === 0 ? " activo" : "");
                punto.setAttribute("aria-label", "Ir a diapositiva " + (indice + 1));
                punto.addEventListener("click", function () {
                    irADiapositiva(indice);
                    reiniciarTemporizador();
                });
                contenedorPuntos.appendChild(punto);
            });
        }

        const puntos = contenedorPuntos ? contenedorPuntos.querySelectorAll(".carrusel-sumergido__punto") : [];

        function irADiapositiva(nuevoIndice) {
            diapositivas[indiceActual]?.classList.remove("activa");
            puntos[indiceActual]?.classList.remove("activo");

            indiceActual = (nuevoIndice + diapositivas.length) % diapositivas.length;

            diapositivas[indiceActual]?.classList.add("activa");
            puntos[indiceActual]?.classList.add("activo");
        }

        function siguiente() {
            irADiapositiva(indiceActual + 1);
        }

        function anterior() {
            irADiapositiva(indiceActual - 1);
        }

        if (botonSiguiente) {
            botonSiguiente.addEventListener("click", function () {
                siguiente();
                reiniciarTemporizador();
            });
        }

        if (botonAnterior) {
            botonAnterior.addEventListener("click", function () {
                anterior();
                reiniciarTemporizador();
            });
        }

        function iniciarTemporizador() {
            detenerTemporizador();
            temporizador = window.setInterval(siguiente, 5500);
        }

        function detenerTemporizador() {
            if (temporizador) {
                window.clearInterval(temporizador);
                temporizador = null;
            }
        }

        function reiniciarTemporizador() {
            detenerTemporizador();
            iniciarTemporizador();
        }

        carrusel.addEventListener("mouseenter", detenerTemporizador);
        carrusel.addEventListener("mouseleave", iniciarTemporizador);

        let posicionInicialX = 0;
        carrusel.addEventListener("touchstart", function (evento) {
            posicionInicialX = evento.touches[0].clientX;
            detenerTemporizador();
        }, { passive: true });

        carrusel.addEventListener("touchend", function (evento) {
            const diferenciaX = evento.changedTouches[0].clientX - posicionInicialX;
            if (Math.abs(diferenciaX) > 45) {
                if (diferenciaX < 0) {
                    siguiente();
                } else {
                    anterior();
                }
            }
            iniciarTemporizador();
        }, { passive: true });

        iniciarTemporizador();
    });
}

// Animaciones al desplazarse
/** Revela contenido y anima contadores cuando aparecen en pantalla. */
function inicializarAnimacionesYContadores() {
    const elementosAnimables = document.querySelectorAll("[data-animar], .tarjeta, .tarjeta-ecologica, .paso-seccion-pantalla");

    if ("IntersectionObserver" in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("revelado");
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });

        elementosAnimables.forEach(function (elemento) {
            observador.observe(elemento);
        });
    } else {
        elementosAnimables.forEach(function (elemento) {
            elemento.classList.add("revelado");
        });
    }

    const contadores = document.querySelectorAll("[data-contador]");
    if (contadores.length > 0 && "IntersectionObserver" in window) {
        const observadorContadores = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    const elemento = entrada.target;
                    const meta = parseInt(elemento.getAttribute("data-contador"), 10) || 0;
                    const prefijo = elemento.getAttribute("data-prefijo") || "";
                    const sufijo = elemento.getAttribute("data-sufijo") || "";
                    let actual = 0;
                    const incremento = Math.max(1, Math.ceil(meta / 35));
                    const intervalo = setInterval(function () {
                        actual += incremento;
                        if (actual >= meta) {
                            actual = meta;
                            clearInterval(intervalo);
                        }
                        elemento.textContent = prefijo + actual + sufijo;
                    }, 40);
                    observadorContadores.unobserve(elemento);
                }
            });
        }, { threshold: 0.25 });

        contadores.forEach(function (contador) {
            observadorContadores.observe(contador);
        });
    }
}

// Respaldo: sustituye WebP por GIF si falla la carga de una imagen.
document.addEventListener("error", function (evento) {
    const imagen = evento.target;
    if (!(imagen instanceof HTMLImageElement) || !imagen.dataset.fallbackSrc) {
        return;
    }

    const rutaRespaldo = imagen.dataset.fallbackSrc;
    imagen.removeAttribute("data-fallback-src");
    imagen.src = rutaRespaldo;
}, true);

// Arranque: cada inicializador actúa solo si encuentra su componente.
document.addEventListener("DOMContentLoaded", function () {
    inicializarMenuMovil();
    inicializarNavegacionActiva();
    inicializarReporteComunitario();
    inicializarVisorImagenes();
    inicializarCarruselesSumergidos();
    inicializarAnimacionesYContadores();
});
