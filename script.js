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
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');

    function setTheme(isLight) {
        if (isLight) {
            document.body.classList.add('light-mode');
            if (themeIcon) themeIcon.src = 'images/planet.png';
            if (themeToggle) themeToggle.title = 'Icon by https://www.freepik.com' + ' from www.flaticon.com';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            if (themeIcon) themeIcon.src = 'images/sun.png';
            if (themeToggle) themeToggle.title = 'Icon by https://www.flaticon.com/authors/smalllikeart' + ' from www.flaticon.com';
            localStorage.setItem('theme', 'dark');
        }
    }

    // On load, set theme from localStorage
    setTheme(localStorage.getItem('theme') === 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            setTheme(!document.body.classList.contains('light-mode'));
        });
    }
});