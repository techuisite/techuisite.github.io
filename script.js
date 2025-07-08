document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                body.innerHTML += `<br><span class="prompt">$</span> ${command}`;
                if (command === 'help') {
                    body.innerHTML += `<br>Available commands: <b>help</b>`;
                } else {
                    body.innerHTML += `<br>Command not found: <b>${command}</b>`;
                }
                input.value = '';
                body.scrollTop = body.scrollHeight;
            }
        }
    });
});