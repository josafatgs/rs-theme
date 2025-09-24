# Guía de Configuración del Header Dinámico

## Descripción General

El header ha sido creado para ser completamente dinámico y personalizable desde el panel de administración de Shopify. Incluye:

- ✅ Logo personalizable (imagen o texto)
- ✅ Menú dinámico seleccionable desde Shopify
- ✅ Botón de WhatsApp call-to-action
- ✅ Iconos de cuenta y carrito
- ✅ Navegación móvil responsive
- ✅ Personalización completa de espaciado y tipografía
- ✅ Iconos SVG modernos
- ✅ Sticky header con sombra

## Configuración del Logo

### Opción 1: Logo con Imagen
- **Logo de la Empresa**: Sube una imagen (recomendado: 300x100px en PNG/SVG)
- **Ancho del Logo**: Control deslizante de 100-400px (por defecto: 200px)
- **Altura Máxima**: Control deslizante de 30-120px (por defecto: 60px)

### Opción 2: Logo con Texto
- **Texto del Logo**: Si no hay imagen, se usa este texto (o el nombre de la tienda)
- **Tamaño del Texto**: Control deslizante de 18-48px (por defecto: 28px)

## Configuración de Navegación

### Menú Principal
- **Menú Principal**: Dropdown para seleccionar menús creados en **Navegación > Menús**
- **Tamaño de Fuente**: 12-24px (por defecto: 16px)
- **Peso de Fuente**: Normal, Medio, Semi-negrita, Negrita (por defecto: Medio)
- **Espaciado entre Enlaces**: 16-64px (por defecto: 32px)
- **Padding Vertical**: 8-24px (por defecto: 12px)

### Cómo crear un menú en Shopify:
1. Ve a **Navegación > Menús**
2. Haz clic en **Crear menú**
3. Agrega un nombre (ej: "Navegación Principal")
4. Agrega elementos del menú:
   - Inicio
   - Propiedades
   - Servicios
   - Acerca de
   - Contacto
5. Guarda el menú
6. Selecciona este menú en el header

## Botón de WhatsApp

### Configuración
- **Número de WhatsApp**: Formato: +1234567890 o 1234567890
- **Texto del Botón**: Texto visible (se oculta en móvil) - por defecto: "WhatsApp"
- **Tamaño de Fuente**: 12-18px (por defecto: 14px)
- **Padding Vertical**: 8-20px (por defecto: 12px)
- **Padding Horizontal**: 12-32px (por defecto: 20px)
- **Radio de Borde**: 0-20px (por defecto: 6px)

### Funcionalidad
- Se abre WhatsApp Web o la app móvil
- Color dorado por defecto, verde WhatsApp en hover
- Responsive: solo icono en móvil, texto + icono en desktop

## Espaciado del Header

### Controles de Padding
- **Padding Superior**: 8-40px (por defecto: 16px)
- **Padding Inferior**: 8-40px (por defecto: 16px)
- **Padding Horizontal**: 16-60px (por defecto: 20px)

### Comportamiento Responsive
- **Desktop**: Padding completo
- **Tablet**: Padding reducido automáticamente
- **Móvil**: Padding mínimo para optimizar espacio

## Características del Header

### Navegación Desktop
- Logo a la izquierda
- Menú centrado con efectos hover
- Acciones a la derecha (WhatsApp, cuenta, carrito)
- Sticky header con sombra sutil

### Navegación Móvil
- Logo a la izquierda
- Botón hamburguesa a la derecha
- Menú full-screen overlay
- Acciones compactas (solo iconos)

### Iconos y Estados
- **Cuenta**: Icono de usuario (si está habilitado)
- **Carrito**: Icono con badge de cantidad
- **WhatsApp**: Icono con texto configurable
- **Menú Móvil**: Hamburguesa que se convierte en X

## Accesibilidad

### Características Incluidas
- ✅ Navegación por teclado completa
- ✅ Skip link para saltar al contenido
- ✅ Etiquetas ARIA apropiadas
- ✅ Contraste WCAG AA/AAA
- ✅ Texto alternativo para iconos
- ✅ Estados de foco visibles
- ✅ Soporte para lectores de pantalla

### Navegación por Teclado
- **Tab**: Navegar entre elementos
- **Enter/Space**: Activar enlaces y botones
- **Escape**: Cerrar menú móvil

## Colores del Tema

