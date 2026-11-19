
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
/** Valida el formulario, genera el oficio formal y habilita el envío directo a Serviamsa e INASERVIP. */
function inicializarReporteComunitario() {
    const formulario = document.getElementById("formulario-reporte");
    const resultado = document.getElementById("resultado-reporte");

    if (!formulario || !resultado) {
        return;
    }

    let textoReporte = "";

    function escaparHTML(cadena) {
        return String(cadena || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!formulario.reportValidity()) {
            return;
        }

        const datosFormulario = new FormData(formulario);
        const valorOrganismo = datosFormulario.get("organismo") || "";
        const nombreRemitente = (datosFormulario.get("nombre") || "").trim();
        const telefonoContacto = (datosFormulario.get("telefono") || "").trim();
        const ubicacion = (datosFormulario.get("ubicacion") || "").trim();
        const fechaObservacion = datosFormulario.get("fecha-observacion") || "";
        const situacion = datosFormulario.get("situacion") || "";
        const atencion = datosFormulario.get("atencion-solicitada") || "";
        const descripcion = (datosFormulario.get("descripcion") || "").trim();

        // Configuración específica según el organismo seleccionado
        let nombreDestinatarioFormal = "";
        let nombreCorto = "";
        let correosDestino = "";
        let tieneWhatsApp = false;
        const telefonoWhatsAppServiamsa = "584120660045";

        if (valorOrganismo === "serviamsa") {
            nombreDestinatarioFormal = "SERVICIO AUTÓNOMO MUNICIPAL DE SANEAMIENTO AMBIENTAL (SERVIAMSA)\nALCALDÍA DEL MUNICIPIO SUCRE · CUMANÁ, ESTADO SUCRE";
            nombreCorto = "Serviamsa";
            correosDestino = "serviamsaweb@gmail.com";
            tieneWhatsApp = true;
        } else if (valorOrganismo === "inaservip") {
            nombreDestinatarioFormal = "INSTITUTO AUTÓNOMO DE SERVICIOS PÚBLICOS DEL ESTADO SUCRE (INASERVIP)\nGOBERNACIÓN DEL ESTADO SUCRE · CUMANÁ";
            nombreCorto = "INASERVIP";
            correosDestino = "gestionhumanainaservip2023@gmail.com";
            tieneWhatsApp = false;
        } else {
            // Ambos organismos
            nombreDestinatarioFormal = "SERVIAMSA (ALCALDÍA DEL MUNICIPIO SUCRE) /\nINASERVIP (GOBERNACIÓN DEL ESTADO SUCRE)\nCUMANÁ, ESTADO SUCRE";
            nombreCorto = "Serviamsa e INASERVIP";
            correosDestino = "serviamsaweb@gmail.com,gestionhumanainaservip2023@gmail.com";
            tieneWhatsApp = true;
        }

        const fechaElaboracion = new Date().toLocaleDateString("es-VE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        // Construcción del documento formal
        textoReporte = [
            "==================================================================",
            "   REPORTE COMUNITARIO Y SOLICITUD DE ATENCIÓN DE RESIDUOS",
            "         SECTOR 4A CAMPECHE · CUMANÁ, ESTADO SUCRE",
            "==================================================================",
            "",
            "LUGAR Y FECHA DE EMISIÓN: Cumaná, " + fechaElaboracion,
            "",
            "DIRIGIDO A:",
            nombreDestinatarioFormal,
            "",
            "ASUNTO: Solicitud formal de atención ambiental y recolección de residuos en el Sector 4A de Campeche",
            "",
            "Estimadas autoridades y personal técnico:",
            "",
            "Por medio del presente oficio, vecinos y vocería organizada de la comunidad Campeche (Sector 4A), parroquia Santa Inés, Cumaná, estado Sucre, nos dirigimos a ustedes de manera respetuosa para notificar formalmente la siguiente situación observada en nuestro entorno y solicitar su intervención institucional:",
            "",
            "1. DATOS DE LA SITUACIÓN OBSERVADA:",
            "   • Ubicación exacta / Referencia: " + ubicacion,
            "   • Fecha en que se observó: " + fechaObservacion,
            "   • Tipo de afectación: " + situacion,
            "   • Acción o atención solicitada: " + atencion,
            "",
            "2. DESCRIPCIÓN DETALLADA DE LOS HECHOS:",
            "   " + descripcion,
            "",
            "3. DATOS DE CONTACTO COMUNITARIO:",
            "   • Remitente / Vocería: " + (nombreRemitente || "Comunidad organizada del Sector 4A de Campeche"),
            "   • Teléfono de contacto: " + (telefonoContacto || "Verificable en asamblea comunitaria"),
            "",
            "NOTA: Se adjuntan como respaldo gráfico las fotografías fechadas tomadas en el sitio como evidencia del estado actual del área afectada.",
            "",
            "Agradecemos de antemano su pronta inspección en el sector, incorporación en las rutas de atención correspondientes y acuse formal de recibo.",
            "",
            "Atentamente,",
            "Comunidad de Campeche · Sector 4A",
            "Plataforma Informativa y de Diagnóstico EcoCampeche"
        ].join("\n");

        // Enlace para correo (mailto con asunto y cuerpo prellenados)
        const asuntoCorreo = encodeURIComponent("Reporte Comunitario de Residuos - Sector 4A Campeche");
        const cuerpoCorreo = encodeURIComponent(textoReporte);
        const enlaceCorreo = "mailto:" + correosDestino + "?subject=" + asuntoCorreo + "&body=" + cuerpoCorreo;

        // Enlace para WhatsApp (resumen conciso y claro)
        const textoWhatsApp = encodeURIComponent(
            "📋 *REPORTE COMUNITARIO - SECTOR 4A CAMPECHE*\n" +
            "Para: " + nombreCorto + "\n\n" +
            "📍 *Ubicación:* " + ubicacion + "\n" +
            "📅 *Fecha:* " + fechaObservacion + "\n" +
            "⚠️ *Situación:* " + situacion + "\n" +
            "🛠️ *Solicitud:* " + atencion + "\n\n" +
            "📝 *Detalle:* " + descripcion + "\n\n" +
            (nombreRemitente ? "👤 *Remitente:* " + nombreRemitente + "\n" : "") +
            (telefonoContacto ? "📞 *Teléfono:* " + telefonoContacto + "\n" : "") +
            "📸 Se adjuntan fotografías fechadas del lugar como evidencia.\n" +
            "Agradecemos su pronta atención y confirmación de recepción."
        );
        const enlaceWhatsApp = "https://wa.me/" + telefonoWhatsAppServiamsa + "?text=" + textoWhatsApp;

        // Inserción en el contenedor de resultados
        resultado.innerHTML = [
            '<div class="aviso-exito">',
            '    <i class="fa-solid fa-circle-check" aria-hidden="true"></i>',
            '    <div>',
            '        <strong>¡Oficio formal preparado con éxito!</strong>',
            '        <p style="margin: 4px 0 0; font-size: 0.88rem;">Tu reporte está formateado y listo para ser enviado directamente a <strong>' + escaparHTML(nombreCorto) + '</strong>.</p>',
            '    </div>',
            '</div>',
            '<p style="margin: 0 0 8px; font-weight: 700; color: var(--color-principal);"><i class="fa-solid fa-file-lines" aria-hidden="true"></i> Vista previa del oficio a remitir:</p>',
            '<pre class="reporte-previa" id="texto-previa-reporte">' + escaparHTML(textoReporte) + '</pre>',
            '<div class="reporte-acciones-envio">',
            '    <a class="boton boton--principal" href="' + enlaceCorreo + '">',
            '        <i class="fa-solid fa-envelope" aria-hidden="true"></i> Enviar por correo a ' + escaparHTML(nombreCorto),
            '    </a>',
            tieneWhatsApp ? '    <a class="boton boton--whatsapp" href="' + enlaceWhatsApp + '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enviar por WhatsApp a Serviamsa</a>' : '',
            '    <button class="boton boton--secundario" type="button" id="boton-copiar-reporte">',
            '        <i class="fa-solid fa-copy" aria-hidden="true"></i> <span>Copiar oficio</span>',
            '    </button>',
            '    <button class="boton boton--secundario" type="button" id="boton-descargar-reporte">',
            '        <i class="fa-solid fa-download" aria-hidden="true"></i> Descargar (.txt)',
            '    </button>',
            '</div>'
        ].join("\n");

        resultado.classList.add("visible");
        resultado.scrollIntoView({ behavior: "smooth", block: "start" });

        // Evento Copiar al portapapeles
        const botonCopiar = document.getElementById("boton-copiar-reporte");
        if (botonCopiar) {
            botonCopiar.addEventListener("click", function () {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textoReporte).then(function () {
                        const span = botonCopiar.querySelector("span");
                        const icono = botonCopiar.querySelector("i");
                        if (span) span.textContent = "¡Copiado! ✓";
                        if (icono) icono.className = "fa-solid fa-check";
                        window.setTimeout(function () {
                            if (span) span.textContent = "Copiar oficio";
                            if (icono) icono.className = "fa-solid fa-copy";
                        }, 2500);
                    }).catch(function () {
                        descargarArchivoTexto();
                    });
                } else {
                    descargarArchivoTexto();
                }
            });
        }

        // Evento Descargar archivo de texto
        function descargarArchivoTexto() {
            if (!textoReporte) return;
            const archivo = new Blob([textoReporte], { type: "text/plain;charset=utf-8" });
            const direccionArchivo = URL.createObjectURL(archivo);
            const enlaceDescarga = document.createElement("a");
            enlaceDescarga.href = direccionArchivo;
            enlaceDescarga.download = "reporte-comunitario-" + valorOrganismo + "-campeche.txt";
            document.body.appendChild(enlaceDescarga);
            enlaceDescarga.click();
            enlaceDescarga.remove();
            window.setTimeout(function () {
                URL.revokeObjectURL(direccionArchivo);
            }, 1000);
        }

        const botonDescargar = document.getElementById("boton-descargar-reporte");
        if (botonDescargar) {
            botonDescargar.addEventListener("click", descargarArchivoTexto);
        }
    });
}

