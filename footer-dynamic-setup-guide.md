# Guía de Configuración del Footer Dinámico

## Descripción General

El footer ha sido actualizado para ser completamente dinámico y configurable desde el panel de administración de Shopify. Ahora incluye:

- ✅ Bloques reutilizables y configurables
- ✅ Selección de menús dinámicos creados en Shopify
- ✅ Múltiples números de teléfono y emails
- ✅ Redes sociales con iconos SVG modernos
- ✅ Bloque de newsletter integrado
- ✅ Bloques de texto personalizables
- ✅ Iconos SVG modernos (sin emojis)

## Configuración Básica

### 1. Información de la Empresa
- **Nombre de la Empresa**: Se usa el nombre de la tienda si se deja vacío
- **Descripción de la Empresa**: Texto descriptivo que aparece en el footer

### 2. Información de Contacto
- **Título de Contacto**: Título de la sección (por defecto: "Contacto")
- **Dirección**: Dirección completa de la empresa
- **Teléfono Principal**: Número principal de contacto
- **Teléfono Secundario**: Número secundario (opcional)
- **Email Principal**: Email principal de contacto
- **Email Secundario**: Email secundario (opcional)
- **Horarios de Atención**: Horarios de servicio al cliente

### 3. Redes Sociales
- **Título de Redes Sociales**: Título de la sección (por defecto: "Síguenos")
- **Facebook URL**: Enlace a página de Facebook
- **Instagram URL**: Enlace a perfil de Instagram
- **Twitter/X URL**: Enlace a perfil de Twitter/X
- **LinkedIn URL**: Enlace a perfil de LinkedIn
- **YouTube URL**: Enlace a canal de YouTube
- **WhatsApp URL**: Enlace de WhatsApp (formato: https://wa.me/1234567890)

### 4. Copyright y Derechos
- **Texto de Copyright**: Texto personalizado (usa nombre de tienda si está vacío)
- **Texto de Derechos**: Texto adicional (por defecto: "Todos los derechos reservados.")

## Bloques Dinámicos

### Bloque: Menú de Navegación
Permite agregar menús creados en **Navegación > Menús** del panel de Shopify.

**Configuración:**
- **Título del Menú**: Nombre que aparecerá como encabezado
- **Seleccionar Menú**: Dropdown con todos los menús disponibles

**Cómo crear un menú en Shopify:**
1. Ve a **Navegación > Menús**
2. Haz clic en **Crear menú**
3. Agrega un nombre (ej: "Enlaces Útiles", "Servicios", "Propiedades")
4. Agrega elementos del menú con sus enlaces
5. Guarda el menú
6. Selecciona este menú en el footer

### Bloque: Bloque de Texto
Permite agregar contenido personalizado con texto enriquecido.

**Configuración:**
- **Título**: Encabezado del bloque
- **Contenido**: Editor de texto enriquecido para contenido HTML

**Usos sugeridos:**
- Información legal
- Políticas de la empresa
- Certificaciones
- Información adicional

### Bloque: Newsletter
Formulario de suscripción integrado con Shopify.

**Configuración:**
- **Título**: Encabezado del formulario (por defecto: "Suscríbete")
- **Descripción**: Texto descriptivo del newsletter
- **Texto del Botón**: Texto del botón de envío (por defecto: "Suscribirse")

**Funcionalidad:**
- Se integra automáticamente con el sistema de clientes de Shopify
- Los suscriptores se marcan con la etiqueta "newsletter"
- Validación de email automática
- Mensajes de éxito y error

## Iconos SVG Disponibles

### Iconos de Contacto
- `location` - Ubicación/dirección
- `phone` - Teléfono
- `email` - Correo electrónico
- `clock` - Horarios

### Iconos de Propiedades
- `home` - Casa/propiedad
- `building` - Edificio
- `bed` - Dormitorios
- `bath` - Baños
- `car` - Estacionamiento
- `area` - Metros cuadrados

### Iconos de Redes Sociales
- `facebook` - Facebook
- `instagram` - Instagram
- `twitter` - Twitter/X
- `linkedin` - LinkedIn
- `youtube` - YouTube
- `whatsapp` - WhatsApp

### Iconos de Navegación
- `arrow-right`, `arrow-left`, `arrow-up`, `arrow-down`
- `menu` - Menú hamburguesa
- `search` - Búsqueda
- `user` - Usuario

### Iconos de Estado
- `check` - Éxito/confirmación
- `close` - Cerrar/cancelar
- `info` - Información
- `warning` - Advertencia
- `success` - Éxito
- `error` - Error

## Configuración Recomendada

### Para Inmobiliaria
```
Bloques sugeridos:
1. Menú "Propiedades" (Casas, Apartamentos, Comerciales, etc.)
2. Menú "Servicios" (Venta, Alquiler, Tasaciones, etc.)
3. Bloque de Texto "Certificaciones" (Licencias, membresías)
4. Newsletter "Recibe Nuevas Propiedades"
```

### Redes Sociales Típicas
- Facebook: Página de la inmobiliaria
- Instagram: Fotos de propiedades
- WhatsApp: Contacto directo
- LinkedIn: Red profesional

## Personalización Avanzada

### Agregar Nuevos Iconos SVG
1. Edita `snippets/svg.liquid`
2. Agrega un nuevo `{% when 'nombre-icono' %}`
3. Incluye el código SVG optimizado
4. Usa `{% render 'svg', icon: 'nombre-icono', class: 'svg-icon--medium' %}`

### Estilos CSS Personalizados
Los estilos están incluidos en cada snippet usando `{% stylesheet %}` para optimización.

### Clases CSS Disponibles
- `.svg-icon--small` - Icono pequeño
- `.svg-icon--medium` - Icono mediano (por defecto)
- `.svg-icon--large` - Icono grande
- `.svg-icon--xl` - Icono extra grande
- `.svg-icon--primary` - Color dorado
- `.svg-icon--secondary` - Color azul
- `.svg-icon--muted` - Color gris
- `.svg-icon--white` - Color blanco

## Accesibilidad

El footer incluye:
- ✅ Navegación por teclado completa
- ✅ Etiquetas ARIA apropiadas
- ✅ Contraste de colores WCAG AA/AAA
- ✅ Texto alternativo para iconos
- ✅ Estructura semántica HTML5
- ✅ Soporte para lectores de pantalla

## Rendimiento

- ✅ CSS inline optimizado
- ✅ Iconos SVG (no fuentes externas)
- ✅ Carga condicional de bloques
- ✅ Código minificado automáticamente
- ✅ Sin dependencias externas

## Soporte Responsive

- **Mobile (≤768px)**: Layout de una columna, centrado
- **Tablet (769px-1024px)**: Grid adaptativo de 2-3 columnas
- **Desktop (>1024px)**: Grid completo con espaciado optimizado

## Troubleshooting

### El menú no aparece
1. Verifica que el menú esté creado en **Navegación > Menús**
2. Asegúrate de que el menú tenga elementos
3. Confirma que esté seleccionado en el bloque del footer

### Los iconos no se muestran
1. Verifica que el nombre del icono sea correcto
2. Revisa que `snippets/svg.liquid` esté presente
3. Confirma la sintaxis: `{% render 'svg', icon: 'nombre' %}`

### El newsletter no funciona
1. Verifica que el formulario use `{% form 'customer' %}`
2. Confirma que el input tenga `name="contact[email]"`
3. Revisa que esté incluido `<input type="hidden" name="contact[tags]" value="newsletter">`

## Archivos Modificados/Creados

### Archivos Principales
- `sections/footer.liquid` - Footer principal con bloques dinámicos
- `snippets/svg.liquid` - Librería de iconos SVG

### Snippets de Bloques
- `snippets/footer-menu-block.liquid` - Bloques de menú dinámicos
- `snippets/footer-text-block.liquid` - Bloques de texto personalizable
- `snippets/footer-newsletter-block.liquid` - Formulario de newsletter
- `snippets/footer-social-media.liquid` - Enlaces de redes sociales

### Snippets Actualizados
- `snippets/footer-contact-info.liquid` - Información de contacto con múltiples campos
- `snippets/footer-company-info.liquid` - Información de la empresa
- `snippets/footer-navigation-menu.liquid` - Menús de navegación (legacy)

### Estilos
- `assets/critical.css` - Estilos base para iconos SVG agregados

El footer ahora es completamente flexible y puede adaptarse a cualquier necesidad de negocio inmobiliario.