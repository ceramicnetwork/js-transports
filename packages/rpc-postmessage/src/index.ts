/**
 * ```sh
 * npm install @ceramicnetwork/rpc-postmessage
 * ```
 *
 * @module rpc-postmessage
 */

import { createHandlerOperator } from '@ceramicnetwork/rpc-transport'
import {
  createUnwrap,
  createUnwrapOperator,
  createWrap,
  createWrapObserver,
  createWrapper,
} from '@ceramicnetwork/transport-subject'
import type {
  TransportSubject,
  UnwrapObservableOptions,
  Wrapped,
} from '@ceramicnetwork/transport-subject'
import {
  createMessageObservable,
  createPostMessageTransport,
} from '@ceramicnetwork/transport-postmessage'
import type {
  IncomingMessage,
  MessageFilter,
  PostMessageTarget,
} from '@ceramicnetwork/transport-postmessage'
import { RPCClient, createHandler } from 'rpc-utils'
import type {
  HandlerMethods,
  HandlerOptions,
  RPCMethods,
  RPCRequest,
  RPCResponse,
  SendRequestFunc,
} from 'rpc-utils'
import { pipe } from 'rxjs'
import type { Observable, OperatorFunction, Subscription } from 'rxjs'
import { filter, first, map, mergeMap, tap } from 'rxjs/operators'

export type ServerOptions<Context, Methods extends RPCMethods> = HandlerOptions<
  Context,
  Methods
> & {
  target: PostMessageTarget
  methods: HandlerMethods<Context, Methods>
}

export function serve<Methods extends RPCMethods>({
  target,
  methods,
  ...options
}: ServerOptions<null, Methods>): Subscription {
  const transport = createPostMessageTransport<
    RPCRequest<Methods, keyof Methods>,
    RPCResponse<Methods, keyof Methods>
  >(target)
  return transport
    .pipe(
      map((event) => event.data),
      createHandlerOperator(null, methods, options),
      filter((res): res is RPCResponse<Methods, keyof Methods> => res != null)
    )
    .subscribe(transport)
}

export type RequestPayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'request'
  message: Message
  request: RPCRequest<Methods, K>
}

export type HandledPayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'handled'
  message: Message
  request: RPCRequest<Methods, K>
  response: RPCResponse<Methods, K> | null
}

export function createNamespaceRequestHandlerOperator<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
>(
  methods: HandlerMethods<Message, Methods>,
  namespace: Namespace,
  options: HandlerOptions<Message, Methods> = {}
): OperatorFunction<Message, HandledPayload<Message, Methods, keyof Methods>> {
  const handleRequest = createHandler<Message, Methods>(methods, options)
  const unwrap = createUnwrap<RPCRequest<Methods, keyof Methods>>(namespace)

  return pipe(
    map((message) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const request = unwrap((message as any).data) // TS error: semantic error TS2339: Property 'data' does not exist on type 'Message'
        return request.method ? { type: 'request', message, request } : null
      } catch (_error) {
        return null
      }
    }),
    filter((payload): payload is RequestPayload<Message, Methods, keyof Methods> => {
      return payload !== null
    }),
    mergeMap(async (payload): Promise<HandledPayload<Message, Methods, keyof Methods>> => {
      return {
        type: 'handled',
        message: payload.message,
        request: payload.request,
        response: await handleRequest(payload.message, payload.request),
      }
    })
  )
}

export type NamespaceServerOptions<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
> = ServerOptions<Message, Methods> & {
  namespace: Namespace
  filter?: string | Array<string> | MessageFilter
}

export function createNamespaceServer<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Request = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
>({
  filter: messageFilter,
  methods,
  namespace,
  target,
  ...options
}: NamespaceServerOptions<Methods, Namespace, IncomingMessage<Request>>): Observable<
  HandledPayload<IncomingMessage<Request>, Methods, keyof Methods>
> {
  const wrap = createWrap<RPCResponse<Methods, keyof Methods>>(namespace)

  return createMessageObservable<Request>(target, messageFilter).pipe(
    createNamespaceRequestHandlerOperator<Methods, Namespace, IncomingMessage<Request>>(
      methods,
      namespace,
      options
    ),
    tap((payload) => {
      if (payload.response != null) {
        const source = (payload.message.source ?? window) as Window
        source.postMessage(wrap(payload.response), payload.message.origin || '*')
      }
    })
  )
}

export type NamespaceClientTransport<
  Methods extends RPCMethods,
  Namespace extends string,
  Incoming = IncomingMessage<Wrapped<RPCResponse<Methods, keyof Methods>, Namespace>>,
  Outgoing = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
> = TransportSubject<Incoming, Outgoing>

export function createNamespaceSendRequest<
  Methods extends RPCMethods,
  Namespace extends string = string
>(
  transport: NamespaceClientTransport<Methods, Namespace>,
  namespace: Namespace,
  options?: UnwrapObservableOptions
): SendRequestFunc<Methods> {
  const wrapper = createWrapper<
    RPCResponse<Methods, keyof Methods>,
    RPCRequest<Methods, keyof Methods>,
    Namespace
  >(namespace)
  const observer = createWrapObserver(transport, wrapper.wrap)
  const unwrap = createUnwrapOperator(wrapper.unwrap, options)

  return async function send<K extends keyof Methods>(
    req: RPCRequest<Methods, K>
  ): Promise<RPCResponse<Methods, K>> {
    return new Promise((resolve, reject) => {
      const subscription = transport
        .pipe(
          map((message) => message.data),
          unwrap,
          first((res) => res != null && res.id === req.id && ('error' in res || 'result' in res))
        )
        .subscribe({
          next: (res) => {
            resolve(res)
            subscription.unsubscribe()
          },
          error: reject,
        })
      observer.next(req)
    })
  }
}

export function createNamespaceClient<
  Methods extends RPCMethods,
  Namespace extends string = string
>(
  transport: NamespaceClientTransport<Methods, Namespace>,
  namespace: Namespace,
  options?: UnwrapObservableOptions
): RPCClient<Methods> {
  const send = createNamespaceSendRequest(transport, namespace, options)
  return new RPCClient<Methods>({ send })
}
