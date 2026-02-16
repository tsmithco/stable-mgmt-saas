/**
 * Event bus implementation
 * Simple pub/sub for inter-module communication
 */

import { EventEmitter } from 'eventemitter3'

export interface AppEvent {
  type: string
  timestamp: Date
  data: Record<string, any>
}

export class EventBus {
  private emitter = new EventEmitter()

  on(event: string, handler: (data: any) => void | Promise<void>) {
    this.emitter.on(event, handler)
  }

  off(event: string, handler: (data: any) => void | Promise<void>) {
    this.emitter.off(event, handler)
  }

  async emit(event: string, data: Record<string, any>) {
    const appEvent: AppEvent = {
      type: event,
      timestamp: new Date(),
      data
    }

    this.emitter.emit(event, appEvent)
  }

  onAny(handler: (event: string, data: any) => void | Promise<void>) {
    // EventEmitter3 uses listeners for all events
    // For now, we'll use a simple approach - emit a catch-all event
    this.emitter.on('*', handler)
  }
}

export const eventBus = new EventBus()
