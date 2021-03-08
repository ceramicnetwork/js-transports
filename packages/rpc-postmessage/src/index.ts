import { serve as serveTransport } from '@ceramicnetwork/rpc-transport'
import {
  PostMessageTransport,
  createMessageObservable,
} from '@ceramicnetwork/transport-postmessage'
import type { PostMessageTarget } from '@ceramicnetwork/transport-postmessage'
import { createHandler } from 'rpc-utils'
import type { HandlerMethods, HandlerOptions, RPCMethods, RPCRequest, RPCResponse } from 'rpc-utils'
import type { Observable, Subscription } from 'rxjs'
import { filter, mergeMap, tap } from 'rxjs/operators'

export type HandledMessage<Methods extends RPCMethods> = {
  message: MessageEvent
  response: RPCResponse<Methods, keyof Methods> | null
}

export type ServerOptions<Context, Methods extends RPCMethods> = HandlerOptions<
  Context,
  Methods
> & {
  methods: HandlerMethods<Context, Methods>
}

export type CrossOriginServerOptions<Methods extends RPCMethods> = ServerOptions<
  MessageEvent,
  Methods
> & {
  ownOrigin: string
}

export function createCrossOriginServer<Methods extends RPCMethods>(
  source: Observable<MessageEvent>,
  { methods, ownOrigin, ...options }: CrossOriginServerOptions<Methods>
): Observable<HandledMessage<Methods>> {
  const handleRequest = createHandler(methods, options)
  return source.pipe(
    mergeMap(
      async (message): Promise<HandledMessage<Methods>> => {
        return { message, response: await handleRequest(message, message.data) }
      }
    ),
    filter((handled) => handled.message.source != null && handled.response != null),
    tap((handled) => {
      ;(handled.message.source as Window).postMessage(handled.response, ownOrigin)
    })
  )
}

export type ServeCrossOriginOptions<Methods extends RPCMethods> = HandlerOptions<
  MessageEvent,
  Methods
> & {
  methods: HandlerMethods<MessageEvent, Methods>
  ownOrigin: string
  allowedOrigin?: string | Array<string>
}

export function serveCrossOrigin<Methods extends RPCMethods>(
  target: PostMessageTarget,
  { allowedOrigin, ...options }: ServeCrossOriginOptions<Methods>
): Subscription {
  const source = createMessageObservable(target, allowedOrigin)
  return createCrossOriginServer(source, options).subscribe()
}

export function serveSameOrigin<Methods extends RPCMethods>(
  target: PostMessageTarget,
  { methods, ...options }: ServerOptions<null, Methods>
): Subscription {
  const transport = new PostMessageTransport<
    RPCRequest<Methods, keyof Methods>,
    RPCResponse<Methods, keyof Methods>
  >(target)
  return serveTransport<null, Methods>(transport, null, methods, options)
}
