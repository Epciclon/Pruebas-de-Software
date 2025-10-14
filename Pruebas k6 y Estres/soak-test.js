import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test para soak testing (larga duración)
    stages: [
        { duration: '2m', target: 10 }, // calentamiento lento
        { duration: '10m', target: 30 }, // carga sostenida por 10 minutos
        { duration: '2m', target: 0 }, // enfriamiento
    ],
    //Umbrales de rendimiento más tolerantes para pruebas largas
    thresholds: {
        http_req_duration: ['p(95)<1000'], // Más tolerante para pruebas largas
        http_req_failed: ['rate<0.02'], // Muy bajo porcentaje de fallos
        'http_req_duration{endpoint:get}': ['p(95)<800'],
        'http_req_duration{endpoint:post}': ['p(95)<900'],
    },
};

// Generar payloads de diferentes tamaños para simular patrones reales
function generarPayloadVariable() {
    const baseData = {
        usuario: `soak_user_${__VU}_${__ITER}`,
        timestamp: new Date().toISOString(),
        testType: 'soak_testing',
        duration: Math.floor(Date.now() / 1000),
        sessionInfo: {
            vu: __VU,
            iteration: __ITER,
            startTime: new Date().toISOString()
        }
    };

    // Añadir datos variables para simular diferentes cargas
    if (Math.random() > 0.7) {
        // 30% de requests con datos grandes
        baseData.largeData = Array(100).fill().map((_, i) => ({
            index: i,
            value: Math.random() * 1000,
            text: `Large data item ${i} for soak testing`
        }));
    } else {
        // 70% de requests con datos pequeños
        baseData.smallData = {
            id: Math.floor(Math.random() * 10000),
            value: Math.random() * 100
        };
    }

    return baseData;
}

//Función principal para soak testing
export default function () {
    // Simular patrones de uso más realistas (más GETs que POSTs)
    const actionType = Math.random();
    
    if (actionType < 0.6) {
        // 60% GET requests (más común en aplicaciones reales)
        const resGet = http.get('http://localhost:4000/api', {
            tags: { endpoint: 'get' }
        });
        
        check(resGet, {
            'Soak GET status is 200': (r) => r.status === 200,
            'Soak GET response time < 800ms': (r) => r.timings.duration < 800,
            'Soak GET has message': (r) => r.json('message') !== undefined,
        });
    } else {
        // 40% POST requests
        const payload = generarPayloadVariable();
        const resPost = http.post('http://localhost:4000/api/data', 
            JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                tags: { endpoint: 'post' }
            }
        );
        
        check(resPost, {
            'Soak POST status is 200': (r) => r.status === 200,
            'Soak POST response time < 900ms': (r) => r.timings.duration < 900,
            'Soak POST data integrity': (r) => r.json('received.usuario') === payload.usuario,
        });
    }

    // Sleep variable para simular patrones de usuario reales en soak testing
    sleep(Math.random() * 3 + 1); // Entre 1-4 segundos
}
