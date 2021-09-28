/**
 * ```sh
 * npm install @ceramicnetwork/transport-subject
 * ```
 *
 * @module transport-subject
 */

import { Subject, Subscription, pipe } from 'rxjs'
import type { NextObserver, Observable, OperatorFunction, PartialObserver } from 'rxjs'
import { filter, map } from 'rxjs/operators'

export class TransportSubject<MsgIn, MsgOut = MsgIn> extends Subject<MsgIn> {
  _source: Observable<MsgIn>
  _sink: PartialObserver<MsgOut>

  constructor(source: Observable<MsgIn>, sink: PartialObserver<MsgOut>) {
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

  _subscribe(observer: PartialObserver<MsgIn>): Subscription {
    return this._source.subscribe(observer) ?? Subscription.EMPTY
  }
}

export type Wrapper<MsgIn, MsgOut, WrappedOut> = {
  wrap: (msg: MsgOut) => WrappedOut
  unwrap: (input: any) => MsgIn
}

export type Wrapped<Message, Namespace extends string = string> = {
  __tw: true
  msg: Message
  ns: Namespace
}

export function createWrap<MsgOut, Namespace extends string = string>(namespace: Namespace) {
  return function wrap(msg: MsgOut): Wrapped<MsgOut, Namespace> {
    return { __tw: true, ns: namespace, msg }
  }
}

export function createUnwrap<MsgIn, Namespace extends string = string>(namespace: Namespace) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function unwrap(input: any): MsgIn {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    if (input.__tw !== true) {
      throw new Error('Input is not a wrapped message')
    }
    if (typeof input.ns !== 'string') {
      throw new Error(
        `Invalid namespace type for wrapped message: expected a string, got ${typeof input.ns}`
      )
    }
    if (input.ns !== namespace) {
      throw new Error(
        `Invalid namespace for wrapped message: expected ${namespace}, got ${input.ns as string}`
      )
    }
    return input.msg as MsgIn
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }
}

export function createWrapper<MsgIn, MsgOut = MsgIn, Namespace extends string = string>(
  namespace: Namespace
): Wrapper<MsgIn, MsgOut, Wrapped<MsgOut, Namespace>> {
  return { wrap: createWrap(namespace), unwrap: createUnwrap(namespace) }
}

export type UnwrapObservableOptions = {
  onInvalidInput?: (input: unknown, error: Error) => void
  throwWhenInvalid?: boolean
}

export function createUnwrapOperator<WrappedIn, MsgIn>(
  unwrap: (input: any) => MsgIn,
  options: UnwrapObservableOptions = {}
): OperatorFunction<WrappedIn, MsgIn> {
  if (options.throwWhenInvalid) {
    return pipe(map(unwrap))
  }

  const onInvalid =
    typeof options.onInvalidInput === 'function'
      ? options.onInvalidInput
      : function onInvalid(input: unknown, error: Error) {
          console.warn('Invalid transport input', input, error)
        }
  return pipe(
    map((input) => {
      try {
        return unwrap(input)
      } catch (err) {
        onInvalid(input, err as Error)
        return null
      }
    }),
    filter((msg): msg is MsgIn => msg !== null)
  )
}

export function createWrapObserver<MsgOut, WrappedOut>(
  observer: NextObserver<WrappedOut>,
  wrap: (msg: MsgOut) => WrappedOut
): NextObserver<MsgOut> {
  return {
    ...observer,
    next: (msg) => {
      if (msg != null) {
        observer.next(wrap(msg))
      }
    },
  }
}

export function createWrappedTransport<MsgIn, MsgOut, WrappedIn, WrappedOut = WrappedIn>(
  transport: TransportSubject<WrappedIn, WrappedOut>,
  { wrap, unwrap }: Wrapper<MsgIn, MsgOut, WrappedOut>,
  options: UnwrapObservableOptions = {}
): TransportSubject<MsgIn, MsgOut> {
  const source = transport.pipe(createUnwrapOperator<WrappedIn, MsgIn>(unwrap, options))
  const sink = createWrapObserver(transport, wrap)
  return new TransportSubject(source, sink)
}

export function createNamespacedTransport<MsgIn, MsgOut = MsgIn, Namespace extends string = string>(
  transport: TransportSubject<Wrapped<MsgIn, Namespace>, Wrapped<MsgOut, Namespace>>,
  namespace: Namespace,
  options?: UnwrapObservableOptions
): TransportSubject<MsgIn, MsgOut> {
  return createWrappedTransport(transport, createWrapper(namespace), options)
}
