export function listenWindow(event, handler) {
    window.addEventListener(event, handler);
    return () => { window.removeEventListener(event, handler); };
}