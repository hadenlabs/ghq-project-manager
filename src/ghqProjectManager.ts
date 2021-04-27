import * as vscode from 'vscode'
import { Config, Icons, ProjectRepository, ProjectQuickPick } from './domain'
import { IQuickPickItem } from './domain/entities'

import ProjectLocator from './ghqProjectLocator'

export default class GhqProjectManager {
  config: Config
  state: vscode.Memento
  loadedRepoListFromFile: boolean
  repoList: ProjectRepository[]
  /**
   * Creates an instance of GhqProjectManager.
   *
   * @param {object} config
   * @param {Memento} state
   */
  constructor(config: Config, state: vscode.Memento) {
    this.config = config
    this.state = state
    this.loadedRepoListFromFile = false
    this.repoList = []

    this.addRepoInRepoList = this.addRepoInRepoList.bind(this)
  }

  async getQuickPickList(): Promise<ProjectQuickPick[]> {
    return this.repoList.map((repo) => {
      const description = `${Icons.globe} ${repo.name}`
      const itemQuickPick: IQuickPickItem = {
        label: repo.name || 'name',
        description: description.trim(),
        directory: repo.directory || 'directory'
      }
      return new ProjectQuickPick(itemQuickPick)
    })
  }

  handleError(error: Error): Error {
    vscode.window.showErrorMessage(`Error in GPM Manager ${error}`)
    return error
  }

  addRepoInRepoList(repoInfo: ProjectRepository): void {
    const map = this.repoList.map((info) => {
      return info.directory
    })

    if (map.indexOf(repoInfo.directory) === -1) {
      this.repoList.push(repoInfo)
    }
  }

  /**
   * Show the list of found Ghq projects, and open the chose project
   *
   * @param {Object} opts Additional options, currently supporting only subfolders
   * @param {boolean} openInNewWindow If true, will open the selected project in a new windows, regardless of the OpenInNewWindow configuration
   *
   * @memberOf GhqProjectManager
   */
  async showProjectList(openInNewWindow: boolean): Promise<void> {
    try {
      const options = {
        placeHolder:
          'Select a folder to open:      (it may take a few seconds to search the folders the first time)'
      }

      const projects = await this.getProjectsList()

      const selected:
        | ProjectQuickPick
        | undefined = await vscode.window.showQuickPick<ProjectQuickPick>(projects, options)

      if (selected) {
        this.openProject(selected, openInNewWindow)
      }
    } catch (error) {
      vscode.window.showInformationMessage(`Error while showing Project list: ${error}`)
    }
  }

  async getProjectsList(): Promise<ProjectQuickPick[]> {
    const projectLocator = new ProjectLocator(this.config)
    const dirList = await projectLocator.locateGhqProjects()
    this.updateRepoList(dirList.dirList)
    return this.getQuickPickList()
  }

  updateRepoList(dirList: ProjectRepository[]): ProjectRepository[] {
    dirList.forEach(this.addRepoInRepoList)
    return dirList
  }

  openProject(pickedObj: ProjectQuickPick | string, openInNewWindow = false): void {
    const projectPath = this.getProjectPath(pickedObj),
      uri = vscode.Uri.file(projectPath),
      newWindow = openInNewWindow

    vscode.commands.executeCommand('vscode.openFolder', uri, newWindow)
  }

  getProjectPath(pickedObj: ProjectQuickPick | string): string {
    if (pickedObj instanceof ProjectQuickPick) {
      return pickedObj.directory
    }

    return pickedObj
  }

  clearProjectList(): void {
    this.repoList = []
  }

  getChannelPath(): string {
    return vscode.env.appName.replace('Visual Studio ', '')
  }
}
