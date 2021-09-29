/**
 * ```sh
 * npm install @ceramicnetwork/rpc-transport
 * ```
 *
 * @module rpc-transport
 */

import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { RPCClient, createHandler } from 'rpc-utils'
import type {
  HandlerMethods,
  HandlerOptions,
  RPCMethods,
  RPCRequest,
  RPCResponse,
  SendRequestFunc,
} from 'rpc-utils'
import { firstValueFrom, pipe } from 'rxjs'
import type { OperatorFunction, Subscription } from 'rxjs'
import { filter, first, mergeMap } from 'rxjs/operators'

// Client = requests out / responses in
export type RPCClientTransport<
  Methods extends RPCMethods,
  Incoming = RPCResponse<Methods, keyof Methods>,
  Outgoing = RPCRequest<Methods, keyof Methods>
> = TransportSubject<Incoming, Outgoing>

// Server = requests in / responses out
export type RPCServerTransport<
  Methods extends RPCMethods,
  Incoming = RPCRequest<Methods, keyof Methods>,
  Outgoing = RPCResponse<Methods, keyof Methods>
> = TransportSubject<Incoming, Outgoing>

export function createSendRequest<Methods extends RPCMethods>(
  transport: RPCClientTransport<Methods>
): SendRequestFunc<Methods> {
  return async function send<K extends keyof Methods>(
    req: RPCRequest<Methods, K>
  ): Promise<RPCResponse<Methods, K>> {
    const res = transport.pipe(first((res) => res.id === req.id))
    transport.next(req)
    return await firstValueFrom(res)
  }
}

export function createClient<Methods extends RPCMethods>(
  transport: RPCClientTransport<Methods>
): RPCClient<Methods> {
  const send = createSendRequest(transport)
  return new RPCClient<Methods>({ send })
}

export function createHandlerOperator<Context, Methods extends RPCMethods>(
  context: Context,
  methods: HandlerMethods<Context, Methods>,
  options?: HandlerOptions<Context, Methods>
): OperatorFunction<
  RPCRequest<Methods, keyof Methods>,
  RPCResponse<Methods, keyof Methods> | null
> {
  const handleRequest = createHandler(methods, options)
  return pipe(mergeMap(async (req) => await handleRequest(context, req)))
}

export function serve<Context, Methods extends RPCMethods>(
  transport: RPCServerTransport<Methods>,
  context: Context,
  methods: HandlerMethods<Context, Methods>,
  options?: HandlerOptions<Context, Methods>
): Subscription {
  return transport
    .pipe(
      createHandlerOperator(context, methods, options),
      filter((res): res is RPCResponse<Methods, keyof Methods> => res != null)
    )
    .subscribe(transport)
}
