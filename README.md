# EcoCampeche

Sitio estático para compartir información sobre residuos sólidos, salud pública y participación comunitaria en Campeche, Sector 4A.

## Páginas

- `index.html`: presentación, información ambiental, reflexión e iniciativas comunitarias.
- `comunidades.html`: comunidad piloto y estructura para sumar otros sectores.
- `campeche.html`: perfil de Campeche, categorías de problemas y galería de referencia.
- `problematica.html`: prevención, riesgos para la salud, guía de documentación y generador local de reportes.
- `direcciones.html`: referencia general de ubicación y búsqueda en mapas.
- `nosotros.html`: equipo desarrollador e historia local.
- `contacto.html`: formas de colaboración y estado de los canales de contacto.
- [NAVEGACION.md](./NAVEGACION.md): mapa Mermaid del sitio, recorrido de comunidades y flujo para preparar y presentar un reporte.

## Desarrollo

El proyecto utiliza HTML, CSS y JavaScript sin bibliotecas adicionales.

### Archivos principales

- [styles.css](./styles.css): variables, estilos globales, componentes compartidos y pie de página.
- [styles2.css](./styles2.css): reglas adaptables y estilos de secciones específicas, como carruseles, videos y componentes comunitarios. Se carga después de `styles.css` para conservar el orden de la cascada.
- [scripts.js](./scripts.js): interacciones compartidas. Se carga con `defer` y cada inicializador comprueba si los elementos que necesita existen en la página.
- Los archivos HTML contienen el contenido y la estructura de cada página. Los comentarios HTML marcan las secciones principales; la apariencia y el comportamiento se mantienen en los archivos compartidos.

### Comportamientos de JavaScript

- `inicializarMenuMovil`: abre y cierra el menú, controla sus submenús y permite cerrarlo con Escape o al pulsar fuera.
- `inicializarNavegacionActiva`: identifica la página y el enlace actuales a partir de la URL.
- `inicializarReporteComunitario`: valida los datos y descarga un reporte local; no transmite información.
- `inicializarVisorImagenes`: muestra las imágenes de la galería en un diálogo accesible.
- `inicializarCarruselesSumergidos`: conecta controles, indicadores, avance automático y gestos táctiles.
- `inicializarVideosSumergidos`: silencia el autoplay, pausa videos fuera de pantalla y conecta los controles disponibles.
- `inicializarParalajeYAnimaciones`: activa revelados, paralaje opcional y contadores al entrar en pantalla.

## Navegación y flujos del sitio

