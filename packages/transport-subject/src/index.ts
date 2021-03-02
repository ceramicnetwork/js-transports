import { Subject, Subscriber, Subscription } from 'rxjs'
import type { Observable, Observer } from 'rxjs'

export class TransportSubject<MsgIn, MsgOut = MsgIn> extends Subject<MsgIn> {
  _source: Observable<MsgIn>
  _sink: Observer<MsgOut>

  constructor(source: Observable<MsgIn>, sink: Observer<MsgOut>) {
    super()
    this._source = source
    this._sink = sink
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore MsgOut can be different from MsgIn
  next(message: MsgOut): void {
    this._sink.next?.(message)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  error(err: any): void {
    this._sink.error?.(err)
  }

  complete(): void {
    this._sink.complete?.()
  }

  _subscribe(subscriber: Subscriber<MsgIn>): Subscription {
    return this._source.subscribe(subscriber) ?? Subscription.EMPTY
  }
}
