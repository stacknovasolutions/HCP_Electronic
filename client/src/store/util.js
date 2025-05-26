export function asyncWrap(promise) {
    return promise.then((result) => [null, result]).catch((err) => [err]);
}

export function getUrl() {


    return 'http://13.235.99.37/api';


//     return 'http://localhost:5100/api'
}