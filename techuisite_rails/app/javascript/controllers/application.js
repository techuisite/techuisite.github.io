import { Application } from "@hotwired/stimulus"
import TerminalController from "./terminal_controller"
import ThemeController from "./theme_controller"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

// Register controllers
application.register("terminal", TerminalController)
application.register("theme", ThemeController)

export { application }
