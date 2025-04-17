const taskRegistry: (() => void)[] = []

export function registerTask(task: any) {
  taskRegistry.push(task)
}

export function unregisterTask(task: () => void): void {
  taskRegistry.splice(taskRegistry.indexOf(task), 1)
}

export function getTasks(): (() => void)[] {
  return taskRegistry
}
