export function updateSessionStorageForGuard(logged: boolean) {
    sessionStorage.setItem('IsLogged', JSON.stringify(logged));
}