// Galería y carruseles
/** Abre las imágenes de la galería en un diálogo y devuelve el foco al cerrarlo. */
// Galería y carruseles
/** Abre las imágenes de la galería en un diálogo y devuelve el foco al cerrarlo. */
function inicializarVisorImagenes() {
    // El visor es un diálogo HTML para ampliar evidencias fotográficas.
    const visor = document.getElementById("visor-imagen");

    if (!(visor instanceof HTMLDialogElement)) {
        return;
    }

    const imagenVisor = visor.querySelector(".visor-imagen__foto");
    const descripcionVisor = visor.querySelector(".visor-imagen__descripcion");
    const botonCerrar = visor.querySelector(".visor-imagen__cerrar");

    if (!imagenVisor || !descripcionVisor || !botonCerrar) {
        return;
    }

    // Se recuerda qué elemento disparó el diálogo para restaurar el foco al cerrarlo.
    let elementoActivo = null;

    /**
     * Extrae la <img> de un contenedor compuesto (tarjeta-overlay, panoramica…)
     * o devuelve el propio elemento si ya es una <img>.
     */
    function obtenerImagen(elemento) {
        if (elemento.tagName === "IMG") return elemento;
        return elemento.querySelector("img");
    }

    function obtenerTitulo(imagen) {
        return imagen.closest("figure")?.querySelector("h3")?.textContent
            || imagen.closest(".tarjeta-panoramica")?.querySelector(".tarjeta-panoramica__titulo")?.textContent
            || imagen.closest(".tarjeta-overlay")?.querySelector(".tarjeta-overlay__titulo")?.textContent
            || imagen.closest(".tarjeta-alerta-sanitaria")?.querySelector(".tarjeta-alerta-sanitaria__titulo")?.textContent
            || imagen.closest(".banner-comunitario")?.querySelector(".banner-comunitario__titulo")?.textContent
            || imagen.closest(".tarjeta")?.querySelector("h3")?.textContent
            || imagen.alt;
    }

    function abrirVisor(elemento) {
        const imagen = obtenerImagen(elemento);
        if (!imagen || !imagen.src) return;
        elementoActivo = elemento;
        // Copia la imagen y su descripción al contenido ampliado del diálogo.
        imagenVisor.src = imagen.src;
        imagenVisor.alt = imagen.alt;
        descripcionVisor.textContent = obtenerTitulo(imagen);
        visor.showModal();
        botonCerrar.focus();
    }

    /**
     * Registra el listener de clic en un elemento, haciéndolo navegable por teclado.
     */
    function habilitarElemento(elemento) {
        elemento.tabIndex = 0;
        elemento.setAttribute("role", "button");
        elemento.setAttribute("aria-haspopup", "dialog");
        elemento.addEventListener("click", function () { abrirVisor(elemento); });
        elemento.addEventListener("keydown", function (evento) {
            // Enter y Espacio activan el elemento igual que un clic.
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                abrirVisor(elemento);
            }
        });
    }

    // Componentes con capas CSS encima: el degradado/overlay intercepta el clic.
    // Se registra el listener en el contenedor que contiene directamente la imagen.
    const contenedoresCompuestos = document.querySelectorAll([
        ".tarjeta-overlay",                      // article completo: foto + degradado + contenido superpuesto
        ".tarjeta-alerta-sanitaria__multimedia", // div con la foto; el texto está fuera
        ".banner-comunitario__multimedia",       // div con la foto; el texto está fuera
        ".tarjeta-panoramica__multimedia"        // div con la foto; el texto está fuera
    ].join(", "));
    contenedoresCompuestos.forEach(habilitarElemento);

    // Imágenes simples donde no hay capas intermedias que bloqueen el clic.
    const imagenesSimples = document.querySelectorAll([
        ".tarjeta__imagen",
        ".foto-ampliable",
        ".tarjeta-ecologica__foto"
    ].join(", "));
    imagenesSimples.forEach(function (img) {
        // Evitar duplicar si ya está cubierta por un contenedor compuesto registrado.
        const yaRegistrada = img.closest([
            ".tarjeta-overlay",
            ".tarjeta-alerta-sanitaria__multimedia",
            ".banner-comunitario__multimedia",
            ".tarjeta-panoramica__multimedia"
        ].join(", "));
        if (!yaRegistrada) habilitarElemento(img);
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
        // Devuelve el foco al elemento que abrió el diálogo y limpia la vista.
        if (elementoActivo) elementoActivo.focus();
        elementoActivo = null;
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
