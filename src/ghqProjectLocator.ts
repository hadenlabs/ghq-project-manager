// @ts-check
import { Config, DirList, IProjectRepository } from "./domain"
import * as childProcess from "child_process"
import * as promisify from "util.promisify"
import * as vscode from "vscode"
import * as path from "path"
import { existsSync } from "fs"

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

  async getGhqRoot(): Promise<string> {
    try {
      const { stdout } = await promisify(childProcess.exec)("ghq root")
      return stdout.toString().trim()
    } catch (error) {
      this.handleError(error)
      return ""
    }
  }

  async ghqGetRepositoryList(): Promise<string> {
    try {
      const { stdout } = await promisify(childProcess.exec)("ghq list")
      return stdout.toString().trim()
    } catch (error) {
      this.handleError(error)
      return ""
    }
  }

  async locateGhqProjects(): Promise<DirList> {
    try {
      const ghqRoot: string = await this.getGhqRoot()
      const repositories = await this.ghqGetRepositoryList()
      repositories.split("\n").forEach((element: string) => {
        if (element === "") {
          return
        }
        const repository: IProjectRepository = {
          name: element.trim(),
          directory: path.join(ghqRoot, element.trim())
        }
        this.dirList.add(repository.name, repository.directory)
      })

      return this.dirList
    } catch (error) {
      this.handleError(error)
      return this.dirList
    }
  }

  private clearDirList(): void {
    this.dirList = new DirList()
  }

  private handleError(err: string) {
    console.log("Error:", err)
  }
}
