/**
 * Wait until the user presses 'ctrl+c' on the keyboard
 */
export const waitForQuit = () => new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.on('data', (data) => {
        const byteArray = [...data];
        if (byteArray.length > 0 && byteArray[0] === 3) {
            console.log('^C');
            process.stdin.setRawMode(false);
            resolve();
        }
    });
});
