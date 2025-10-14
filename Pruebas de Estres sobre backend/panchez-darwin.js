import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    //Definimos las etapas del test con un modelo staged
    stages: [
        { duration: '10s', target: 10 }, // calentamiento
        { duration: '30s', target: 90 }, // carga moderada para POST
        { duration: '10s', target: 0 }, // enfriamiento
    ],
    //Umbrales de rendimiento
    thresholds: {
        http_req_duration: ['p(95)<700'], // 95% de las peticiones deben ser menores a 600ms
        http_req_failed: ['rate<0.05'], // menos del 5% de las peticiones deben fallar
    },
};

// Generar correos unicos
function generarCorreo() {
    return `darwinpanchez_${__VU}_${__ITER}@gmail.com`;
}

// Funcion que se ejecuta por cada usuario virtual en cada interacion 
export default function () {
    // 1.Generar los datos unicos para cada usuario
    const correo = generarCorreo();
    const password = '123456';
    
    // 2. Intentar registrar al usuario
    let resRegister = http.post('http://localhost:3000/api/auth/register', JSON.stringify({
        email: correo,
        password: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    // 3. Verificar la respuesta del registro
    check(resRegister, {
        'registro exitoso': (res) => res.status === 201,
    });

    // 4. Intentar iniciar sesion con el nuevo usuario
    let resLogin = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
        email: correo,
        password: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    // 5. Verificar la respuesta del inicio de sesion
    check(resLogin, {
        'inicio de sesion exitoso': (res) => res.status === 200 && res.json('token') !== undefined,
        'token presente': (res) => !!res.json('token'),
    });

    // 6. Realizar una reserva
    const token = resLogin.json('token');
    let resReserva = http.post('http://localhost:3000/api/reservas', JSON.stringify({
        userId: correo,
        fecha: '10/20/2024',
        hora: '08:00',
        sala: 'DarwinPanchez'
    }), {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });

    // 7. Verificar la respuesta de la reserva
    check(resReserva, {
        'registro de reserva exitoso': (res) => res.status === 201,
    });

    // 8. Esperar un poco antes de la siguiente iteracion
    sleep(1);
}