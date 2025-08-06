# Estructura del Proyecto Frontend

## 📁 Arquitectura de Carpetas

```
Frontend/
├── public/                     # Archivos estáticos
│   └── vite.svg               # Favicon por defecto
├── scripts/                    # Scripts de utilidad
│   ├── deploy.sh              # Script de despliegue
│   └── setup.sh               # Script de configuración inicial
├── src/                        # Código fuente
│   ├── components/             # Componentes React
│   │   ├── InvoiceList.jsx    # Lista y gestión de facturas
│   │   └── UploadXML.jsx      # Carga de archivos XML
│   ├── services/              # Servicios y APIs
│   │   └── api.js             # Cliente de API REST
│   ├── App.jsx                # Componente raíz de la aplicación
│   ├── main.jsx               # Punto de entrada de React
│   └── index.css              # Estilos globales y Tailwind
├── .env.example               # Plantilla de variables de entorno
├── .eslintrc.cjs              # Configuración de ESLint
├── .gitignore                 # Archivos ignorados por Git
├── index.html                 # Template HTML principal
├── package.json               # Dependencias y scripts
├── postcss.config.js          # Configuración de PostCSS
├── README.md                  # Documentación principal
├── STRUCTURE.md               # Este archivo
├── tailwind.config.js         # Configuración de Tailwind CSS
└── vite.config.js             # Configuración de Vite
```

## 🧩 Componentes

### `src/components/`

#### `UploadXML.jsx`
**Propósito**: Componente para la carga de archivos XML de facturas.

**Características**:
- Interfaz drag & drop
- Validación de archivos XML
- Selección múltiple
- Preview de archivos seleccionados
- Estados de carga

**Props**:
```javascript
{
  onUpload: (files) => Promise,  // Función para manejar la carga
  loading: boolean               // Estado de carga
}
```

#### `InvoiceList.jsx`
**Propósito**: Componente para mostrar y gestionar la lista de facturas.

**Características**:
- Tabla responsiva
- Tarjetas de resumen estadístico
- Menús de acciones contextuales
- Badges de estado (Pagada/Pendiente)
- Formateo de moneda y fechas

**Props**:
```javascript
{
  invoices: Array,                           // Lista de facturas
  onGeneratePayment: (id) => Promise,        // Generar complemento de pago
  onDownload: (id, type) => Promise,         // Descargar archivos
  loading: boolean                           // Estado de carga
}
```

## 🔧 Servicios

### `src/services/api.js`

**Propósito**: Cliente centralizado para comunicación con la API backend.

**Métodos Principales**:
- `getInvoices()` - Obtener lista de facturas
- `uploadInvoices(files)` - Subir archivos XML
- `generatePaymentComplement(id)` - Generar complemento de pago
- `downloadInvoiceFile(id, type)` - Descargar PDF/XML

**Métodos Mock (para desarrollo)**:
- `mockUploadInvoices(files)` - Simula carga de archivos
- `mockGeneratePaymentComplement(id)` - Simula generación de complemento
- `mockDownloadFile(id, type)` - Simula descarga de archivos

## 📱 Estructura de Datos

### Invoice Object
```javascript
{
  id: string,                          // ID único de la factura
  client: string,                      // Nombre del cliente
  issueDate: string,                   // Fecha de emisión (YYYY-MM-DD)
  uuid: string,                        // UUID del CFDI
  subtotal: number,                    // Subtotal de la factura
  total: number,                       // Total de la factura
  isPaid: boolean,                     // Si la factura está pagada
  paymentComplementGenerated: boolean, // Si tiene complemento generado
  fileName?: string                    // Nombre del archivo XML original
}
```

### API Response Format
```javascript
{
  success: boolean,      // Indica si la operación fue exitosa
  data: any,            // Datos de respuesta
  message?: string,     // Mensaje descriptivo
  error?: string        // Mensaje de error (si aplica)
}
```

## 🎨 Sistema de Diseño

### Componentes UI Reutilizables

Todos los componentes UI están implementados siguiendo el patrón de shadcn/ui:

- `Button` - Botones con variantes y tamaños
- `Badge` - Indicadores de estado
- `Card` - Contenedores de contenido
- `Table` - Tablas responsivas
- `Alert` - Mensajes de notificación
- `DropdownMenu` - Menús contextuales

