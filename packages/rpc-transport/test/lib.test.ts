import { TransportSubject } from '@ceramicnetwork/transport-subject'
import type { RPCRequest, RPCResponse } from 'rpc-utils'
import { Observable, Subject, Subscriber } from 'rxjs'

import { createClient, createClientClass, createSendRequest, serve } from '../src'

describe('rpc-transport', () => {
  test('createSendRequest', async () => {
    const expectedResponse = { jsonrpc: '2.0', id: 3, result: true }

    const source = new Observable((subscriber) => {
      subscriber.next({ jsonrpc: '2.0', id: 1 })
      subscriber.next({ jsonrpc: '2.0', id: 2 })
      subscriber.next(expectedResponse)
    })
    const transport = new TransportSubject<any, any>(source, new Subscriber())

    const send = createSendRequest(transport)
    await expect(
      send({ jsonrpc: '2.0', id: 3, method: 'test', params: undefined })
    ).resolves.toEqual(expectedResponse)
  })

  test('createClient and serve', async () => {
    type Methods = {
      foo: { result: string }
    }
    const methods = {
      foo: () => 'bar',
    }

    const requests = new Subject<RPCRequest<Methods, keyof Methods>>()
    const responses = new Subject<RPCResponse<Methods, keyof Methods>>()

    // Responses in / requests out for client transport
    const clientTransport = new TransportSubject(responses, requests)
    const client = createClient<Methods>(clientTransport)

    // Requests in / responses out for server transport
    const serverTransport = new TransportSubject(requests, responses)
    const server = serve<Record<string, any>, Methods>(serverTransport, {}, methods)

    await expect(client.request('foo')).resolves.toBe('bar')
    server.unsubscribe()
  })

  test('createClientClass', async () => {
    type Methods = {
      foo: { result: string }
    }
    const methods = {
      foo: () => 'bar',
    }

    const requests = new Subject<RPCRequest<Methods, keyof Methods>>()
    const responses = new Subject<RPCResponse<Methods, keyof Methods>>()
    const clientTransport = new TransportSubject(responses, requests)
    const serverTransport = new TransportSubject(requests, responses)
    const server = serve<Record<string, any>, Methods>(serverTransport, {}, methods)

    class TestClient extends createClientClass<Methods>(clientTransport) {
      async foo() {
        return await this.request('foo')
      }
    }
    const client = new TestClient()
    await expect(client.foo()).resolves.toBe('bar')

    server.unsubscribe()
  })
})
