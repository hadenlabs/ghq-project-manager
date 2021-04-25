export default class ProjectRepository {
  name: string
  directory: string
  constructor(name: string, dir: string) {
    this.name = name
    this.directory = dir
  }
}
