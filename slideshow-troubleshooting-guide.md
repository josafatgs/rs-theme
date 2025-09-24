# 🔧 Guía de Solución de Problemas del Slideshow

## 🚨 Problema: Los Bloques de Imagen No Funcionan

### ✅ Cambios Realizados para Solucionar

#### 1. **JavaScript Mejorado**
- ✅ Cambiado de `<script>` a `{% javascript %}` (mejor práctica de Shopify)
- ✅ Agregados logs de debug para identificar problemas
- ✅ Mejorada la inicialización del slideshow
- ✅ Corregidos los event listeners

#### 2. **Schema Completo**
- ✅ Completado el schema que estaba truncado
- ✅ Agregadas todas las configuraciones faltantes
- ✅ Incluidos bloques de imagen con presets

### 🔍 Pasos de Diagnóstico

#### **Paso 1: Verificar la Consola del Navegador**
1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Recarga la página
4. Busca estos mensajes:
   ```
   Slideshow script loaded
   Found slideshows: 1
   Initializing slideshow with X slides
   ```

#### **Paso 2: Verificar los Bloques**
1. Ve a **Temas > Personalizar**
2. Agrega la sección **Slideshow**
3. Haz clic en **"Agregar bloque"**
4. Selecciona **"Imagen"**
5. Sube una imagen y agrega texto
6. Repite para crear al menos 2-3 bloques

#### **Paso 3: Verificar Configuración**
En la configuración del slideshow, asegúrate de que:
- ✅ **Reproducción Automática**: Activada
- ✅ **Mostrar Flechas**: Activada
- ✅ **Mostrar Puntos**: Activada
- ✅ **Altura**: Configurada (ej: 400px)

### 🛠️ Soluciones Específicas

#### **Si No Aparecen las Imágenes:**
```liquid
<!-- Verifica que los bloques tengan imágenes -->
{% for block in section.blocks %}
  <p>Bloque {{ forloop.index }}: 
    {% if block.settings.image %}
      ✅ Imagen presente
    {% else %}
      ❌ Sin imagen
    {% endif %}
  </p>
{% endfor %}
```

#### **Si No Funciona la Navegación:**
1. **Verifica JavaScript**: Abre la consola y busca errores
2. **Verifica Iconos SVG**: Asegúrate de que `snippets/svg.liquid` tenga los iconos `arrow-left` y `arrow-right`
3. **Verifica Event Listeners**: Los logs de debug mostrarán si se ejecutan

#### **Si No Cambia Automáticamente:**
1. **Verifica Autoplay**: Debe estar activado en la configuración
2. **Verifica Velocidad**: Configurada en segundos (ej: 5)
3. **Verifica Múltiples Slides**: Necesitas al menos 2 imágenes

### 🎯 Configuración Recomendada para Testing

```json
{
  "autoplay": true,
  "autoplay_speed": 3,
  "show_arrows": true,
  "show_dots": true,
  "slideshow_height_mobile": 300,
  "slideshow_height_desktop": 500
}
```

### 📋 Checklist de Verificación

#### **Archivos Necesarios:**
- [ ] `sections/slideshow.liquid` ✅ (actualizado)
- [ ] `snippets/svg.liquid` ✅ (con iconos arrow-left, arrow-right, image)

#### **Configuración Admin:**
- [ ] Sección Slideshow agregada
- [ ] Al menos 2 bloques de imagen creados
- [ ] Imágenes subidas en cada bloque
- [ ] Autoplay activado
- [ ] Flechas y puntos activados

#### **Frontend:**
- [ ] Slideshow visible en la página
- [ ] Imágenes se muestran correctamente
- [ ] Flechas de navegación visibles
- [ ] Puntos de navegación visibles
- [ ] Cambio automático funciona

### 🚀 Pasos para Probar

#### **1. Configuración Básica**
```
1. Temas > Personalizar
2. Agregar sección > Slideshow
3. Agregar bloque > Imagen
4. Subir imagen + agregar título
5. Repetir para 2-3 imágenes más
6. Guardar y ver en frontend
```

#### **2. Test de Funcionalidad**
```
1. ¿Se ven las imágenes? ✅/❌
2. ¿Funcionan las flechas? ✅/❌
3. ¿Funcionan los puntos? ✅/❌
4. ¿Cambia automáticamente? ✅/❌
5. ¿Funciona en móvil? ✅/❌
```

### 🔧 Soluciones de Emergencia

#### **Si Nada Funciona:**

**Opción 1: Slideshow Simplificado**
```liquid
<!-- Versión mínima para testing -->
<div class="simple-slideshow">
  {% for block in section.blocks %}
    <div class="simple-slide" style="display: {% if forloop.first %}block{% else %}none{% endif %}">
      {% if block.settings.image %}
        <img src="{{ block.settings.image | image_url: width: 800 }}" alt="{{ block.settings.heading }}">
      {% endif %}
      {% if block.settings.heading %}
        <h2>{{ block.settings.heading }}</h2>
      {% endif %}
    </div>
  {% endfor %}
</div>
```

**Opción 2: Verificar Errores JavaScript**
```javascript
// Agregar al final del JavaScript
console.log('Slideshow debug info:', {
  slideshows: document.querySelectorAll('.slideshow').length,
  slides: document.querySelectorAll('.slideshow-slide').length,
  dots: document.querySelectorAll('.slideshow-dot').length,
  arrows: document.querySelectorAll('.slideshow-arrow').length
});
```

### 📞 Información de Debug

Si el problema persiste, verifica:

1. **Consola del navegador**: ¿Hay errores JavaScript?
2. **Network tab**: ¿Se cargan las imágenes?
3. **Elements tab**: ¿Existen los elementos HTML?
4. **Configuración**: ¿Están todos los campos llenos?

### ✅ Resultado Esperado

Cuando funcione correctamente:
- ✅ Slideshow visible con altura configurada
- ✅ Imágenes se muestran correctamente
- ✅ Cambio automático cada X segundos
- ✅ Flechas funcionan al hacer clic
- ✅ Puntos funcionan al hacer clic
- ✅ Responsive en móvil y desktop
- ✅ Texto overlay sobre las imágenes

### 🎉 Confirmación de Éxito

El slideshow está funcionando cuando veas:
- Múltiples imágenes rotando automáticamente
- Flechas de navegación funcionales
- Puntos indicadores activos
- Texto superpuesto legible
- Responsive en todos los dispositivos

¡Con estos cambios el slideshow debería funcionar perfectamente! 🚀