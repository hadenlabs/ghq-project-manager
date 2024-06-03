import { QuickPickItem } from "vscode"
import { IQuickPickItem } from "./entities"

export default class ProjectQuickPick implements QuickPickItem {
  label: string
  directory: string
  description?: string | undefined
  detail?: string | undefined
  picked?: boolean | undefined
  alwaysShow?: boolean | undefined

  constructor(pickItem: IQuickPickItem) {
    this.label = pickItem.label
    this.directory = pickItem.directory
    this.description = pickItem.description
  }
}
