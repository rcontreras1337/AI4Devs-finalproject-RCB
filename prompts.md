> Detalla en esta sección los prompts principales utilizados durante la creación del proyecto, que justifiquen el uso de asistentes de código en todas las fases del ciclo de vida del desarrollo. Esperamos un máximo de 3 por sección, principalmente los de creación inicial o  los de corrección o adición de funcionalidades que consideres más relevantes.
Puedes añadir adicionalmente la conversación completa como link o archivo adjunto si así lo consideras


## Índice

- [Índice](#índice)
- [1. Descripción general del producto](#1-descripción-general-del-producto)
- [2. Arquitectura del Sistema](#2-arquitectura-del-sistema)
  - [**2.1. Diagrama de arquitectura:**](#21-diagrama-de-arquitectura)
  - [**2.2. Descripción de componentes principales:**](#22-descripción-de-componentes-principales)
  - [**2.3. Descripción de alto nivel del proyecto y estructura de ficheros**](#23-descripción-de-alto-nivel-del-proyecto-y-estructura-de-ficheros)
  - [**2.4. Infraestructura y despliegue**](#24-infraestructura-y-despliegue)
  - [**2.5. Seguridad**](#25-seguridad)
  - [**2.6. Tests**](#26-tests)
  - [3. Modelo de Datos](#3-modelo-de-datos)
  - [4. Especificación de la API](#4-especificación-de-la-api)
  - [5. Historias de Usuario](#5-historias-de-usuario)
  - [6. Tickets de Trabajo](#6-tickets-de-trabajo)
  - [7. Pull Requests](#7-pull-requests)

---

## 1. Descripción general del producto

**Prompt 1 (Product Manager):**
Ahora necesito que actúes como Product Manager. Genera una descripción general del producto HypeV4ault, incluyendo objetivo, valor agregado, funcionalidades clave y experiencia de usuario esperada.

**Prompt 2 (Product Manager):**
Redacta la experiencia esperada del usuario final (cliente y administrador) desde que aterriza en la aplicación hasta la generación de cotización y pago, en lenguaje claro y orientado a producto.

**Prompt 3 (Product Manager):**
Genera instrucciones de instalación y requisitos para que un desarrollador pueda levantar el sistema en local, sin Docker, detallando pasos para backend y frontend.

---

## 2. Arquitectura del Sistema

### **2.1. Diagrama de arquitectura:**

**Prompt 1 (Experto Técnico):**
Como experto en arquitectura de software, genera un diagrama Mermaid que represente la arquitectura de HypeV4ault, mostrando frontend, backend, scrapper y base de datos, con flujos de datos y leyenda.

**Prompt 2 (Experto Técnico):**
Explica la responsabilidad y tecnologías de cada componente principal (frontend Angular, backend Node.js, scrapper, PostgreSQL) y cómo interactúan entre sí.

**Prompt 3 (Experto Técnico):**
Describe la comunicación entre los módulos y cómo se asegura la separación de responsabilidades y escalabilidad.

### **2.2. Descripción de componentes principales:**

**Prompt 1 (Experto Técnico):**
Detalla el rol y las funciones de cada componente del sistema, incluyendo cómo interactúan entre sí y qué librerías o frameworks se utilizan.

**Prompt 2 (Experto Técnico):**
¿Qué tecnologías y librerías específicas se usan en cada módulo y por qué? Justifica su elección.

**Prompt 3 (Experto Técnico):**
¿Cómo se gestiona la seguridad y la validación de datos en cada capa del sistema?

### **2.3. Descripción de alto nivel del proyecto y estructura de ficheros**

**Prompt 1 (Experto Técnico):**
Describe la estructura de carpetas del proyecto y la función de cada directorio principal, siguiendo buenas prácticas de arquitectura.

**Prompt 2 (Experto Técnico):**
¿Cómo se organiza el código para facilitar el mantenimiento y la escalabilidad? Explica convenciones y patrones usados.

**Prompt 3 (Experto Técnico):**
¿Qué convenciones de nombres y organización se siguen en frontend y backend?

### **2.4. Infraestructura y despliegue**

**Prompt 1 (Experto Técnico):**
¿Dónde y cómo se puede desplegar cada componente del sistema? Incluye opciones cloud y on-premise.

**Prompt 2 (Experto Técnico):**
¿Qué consideraciones de red, CORS y seguridad se deben tener en cuenta para el despliegue?

**Prompt 3 (Experto Técnico):**
¿Cómo se gestiona la configuración de variables de entorno para cada entorno (local, producción)?

### **2.5. Seguridad**

**Prompt 1 (Experto Técnico):**
¿Qué mecanismos de autenticación y autorización se implementan en el sistema? Explica el uso de JWT y roles.

**Prompt 2 (Experto Técnico):**
¿Cómo se protege la información sensible y se asegura la expiración de URLs temporales?

**Prompt 3 (Experto Técnico):**
¿Qué validaciones y controles existen para evitar accesos no autorizados o ataques comunes?

### **2.6. Tests**

**Prompt 1 (Experto Técnico):**
¿Qué tipos de pruebas se implementan en frontend y backend (unitarias, integración, e2e)?

**Prompt 2 (Experto Técnico):**
¿Cómo se automatizan las pruebas y qué herramientas se utilizan?

**Prompt 3 (Experto Técnico):**
¿Qué cobertura de tests se considera aceptable y cómo se mide?

---

### 3. Modelo de Datos

**Prompt 1 (Experto en Bases de Datos):**
Genera un diagrama E-R en Mermaid para el modelo de datos relacional de HypeV4ault, con entidades, claves y relaciones normalizadas.

**Prompt 2 (Experto en Bases de Datos):**
Describe cada entidad de la base de datos, sus atributos, tipos, restricciones y relaciones, incluyendo claves foráneas y reglas de unicidad.

**Prompt 3 (Experto en Bases de Datos):**
Explica las reglas de negocio, integridad referencial y unicidad que debe cumplir el modelo, y cómo se auditan los cambios de estado.

---

### 4. Especificación de la API

**Prompt 1 (Product Manager/Experto Técnico):**
Genera la especificación OpenAPI (YAML) para la API de HypeV4ault, cubriendo autenticación JWT, gestión de usuarios, direcciones, cotizaciones, pedidos, pagos, logs y visualización HTML.

**Prompt 2 (Product Manager/Experto Técnico):**
Incluye ejemplos de request y response para los endpoints principales de la API, mostrando casos de éxito y error.

**Prompt 3 (Product Manager/Experto Técnico):**
Explica cómo se maneja la autenticación JWT y la autorización en los endpoints protegidos, y cómo se documenta en OpenAPI.

---

### 5. Historias de Usuario

**Prompt 1 (Product Manager):**
Ahora necesito que actúes como Product Manager. Genera las historias de usuario necesarias para HypeV4ault. Usa el formato: Estructura básica de una User Story. Formato estándar: "Como [tipo de usuario], quiero [realizar una acción] para [obtener un beneficio]". Incluye descripción, criterios de aceptación, notas adicionales y tareas.

**Prompt 2 (Product Manager):**
¿Hay más historias de usuario que creas necesario agregar? ¿Se pueden mejorar las que ya existen? Propón mejoras y nuevas historias para cubrir todos los flujos y roles.

**Prompt 3 (Product Manager):**
Desglosa las historias de usuario en tareas técnicas y criterios de aceptación detallados para desarrollo individual, priorizando según valor de negocio y dependencias.

---

### 6. Tickets de Trabajo

**Prompt 1 (Team Lead Agile):**
Si ahora como experto Team Lead Agile con basta experiencia en este tipo de sistemas, genera los tickets bien definidos para Frontend, Backend y BD de acuerdo a las historias de usuario. Incluye tareas técnicas, esfuerzo estimado y dependencias, además de priorizarlas para poder tener un orden claro de cómo desarrollar todo. Si tienes dudas pregúntame, recuerda que esto debe estar grabado en @readme.md y utilizar @Mermaid DOC para generar lo que estimes necesario para darle un toque profesional a la documentación.

**Prompt 2 (Team Lead Agile):**
Necesito todo lo que preguntas al final y que se agregue a la sección 6. Tickets de trabajo en el @readme.md, quiero que todo quede detallado y claro, el equipo de trabajo soy solo yo.

**Prompt 3 (Team Lead Agile):**
Dame un ejemplo de cómo organizar las ramas de git, una plantilla de commit o PR para el flujo, y agrégalo a la documentación.

---

### 7. Pull Requests

**Prompt 1 (Team Lead Agile/Product Manager):**
Documenta 3 Pull Requests principales realizados durante el desarrollo, indicando qué funcionalidad o ticket cubren, el impacto en el sistema y checklist de revisión.

**Prompt 2 (Team Lead Agile/Product Manager):**
Incluye checklist de revisión y notas técnicas relevantes en cada PR, siguiendo buenas prácticas de documentación y revisión.

**Prompt 3 (Team Lead Agile/Product Manager):**
¿Qué buenas prácticas de documentación y revisión se siguieron en los PRs? Explica cómo se asegura la calidad y trazabilidad en el flujo de trabajo.
