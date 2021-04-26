// @ts-check
import { Config, DirList } from './domain'
import * as vscode from 'vscode'
import * as path from 'path'
import { existsSync } from 'fs'
import { spawn } from 'child_process'

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

  getGhqRoot(): string {
    const child = spawn('git config --global ghq.root', {
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
    const ghqRoot: string = this.getGhqRoot()
    this.ghqGetRepositoryList()
      .split('\n')
      .forEach((element: string) => {
        if (element === '') {
          return
        }
        this.dirList.add(path.join(ghqRoot, element.trim()))
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
