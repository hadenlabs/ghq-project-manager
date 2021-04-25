/* global suite, test, before, after */

import ProjectLocator from '../../ghqProjectLocator'
import { expect } from 'chai'
import Config from '../../domain/config'
import DirList from '../../domain/dirList'
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
  })
})

suite('ghqProjectLocator locateGhqProjects', () => {
  const makeStub = Sinon.stub(ProjectLocator.prototype, 'ghqGetRepositoryList')

  setup(() => {
    let projects = ''
    projects += 'github.com/hadenlabs/repo1 \n'
    projects += 'github.com/hadenlabs/repo2 \n'
    projects += 'github.com/hadenlabs/repo3 \n'
    makeStub.returns(projects)
  })

  teardown(() => {
    Sinon.restore()
  })

  test('should return list dir', () => {
    const dirList: DirList = projectLocator.locateGhqProjects()
    expect([
      'github.com/hadenlabs/repo1',
      'github.com/hadenlabs/repo2',
      'github.com/hadenlabs/repo3'
    ]).to.have.all.members(dirList.directories)
  })
})
