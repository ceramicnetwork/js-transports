import { serve as serveTransport } from '@ceramicnetwork/rpc-transport'
import { PostMessageTransport, createOriginFilter } from '@ceramicnetwork/transport-postmessage'
import type { PostMessageTarget } from '@ceramicnetwork/transport-postmessage'
import { createHandler } from 'rpc-utils'
import type { HandlerMethods, HandlerOptions, RPCMethods, RPCRequest, RPCResponse } from 'rpc-utils'
import { fromEvent } from 'rxjs'
import type { Subscription } from 'rxjs'
import { filter, mergeMap, tap } from 'rxjs/operators'

export function serve<Methods extends RPCMethods>(
  target: PostMessageTarget,
  methods: HandlerMethods<null, Methods>,
  options?: HandlerOptions<null, Methods>
): Subscription {
  const transport = new PostMessageTransport<
    RPCRequest<Methods, keyof Methods>,
    RPCResponse<Methods, keyof Methods>
  >(target)
  return serveTransport<null, Methods>(transport, null, methods, options)
}

export type HandledMessage<Methods extends RPCMethods> = {
  message: MessageEvent
  response: RPCResponse<Methods, keyof Methods> | null
}

export type ServeCrossOriginOptions<Methods extends RPCMethods> = HandlerOptions<
  MessageEvent,
  Methods
> & {
  target: PostMessageTarget
  methods: HandlerMethods<MessageEvent, Methods>
  allowedOrigin: string | Array<string>
  ownOrigin: string
}

export function serveCrossOrigin<Methods extends RPCMethods>({
  target,
  methods,
  allowedOrigin,
  ownOrigin,
  ...options
}: ServeCrossOriginOptions<Methods>): Subscription {
  const handleRequest = createHandler(methods, options)

  return fromEvent<MessageEvent>(target, 'message')
    .pipe(
      filter(createOriginFilter(allowedOrigin)),
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
    .subscribe()
}
