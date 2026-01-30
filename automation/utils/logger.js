export function log(msg) {
    console.log(`[AUTOMATION] ${msg}`);
}

export function error(msg, err) {
    console.error(`[AUTOMATION ERROR] ${msg}`, err);
}
