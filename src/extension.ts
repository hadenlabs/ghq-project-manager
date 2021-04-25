// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as sh from 'shelljs'
import * as vscode from 'vscode'
import ProjectManager from './ghqProjectManager'
import Config from './domain/config'

const cfg = new Config(vscode.workspace.getConfiguration('ghqProjectManager'))

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context: vscode.ExtensionContext) {
  const isGhqAvailable = sh.which('ghq')

  if (!isGhqAvailable) {
    vscode.window.showWarningMessage('ghq is not installed.')
  }

  const projectManager = new ProjectManager(cfg, context.globalState)

  const disposable = vscode.commands.registerCommand('ghqProjectManager.openProject', function () {
    projectManager.showProjectList(false)
  })

  const newWindowdisposable = vscode.commands.registerCommand(
    'ghqProjectManager.openProjectNewWindow',
    function () {
      projectManager.showProjectList(true)
    }
  )

  context.subscriptions.push(disposable, newWindowdisposable)

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      projectManager.config = new Config(vscode.workspace.getConfiguration('ghqProjectManager'))
      projectManager.refreshList.bind(projectManager, true)
    })
  )
}

exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {
  //clear things
}

exports.deactivate = deactivate
