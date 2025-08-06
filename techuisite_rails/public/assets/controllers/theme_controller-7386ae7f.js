import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["icon"]

  connect() {
    // Set theme based on localStorage or default to dark
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      this.setLight()
    } else {
      this.setDark()
    }
  }

  toggle() {
    if (document.body.classList.contains('light-mode')) {
      this.setDark()
    } else {
      this.setLight()
    }
  }

  setLight() {
    document.body.classList.add('light-mode')
    this.iconTarget.src = '/assets/planet.png'
    this.iconTarget.alt = 'Switch to dark mode'
    localStorage.setItem('theme', 'light')
  }

  setDark() {
    document.body.classList.remove('light-mode')
    this.iconTarget.src = '/assets/sun.png'
    this.iconTarget.alt = 'Switch to light mode'
    localStorage.setItem('theme', 'dark')
  }
}