### Variantes de Componentes

#### Button
```javascript
variant: 'default' | 'outline' | 'ghost' | 'destructive'
size: 'default' | 'sm' | 'lg'
```

#### Badge
```javascript
variant: 'default' | 'success' | 'warning' | 'destructive'
```

#### Alert
```javascript
variant: 'default' | 'success' | 'destructive'
```

## 🚀 Hooks Personalizados

### `useInvoices` (en App.jsx)

**Propósito**: Hook personalizado para manejo del estado de facturas.

**Estado**:
```javascript
{
  invoices: Array,        // Lista de facturas
  loading: boolean,       // Estado de carga global
  error: string | null    // Mensaje de error actual
}
```

**Métodos**:
```javascript
{
  uploadInvoices: (files) => Promise,
  generatePaymentComplement: (id) => Promise,
  downloadFile: (id, type) => Promise,
  clearError: () => void
}
```

## 🔄 Flujo de Datos

### 1. Carga de Facturas
```
UploadXML → useInvoices.uploadInvoices → apiService → Backend API
                ↓
        Actualización del estado
                ↓
        Re-render de InvoiceList
```

### 2. Generación de Complementos
```
InvoiceList → useInvoices.generatePaymentComplement → apiService → Facturama API
                ↓
        Actualización del estado de la factura
                ↓
        Re-render con nuevo estado
```

### 3. Descarga de Archivos
```
InvoiceList → useInvoices.downloadFile → apiService → Backend API
                ↓
        Descarga automática del archivo
```

## 🛠️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_API_URL` | URL base de la API backend | Sí |
| `VITE_DEV_MODE` | Modo de desarrollo | No |

### Configuraciones Principales

- **Vite**: Build tool y dev server
- **Tailwind**: Framework de CSS utilitario
- **PostCSS**: Procesador de CSS
- **ESLint**: Linter de JavaScript

## 📦 Dependencias

### Producción
- `react` - Framework frontend
- `react-dom` - Renderizado de React
- `lucide-react` - Librería de iconos
- `clsx` - Utilidad para clases CSS
- `class-variance-authority` - Variantes de componentes

### Desarrollo
- `vite` - Build tool
- `@vitejs/plugin-react` - Plugin de React para Vite
- `tailwindcss` - Framework CSS
- `autoprefixer` - Plugin de PostCSS
- `eslint` - Linter de JavaScript

## 🔀 Estados de la Aplicación

### Estados de Carga
- `loading: true` - Operación en progreso
- `loading: false` - Operación completada o inactiva

### Estados de Error
- `error: null` - Sin errores
- `error: string` - Mensaje de error actual

### Estados de Facturas
- `isPaid: false` - Factura pendiente de pago
- `isPaid: true` - Factura pagada
- `paymentComplementGenerated: false` - Sin complemento generado
- `paymentComplementGenerated: true` - Con complemento generado

## 🧪 Patrones de Desarrollo

### Composición de Componentes
Los componentes siguen el patrón de composición, donde cada componente tiene una responsabilidad específica y se comunica mediante props.

### Manejo de Estado
Se utiliza el patrón de hooks personalizados para centralizar la lógica de estado y hacerla reutilizable.

### Manejo de Errores
Todos los errores se manejan de forma centralizada y se muestran al usuario mediante componentes de alerta.

### Responsive Design
La aplicación es completamente responsiva utilizando las clases utilitarias de Tailwind CSS.

## 🔄 Ciclo de Vida

### Inicialización
1. Carga del componente principal (`App.jsx`)
2. Inicialización del hook `useInvoices`
3. Carga inicial de facturas (si hay backend disponible)
4. Renderizado de componentes

### Interacciones
1. Usuario selecciona archivos XML
2. Se ejecuta validación y preview
3. Usuario confirma carga
4. Se envían archivos al backend
5. Se actualiza el estado con nuevas facturas
6. Se re-renderiza la lista

### Limpieza
1. Limpieza de timeouts de notificaciones
2. Limpieza de event listeners
3. Cancelación de requests pendientes (si aplica)