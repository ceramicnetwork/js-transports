import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { Observable, Subscriber } from 'rxjs'

import { createSendRequest } from '../src'

describe('rpc-transport', () => {
  test('createSendRequest', async () => {
    const expectedResponse = { jsonrpc: '2.0', id: 3, result: true }

    const source = new Observable((subscriber) => {
      subscriber.next({ jsonrpc: '2.0', id: 1 })
      subscriber.next({ jsonrpc: '2.0', id: 2 })
      subscriber.next(expectedResponse)
    })
    const subject = new TransportSubject<any, any>(source, new Subscriber())

    const send = createSendRequest(subject)
    await expect(
      send({ jsonrpc: '2.0', id: 3, method: 'test', params: undefined })
    ).resolves.toEqual(expectedResponse)
  })
})
