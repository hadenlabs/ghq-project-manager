import Config from './domain/config';

// @ts-check
import * as cp from 'child_process';
import * as vscode from 'vscode';
import * as walker from 'walker';
import * as path from 'path';
import { existsSync } from 'fs';
import DirList from './domain/dirList';

export default class ProjectLocator {
  dirList: DirList;
  config: Config;

  constructor(config: Config) {
    this.dirList = new DirList();
    this.config = config || new Config();
  }
  /**
   * Returns the depth of the directory path
   *
   * @param {String} s The path to be processed
   * @returns Number
   */
  getPathDepth(s: string): number {
    return s.split(path.sep).length;
  }

  checkFolderExists(folderPath: string) {
    const exists = existsSync(folderPath);
    if (!exists) {
      vscode.window.showWarningMessage(`Directory ${folderPath} does not exists.`);
    }

    return exists;
  }

  filterDir(dir: string, depth: number) {
    return true;
  }

  walkDirectory(dir: string): Promise<DirList> {
    const depth = this.getPathDepth(dir);

    return new Promise((resolve, reject) => {
      try {
        walker(dir)
          .filterDir((dir: string) => this.filterDir(dir, depth))
          .on('error', (e: string) => this.handleError(e))
          .on('end', () => {
            resolve(this.dirList);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async locateGhqProjects(projectsDirList: string[]): Promise<DirList> {
    /** @type {string[]} */
    const promises: Promise<DirList>[] = [];

    projectsDirList.forEach((projectBasePath) => {
      if (!this.checkFolderExists(projectBasePath)) {
        return;
      }

      promises.push(this.walkDirectory(projectBasePath));
    });

    await Promise.all(promises);

    return this.dirList;
  }

  clearDirList() {
    this.dirList = new DirList();
  }

  handleError(err: string) {
    console.log('Error walker:', err);
  }
}
