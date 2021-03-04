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
import type { Subscription } from 'rxjs'
import { filter, first, mergeMap } from 'rxjs/operators'

// Requests out / responses in
export type RPCClientTransport<Methods extends RPCMethods> = TransportSubject<
  RPCResponse<Methods, keyof Methods>,
  RPCRequest<Methods, keyof Methods>
>

// Requests in / responses out
export type RPCServerTransport<Methods extends RPCMethods> = TransportSubject<
  RPCRequest<Methods, keyof Methods>,
  RPCResponse<Methods, keyof Methods>
>

export function serve<Context, Methods extends RPCMethods>(
  transport: RPCServerTransport<Methods>,
  context: Context,
  methods: HandlerMethods<Context, Methods>,
  options?: HandlerOptions<Context, Methods>
): Subscription {
  const handleRequest = createHandler(methods, options)

  return transport
    .pipe(
      mergeMap(async (req) => await handleRequest(context, req)),
      filter((res): res is RPCResponse<Methods, keyof Methods> => res != null)
    )
    .subscribe(transport)
}

export function createSendRequest<Methods extends RPCMethods>(
  transport: RPCClientTransport<Methods>
): SendRequestFunc<Methods> {
  return async function send<K extends keyof Methods>(
    req: RPCRequest<Methods, K>
  ): Promise<RPCResponse<Methods, K>> {
    transport.next(req)
    return await transport.pipe(first((res) => res.id === req.id)).toPromise()
  }
}

export function createClientClass<Methods extends RPCMethods>(
  transport: RPCClientTransport<Methods>
): new () => RPCClient<Methods> {
  const send = createSendRequest(transport)
  return class extends RPCClient<Methods> {
    constructor() {
      super({ send })
    }
  }
}

export function createClient<Methods extends RPCMethods>(
  transport: RPCClientTransport<Methods>
): RPCClient<Methods> {
  const send = createSendRequest(transport)
  return new RPCClient<Methods>({ send })
}
