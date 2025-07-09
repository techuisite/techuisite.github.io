document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    function print(text, replaceLast = false) {
        if (replaceLast && body.lastChild) {
            body.lastChild.innerHTML = text;
        } else {
            body.innerHTML += `<br>${text}`;
        }
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
                print('Available commands: <b>help</b>, <b>about</b>, <b>clear</b>, <b>projects</b>, <b>reading</b>');
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
            case 'projects':
                window.location.href = 'projects.html';
                break;
            case 'dark':
                setTheme(false);
                print('Nice! You found a secret command: stwitched to dark mode.');
                break;
            case 'light':
                setTheme(true);
                print('Nice! You found a secret command: switched to light mode.');
                break;
            case 'lenny':
                showDancingRobot();
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

    // Book rating display
    document.querySelectorAll('.book-rating').forEach(function(el) {
        const rating = parseInt(el.getAttribute('data-rating'), 10) || 0;
        el.textContent = '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);
    });

    // Add this function to animate the robot in your web terminal
    function showDancingRobot() {
        const frames = [
            `[o_o]<br> /|\\<br> / \\`,
            `[o_o]<br>\\|/<br> / \\`,
            `[o_o]<br> /|\\<br>_/ \\`,
            `[o_o]<br>\\|/<br>_/ \\`
        ];
        let frame = 0;
        let count = 0;
        const repeats = 8;
        print('Dancing robot activated!<br>');
        print(frames[0]); // Print the first frame
        const interval = setInterval(() => {
            print(frames[frame], true); // Replace the last frame
            frame = (frame + 1) % frames.length;
            count++;
            if (count >= repeats * frames.length) {
                clearInterval(interval);
                print('Robot dance complete!');
            }
        }, 200);
    }
});