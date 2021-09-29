/**
 * ```sh
 * npm install @ceramicnetwork/transport-postmessage
 * ```
 *
 * @module transport-postmessage
 */

import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { fromEvent } from 'rxjs'
import type { NextObserver, Observable } from 'rxjs'
import { filter } from 'rxjs/operators'

// Similar to the MessagePort interface
export interface PostMessageEventMap {
  message: MessageEvent
  messageerror: MessageEvent
}
export interface PostMessageTarget extends EventTarget {
  onmessage: ((this: any, ev: MessageEvent) => any) | null
  onmessageerror: ((this: any, ev: MessageEvent) => any) | null
  postMessage(...args: Array<any>): void
  addEventListener<K extends keyof PostMessageEventMap>(
    type: K,
    listener: (this: any, ev: PostMessageEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof PostMessageEventMap>(
    type: K,
    listener: (this: any, ev: PostMessageEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void
}

export type MessageFilter = (event: MessageEvent) => boolean

// Workarout for TS error about MessageEvent not being generic
export interface IncomingMessage<Data = any> extends MessageEvent {
  readonly data: Data
}

export function createOriginFilter<Event extends MessageEvent>(
  allowedOrigin: string | Array<string>
): (event: Event) => boolean {
  if (!Array.isArray(allowedOrigin)) {
    allowedOrigin = [allowedOrigin]
  }
  return (event: Event) => allowedOrigin.includes(event.origin)
}

export function createMessageObservable<MessageData = any>(
  target: PostMessageTarget,
  originOrFilter?: string | Array<string> | MessageFilter
): Observable<IncomingMessage<MessageData>> {
  const source = fromEvent<MessageEvent>(target, 'message')
  if (originOrFilter == null) {
    return source
  }

  const messageFilter =
    typeof originOrFilter === 'function' ? originOrFilter : createOriginFilter(originOrFilter)
  return source.pipe(filter(messageFilter))
}

export function createPostMessageObserver<MessageData = any>(
  target: PostMessageTarget,
  ...args: Array<any>
): NextObserver<MessageData> {
  return {
    next: (message: MessageData) => {
      if (message != null) {
        target.postMessage(message, ...args)
      }
    },
  }
}

export type PostMessageTransportOptions = {
  filter?: string | Array<string> | MessageFilter
  postMessageArguments?: Array<any>
}

export function createPostMessageTransport<MsgIn, MsgOut = MsgIn>(
  from: PostMessageTarget,
  to: PostMessageTarget = from,
  { filter, postMessageArguments = [] }: PostMessageTransportOptions = {}
): TransportSubject<IncomingMessage<MsgIn>, MsgOut> {
  const source = createMessageObservable<MsgIn>(from, filter)
  const sink = createPostMessageObserver<MsgOut>(to, ...postMessageArguments)
  return new TransportSubject(source, sink)
}
