# Navegación y flujos de EcoCampeche

Este documento describe las páginas y los recorridos principales del sitio. Los bloques Mermaid se pueden copiar directamente en [mermaid.live](https://mermaid.live) para verlos o exportarlos.

## 1. Mapa general del sitio

La navegación principal está disponible en todas las páginas. Los enlaces a secciones usan anclas (`#...`) para llevar a una parte concreta de la página indicada.

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

## 2. Menú principal

El mismo menú se repite en las páginas. En pantallas pequeñas se abre con el botón del encabezado; elegir un enlace o pulsar Escape lo cierra.

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

## 3. Recorrido de comunidades

La página de comunidades presenta el territorio piloto, una galería carrusel y enlaces al perfil de Campeche, a la ruta y al mapa. Desde el perfil se puede revisar la galería y continuar hacia orientación para preparar un reporte.

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

## 4. Documentar una situación y preparar el informe

El formulario local de `problematica.html` ayuda a organizar la información. No es un sistema de denuncias: no envía ni almacena el contenido. El archivo descargado debe revisarse, completarse con las evidencias por separado y presentarse ante el organismo competente.

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

## 5. Presentación por un canal institucional

El enlace al portal del MINEC abre un sitio externo. El teléfono y los demás datos publicados deben confirmarse antes de usarlos. Para asuntos ambientales, la página recomienda pedir orientación sobre el contacto estadal de Sucre. La plataforma EcoCampeche no recibe denuncias.

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

## Notas de alcance

- Los enlaces a páginas y secciones corresponden a los archivos HTML y anclas que existen actualmente.
- El formulario crea un archivo `.txt` en el navegador; no manda datos a EcoCampeche ni a un organismo.
- Las fotografías se adjuntan por separado cuando se presenta el reporte.
- EcoCampeche es informativo y comunitario; no es un canal oficial ni garantiza una respuesta institucional.
- Confirma la vigencia de teléfonos, portales y competencias antes de enviar información sensible.
