# HypeV4ult - Cotizador de productos Nike

HypeV4ult es una aplicación Angular moderna diseñada para simplificar la creación de cotizaciones de productos Nike. Permite agregar productos desde la URL de N, gestionar un carrito de compras y generar cotizaciones en PDF con un diseño profesional y personalizado.

![Logo HypeV4ult](public/assets/hypeV4ault.png)

## Características principales

- 🛒 **Agregar productos** desde URLs de N
- 🔍 **Visualizar detalles** de cada producto (tallas, colores, precios)
- 📊 **Gestionar carrito** con múltiples productos
- 💰 **Cálculo automático** de precios, descuentos y envío
- 💳 **Cálculo de cuotas** con interés incluido
- 📑 **Generación de PDF** profesional con diseño personalizado
- 🎨 **Interfaz moderna** con animaciones y notificaciones

## Requisitos previos

- Node.js (v16 o superior)
- npm (v8 o superior)
- Angular CLI (v18.2.0)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/hypev4ault.git
   cd hypev4ault
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   ng serve
   ```

4. **Acceder a la aplicación**
   Navega a `http://localhost:4200/` en tu navegador.

## Estructura del proyecto

La aplicación sigue una arquitectura modular y está organizada siguiendo los principios SOLID:

```
src/
├── app/
│   ├── core/               # Funcionalidades esenciales y modelos
│   │   ├── models/         # Interfaces y tipos comunes
│   │   └── utils/          # Funciones de utilidad
│   ├── modules/            # Módulos funcionales de la aplicación
│   │   └── shopping/       # Módulo de compras
│   │       ├── pages/      # Páginas del módulo
│   │       └── services/   # Servicios específicos del módulo
│   └── shared/             # Componentes y servicios compartidos
│       ├── components/     # Componentes reutilizables
│       └── services/       # Servicios transversales
├── assets/                 # Recursos estáticos (imágenes, fuentes)
└── environments/           # Configuración de entornos
```

## Buenas prácticas implementadas

### Principios SOLID

1. **Principio de Responsabilidad Única (S)**
   - Cada servicio y componente tiene una única responsabilidad.
   - Ejemplo: `PdfGeneratorService` se encarga exclusivamente de la generación de PDFs.

2. **Principio Abierto/Cerrado (O)**
   - Los servicios están diseñados para ser extendidos sin modificar el código existente.
   - Uso de interfaces para definir contratos.

3. **Principio de Sustitución de Liskov (L)**
   - Los tipos derivados pueden sustituir a sus tipos base sin alterar el comportamiento.

4. **Principio de Segregación de Interfaces (I)**
   - Se utilizan interfaces específicas en lugar de una interfaz general.
   - Los clientes solo dependen de los métodos que usan.

5. **Principio de Inversión de Dependencias (D)**
   - Los módulos de alto nivel no dependen de módulos de bajo nivel.
   - Ambos dependen de abstracciones.
   - Uso de inyección de dependencias para desacoplar componentes.

### Otras buenas prácticas

- **Código limpio y comentado** - Funciones pequeñas con nombres descriptivos
- **Manejo de errores** - Captura y gestión adecuada de excepciones
- **Tipado estricto** - Uso extensivo de TypeScript para prevenir errores
- **Pruebas unitarias** - Componentes y servicios preparados para testing
- **Diseño responsive** - Interfaz adaptable a diferentes dispositivos

## Generación de PDFs

La funcionalidad de generación de PDFs ha sido implementada siguiendo el patrón de diseño Strategy y los principios SOLID. El servicio `PdfGeneratorService` encapsula toda la lógica de generación, permitiendo:

1. Separación de responsabilidades
2. Configuración centralizada
3. Reutilización de código
4. Fácil mantenimiento y extensibilidad

## Personalización

Puedes modificar los parámetros de la aplicación editando los archivos de entorno:

```
src/environments/environment.ts          # Desarrollo
src/environments/environment.prod.ts     # Producción
```

## Comandos disponibles

- `ng serve` - Inicia el servidor de desarrollo
- `ng build` - Compila la aplicación para producción
- `ng test` - Ejecuta pruebas unitarias
- `ng lint` - Verifica la calidad del código

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`)
4. Sube tus cambios (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Desarrollo

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.0.

### Servidor de desarrollo

Ejecuta `ng serve` para un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

### Generación de código

Ejecuta `ng generate component nombre-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Compilación

