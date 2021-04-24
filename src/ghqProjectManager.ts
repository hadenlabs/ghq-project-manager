import * as vscode from 'vscode';
import * as path from 'path';
import { SHA256 } from 'crypto-js';
import Config from './domain/config';
import ProjectRepository from './domain/ProjectRepository';

import RecentItems from './recentItems';
import ProjectLocator from './ghqProjectLocator';
import DirList from './domain/dirList';
import ProjectQuickPick from './domain/ProjectQuickPick';

const FOLDER = '\uD83D\uDCC2';
const GLOBE = '\uD83C\uDF10';

export default class GhqProjectManager {
  config: Config;
  state: vscode.Memento;
  loadedRepoListFromFile: boolean;
  repoList: ProjectRepository[];
  storedLists: Map<any, any>;
  /**
   * Creates an instance of GhqProjectManager.
   *
   * @param {object} config
   * @param {Memento} state
   */
  constructor(config: Config, state: vscode.Memento) {
    this.config = config;
    this.state = state;
    this.loadedRepoListFromFile = false;
    this.repoList = [];
    this.storedLists = new Map();

    this.addRepoInRepoList = this.addRepoInRepoList.bind(this);
  }

  getQuickPickList(): ProjectQuickPick[] {
    this.repoList = this.repoList.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });

    // let homeDir = this.getHomePath().replace(new RegExp(`${path.sep}$`), '') + path.sep;
    return this.repoList.map((repo) => {
      const description = '';
      const item = new ProjectQuickPick();
      item.label = repo.name;
      item.description = description.trim();
      item.directory = repo.directory;
      return item;
    });
  }

  handleError(error: Error): Error {
    vscode.window.showErrorMessage(`Error in GPM Manager ${error}`);
    return error;
  }

  addRepoInRepoList(repoInfo: ProjectRepository) {
    const map = this.repoList.map((info) => {
      return info.directory;
    });
    if (map.indexOf(repoInfo.directory) === -1) {
      this.repoList.push(repoInfo);
    }
  }

  async getProjectsFolders(subFolder = ''): Promise<string[]> {
    const isFolderConfigured = this.config.baseProjectFolders.length > 0;

    if (!isFolderConfigured) {
      throw new Error(
        'You need to configure at least one folder in "ghqProjectManager.baseProjectsFolders" before searching for projects.'
      );
    }

    const baseProjectsFolders: string[] =
      subFolder === ''
        ? vscode.workspace.getConfiguration('ghqProjectManager').get('baseProjectsFolders') || []
        : [subFolder];
    const resolvedProjectsFolders = baseProjectsFolders.map((path) => {
      return this.resolveEnvironmentVariables(process.platform, path);
    });

    return resolvedProjectsFolders;
  }

  getHomePath() {
    return process.env.HOME || process.env.HOMEPATH;
  }

  resolveEnvironmentVariables(processPlatform: string, aPath: string) {
    const envVarMatcher = processPlatform === 'win32' ? /%([^%]+)%/g : /\$([^\/]+)/g;
    const resolvedPath = aPath.replace(envVarMatcher, (_, key) => process.env[key] || '');

    const homePath = this.getHomePath() || '';
    return resolvedPath.charAt(0) === '~'
      ? path.join(homePath, resolvedPath.substr(1))
      : resolvedPath;
  }

  /**
   * Show the list of found Git projects, and open the chose project
   *
   * @param {Object} opts Additional options, currently supporting only subfolders
   * @param {boolean} openInNewWindow If true, will open the selected project in a new windows, regardless of the OpenInNewWindow configuration
   *
   * @memberOf GhqProjectManager
   */
  async showProjectList(openInNewWindow: boolean, baseFolder?: string) {
    try {
      const options = {
        placeHolder:
          'Select a folder to open:      (it may take a few seconds to search the folders the first time)'
      };

      const projectsPromise = this.getProjectsList(await this.getProjectsFolders(baseFolder));

      const selected = await vscode.window.showQuickPick<ProjectQuickPick>(projectsPromise, options);

      if (selected) {
        this.openProject(selected, openInNewWindow);
      }
    } catch (e) {
      vscode.window.showInformationMessage(`Error while showing Project list: ${e}`);
    }
  }

  async getProjectsList(directories: string[]): Promise<ProjectQuickPick[]> {
    this.repoList = this.storedLists.get(this.getDirectoriesHash(directories));
    if (this.repoList) {
      return this.getQuickPickList();
    }

    return this.getQuickPickList();
  }

  openProject(pickedObj: ProjectQuickPick | string, openInNewWindow = false) {
    const projectPath = this.getProjectPath(pickedObj),
      uri = vscode.Uri.file(projectPath),
      newWindow = openInNewWindow || !!vscode.workspace.workspaceFolders;

    vscode.commands.executeCommand('vscode.openFolder', uri, newWindow);
  }

  getProjectPath(pickedObj: ProjectQuickPick | string): string {
    if (pickedObj instanceof ProjectQuickPick) {
      return pickedObj.directory;
    }

    return pickedObj;
  }

  internalRefresh(folders: string[], suppressMessage: boolean) {
    this.storedLists = new Map();
    this.getProjectsList(folders)
      .then(() => {
        if (!suppressMessage) {
          vscode.window.setStatusBarMessage('Git Project Manager - Project List Refreshed', 3000);
        }
      })
      .catch((error) => {
        if (!suppressMessage) {
          this.handleError(error);
        }
      });
  }

  clearProjectList() {
    this.repoList = [];
  }

  /**
   * Refreshs the current list of projects
   * @param {boolean} suppressMessage if true, no warning message will be shown.
   */
  refreshList(suppressMessage = false) {
    this.clearProjectList();
    this.getProjectsFolders()
      .then((folders) => {
        this.internalRefresh(folders, suppressMessage);
      })
      .catch((error) => {
        if (!suppressMessage) {
          this.handleError(error);
        }
      });
  }

  /**
   * Calculate a hash of directories list
   *
   * @param {String[]} directories
   * @returns {string} The hash of directories list
   *
   * @memberOf GhqProjectManager
   */
  getDirectoriesHash(directories: string[]) {
    return SHA256(directories.join('')).toString();
  }

  getChannelPath() {
    return vscode.env.appName.replace('Visual Studio ', '');
  }
}