### Paleta Utilizada
- **Fondo**: Blanco (`--primary-white`)
- **Texto**: Azul oscuro (`--text-dark`)
- **Acentos**: Dorado (`--primary-gold`)
- **Hover**: Efectos con dorado
- **WhatsApp**: Verde oficial (#25d366)

### Estados Interactivos
- **Hover**: Color dorado con transiciones suaves
- **Focus**: Outline dorado de 2px
- **Active**: Página actual marcada en dorado
- **Disabled**: Opacidad reducida

## Responsive Design

### Breakpoints
- **Móvil**: ≤768px
  - Menú hamburguesa
  - Logo más pequeño
  - Solo iconos en acciones
  - Overlay full-screen

- **Tablet**: 769px-1024px
  - Espaciado reducido
  - Fuentes ligeramente más pequeñas
  - Layout desktop compacto

- **Desktop**: ≥1025px
  - Layout completo
  - Todos los elementos visibles
  - Espaciado óptimo

- **Large Desktop**: ≥1200px
  - Padding extendido
  - Espaciado máximo

## JavaScript Incluido

### Funcionalidad del Menú Móvil
- Toggle del menú hamburguesa
- Overlay con click para cerrar
- Tecla Escape para cerrar
- Prevención de scroll del body
- Cambio de iconos (hamburguesa ↔ X)

### Eventos Manejados
- Click en botón toggle
- Click en overlay
- Keydown (Escape)
- Resize de ventana (automático)

## Optimización de Rendimiento

### Características
- ✅ CSS inline para carga rápida
- ✅ Iconos SVG (no fuentes externas)
- ✅ JavaScript mínimo y eficiente
- ✅ Imágenes lazy loading
- ✅ Transiciones optimizadas
- ✅ Sin dependencias externas

### Mejores Prácticas
- Logo optimizado (WebP recomendado)
- Menús con pocos elementos (5-7 máximo)
- Texto del botón WhatsApp corto
- Padding moderado para mejor UX

## Configuración Recomendada para Inmobiliaria

### Logo
```
- Altura: 50-60px
- Formato: PNG transparente o SVG
- Colores: Azul oscuro y dorado del tema
```

### Menú Principal
```
Elementos sugeridos:
- Inicio
- Propiedades
- Servicios
- Acerca de Nosotros
- Contacto
```

### WhatsApp
```
- Número: +1234567890
- Texto: "Contactar" o "WhatsApp"
- Siempre visible para generar leads
```

### Espaciado
```
- Padding vertical: 16px
- Padding horizontal: 20px
- Menú spacing: 32px
- Fuente menú: 16px, peso medio
```

## Troubleshooting

### El logo no aparece
1. Verifica que la imagen esté subida correctamente
2. Revisa el ancho y altura configurados
3. Asegúrate de que la imagen no sea demasiado grande

### El menú no se muestra
1. Confirma que hay un menú seleccionado
2. Verifica que el menú tenga elementos
3. Revisa que el menú esté publicado

### El botón WhatsApp no funciona
1. Verifica el formato del número (sin espacios ni caracteres especiales)
2. Prueba el enlace: `https://wa.me/1234567890`
3. Confirma que el número esté activo

### El menú móvil no se abre
1. Verifica que JavaScript esté habilitado
2. Revisa la consola del navegador por errores
3. Confirma que los elementos HTML existan

## Archivos del Header

### Archivo Principal
- `sections/header.liquid` - Header completo con toda la funcionalidad

### Archivos de Configuración
- `sections/header-group.json` - Configuración del grupo de header
- `snippets/svg.liquid` - Iconos SVG (actualizado con cart)

### Estilos
- CSS inline en el archivo header.liquid para optimización
- Variables CSS del tema utilizadas consistentemente

## Personalización Avanzada

### Agregar Nuevos Iconos
1. Edita `snippets/svg.liquid`
2. Agrega el nuevo icono con `{% when 'nombre-icono' %}`
3. Usa `{% render 'svg', icon: 'nombre-icono' %}`

### Modificar Colores
Los colores se toman de las variables CSS del tema:
- `--primary-white`
- `--primary-gold`
- `--dark-blue`
- `--text-dark`

### Agregar Funcionalidad
El JavaScript está incluido inline y puede extenderse para:
- Mega menús
- Búsqueda en header
- Múltiples idiomas
- Animaciones adicionales

El header es completamente flexible y se adapta a las necesidades de cualquier inmobiliaria, manteniendo la consistencia visual con el resto del tema.