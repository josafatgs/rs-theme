# Guía de Solución de Problemas del Footer

## 🔍 Problema: Footer No Se Muestra Actualizado

### Posibles Causas y Soluciones

#### 1. **Cache del Navegador**
**Síntoma**: Los cambios no se reflejan visualmente
**Solución**:
- Hacer **Hard Refresh**: `Ctrl + F5` (Windows) o `Cmd + Shift + R` (Mac)
- Abrir **Herramientas de Desarrollador** > **Network** > **Disable Cache**
- Probar en **modo incógnito/privado**

#### 2. **Configuración del Footer-Group**
**Síntoma**: Footer muestra versión antigua o básica
**Solución**: Actualizar `sections/footer-group.json`

#### 3. **Snippets No Encontrados**
**Síntoma**: Errores en consola o secciones vacías
**Verificar**: Que todos los snippets existan:
- `snippets/footer-company-info.liquid`
- `snippets/footer-contact-info.liquid`
- `snippets/footer-menu-block.liquid`
- `snippets/footer-text-block.liquid`
- `snippets/footer-newsletter-block.liquid`
- `snippets/footer-social-media.liquid`

#### 4. **Configuración desde Admin**
**Síntoma**: Footer aparece pero sin contenido
**Solución**: Configurar desde **Temas > Personalizar > Footer**

#### 5. **Errores de Liquid**
**Síntoma**: Footer no renderiza o muestra errores
**Verificar**: Consola del navegador por errores de sintaxis

## 🛠️ Pasos de Diagnóstico

### Paso 1: Verificar Archivos
```bash
# Verificar que existan todos los archivos:
sections/footer.liquid ✓
sections/footer-group.json ✓
snippets/footer-company-info.liquid ✓
snippets/footer-contact-info.liquid ✓
snippets/footer-menu-block.liquid ✓
snippets/footer-text-block.liquid ✓
snippets/footer-newsletter-block.liquid ✓
snippets/footer-social-media.liquid ✓
snippets/svg.liquid ✓
```

### Paso 2: Verificar Configuración
1. Ve a **Temas > Personalizar**
2. Busca la sección **Footer**
3. Verifica que aparezcan todas las opciones:
   - Información de la Empresa
   - Información de Contacto
   - Redes Sociales
   - Copyright y Derechos
   - Botón "Agregar bloque"

### Paso 3: Verificar Bloques
1. En el footer, haz clic en **"Agregar bloque"**
2. Deberías ver opciones:
   - Menú de Navegación
   - Bloque de Texto
   - Newsletter

### Paso 4: Verificar en Frontend
1. Ve al sitio web
2. Scroll hasta el footer
3. Verifica que se muestre el nuevo diseño

## 🔧 Soluciones Rápidas

### Solución 1: Actualizar Footer-Group
Si el footer muestra la versión antigua, actualiza la configuración:
### 
Solución 2: Limpiar Cache de Shopify
```liquid
<!-- Agregar al final de layout/theme.liquid antes de </body> -->
<!-- Footer Debug: {{ 'now' | date: '%Y-%m-%d %H:%M:%S' }} -->
```

### Solución 3: Verificar Snippets
Asegúrate de que todos estos archivos existan:
- ✅ `snippets/footer-company-info.liquid`
- ✅ `snippets/footer-contact-info.liquid`
- ✅ `snippets/footer-menu-block.liquid`
- ✅ `snippets/footer-text-block.liquid`
- ✅ `snippets/footer-newsletter-block.liquid`
- ✅ `snippets/footer-social-media.liquid`
- ✅ `snippets/svg.liquid`

### Solución 4: Forzar Actualización del Footer-Group
El archivo `sections/footer-group.json` ha sido actualizado con:
- Configuración completa de contacto
- Bloques de ejemplo preconfigurados
- Redes sociales configuradas
- Copyright personalizado

## 🚨 Checklist de Verificación

### ✅ Archivos Críticos
- [ ] `sections/footer.liquid` - Footer principal
- [ ] `sections/footer-group.json` - Configuración actualizada
- [ ] `snippets/svg.liquid` - Iconos SVG
- [ ] Todos los snippets de footer

### ✅ Configuración Admin
1. Ve a **Temas > Personalizar**
2. Busca **Footer** en la lista de secciones
3. Verifica que aparezcan todas las opciones:
   - Información de la Empresa ✓
   - Información de Contacto ✓
   - Redes Sociales ✓
   - Copyright y Derechos ✓
