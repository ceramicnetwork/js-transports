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

export function serveSameOrigin<Methods extends RPCMethods>({
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

export type ErrorPayload<Message, Error = any> = {
  type: 'error'
  message: Message
  error: Error
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
export type ResponsePayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'response'
  message: Message
  request: RPCRequest<Methods, K>
  response: RPCResponse<Methods, K>
}
export type OutPayload<Message, Methods extends RPCMethods, K extends keyof Methods, Error = any> =
  | ErrorPayload<Message, Error>
  | HandledPayload<Message, Methods, K>
  | ResponsePayload<Message, Methods, K>

export function createCrossOriginRequestHandlerOperator<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
>(
  methods: HandlerMethods<Message, Methods>,
  namespace: Namespace,
  options: HandlerOptions<Message, Methods> = {}
): OperatorFunction<Message, OutPayload<Message, Methods, keyof Methods>> {
  const handleRequest = createHandler<Message, Methods>(methods, options)
  const unwrap = createUnwrap<RPCRequest<Methods, keyof Methods>>(namespace)

  return pipe(
    map((message) => {
      try {
        return {
          type: 'request',
          message,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          request: unwrap((message as any).data), // TS error: semantic error TS2339: Property 'data' does not exist on type 'Message'
        } as RequestPayload<Message, Methods, keyof Methods>
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { type: 'error', message, error } as ErrorPayload<Message>
      }
    }),
    mergeMap(async (payload) => {
      if (payload.type === 'error') {
        return payload
      }

      const response = await handleRequest(payload.message, payload.request)
      return response == null
        ? ({
            type: 'handled',
            message: payload.message,
            request: payload.request,
            response,
          } as HandledPayload<Message, Methods, keyof Methods>)
        : ({
            type: 'response',
            message: payload.message,
            request: payload.request,
            response,
          } as ResponsePayload<Message, Methods, keyof Methods>)
    })
  )
}

export type CrossOriginServerOptions<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
> = ServerOptions<Message, Methods> & {
  namespace: Namespace
  filter?: string | Array<string> | MessageFilter
  sendResponse?: (payload: ResponsePayload<Message, Methods, keyof Methods>) => void
}

export function createCrossOriginServer<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Request = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
>({
  filter: messageFilter,
  methods,
  namespace,
  target,
  ...options
}: CrossOriginServerOptions<Methods, Namespace, IncomingMessage<Request>>): Observable<
  OutPayload<IncomingMessage<Request>, Methods, keyof Methods>
> {
  const wrap = createWrap<RPCResponse<Methods, keyof Methods>>(namespace)

  return createMessageObservable<Request>(target, messageFilter).pipe(
    createCrossOriginRequestHandlerOperator<Methods, Namespace, IncomingMessage<Request>>(
      methods,
      namespace,
      options
    ),
    tap((payload) => {
      if (payload.type === 'response') {
        const source = payload.message.source as Window
        source.postMessage(wrap(payload.response), payload.message.origin)
      }
    })
  )
}

export type WrappedClientTransport<
  Methods extends RPCMethods,
  Namespace extends string,
  Incoming = IncomingMessage<Wrapped<RPCResponse<Methods, keyof Methods>, Namespace>>,
  Outgoing = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
> = TransportSubject<Incoming, Outgoing>

export function createSendRequest<Methods extends RPCMethods, Namespace extends string = string>(
  transport: WrappedClientTransport<Methods, Namespace>,
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
    const res = transport
      .pipe(
        map((message) => message.data),
        unwrap,
        first((res) => res.id === req.id)
      )
      .toPromise()
    observer.next(req)
    return await res
  }
}

export function createCrossOriginClient<
  Methods extends RPCMethods,
  Namespace extends string = string
>(
  transport: WrappedClientTransport<Methods, Namespace>,
  namespace: Namespace,
  options?: UnwrapObservableOptions
): RPCClient<Methods> {
  const send = createSendRequest(transport, namespace, options)
  return new RPCClient<Methods>({ send })
}
