
/*
 * Este archivo reúne las interacciones compartidas por las páginas del sitio.
 * Cada inicializador busca primero su componente y termina sin hacer cambios
 * cuando la página no lo contiene.
 */

// Navegación
/** Controla el menú adaptable, sus submenús y el cierre con Escape o al tocar fuera. */
function inicializarMenuMovil() {
    // El botón abre/cierra el menú y el elemento nav contiene sus enlaces.
    const botonMenu = document.getElementById("alternar-menu");
    const menuNavegacion = document.getElementById("menu-principal");

    // Esta página puede no tener el menú; en ese caso no hay nada que inicializar.
    if (!botonMenu || !menuNavegacion) {
        return;
    }

    // Se guardan los elementos que se consultarán varias veces en los eventos.
    const iconoMenu = botonMenu.querySelector("i");
    const enlacesNavegacion = menuNavegacion.querySelectorAll(".navegacion__enlace");
    const menusDesplegables = menuNavegacion.querySelectorAll(".navegacion__desplegable");
    // Esta consulta indica si el ancho actual corresponde al diseño móvil.
    const consultaMovil = window.matchMedia("(max-width: 1080px)");

    // Mantiene abierto como máximo un submenú a la vez.
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

    // Actualiza juntos el menú, el botón accesible y su icono.
    function establecerMenuAbierto(estaAbierto) {
        // En escritorio el menú siempre queda en su presentación normal.
        const debeAbrirse = estaAbierto && consultaMovil.matches;
        menuNavegacion.classList.toggle("abierto", debeAbrirse);
        document.body.classList.toggle("menu-abierto", debeAbrirse);
        // aria-expanded y aria-label comunican el estado a tecnologías asistivas.
        botonMenu.setAttribute("aria-expanded", String(debeAbrirse));
        botonMenu.setAttribute("aria-label", debeAbrirse ? "Cerrar menú" : "Abrir menú");
        // Cambia las clases del icono para mostrar barras o una X.
        iconoMenu.classList.toggle("fa-bars", !debeAbrirse);
        iconoMenu.classList.toggle("fa-xmark", debeAbrirse);
    }

    // Alterna el menú cuando se activa el botón.
    botonMenu.addEventListener("click", function () {
        establecerMenuAbierto(botonMenu.getAttribute("aria-expanded") !== "true");
    });

    // Después de elegir un enlace, cierra el menú móvil.
    enlacesNavegacion.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            establecerMenuAbierto(false);
        });
    });

    document.addEventListener("pointerdown", function (evento) {
        const elementoPulsado = evento.target;
        const menuEstaAbierto = botonMenu.getAttribute("aria-expanded") === "true";

        // Un clic fuera del botón y del menú lo cierra.
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
        // Escape cierra el menú y devuelve el foco al control que lo abrió.
        if (evento.key === "Escape" && botonMenu.getAttribute("aria-expanded") === "true") {
            establecerMenuAbierto(false);
            botonMenu.focus();
        }
    });

    window.addEventListener("resize", function () {
        // Si se cambia a escritorio, se quita el estado de menú móvil.
        if (!consultaMovil.matches) {
            establecerMenuAbierto(false);
        }
    });
}

