import * as echarts from 'echarts';

export class MockEChartsInstance {
  private options: any = {};
  private eventHandlers: { [key: string]: Function[] } = {};
  private actions: any[] = [];

  setOption(options: any) {
    this.options = options;
  }

  on(eventName: string, handler: Function) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(handler);
  }

  dispatchAction(action: any) {
    this.actions.push(action);
  }

  resize(options: { width: number; height: number }) {
    this.options.width = options.width;
    this.options.height = options.height;
  }

  dispose() {
    this.options = {};
    this.eventHandlers = {};
    this.actions = [];
  }

  // Test helpers
  triggerEvent(eventName: string, params: any) {
    const handlers = this.eventHandlers[eventName] || [];
    handlers.forEach(handler => handler(params));
  }

  getOptions() {
    return this.options;
  }

  getActions() {
    return this.actions;
  }
}

export function mockECharts() {
  const mockInstance = new MockEChartsInstance();
  jest.spyOn(echarts, 'init').mockReturnValue(mockInstance as any);
  return mockInstance;
} 