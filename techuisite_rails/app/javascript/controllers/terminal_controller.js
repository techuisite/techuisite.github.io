import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "body"]

  connect() {
    this.inputTarget.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  handleKeydown(event) {
    if (event.key === 'Enter') {
      const command = this.inputTarget.value.trim()
      if (command) {
        this.print(`<span class="prompt">$</span> ${command}`)
        this.handleCommand(command)
        this.inputTarget.value = ''
      }
    }
  }

  print(text, replaceLast = false) {
    if (replaceLast && this.bodyTarget.lastElementChild) {
      this.bodyTarget.lastElementChild.innerHTML = text
    } else {
      const line = document.createElement('div')
      line.innerHTML = text
      this.bodyTarget.appendChild(line)
    }
    this.bodyTarget.scrollTop = this.bodyTarget.scrollHeight
  }

  handleCommand(cmd) {
    switch(cmd.toLowerCase()) {
      case 'help':
        this.print('Available commands: <b>help</b>, <b>about</b>, <b>clear</b>, <b>projects</b>, <b>reading</b>')
        break
      case 'about':
        window.location.href = '/about'
        break
      case 'clear':
        window.location.href = '/'
        break
      case 'reading':
        window.location.href = '/reading'
        break
      case 'projects':
        window.location.href = '/projects'
        break
      case 'dark':
        this.setTheme(false)
        this.print('Nice! You found a secret command: switched to dark mode.')
        break
      case 'light':
        this.setTheme(true)
        this.print('Nice! You found a secret command: switched to light mode.')
        break
      default:
        this.print(`Command not found: ${cmd}. Type <b>help</b> for available commands.`)
    }
  }

  setTheme(isLight) {
    const body = document.body
    const themeIcon = document.querySelector('[data-theme-target="icon"]')
    
    if (themeIcon) {
      if (isLight) {
        body.classList.add('light-mode')
        themeIcon.src = themeIcon.src.replace('sun.png', 'planet.png')
        themeIcon.alt = 'Switch to dark mode'
        localStorage.setItem('theme', 'light')
      } else {
        body.classList.remove('light-mode')
        themeIcon.src = themeIcon.src.replace('planet.png', 'sun.png')
        themeIcon.alt = 'Switch to light mode'
        localStorage.setItem('theme', 'dark')
      }
    }
  }
}
