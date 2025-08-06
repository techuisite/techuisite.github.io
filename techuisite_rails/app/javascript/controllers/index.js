import { application } from "./application"

import TerminalController from "./terminal_controller"
import ThemeController from "./theme_controller"

application.register("terminal", TerminalController)
application.register("theme", ThemeController)
