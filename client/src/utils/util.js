export function asyncWrap(promise) {
    return promise.then((result) => [null, result]).catch((err) => [err]);
}

export function getUrl() {
    return 'http://localhost:5100/api/';
}