import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test con un modelo staged para pruebas concurrentes
    stages: [
        { duration: '15s', target: 20 }, // calentamiento gradual
        { duration: '45s', target: 80 }, // carga sostenida alta
        { duration: '15s', target: 0 }, // enfriamiento
    ],
    //Umbrales de rendimiento para requests concurrentes
    thresholds: {
        http_req_duration: ['p(95)<700'], // Más tolerante para pruebas concurrentes
        http_req_failed: ['rate<0.05'],
        'http_req_duration{endpoint:get}': ['p(95)<500'],
        'http_req_duration{endpoint:post}': ['p(95)<600'],
    },
};

// Generar datos para requests POST
function generarDatos() {
    return {
        usuario: `concurrent_user_${__VU}_${__ITER}`,
        timestamp: new Date().toISOString(),
        action: 'concurrent_test',
        sessionId: `session_${__VU}`,
        data: {
            id: Math.floor(Math.random() * 10000),
            value: Math.random() * 1000,
            testType: 'concurrent'
        }
    };
}

//Función principal que alterna entre GET y POST
export default function () {
    // Alternar entre GET y POST en cada iteración
    if (__ITER % 2 === 0) {
        // Realizar GET request
        const resGet = http.get('http://localhost:4000/api', {
            tags: { endpoint: 'get' }
        });
        
        check(resGet, {
            'GET status is 200': (r) => r.status === 200,
            'GET response time < 500ms': (r) => r.timings.duration < 500,
            'GET has message': (r) => r.json('message') !== undefined,
        });
        
    } else {
        // Realizar POST request
        const payload = generarDatos();
        const resPost = http.post('http://localhost:4000/api/data', 
            JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                tags: { endpoint: 'post' }
            }
        );
        
        check(resPost, {
            'POST status is 200': (r) => r.status === 200,
            'POST response time < 600ms': (r) => r.timings.duration < 600,
            'POST data echoed': (r) => r.json('received.usuario') === payload.usuario,
        });
    }

    // Sleep variable para simular patrones de usuario más realistas
    sleep(Math.random() * 2 + 0.5); // Entre 0.5-2.5 segundos
}

