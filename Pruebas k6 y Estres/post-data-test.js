import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test con un modelo staged
    stages: [
        { duration: '10s', target: 10 }, // calentamiento
        { duration: '30s', target: 50 }, // carga
        { duration: '10s', target: 0 }, // enfriamiento
    ],
    //Umbrales de rendimiento
    thresholds: {
        http_req_duration: ['p(95)<600'], // 95% de las peticiones deben ser menores a 600ms
        http_req_failed: ['rate<0.05'], // menos del 5% de las peticiones deben fallar
    },
};

// Generar datos únicos para cada request POST
function generarDatos() {
    return {
        usuario: `user_${__VU}_${__ITER}`,
        timestamp: new Date().toISOString(),
        data: {
            id: Math.floor(Math.random() * 1000),
            message: `Test data from VU ${__VU}, iteration ${__ITER}`,
            value: Math.random() * 100,
            category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
        },
        metadata: {
            source: 'k6-post-test',
            version: '1.0'
        }
    };
}

//Función principal
export default function () {
    // Generar datos JSON únicos para enviar
    const payload = generarDatos();
    
    //Enviar una solicitud HTTP POST al endpoint /api/data
    const res = http.post('http://localhost:4000/api/data', JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' }
    });
    
    //Verificar que la respuesta sea exitosa
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 600ms': (r) => r.timings.duration < 600,
        'data received': (r) => r.json('received') !== undefined,
        'usuario echoed': (r) => r.json('received.usuario') === payload.usuario,
    });
    
    //Esperar 1 segundo antes de realizar otra solicitud
    sleep(1);
}
