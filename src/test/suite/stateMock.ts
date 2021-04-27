export default class StateMock {
  data: Map<string, string>
  constructor() {
    this.data = new Map<string, string>()
  }

  get(key: string, defaultValue = undefined): string | undefined {
    return this.data.get(key) || defaultValue
  }

  async update(key: string, value: string): Promise<void> {
    this.data.set(key, value)
  }
}