Los siguientes diagramas también están disponibles en [NAVEGACION.md](./NAVEGACION.md) y se pueden copiar en [mermaid.live](https://mermaid.live).

### Mapa general

```mermaid
flowchart TD
    Inicio["Inicio — index.html"]
    Comunidades["Comunidades — comunidades.html"]
    Campeche["Campeche, Sector 4A — campeche.html"]
    Direcciones["Ubicación y mapa — direcciones.html"]
    Problematica["Problemática — problematica.html"]
    Nosotros["Nosotros — nosotros.html"]
    Contacto["Contacto y colaboración — contacto.html"]

    Inicio --> Proposito["Propósito comunitario"]
    Inicio --> Iniciativas["Iniciativas vecinales"]
    Inicio --> CarruselEco["Galería ambiental"]
    Inicio --> Manual["Manual de recolección"]
    Inicio --> Video["Video comunitario"]
    Inicio --> Participa["Participa"]

    Inicio --> Comunidades
    Inicio --> Problematica
    Comunidades --> Campeche
    Comunidades --> Direcciones
    Campeche --> Galeria["Registro de evidencias"]
    Campeche --> Ruta["Ruta comunitaria"]
    Campeche --> Direcciones
    Campeche --> Problematica

    Problematica --> Prevencion["Clasificación y prevención"]
    Problematica --> Salud["Salud"]
    Problematica --> Documentar["Cómo documentar — #visibilizar"]
    Problematica --> Organismos["Organismos — #entes"]
    Documentar --> Informe["Preparar borrador local"]
    Organismos --> CanalOficial["Presentar por canal oficial"]

    Nosotros --> Metas["Historia y metas"]
    Nosotros --> ContactoDesarrolladores["Contacto de desarrolladores"]
    Contacto --> ContactoDesarrolladores
    Contacto --> Informe
    Participa --> Contacto
```

### Menú principal

El mismo menú se repite en todas las páginas. En pantallas pequeñas se abre con el botón del encabezado; elegir un enlace o pulsar Escape lo cierra.

```mermaid
flowchart LR
    Menu["Menú principal"]
    Menu --> Inicio["Inicio"]
    Inicio --> Portada["Portada y visión"]
    Inicio --> Proposito["Propósito comunitario"]
    Inicio --> Iniciativas["Iniciativas vecinales"]
    Inicio --> GaleriaEco["Galería inmersiva"]
    Inicio --> Manual["Manual de recolección"]
    Inicio --> Video["Video de acción en comunidad"]
    Inicio --> Participa["Participa en el cambio"]

    Menu --> Comunidad["Comunidades"]
    Comunidad --> Red["Red de comunidades"]
    Comunidad --> Perfil["Campeche — Sector 4A"]
    Comunidad --> Ruta["Ruta comunitaria"]
    Comunidad --> Evidencias["Registro de evidencias"]
    Comunidad --> Mapa["Ubicación y mapa"]

    Menu --> Problematica["Problemática"]
    Problematica --> Diagnostico["Diagnóstico general"]
    Problematica --> Clasificacion["Clasificación de residuos"]
    Problematica --> Salud["Salud y prevención"]
    Problematica --> Reporte["Preparar un reporte"]
    Problematica --> Entes["Entes competentes"]

    Menu --> Nosotros["Nosotros"]
    Nosotros --> Equipo["Desarrolladores"]
    Nosotros --> Metas["Propósito del proyecto"]
    Nosotros --> Contacto["Contacto y colaboración"]
```

### Recorrido de comunidades

La página de comunidades presenta el territorio piloto, un carrusel y enlaces al perfil de Campeche, a la ruta y al mapa. Desde el perfil se puede revisar la galería y continuar hacia la guía de reportes.

```mermaid
flowchart TD
    Red["Red de comunidades — comunidades.html"]
    Red --> Contexto["Presentación de Campeche, Sector 4A"]
    Contexto --> Perfil["Ver comunidad y problemática — campeche.html"]
    Red --> Carrusel["Carrusel territorial"]
    Carrusel --> Perfil
    Carrusel --> Ruta["Explorar la ruta — campeche.html#ruta"]
    Carrusel --> Mapa["Ver mapa — direcciones.html"]
    Carrusel --> Sumar["Sumar otra comunidad — contacto.html"]

    Perfil --> Diagnostico["Categorías a verificar en campo"]
    Perfil --> Evidencias["Galería — #titulo-galeria"]
    Perfil --> Video["Video de la comunidad"]
    Perfil --> Ruta
    Perfil --> Guia["Documentar y solicitar atención — problematica.html"]
    Ruta --> Mapa
    Guia --> Informe["Preparar borrador — problematica.html"]
```

### Documentar una situación y preparar el informe

El formulario local de `problematica.html` organiza la información, pero no es un sistema de denuncias: no envía ni almacena el contenido. El archivo descargado debe revisarse, completarse con las evidencias por separado y presentarse ante el organismo competente.

```mermaid
flowchart TD
    Inicio["Observar una situación"]
    Inicio --> Seguridad["Priorizar la seguridad; no entrar a zonas peligrosas"]
    Seguridad --> Ubicacion["Anotar una referencia pública"]
    Ubicacion --> Evidencia["Tomar fotos seguras y fechadas; proteger datos personales"]
    Evidencia --> Describir["Separar hechos observados de lo no confirmado"]
    Describir --> Abrir["Abrir Problemática — #visibilizar"]
    Abrir --> Formulario["Completar formulario local"]

    Formulario --> Organismo["Organismo al que se dirige"]
    Formulario --> Referencia["Ubicación o referencia"]
    Formulario --> Fecha["Fecha de observación"]
    Formulario --> Tipo["Tipo de situación"]
    Formulario --> Solicitud["Atención solicitada"]
    Formulario --> Descripcion["Descripción objetiva"]

    Organismo --> Validar{"¿Campos obligatorios válidos?"}
    Referencia --> Validar
    Fecha --> Validar
    Tipo --> Validar
    Solicitud --> Validar
    Descripcion --> Validar
    Validar -->|No| Corregir["Corregir los campos indicados"]
    Corregir --> Formulario
    Validar -->|Sí| Borrador["Preparar reporte en el navegador"]
    Borrador --> Descargar["Descargar reporte-comunitario-ecocampeche.txt"]
    Descargar --> Local["El archivo queda en el dispositivo; no se transmite"]
    Local --> Revisar["Revisar el contenido y adjuntar fotografías por separado"]
    Revisar --> Canal["Elegir y confirmar un canal oficial competente"]
    Canal --> Entregar["Presentar el informe y la evidencia al organismo"]
    Entregar --> Recibo["Pedir constancia o número de caso"]
    Recibo --> Seguimiento["Guardar copia y registrar respuestas"]
```

### Presentación por un canal institucional

El enlace al portal del MINEC abre un sitio externo. Confirma la vigencia de los teléfonos y canales antes de usarlos. Para asuntos ambientales, solicita orientación sobre el contacto estadal de Sucre. EcoCampeche no recibe denuncias.

```mermaid
flowchart TD
    Borrador["Borrador descargado y revisado"]
    Borrador --> Competencia{"¿Qué institución tiene competencia?"}
    Competencia -->|Afectación ambiental| Minec["Consultar MINEC"]
    Minec --> Portal["Portal externo: 0800ambiente.com/#denuncias"]
    Minec --> Telefono["Llamar a la central o línea ambiental publicada"]
    Telefono --> Regional["Solicitar orientación sobre la Dirección Estadal Ambiental de Sucre"]
    Competencia -->|Aseo o servicios públicos| Alcaldia["Confirmar canal vigente de la Alcaldía del Municipio Sucre, Cumaná"]
    Competencia -->|No está claro| Orientacion["Pedir orientación al organismo competente"]
    Portal --> Verificar["Verificar que el canal siga activo"]
    Regional --> Verificar
    Alcaldia --> Verificar
    Orientacion --> Verificar
    Verificar --> Entrega["Entregar el informe y las fotografías"]
    Entrega --> Constancia["Solicitar sello de recibido o número de caso"]
    Constancia --> Seguimiento["Conservar copia y hacer seguimiento"]
```

### Notas de alcance

- Los enlaces y anclas de estos diagramas corresponden a páginas y secciones existentes en el sitio.
- El formulario crea un archivo `.txt` en el navegador; no manda datos a EcoCampeche ni a un organismo.
- Las fotografías se adjuntan por separado al presentar el reporte.
- EcoCampeche es informativo y comunitario; no es un canal oficial ni garantiza una respuesta institucional.
- Confirma la vigencia de teléfonos, portales y competencias antes de enviar información sensible.

Para mantener el orden visual, agrega las hojas de estilo en el mismo orden en todas las páginas: primero `styles.css` y después `styles2.css`.

Para servirlo localmente con Python:

```sh
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Antes de publicar

- Confirmar que se cuenta con autorización para publicar las fotografías locales de la problemática y añadir retratos del equipo solo con consentimiento.
- Confirmar la ubicación precisa y validar la historia con fuentes locales.
- Confirmar en la página oficial del MINEC que sus teléfonos y portal de denuncias sigan vigentes; los datos publicados en el sitio son nacionales y no sustituyen un canal regional de Sucre.
- Verificar por una fuente oficial los datos de contacto de la Alcaldía del Municipio Sucre en Cumaná antes de publicarlos. No usar resultados del municipio homónimo del estado Miranda.
- Solicitar autorización expresa antes de publicar los WhatsApp de la vocería comunitaria o del equipo desarrollador; ambos contactos están pendientes.
- Levantar y validar en campo las ubicaciones de residuos antes de convertir la ruta diagnóstica en un mapa de puntos confirmados.
- Presentar los reportes ante los organismos competentes. La herramienta del sitio solo genera un archivo local; no transmite información ni constituye un canal oficial de denuncias.
