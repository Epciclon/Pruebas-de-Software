import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test con un modelo stated
    stages: [
        { duration: '10s', target: 10 }, // calentamiento
        { duration: '30s', target: 300 }, // carga
        { duration: '10s', target: 0 }, // enfriamiento
    ],
    //Umbrales de rendimiento
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% de las peticiones deben ser menores a 200ms
        http_req_failed: ['rate<0.05'], // menos del 1% de las peticiones deben fallar
    },
};

//Función principal
export default function () {
    //Enviar una solicitud HTTP GET al endpoint de prueba
    const res = http.get('http://localhost:4000/api');
    //Verificar que la respuesta sea exitosa
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });
    //Esperar 1 segundo antes de realizar otra solicitud
    sleep(1);
}