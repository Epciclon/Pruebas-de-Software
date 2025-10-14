import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test para spike testing (pico súbito)
    stages: [
        { duration: '30s', target: 5 }, // línea base normal
        { duration: '10s', target: 5 }, // mantener línea base
        { duration: '10s', target: 200 }, // SPIKE súbito de usuarios
        { duration: '30s', target: 200 }, // mantener spike
        { duration: '10s', target: 5 }, // bajar rápidamente
        { duration: '30s', target: 5 }, // recuperación
        { duration: '10s', target: 0 }, // apagar
    ],
    //Umbrales de rendimiento más tolerantes durante spikes
    thresholds: {
        http_req_duration: ['p(90)<2000'], // Más tolerante durante spikes
        http_req_failed: ['rate<0.1'], // 10% de fallos aceptable durante spike
        'http_req_duration{phase:baseline}': ['p(95)<500'],
        'http_req_duration{phase:spike}': ['p(90)<2000'],
        'http_req_duration{phase:recovery}': ['p(95)<800'],
    },
};

// Determinar la fase actual del test basada en el tiempo transcurrido
function getPhase() {
    // Aproximación basada en las etapas definidas
    const totalElapsed = (__ITER * 1000) + (__VU * 100); // Aproximación simple
    
    if (__ITER < 40) return 'baseline'; // Primeras iteraciones
    if (__ITER < 80) return 'spike'; // Iteraciones del spike
    return 'recovery'; // Iteraciones de recuperación
}

// Generar datos específicos para spike testing
function generarDatosSpike() {
    const phase = getPhase();
    return {
        usuario: `spike_user_${__VU}_${__ITER}`,
        timestamp: new Date().toISOString(),
        phase: phase,
        vu: __VU,
        iteration: __ITER,
        spikeData: phase === 'spike' ? {
            // Durante spike: datos más pesados
            heavyLoad: Array(50).fill().map(i => Math.random()),
            timestamp: Date.now(),
            loadLevel: 'high'
        } : {
            // Durante baseline/recovery: datos normales
            normalLoad: Math.random() * 100,
            loadLevel: 'normal'
        }
    };
}

//Función principal para spike testing
export default function () {
    const phase = getPhase();
    const tags = { phase: phase };
    
    // Durante el spike, hacer más requests POST (más pesados)
    if (phase === 'spike' && Math.random() > 0.3) {
        // 70% POST durante spike
        const payload = generarDatosSpike();
        const resPost = http.post('http://localhost:4000/api/data', 
            JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
                tags: tags
            }
        );
        
        check(resPost, {
            'Spike POST completed': (r) => r.status === 200 || r.status === 500,
            'Spike POST not timeout': (r) => r.timings.duration < 5000,
        });
    } else {
        // Baseline y recovery: principalmente GET
        const resGet = http.get('http://localhost:4000/api', { tags: tags });
        
        check(resGet, {
            'Baseline/Recovery GET success': (r) => r.status === 200,
            'Baseline/Recovery GET fast': (r) => r.timings.duration < (phase === 'baseline' ? 500 : 1000),
        });
    }

    // Sleep más corto durante spike para aumentar la presión
    const sleepTime = phase === 'spike' ? Math.random() * 0.5 : Math.random() * 2 + 0.5;
    sleep(sleepTime);
}
