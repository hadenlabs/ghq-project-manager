import { IProjectRepository } from './entities'

export default class ProjectRepository {
  name: string
  directory: string
  constructor(repository: IProjectRepository) {
    this.name = repository.name
    this.directory = repository.directory
  }
}
