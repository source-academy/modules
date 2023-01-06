export const wrapWithTimer = (func) => async (...params) => {
    const startTime = performance.now();
    const result = await func(...params);
    const endTime = performance.now();
    return {
        elapsed: endTime - startTime,
        result,
    };
};
export const divideAndRound = (dividend, divisor, round) => (dividend / divisor).toFixed(round);
export const findSeverity = (items, processor) => {
    let severity = 'success';
    for (const item of items) {
        const itemSev = processor(item);
        if (itemSev === 'error')
            return 'error';
        if (itemSev === 'warn' && severity === 'success')
            severity = 'warn';
    }
    return severity;
};
export const fileSizeFormatter = (size) => {
    size /= 1000;
    if (size < 0.01)
        return '<0.01 KB';
    if (size >= 100)
        return `${divideAndRound(size, 1000, 2)} MB`;
    return `${size.toFixed(2)} KB`;
};
