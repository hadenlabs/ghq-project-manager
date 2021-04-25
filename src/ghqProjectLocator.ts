import Config from './domain/config'

// @ts-check
import * as vscode from 'vscode'
import * as path from 'path'
import { existsSync } from 'fs'
import { spawn } from 'child_process'
import DirList from './domain/dirList'

export default class ProjectLocator {
  dirList: DirList
  config: Config

  constructor(config: Config) {
    this.dirList = new DirList()
    this.config = config || new Config()
  }
  /**
   * Returns the depth of the directory path
   *
   * @param {String} s The path to be processed
   * @returns Number
   */
  private getPathDepth(s: string): number {
    return s.split(path.sep).length
  }

  private checkFolderExists(folderPath: string) {
    const exists = existsSync(folderPath)
    if (!exists) {
      vscode.window.showWarningMessage(`Directory ${folderPath} does not exists.`)
    }

    return exists
  }

  ghqGetRepositoryList(): string {
    const child = spawn('ghq list', {
      shell: true
    })
    child.stdout.on('data', (result) => {
      return result.toString()
    })
    child.stderr.on('close', (error: any) => {
      this.handleError(error)
    })
    return ''
  }

  locateGhqProjects(): DirList {
    /** @type {string[]} */
    const projects: DirList[] = []

    const ghqList = this.ghqGetRepositoryList()
    ghqList.split('/n').forEach((element: string) => {
      const dirList = new DirList()
      dirList.add(element)
      projects.push(dirList)
    })

    return this.dirList
  }

  private clearDirList(): void {
    this.dirList = new DirList()
  }

  private handleError(err: string) {
    console.log('Error:', err)
  }
}
