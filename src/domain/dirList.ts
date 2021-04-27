import ProjectRepository from './ProjectRepository'

export default class DirList {
  dirs: ProjectRepository[]

  constructor() {
    this.dirs = []
  }

  get dirList(): ProjectRepository[] {
    return this.dirs
  }
  /**
   * Returns an array with all current directories
   *
   * @returns {[]string} An array that contains all directories
   * @readonly
   */
  get directories(): string[] {
    return this.dirs.map((x) => x.directory)
  }

  add(name: string, dirPath: string): void {
    if (this.exists(dirPath)) {
      return
    }

    this.dirs.push({
      directory: dirPath,
      name: name
    })
  }

  exists(dirPath: string): boolean {
    return this.dirs.find((e) => e.directory === dirPath) !== undefined
  }

  clear(): void {
    this.dirs = []
  }
}
