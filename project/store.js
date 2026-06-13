const STORE_KEY = 'gameData';

function _readAll() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {};
    try {
        return JSON.parse(atob(raw));
    } catch {
        return {};
    }
}

function _writeAll(obj) {
    localStorage.setItem(STORE_KEY, btoa(JSON.stringify(obj)));
}

export function readStore(key) {
    const obj = _readAll();
    return key !== undefined ? (obj[key] ?? null) : obj;
}

export function writeStore(key, value) {
    const obj = _readAll();
    obj[key] = value;
    _writeAll(obj);
}

export function removeStore(key) {
    const obj = _readAll();
    delete obj[key];
    _writeAll(obj);
}