/** Marca el enlace y la sección de navegación que corresponden a la URL actual. */
function inicializarNavegacionActiva() {
    // Separa el nombre del archivo del fragmento (#seccion) de la URL.
    const nombrePagina = window.location.pathname.split("/").pop() || "index.html";
    const hashActual = window.location.hash;

    // Compara cada href del menú con la página y el fragmento actuales.
    const todosLosEnlaces = document.querySelectorAll(".navegacion__enlace");
    todosLosEnlaces.forEach(function (enlace) {
        const rutaHref = enlace.getAttribute("href") || "";
        // Un href como "pagina.html#seccion" se divide en archivo y fragmento.
        const [paginaHref, hashHref] = rutaHref.split("#");
        const coincidePagina = (paginaHref === nombrePagina) || (!paginaHref && nombrePagina === "index.html");
        
        // Los enlaces con fragmento solo se marcan si coincide también la sección.
        let coincide = false;
        if (coincidePagina) {
            if (hashHref) {
                coincide = hashActual === "#" + hashHref;
            } else {
                coincide = !hashActual || hashActual === "#contenido";
            }
        }

        // La clase controla el estilo visual; aria-current indica la página actual.
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

        // Resalta el grupo cuando la página actual está dentro de su submenú.
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
    // Se obtienen las tres partes necesarias: formulario, mensaje y descarga.
    const formulario = document.getElementById("formulario-reporte");
    const resultado = document.getElementById("resultado-reporte");
    const botonDescarga = document.getElementById("descargar-reporte");

    if (!formulario || !resultado || !botonDescarga) {
        return;
    }

    let textoReporte = "";

    formulario.addEventListener("submit", function (evento) {
        // El reporte se prepara en el navegador; nunca se envía al servidor.
        evento.preventDefault();

        if (!formulario.reportValidity()) {
            return;
        }

        // FormData lee los campos por su atributo name sin recorrerlos uno a uno.
        const datosFormulario = new FormData(formulario);
        // La fecha de elaboración se genera al momento de enviar el formulario.
        const fecha = new Date().toLocaleDateString("es-VE");
        // Los campos se organizan en líneas para crear un archivo de texto legible.
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

        // Informa el resultado y habilita la descarga, sin transmitir los datos.
        resultado.textContent = "Reporte listo. Descárgalo y adjunta fotografías del lugar desde un sitio seguro. No se envió información a ningún servidor.";
        resultado.classList.add("visible");
        botonDescarga.hidden = false;
        botonDescarga.focus();
    });

    botonDescarga.addEventListener("click", function () {
        if (!textoReporte) {
            return;
        }

        // Crea una URL temporal para descargar el texto como archivo.
        const archivo = new Blob([textoReporte], { type: "text/plain;charset=utf-8" });
        const direccionArchivo = URL.createObjectURL(archivo);
        const enlaceDescarga = document.createElement("a");
        enlaceDescarga.href = direccionArchivo;
        enlaceDescarga.download = "reporte-comunitario-ecocampeche.txt";
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        enlaceDescarga.remove();
        // Libera la URL temporal después de iniciar la descarga.
        window.setTimeout(function () {
            URL.revokeObjectURL(direccionArchivo);
        }, 1000);
    });
}

// Galería y carruseles
/** Abre las imágenes de la galería en un diálogo y devuelve el foco al cerrarlo. */
function inicializarVisorImagenes() {
    // La galería se identifica por su título y el visor es un diálogo HTML.
    const galeria = document.querySelector('[aria-labelledby="titulo-galeria"]');
    const visor = document.getElementById("visor-imagen");

    if (!galeria || !(visor instanceof HTMLDialogElement)) {
        return;
    }

    const imagenVisor = visor.querySelector(".visor-imagen__foto");
    const descripcionVisor = visor.querySelector(".visor-imagen__descripcion");
    const botonCerrar = visor.querySelector(".visor-imagen__cerrar");
    
    // Solo se habilitan las imágenes que pertenecen a esta galería.
    const imagenes = galeria.querySelectorAll(".tarjeta__imagen");

    // Se recuerda qué imagen abrió el diálogo para restaurar el foco al cerrarlo.
    let imagenActiva = null;

    if (!imagenVisor || !descripcionVisor || !botonCerrar) {
        return;
    }

    function abrirVisor(imagen) {
        imagenActiva = imagen;
        // Copia la imagen y su descripción al contenido ampliado del diálogo.
        imagenVisor.src = imagen.src;
        imagenVisor.alt = imagen.alt;
        descripcionVisor.textContent = imagen.closest("figure")?.querySelector("h3")?.textContent
            || imagen.alt;
        visor.showModal();
        botonCerrar.focus();
    }

    imagenes.forEach(function (imagen) {
        // Hace que cada imagen se pueda usar como botón con ratón o teclado.
        imagen.tabIndex = 0;
        imagen.setAttribute("role", "button");
        imagen.setAttribute("aria-haspopup", "dialog");
        imagen.setAttribute("aria-label", "Ampliar imagen: " + imagen.alt);

        imagen.addEventListener("click", function () {
            abrirVisor(imagen);
        });

        imagen.addEventListener("keydown", function (evento) {
            // Enter y Espacio activan la imagen igual que un clic.
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirVisor(imagen);
            }
        });
    });

    botonCerrar.addEventListener("click", function () {
        visor.close();
    });

    // Permite cerrar al pulsar el fondo del diálogo, no su contenido.
    visor.addEventListener("click", function (evento) {
        if (evento.target === visor) {
            visor.close();
        }
    });

    visor.addEventListener("close", function () {
        // Devuelve el foco a la imagen que abrió el diálogo y limpia la vista.
        imagenActiva?.focus();
        imagenActiva = null;
        imagenVisor.removeAttribute("src");
    });
}

/** Inicializa los controles, indicadores, avance automático y gestos de los carruseles. */
function inicializarCarruselesSumergidos() {
    // Puede haber más de un carrusel; cada uno mantiene su propio estado.
    const carruseles = document.querySelectorAll(".carrusel-sumergido");

    carruseles.forEach(function (carrusel) {
        // Controles e indicadores se buscan dentro del carrusel actual.
        const diapositivas = carrusel.querySelectorAll(".carrusel-sumergido__diapositiva");
        const botonAnterior = carrusel.querySelector(".carrusel-sumergido__control--anterior");
        const botonSiguiente = carrusel.querySelector(".carrusel-sumergido__control--siguiente");
        const contenedorPuntos = carrusel.querySelector(".carrusel-sumergido__indicadores");

        if (diapositivas.length === 0) {
            return;
        }

        // El índice señala la diapositiva visible; el temporizador controla el avance.
        let indiceActual = 0;
        let temporizador = null;

        // Si el HTML no trae indicadores, crea uno por cada diapositiva.
        if (contenedorPuntos && contenedorPuntos.children.length === 0) {
            diapositivas.forEach(function (_, indice) {
                const punto = document.createElement("button");
                punto.type = "button";
                punto.className = "carrusel-sumergido__punto" + (indice === 0 ? " activo" : "");
                punto.setAttribute("aria-label", "Ir a diapositiva " + (indice + 1));
                punto.addEventListener("click", function () {
                    // Ir a un indicador también reinicia el tiempo de avance.
                    irADiapositiva(indice);
                    reiniciarTemporizador();
                });
                contenedorPuntos.appendChild(punto);
            });
        }

        const puntos = contenedorPuntos ? contenedorPuntos.querySelectorAll(".carrusel-sumergido__punto") : [];

        function irADiapositiva(nuevoIndice) {
            // Primero se quitan los estados visuales de la diapositiva anterior.
            diapositivas[indiceActual]?.classList.remove("activa");
            puntos[indiceActual]?.classList.remove("activo");

            // El módulo permite avanzar desde el final al inicio y viceversa.
            indiceActual = (nuevoIndice + diapositivas.length) % diapositivas.length;

            // Después se activan tanto la diapositiva nueva como su indicador.
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
            // Evita dejar intervalos duplicados si se inicia más de una vez.
            detenerTemporizador();
            temporizador = window.setInterval(siguiente, 5500);
        }

        function detenerTemporizador() {
            // clearInterval cancela el avance automático hasta que se reinicie.
            if (temporizador) {
                window.clearInterval(temporizador);
                temporizador = null;
            }
        }

        function reiniciarTemporizador() {
            // La interacción manual da un nuevo intervalo antes del avance siguiente.
            detenerTemporizador();
            iniciarTemporizador();
        }

        carrusel.addEventListener("mouseenter", detenerTemporizador);
        carrusel.addEventListener("mouseleave", iniciarTemporizador);

        // En pantallas táctiles, el desplazamiento horizontal cambia la diapositiva.
        let posicionInicialX = 0;
        carrusel.addEventListener("touchstart", function (evento) {
            // Guarda la coordenada horizontal inicial y pausa el avance automático.
            posicionInicialX = evento.touches[0].clientX;
            detenerTemporizador();
        }, { passive: true });

        carrusel.addEventListener("touchend", function (evento) {
            // La diferencia entre el inicio y el final determina la dirección.
            const diferenciaX = evento.changedTouches[0].clientX - posicionInicialX;
            // Se ignoran movimientos cortos para evitar confundirlos con un deslizamiento.
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
    // Estos elementos reciben la clase que activa sus estilos de revelado en CSS.
    const elementosAnimables = document.querySelectorAll("[data-animar], .tarjeta, .tarjeta-ecologica, .paso-seccion-pantalla");

    if ("IntersectionObserver" in window) {
        // Revela cada elemento al entrar en pantalla y deja de observarlo después.
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("revelado");
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            // El elemento se considera visible al entrar al menos un 10% en pantalla.
            threshold: 0.1,
            // Reduce el área observada por abajo para iniciar un poco antes del borde.
            rootMargin: "0px 0px -30px 0px"
        });

        elementosAnimables.forEach(function (elemento) {
            observador.observe(elemento);
        });
    } else {
        // En navegadores antiguos, muestra el contenido sin esperar a observarlo.
        elementosAnimables.forEach(function (elemento) {
            elemento.classList.add("revelado");
        });
    }

    const contadores = document.querySelectorAll("[data-contador]");
    if (contadores.length > 0 && "IntersectionObserver" in window) {
        // Los números empiezan a animarse cuando el visitante llega a ellos.
        const observadorContadores = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    const elemento = entrada.target;
                    // El valor objetivo y el texto alrededor vienen de atributos HTML.
                    const meta = parseInt(elemento.getAttribute("data-contador"), 10) || 0;
                    const prefijo = elemento.getAttribute("data-prefijo") || "";
                    const sufijo = elemento.getAttribute("data-sufijo") || "";
                    let actual = 0;
                    // El incremento limita la animación a unos 35 pasos.
                    const incremento = Math.max(1, Math.ceil(meta / 35));
                    const intervalo = setInterval(function () {
                        actual += incremento;
                        if (actual >= meta) {
                            // Ajusta el último paso al objetivo y termina el intervalo.
                            actual = meta;
                            clearInterval(intervalo);
                        }
                        // Actualiza el texto sin reemplazar otros elementos HTML.
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
    // El evento error también puede provenir de otros recursos; solo interesa img.
    if (!(imagen instanceof HTMLImageElement) || !imagen.dataset.fallbackSrc) {
        return;
    }

    const rutaRespaldo = imagen.dataset.fallbackSrc;
    // Quita el respaldo antes de cambiar la fuente para evitar un ciclo de errores.
    imagen.removeAttribute("data-fallback-src");
    imagen.src = rutaRespaldo;
}, true);

// Arranque: cada inicializador actúa solo si encuentra su componente.
document.addEventListener("DOMContentLoaded", function () {
    // Se ejecuta cuando el HTML ya existe y sus selectores pueden encontrar elementos.
    inicializarMenuMovil();
    inicializarNavegacionActiva();
    inicializarReporteComunitario();
    inicializarVisorImagenes();
    inicializarCarruselesSumergidos();
    inicializarAnimacionesYContadores();
});
