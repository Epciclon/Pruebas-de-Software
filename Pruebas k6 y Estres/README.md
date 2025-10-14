# Lab3 - Pruebas de Rendimiento con K6

Este laboratorio contiene diferentes scripts de pruebas de rendimiento usando K6 para evaluar el servidor Express.

## Estructura de Archivos

- `server.js` - Servidor Express con endpoints de prueba
- `carga-y-rendimiento.js` - Script básico de pruebas de carga (corregido)
- `post-test.js` - Pruebas específicas para endpoint POST con JSON
- `concurrent-test.js` - Pruebas concurrentes GET y POST
- `soak-test.js` - Pruebas de resistencia (larga duración)
- `spike-test.js` - Pruebas de picos súbitos de carga

## Endpoints Disponibles

- **GET** `/api` - Retorna mensaje simple con delay aleatorio (0-500ms)
- **POST** `/api/data` - Recibe JSON y lo retorna con delay aleatorio (0-500ms)

## Requisitos

1. **Node.js** - Para el servidor
2. **K6** - Para las pruebas de rendimiento

### Instalación de K6

**Windows (Chocolatey):**
```powershell
choco install k6
```

**Windows (Scoop):**
```powershell
scoop install k6
```

**Manual:** Descargar desde https://k6.io/docs/getting-started/installation/

## Instrucciones de Uso

### 1. Iniciar el Servidor

```powershell
# Desde la carpeta Lab3
node server.js
```

El servidor estará disponible en `http://localhost:4000`

### 2. Ejecutar las Pruebas

En una nueva terminal, ejecutar cada script:

#### Prueba Básica de Carga (GET)
```powershell
k6 run carga-y-rendimiento.js
```

#### Prueba de POST con JSON
```powershell
k6 run post-test.js
```

#### Pruebas Concurrentes (GET y POST)
```powershell
k6 run concurrent-test.js
```

#### Soak Testing (Larga Duración - ~14 minutos)
```powershell
k6 run soak-test.js
```

#### Spike Testing (Picos Súbitos)
```powershell
k6 run spike-test.js
```

## Descripción de los Tests

### 1. carga-y-rendimiento.js
- **Objetivo:** Prueba básica de carga con requests GET
- **Duración:** ~50 segundos
- **Patrón:** 10s calentamiento → 30s carga → 10s enfriamiento
- **Usuarios:** 0 → 10 → 100 → 0

### 2. post-test.js
- **Objetivo:** Evaluar endpoint POST con datos JSON
- **Duración:** ~50 segundos
- **Patrón:** 10s calentamiento → 30s carga → 10s enfriamiento
- **Usuarios:** 0 → 10 → 50 → 0
- **Datos:** JSON con información de usuario y timestamp

### 3. concurrent-test.js
- **Objetivo:** Pruebas concurrentes alternando GET y POST
- **Duración:** ~75 segundos
- **Patrón:** 15s calentamiento → 45s carga → 15s enfriamiento
- **Usuarios:** 0 → 20 → 80 → 0
- **Comportamiento:** Alterna entre GET y POST por iteración

### 4. soak-test.js
- **Objetivo:** Pruebas de resistencia a largo plazo
- **Duración:** ~14 minutos
- **Patrón:** 2m calentamiento → 10m carga sostenida → 2m enfriamiento
- **Usuarios:** 0 → 10 → 30 → 0
- **Comportamiento:** Simula patrones reales con payloads variables

### 5. spike-test.js
- **Objetivo:** Evaluar respuesta a picos súbitos de carga
- **Duración:** ~2.5 minutos
- **Patrón:** Línea base → SPIKE → Línea base
- **Usuarios:** 5 → 5 → 200 → 200 → 5 → 5 → 0
- **Comportamiento:** Carga intensiva durante el spike

## Métricas Evaluadas

- **http_req_duration:** Tiempo de respuesta de las peticiones
- **http_req_failed:** Tasa de fallos
- **http_req_rate:** Peticiones por segundo
- **Checks:** Validaciones específicas por tipo de test

## Umbrales de Rendimiento

Cada script tiene umbrales específicos adaptados al tipo de prueba:
- **Básico:** p(95) < 500ms, fallos < 5%
- **POST:** p(95) < 600ms, fallos < 5%
- **Concurrente:** p(95) < 700ms, fallos < 5%
- **Soak:** p(95) < 1000ms, fallos < 2%
- **Spike:** p(90) < 2000ms, fallos < 10%

## Interpretación de Resultados

K6 proporcionará métricas detalladas incluyendo:
- Tiempo promedio, mínimo, máximo y percentiles de respuesta
- Tasa de éxito/fallo
- Throughput (requests/segundo)
- Transferencia de datos
- Estado de los checks definidos
