export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
};