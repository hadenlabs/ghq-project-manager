/* global suite, it */

import { DirList } from '../../domain'
import { expect } from 'chai'

suite('dirList Tests', () => {
  test('should add directories to list', () => {
    const dirList = new DirList()
    dirList.add('github.com/luismayta/repo-1')
    dirList.add('github.com/luismayta/repo-2')
    dirList.add('github.com/luismayta/repo-3')
    expect(dirList.dirList.length).to.be.equal(3)
    dirList.add('github.com/luismayta/repo-4')
    expect(dirList.dirList.length).to.be.equal(4)
  })

  test('should not add duplicates', () => {
    const dirList = new DirList()
    dirList.add('github.com/luismayta/repo-1')
    dirList.add('github.com/luismayta/repo-1')
    expect(dirList.dirList.length).to.be.equal(1)
    dirList.add('github.com/luismayta/repo-1')
    expect(dirList.dirList.length).to.be.equal(1)
  })

  test('should validate existing repositories', () => {
    const dirList = new DirList()
    dirList.add('github.com/luismayta/repo-1')
    expect(dirList.exists('github.com/luismayta/repo-1')).to.be.true
  })

  test("shouldn't validate not existing repositories", () => {
    const dirList = new DirList()
    dirList.add('github.com/luismayta/repo-1')
    expect(dirList.exists('/home/user/path2')).to.be.false
  })

  test('should concatenate two dirlist', () => {
    const dirList = new DirList()
    dirList.add('github.com/luismayta/repo-1')
    dirList.add('github.com/luismayta/repo-2')

    const dirList2 = new DirList()
    dirList2.add('github.com/luismayta/repo-3')
    dirList2.add('github.com/luismayta/repo-4')
    dirList2.add('github.com/luismayta/repo-5')

    dirList.concat(dirList2)

    expect(dirList.dirList.length).to.be.equal(5)
  })
})
