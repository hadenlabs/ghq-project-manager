import { WorkspaceConfiguration } from 'vscode'

/**
 * @typedef Config
 * @type {Object}
 * @class Config
 */
export default class Config extends Object {
  baseProjectFolders: string

  constructor(vscodeCfg?: WorkspaceConfiguration) {
    super()
    this.baseProjectFolders = ''
  }

  loadConfigFromVsCode(vscodeConfig: WorkspaceConfiguration) {
    this.baseProjectFolders = vscodeConfig.get('ghqRoot', '')
  }
}
