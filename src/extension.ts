// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as sh from "shelljs"
import * as vscode from "vscode"
import ProjectManager from "./ghqProjectManager"
import { Config } from "./domain"

const cfg = new Config(vscode.workspace.getConfiguration("ghqProjectManager"))

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  const isGhqAvailable = sh.which("ghq")

  if (!isGhqAvailable) {
    vscode.window.showWarningMessage("ghq is not installed.")
  }

  const projectManager = new ProjectManager(cfg, context.globalState)

  const disposable = vscode.commands.registerCommand("ghqProjectManager.openProject", () => {
    projectManager.showProjectList(false)
  })

  const newWindowdisposable = vscode.commands.registerCommand(
    "ghqProjectManager.openProjectNewWindow",
    () => {
      projectManager.showProjectList(true)
    }
  )

  context.subscriptions.push(disposable, newWindowdisposable)
}

exports.activate = activate

// this method is called when your extension is deactivated
export function deactivate(): void {
  //clear things
}

exports.deactivate = deactivate