Ejecuta `ng build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio `dist/`.

### Ejecución de pruebas unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias a través de [Karma](https://karma-runner.github.io).

### Ejecución de pruebas end-to-end

Ejecuta `ng e2e` para ejecutar las pruebas end-to-end a través de una plataforma de tu elección. Para usar este comando, primero debes agregar un paquete que implemente capacidades de prueba end-to-end.

### Más ayuda

Para obtener más ayuda sobre Angular CLI, usa `ng help` o consulta la [Página de referencia y descripción general de Angular CLI](https://angular.dev/tools/cli).

Angular CLI: 18.2.0
Node: 22.6.0
Package Manager: npm 10.8.2
OS: win32 x64

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1802.0 (cli-only)
@angular-devkit/core         18.2.0 (cli-only)
@angular-devkit/schematics   18.2.0 (cli-only)
@schematics/angular          18.2.0 (cli-only)

## Historial de versiones

### v1.3.9 (Actual)
- **Corrección de Datos de Transferencia**: Se ha solucionado el problema con la visualización de los datos bancarios en el PDF.
- **Mejora Visual**: Separación más clara y mejor formateo de la sección de datos de transferencia.
- **Control de Espacio Mejorado**: Verificación automática para asegurar que toda la información quepa correctamente en el PDF.
- **Adaptación Inteligente**: El PDF ahora añade páginas automáticamente cuando es necesario para mostrar toda la información.
- **Diagnósticos Avanzados**: Sistema de logs mejorado para identificar y resolver problemas de renderizado.

### v1.3.8 (Anterior)
- **Solución definitiva para enlaces en PDF**: Se ha implementado un sistema robusto para garantizar que todos los productos sean clickeables.
- **Enlaces por página**: Nueva arquitectura que procesa los enlaces página por página para evitar problemas de posicionamiento.
- **Mayor precisión**: Los enlaces ahora se asocian correctamente a su página específica en el documento.
- **Áreas clickeables mejoradas**: Mayor tamaño de las áreas clickeables (40mm de altura) para facilitar la navegación.
- **Sistema de depuración completo**: Logs detallados que facilitan el diagnóstico de cualquier problema con los enlaces.

### v1.3.7 (Anterior)
- **Corrección de Enlaces en PDF**: Se ha solucionado el problema donde solo el último producto tenía un enlace clickeable.
- **Enlaces Mejorados**: Todos los productos en el PDF ahora tienen enlaces correctamente implementados.
- **Mayor Área Clickeable**: Se ha aumentado el área clickeable para mejorar la experiencia del usuario.
- **Diagnósticos Mejorados**: Implementación de logs para facilitar la depuración de problemas con enlaces.

### v1.3.6 (Anterior)
- **Datos de Transferencia en PDF**: Se han añadido los datos bancarios para transferencia en el PDF de cotización.
- **Información Completa**: El PDF ahora incluye nombre, RUT, banco, tipo de cuenta, número de cuenta y email para facilitar los pagos.
- **Mejor Experiencia**: Los clientes pueden realizar transferencias directamente con la información del PDF.

### v1.3.5
- **Mejora en Visualización de Tallas**: Se ha optimizado la distribución de tallas en la modal de productos.
- **Distribución Mejorada**: Las tallas ahora se muestran en múltiples filas cuando hay muchas opciones.
- **Dimensiones Optimizadas**: Se ha establecido un tamaño mínimo para cada botón de talla para asegurar la visibilidad del texto.
- **Diseño Flexible**: Implementación de grid para adaptarse al espacio disponible.
- **Experiencia de Usuario Mejorada**: Botones de tamaño consistente para una mejor interacción.

### v1.3.3 (Anterior)

#### Optimización de enlaces clickeables en PDF

- 🔗 **Enlaces integrados**: Cada producto del PDF es ahora directamente clickeable sin páginas adicionales
- 👆 **Mayor área clickeable**: Se amplió el área de interacción para facilitar la navegación
- 🔴 **Indicador visual**: Pequeño icono de enlace que indica la presencia de hipervínculo
- 🧠 **Experiencia intuitiva**: Los productos funcionan como enlaces directos a sus páginas originales
- 📄 **PDF más compacto**: Eliminación de la página adicional de enlaces para una experiencia más fluida

### v1.3.2 (Anterior)

#### Mejora en la navegación del PDF con enlaces directos

- 🔗 **Página de enlaces**: Nueva página al final del PDF con enlaces directos a todos los productos
- 📋 **Lista clara**: Los productos aparecen numerados con sus tallas para fácil referencia
- 🔄 **Doble acceso**: Enlaces tanto en los nombres de los productos como en la página de enlaces
- 📱 **Compatibilidad mejorada**: Funcionamiento garantizado en la mayoría de lectores de PDF
- 🧭 **Mejor navegación**: Área de clic optimizada para mejor experiencia de usuario
- 🔍 **Visibilidad mejorada**: Instrucciones claras para el usuario sobre cómo acceder a los productos

### v1.3.1 (Anterior)

#### Mejoras en la generación de PDF para cotizaciones

- ✨ **Modal personalizado**: Interfaz mejorada para solicitar el nombre del destinatario de la cotización
- 🎨 **Estilo actualizado**: Cambios visuales en el PDF generado con colores corporativos
- 👤 **Personalización**: El PDF ahora incluye el nombre del destinatario debajo de la fecha
- 🔴 **Elementos destacados**: Textos importantes (Ahorro, Total Crédito y Envío Gratis) destacados en color rojo
- 🖌️ **Interfaz coherente**: Modal con estilos que coinciden con la paleta de colores de la aplicación
- ⌨️ **Mejor usabilidad**: Soporte para confirmar con la tecla Enter y enfoque automático en el campo de entrada
- 🛑 **Manejo de cancelación**: Implementación adecuada para cuando el usuario cancela la generación

### v1.2.0 (Marzo 2025)

#### Mejoras en el sistema de caché del carrito

- ✨ **Nueva funcionalidad**: Opción para activar/desactivar el caché del carrito desde el header
- 🔄 **Persistencia mejorada**: El estado de activación del caché se mantiene entre sesiones
- 🧠 **Memoria en tiempo real**: Los productos se mantienen en memoria durante la sesión aunque el caché esté desactivado
- 🔐 **Control de privacidad**: Los usuarios pueden decidir si quieren que sus productos permanezcan entre sesiones
- 🔄 **Transiciones fluidas**: Al activar el caché, los productos actuales se guardan automáticamente
- 🧹 **Limpieza inteligente**: Al desactivar el caché, se eliminan los productos del almacenamiento pero se conservan en la sesión actual
- 🔧 **Implementación SOLID**: Nueva arquitectura siguiendo principios de diseño sólidos:
  - Separación de responsabilidades con `CartStorageService`
  - Inversión de dependencias en `CartService`
  - Mayor inmutabilidad en las operaciones con productos
