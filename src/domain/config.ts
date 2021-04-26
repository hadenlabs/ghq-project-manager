import { WorkspaceConfiguration } from 'vscode'

export enum Icons {
  FOLDER = '\uD83D\uDCC2',
  GLOBE = '\uD83C\uDF10'
}

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
