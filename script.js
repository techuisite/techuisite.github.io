document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    function print(text) {
        body.innerHTML += `<br>${text}`;
        body.scrollTop = body.scrollHeight;
    }

    input && input.addEventListener('keydown', function(e) {
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
                window.location.href = 'index.html';
                break;
            case 'reading':
                window.location.href = 'reading.html';
                break;
            default:
                print(`Command not found: <b>${cmd}</b>`);
        }
    }

    // Theme persistence
    const themeToggle = document.getElementById('theme-toggle');
    // On load, set theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.textContent = '🌙 Dark Mode';
    } else {
        document.body.classList.remove('light-mode');
        if (themeToggle) themeToggle.textContent = '🌞 Light Mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            if(document.body.classList.contains('light-mode')) {
                themeToggle.textContent = '🌙 Dark Mode';
                localStorage.setItem('theme', 'light');
            } else {
                themeToggle.textContent = '🌞 Light Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});