4. Haz clic en **"Agregar bloque"**
5. Deberías ver:
   - Menú de Navegación ✓
   - Bloque de Texto ✓
   - Newsletter ✓

### ✅ Frontend
1. **Hard Refresh**: `Ctrl + F5` o `Cmd + Shift + R`
2. **Modo Incógnito**: Abre ventana privada
3. **Scroll al Footer**: Verifica el nuevo diseño
4. **Responsive**: Prueba en móvil y desktop

## 🔧 Soluciones Específicas

### Si el Footer Sigue Mostrando la Versión Antigua:

#### Opción 1: Forzar Recarga
```bash
# En el navegador:
1. Abrir DevTools (F12)
2. Click derecho en el botón de recarga
3. Seleccionar "Empty Cache and Hard Reload"
```

#### Opción 2: Verificar Layout
```liquid
<!-- En layout/theme.liquid debe tener: -->
{% sections 'footer-group' %}
```

#### Opción 3: Recrear Footer-Group
Si nada funciona, elimina y recrea:
1. Elimina `sections/footer-group.json`
2. Ve a **Temas > Personalizar**
3. Agrega una nueva sección **Footer**
4. Configura desde cero

### Si Aparecen Errores de Liquid:

#### Error: "Could not find asset snippets/svg.liquid"
**Solución**: Verificar que el archivo `snippets/svg.liquid` exista

#### Error: "Could not find asset snippets/footer-xxx.liquid"
**Solución**: Verificar que todos los snippets del footer existan

#### Error: "Unknown tag 'render'"
**Solución**: Usar `{% include %}` en lugar de `{% render %}` si es una versión antigua de Shopify

## 📱 Testing Responsive

### Desktop (>1024px)
- Footer con 4 columnas
- Espaciado completo
- Todos los elementos visibles

### Tablet (769px-1024px)
- Footer con 2-3 columnas adaptativas
- Espaciado reducido
- Elementos reorganizados

### Mobile (≤768px)
- Footer con 1 columna
- Elementos centrados
- Espaciado mínimo

## 🎯 Configuración Recomendada

### Para Ver Cambios Inmediatamente:
1. **Información de la Empresa**:
   - Nombre: "Tu Inmobiliaria"
   - Descripción: "Especialistas en bienes raíces..."

2. **Información de Contacto**:
   - Teléfono: "+1 234 567 890"
   - Email: "info@tuinmobiliaria.com"
   - Dirección: "Tu dirección completa"

3. **Redes Sociales**:
   - Facebook: "https://facebook.com/tuinmobiliaria"
   - Instagram: "https://instagram.com/tuinmobiliaria"
   - WhatsApp: "https://wa.me/1234567890"

4. **Agregar Bloques**:
   - Menú de Navegación (seleccionar menú existente)
   - Newsletter con título "Suscríbete"

### Resultado Esperado:
- Footer con fondo azul oscuro
- Texto blanco con acentos dorados
- Iconos SVG modernos (sin emojis)
- Layout responsive
- Bloques configurables

## 🆘 Si Nada Funciona

### Último Recurso:
1. **Backup**: Guarda una copia de `sections/footer.liquid`
2. **Elimina**: Borra `sections/footer-group.json`
3. **Recrea**: Ve a Personalizar > Agregar sección > Footer
4. **Configura**: Desde cero con los nuevos controles
5. **Restaura**: Si es necesario, restaura el backup

### Contacto de Soporte:
Si el problema persiste:
1. Verifica la consola del navegador (F12)
2. Revisa errores de Liquid en el admin
3. Comprueba que todos los archivos estén presentes
4. Prueba en un tema de desarrollo primero

## ✅ Confirmación de Éxito

El footer está funcionando correctamente cuando veas:
- ✅ Fondo azul oscuro (`#0d1b2a`)
- ✅ Texto blanco con acentos dorados
- ✅ Iconos SVG (ubicación, teléfono, email)
- ✅ Layout responsive (4 columnas → 1 columna)
- ✅ Bloques configurables desde admin
- ✅ Redes sociales con iconos modernos
- ✅ Copyright dinámico con año actual

Si ves todos estos elementos, ¡el footer dinámico está funcionando perfectamente! 🎉