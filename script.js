document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    function print(text) {
        body.innerHTML += `<br>${text}`;
        body.scrollTop = body.scrollHeight;
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                print(`<span class="prompt">$</span> ${command}`);
                handleCommand(command);
                input.value = '';
            }
        }
    });

    function handleCommand(cmd) {
        switch(cmd.toLowerCase()) {
            case 'help':
                print('Available commands: <b>help</b>, <b>about</b>, <b>clear</b>, <b>reading</b>');
                break;
            case 'about':
            window.location.href = 'about.html';
                break;
            case 'clear':
                body.innerHTML = `<br>${text}`;
                body.scrollTop = body.scrollHeight;
                break;
            case 'reading':
                window.location.href = 'reading.html';
                break;
            default:
                print(`Command not found: <b>${cmd}</b>`);
        }
    }
});