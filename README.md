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

## Desarrollo

El proyecto utiliza HTML, CSS y JavaScript sin bibliotecas adicionales. Los estilos compartidos están en `styles.css` y el comportamiento en `scripts.js`; no requiere instalar dependencias ni configurar un servidor de aplicaciones.

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
