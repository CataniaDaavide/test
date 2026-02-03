export class ApiClient {
    constructor(defaultTimeout = 30 * 1000) {
        this.defaultTimeout = defaultTimeout;
    }

    _getErrorMessage(status) {
        switch (status) {
            case 400:
                return 'Bad request – richiesta non valida';
            case 401:
                return 'Unauthorized – autenticazione richiesta';
            case 403:
                return 'Forbidden – accesso negato';
            case 404:
                return 'Resource not found – endpoint non trovato';
            case 408:
                return 'Request timeout – server troppo lento';
            case 500:
                return 'Server error – errore interno del server';
            case 503:
                return 'Service unavailable – servizio non disponibile';
            default:
                return `Unexpected error (status ${status})`;
        }
    }

    async _request(method, url, body = null, timeout = this.defaultTimeout, headers = {}) {
        const controller = new AbortController();
        const signal = controller.signal;

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            signal
        };

        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(url, options);
            console.log(response)
            clearTimeout(timeoutId);

            if (!response.ok) {
                const message = this._getErrorMessage(response.status);

                // puoi anche includere info extra
                throw {
                    status: response.status,
                    message,
                    url
                };
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw {
                    status: 'TIMEOUT',
                    message: `Request timed out after ${timeout} ms`,
                    url
                };
            }

            throw error;
        }
    }

    get(url, timeout, headers) {
        return this._request('GET', url, null, timeout, headers);
    }

    post(url, body, timeout, headers) {
        return this._request('POST', url, body, timeout, headers);
    }

    put(url, body, timeout, headers) {
        return this._request('PUT', url, body, timeout, headers);
    }

    delete(url, timeout, headers) {
        return this._request('DELETE', url, null, timeout, headers);
    }
}


// --- Esempio di utilizzo ---
// const api = new ApiClient(5000); // Timeout default 5 secondi

// (async () => {
//     try {
//         // POST con timeout di 3 secondi
//         const postData = await api.post(
//             'https://jsonplaceholder.typicode.com/posts',
//             { title: 'Test', body: 'Contenuto', userId: 1 },
//             3000
//         );
//         console.log('Risposta POST:', postData);

//         // GET con timeout default
//         const getData = await api.get('https://jsonplaceholder.typicode.com/todos/1');
//         console.log('Risposta GET:', getData);
//     } catch (err) {
//         console.error(err.message);
//     }
// })();
