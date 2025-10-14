import http from 'k6/http';
import { check, sleep } from 'k6';

//Configuracion del test
export let options = {
    stages: [
        { duration: '5s', target: 5 }, // Aumenta a
        { duration: '15s', target: 20 }, // carga sostenida
        { duration: '5s', target: 0 }, // enfriamiento
    ],
    thresholds: {
        http_req_duration: ['p(95)<600'], // 95% de las peticiones deben ser menores a 600ms
        http_req_failed: ['rate<0.05'], // Menos del 5% de las peticiones deben fallar
    },
};

// Generar correos unicos
function generarCorreo() {
    return `user_${__VU}_${__ITER}@test.com`;
}

// Funcion que se ejecuta por cada usuario virtual en cada interacion 
export default function () {
    // 1.Generar los datos unicos para cada usuario
    const correo = generarCorreo();
    const password = '123456';
    
    // 2. Intentar registrar al usuario
    let resRegister = http.post('http://localhost:3000/api/auth/register', JSON.stringify({
        correo: correo,
        contraseña: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    // 3. Verificar la respuesta del registro
    check(resRegister, {
        'registro exitoso': (res) => res.status === 201,
    });

    // 4. Intentar iniciar sesion con el nuevo usuario
    let resLogin = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
        correo: correo,
        contraseña: password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    // 5. Verificar la respuesta del inicio de sesion
    check(resLogin, {
        'inicio de sesion exitoso': (res) => res.status === 200 && res.json('token') !== undefined,
        'token presente': (res) => !!res.json('token'),
    });

    // 6. Esperar un poco antes de la siguiente iteracion
    sleep(1);
}