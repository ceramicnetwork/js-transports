import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { Subscriber, fromEvent } from 'rxjs'
import { filter, map } from 'rxjs/operators'

type PostMessageTarget = Window | Worker

export class PostMessageTransport<MsgIn, MsgOut = MsgIn> extends TransportSubject<MsgIn, MsgOut> {
  constructor(
    target: PostMessageTarget,
    allowedOrigin: string | Array<string>,
    ownOrigin?: string
  ) {
    if (!Array.isArray(allowedOrigin)) {
      allowedOrigin = [allowedOrigin]
    }
    const source = fromEvent<MessageEvent>(target, 'message').pipe(
      filter((event) => allowedOrigin.includes(event.origin)),
      map((event) => event.data as MsgIn)
    )

    const postMessage =
      target instanceof Worker
        ? (message: MsgOut) => target.postMessage(message)
        : (message: MsgOut) => target.postMessage(message, ownOrigin ?? window.location.origin)
    const sink = Subscriber.create<MsgOut>((message) => {
      if (message != null) {
        postMessage(message)
      }
    })

    super(source, sink)
  }
}
