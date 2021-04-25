import { stringify } from 'querystring'

export default class StateMock {
  data: Map<string, string>
  constructor() {
    this.data = new Map<string, string>()
  }
  get(key: string, defaultValue = undefined) {
    return this.data.get(key) || defaultValue
  }
  async update(key: string, value: string) {
    this.data.set(key, value)
  }
}
