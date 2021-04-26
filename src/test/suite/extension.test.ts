import * as assert from 'assert'
import { expect } from 'chai'
import * as vscode from 'vscode'
import * as myExtension from '../../extension'

suite('extension Tests', function () {
  suite('#Available functions', function () {
    test('Should export activate function', function (done) {
      expect(typeof myExtension.activate).to.be.equals('function')
      done()
    })

    test('Should export deactivate function', function (done) {
      expect(typeof myExtension.deactivate).to.be.equals('function')
      done()
    })
  })
})

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('Sample test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5))
    assert.strictEqual(-1, [1, 2, 3].indexOf(0))
  })
})
