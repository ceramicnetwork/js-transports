import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { Subscriber, fromEvent } from 'rxjs'
import type { Observable, Observer } from 'rxjs'
import { filter, map } from 'rxjs/operators'

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

export function createOriginFilter<Event extends MessageEvent>(
  allowedOrigin: string | Array<string>
): (event: Event) => boolean {
  if (!Array.isArray(allowedOrigin)) {
    allowedOrigin = [allowedOrigin]
  }
  return (event: Event) => allowedOrigin.includes(event.origin)
}

export function createMessageObservable(
  target: PostMessageTarget,
  allowedOrigin?: string | Array<string>
): Observable<MessageEvent> {
  const source = fromEvent<MessageEvent>(target, 'message')
  return allowedOrigin ? source.pipe(filter(createOriginFilter(allowedOrigin))) : source
}

export function createPostMessageObserver<MessageData>(
  target: PostMessageTarget,
  ...args: Array<any>
): Observer<MessageData> {
  return Subscriber.create<MessageData>((message) => {
    if (message != null) {
      target.postMessage(message, ...args)
    }
  })
}

export type PostMessageTransportOptions = {
  allowedOrigin?: string | Array<string>
  postMessageArguments?: Array<any>
}
export class PostMessageTransport<MsgIn, MsgOut = MsgIn> extends TransportSubject<MsgIn, MsgOut> {
  constructor(
    from: PostMessageTarget,
    to: PostMessageTarget = from,
    { allowedOrigin, postMessageArguments }: PostMessageTransportOptions = {}
  ) {
    const source = createMessageObservable(from, allowedOrigin).pipe(
      map((event) => event.data as MsgIn)
    )

    const sink = postMessageArguments
      ? createPostMessageObserver(to, ...postMessageArguments)
      : createPostMessageObserver(to)

    super(source, sink)
  }
}
