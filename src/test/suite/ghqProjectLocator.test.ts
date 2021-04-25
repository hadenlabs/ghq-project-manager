/* global describe, it, before, after */

import ProjectLocator from '../../ghqProjectLocator'
import { expect } from 'chai'
import Config from '../../domain/config'

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
