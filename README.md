# Instrucciones Generales del Challenge
Nos gustaría conocer tu forma de programar y cómo abordas la resolución de problemas. Para ello, deberás desarrollar una **aplicación web** con las siguientes características:

## Tecnologías

- **Frontend**: React con JavaScript  
  - Utiliza la librería [ShadCN UI](https://ui.shadcn.com/). Puedes usar los componentes que desees o construir los tuyos propios.
  - **No añadas CSS adicional**. Todos los estilos deben aplicarse exclusivamente usando [Tailwind CSS](https://tailwindcss.com/).

- **Backend**: Ruby on Rails en modalidad **API-only**

> Todo tu código debe de ser en inglés; no combines lenguajes. 

## Entrega

Tu repositorio debe contener dos carpetas:

- `Frontend/`: Contendrá todo el código del frontend.
- `Backend/`: Contendrá todo el código del backend.

Incluye un archivo `README.md` con **instrucciones claras** para ejecutar cada parte de la aplicación.

## Hosting

Debes hospedar ambas aplicaciones de manera independiente (idealmente como dos apps separadas). Incluye los **enlaces del frontend y del backend** en el README. Puedes utilizar servicios como Heroku o cualquier otra plataforma similar para desplegar las aplicaciones.

Esto nos permitirá ejecutar pruebas y visualizar fácilmente tu solución.

--- 
### Descripción del Challenge

La empresa **XENON INDUSTRIAL ARTICLES** está creciendo rápidamente. Este crecimiento ha traído consigo algunos retos administrativos importantes, en particular con la **conciliación bancaria**. Actualmente, el equipo tarda demasiado tiempo en conciliar sus facturas con los movimientos bancarios.

El equipo encargado de este proceso ha solicitado tu apoyo para resolver este problema de la manera más sencilla posible. Buscan una aplicación que les permita:

## Requerimientos funcionales

### 1. Carga de XMLs
- Subir **facturas PPD de ingreso emitidas**, sin pagos realizados.
- Una vez cargadas, el sistema debe desglosar la información relevante en una tabla tipo índice.

### 2. Visualización en tabla
- Mostrar los siguientes datos por factura:
  - Cliente
  - Fecha de emisión
  - UUID
  - Subtotal
  - Total
  - Pagada: debe ser como un Badge o algo similar. Si ya se generó su complemento, debe decir 'Pagada', 'Pendiente' en el otro caso.

### 3. Generación de Complementos de Pago
- Desde la tabla, cada factura debe contar con un **menú desplegable** que permita:
  - Generar un **Complemento de Pago** sobre el total de la factura.
  - Descargar el **Complemento de Pago** (PDF y XML) si ya ha sido generado.

## API y Facturación

Los complementos de pago deben ser generados utilizando la API de [Facturama](https://apisandbox.facturama.mx/guias/cfdi40/complementos/complemento-pago-20) en su entorno **Sandbox**.

### Información del emisor

- **Razón social**: XENON INDUSTRIAL ARTICLES  
- **RFC**: XIA190128J61  
- **Régimen fiscal**: General de Personas Morales  
- **Código postal**: 76343  

Este emisor ya está cargado en la cuenta proporcionada por el equipo, por lo que no es necesario crearlo nuevamente.

### Autenticación

Facturama utiliza **Basic Auth**. Usa las siguientes credenciales de acceso según la documentación oficial de su API:

- **Username**: `apimeefi`  
- **Password**: `00e751c795a09cabc5fad9cadfd1aba9`

### Descarga de complementos

Para la descarga de los complementos (PDF y XML), utiliza el endpoint correspondiente de Facturama.

## Consideraciones

- No es necesario implementar autenticación en la aplicación.
- El enfoque debe estar en cumplir la funcionalidad descrita.

---

### Pruebas

Para realizar pruebas, puedes utilizar los archivos ubicados en la carpeta `invoices/xml`, donde se encuentran las facturas PPD vigentes de **XENON INDUSTRIAL ARTICLES**.

---

### Arquitectura

Se recomienda utilizar **Jobs** para el proceso de timbrado de facturas, con el objetivo de evitar bloqueos en los modelos y mantener la aplicación escalable y ordenada.

Aplica **mejores prácticas de desarrollo** tanto en backend como en frontend para asegurar una solución mantenible y de calidad.


