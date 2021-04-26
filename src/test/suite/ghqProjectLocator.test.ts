/* global suite, test, setup, teardown */

import ProjectLocator from '../../ghqProjectLocator'
import { expect } from 'chai'
import { Config, DirList, ProjectRepository } from '../../domain'
import * as Sinon from 'sinon'

const config = new Config()
const projectLocator = new ProjectLocator(config)

// Defines a Mocha test suite to group tests of similar kind together

suite('ghqProjectLocator Tests', function () {
  suite('#Available functions', function () {
    // Defines a Mocha unit test
    test('Should export locateGhqProjects function', function (done) {
      expect(typeof projectLocator.locateGhqProjects).to.be.equals('function')
      done()
    })

    test('Should export ghqGetRepositoryList function', function (done) {
      expect(typeof projectLocator.ghqGetRepositoryList).to.be.equals('function')
      done()
    })

    test('Should export getGhqRoot function', function (done) {
      expect(typeof projectLocator.getGhqRoot).to.be.equals('function')
      done()
    })
  })
})

suite('ghqProjectLocator locateGhqProjects', () => {
  const makeGetRepositoryListStub = Sinon.stub(ProjectLocator.prototype, 'ghqGetRepositoryList')
  const makeGetGhqRootStub = Sinon.stub(ProjectLocator.prototype, 'getGhqRoot')

  setup(() => {
    let projects = ''
    projects += 'github.com/hadenlabs/repo1 \n'
    projects += 'github.com/hadenlabs/repo2 \n'
    projects += 'github.com/hadenlabs/repo3 \n'
    const ghqRoot = '/home/user/projects'

    makeGetRepositoryListStub.returns(projects)
    makeGetGhqRootStub.returns(ghqRoot)
  })

  teardown(() => {
    Sinon.restore()
  })

  test('should return list dir', () => {
    const dirList: DirList = projectLocator.locateGhqProjects()
    expect([
      '/home/user/projects/github.com/hadenlabs/repo1',
      '/home/user/projects/github.com/hadenlabs/repo2',
      '/home/user/projects/github.com/hadenlabs/repo3'
    ]).to.have.all.members(dirList.directories)
  })

  test('should return list dir', () => {
    const projectRepositoryList: ProjectRepository[] = projectLocator.locateGhqProjects().dirs
    expect([
      new ProjectRepository({
        name: 'github.com/hadenlabs/repo1',
        directory: '/home/user/projects/github.com/hadenlabs/repo1'
      }),
      new ProjectRepository({
        name: 'github.com/hadenlabs/repo1',
        directory: '/home/user/projects/github.com/hadenlabs/repo1'
      }),
      new ProjectRepository({
        name: 'github.com/hadenlabs/repo1',
        directory: '/home/user/projects/github.com/hadenlabs/repo1'
      })
    ]).to.have.all.members(projectRepositoryList)
  })
})
