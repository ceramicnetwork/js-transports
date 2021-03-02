import { TransportSubject } from '@ceramicnetwork/transport-subject'
import type { RPCMethods, RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils'
import { first } from 'rxjs/operators'

export function createSendRequest<Methods extends RPCMethods>(
  transport: TransportSubject<
    RPCResponse<Methods, keyof Methods>,
    RPCRequest<Methods, keyof Methods>
  >
): SendRequestFunc<Methods> {
  return async function send<K extends keyof Methods>(
    req: RPCRequest<Methods, K>
  ): Promise<RPCResponse<Methods, K>> {
    transport.next(req)
    return await transport.pipe(first((res) => res.id === req.id)).toPromise()
  }
}
