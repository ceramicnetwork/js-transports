import { TransportSubject } from '@ceramicnetwork/transport-subject'
import type { Wrapped } from '@ceramicnetwork/transport-subject'
import { createPostMessageTransport } from '@ceramicnetwork/transport-postmessage'
import type { IncomingMessage, PostMessageTarget } from '@ceramicnetwork/transport-postmessage'
import { jest } from '@jest/globals'
import type { RPCRequest, RPCResponse } from 'rpc-utils'
import { Subject } from 'rxjs'

import { createNamespaceClient, createNamespaceServer, serve } from '../src'

type Listener = (event: unknown) => void

describe('direct RPC', () => {
  test('serve', () => {
    type Methods = {
      foo: { result: string }
    }

    return new Promise<void>((done) => {
      const listeners: Array<Listener> = []

      const foo = jest.fn(() => 'bar')
      const server = serve<Methods>({
        target: {
          addEventListener: jest.fn((type, listener: Listener) => {
            expect(type).toBe('message')
            listeners.push(listener)
          }),
          removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
          postMessage: jest.fn((msg) => {
            expect(msg).toEqual({ jsonrpc: '2.0', id: 1, result: 'bar' })
            server.unsubscribe()
            done()
          }),
        } as unknown as PostMessageTarget,
        methods: { foo },
      })

      const message = {
        data: { jsonrpc: '2.0', method: 'foo', id: 1 },
      }

      expect(listeners).toHaveLength(1)
      for (const emit of listeners) {
        emit(message)
      }
    })
  })
})

describe('namespace RPC', () => {
  test('createNamespaceClient', async () => {
    type Methods = {
      foo: { result: boolean | string }
    }
    type MsgReq = Wrapped<RPCRequest<Methods, keyof Methods>>
    type MsgRes = IncomingMessage<Wrapped<RPCResponse<Methods, keyof Methods>>>

    const onInvalidInput = jest.fn()
    const source = new Subject<MsgRes>()

    const send = jest.fn((req: MsgReq) => {
      expect(req).toEqual({
        __tw: true,
        ns: 'foo',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        msg: { jsonrpc: '2.0', id: expect.any(String), method: 'foo', params: undefined },
      })

      source.next({
        data: { __tw: true, ns: 'test', msg: { jsonrpc: '2.0', id: 1, result: 'foo' } },
      } as unknown as MsgRes)
      // @ts-expect-error empty object
      source.next({})
      source.next({
        data: { __tw: true, ns: 'foo', msg: { jsonrpc: '2.0', id: req.msg.id, result: true } },
      } as unknown as MsgRes)
    })

    const transport = new TransportSubject(source, { next: send })
    const client = createNamespaceClient(transport, 'foo', { onInvalidInput })

    await expect(client.request('foo')).resolves.toBe(true)
    expect(send).toBeCalled()
    expect(onInvalidInput).toBeCalledTimes(2)
  })

  describe('createNamespaceServer', () => {
    test('with origin filter', () => {
      const listeners: Array<Listener> = []
      const target = {
        addEventListener: jest.fn((type, listener: Listener) => {
          expect(type).toBe('message')
          listeners.push(listener)
        }),
        removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
      } as unknown as PostMessageTarget

      type Methods = {
        foo: { result: string }
      }
      const foo = jest.fn(() => 'bar')
      const server = createNamespaceServer<Methods>({
        target,
        filter: 'http://test',
        methods: { foo },
        namespace: 'test',
      }).subscribe()

      return new Promise<void>((done) => {
        const postMessage = jest.fn((msg) => {
          expect(msg).toEqual({
            __tw: true,
            ns: 'test',
            msg: { jsonrpc: '2.0', id: 1, result: 'bar' },
          })
          server.unsubscribe()
          done()
        })
        const message = {
          origin: 'http://test',
          data: { __tw: true, ns: 'test', msg: { jsonrpc: '2.0', method: 'foo', id: 1 } },
          source: { postMessage },
        }

        expect(listeners).toHaveLength(1)
        for (const emit of listeners) {
          emit(message)
        }
      })
    })

    test('with no filter', () => {
      const listeners: Array<Listener> = []
      const target = {
        addEventListener: jest.fn((type, listener: Listener) => {
          expect(type).toBe('message')
          listeners.push(listener)
        }),
        removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
      } as unknown as PostMessageTarget

      type Methods = {
        foo: { result: string }
      }
      const foo = jest.fn(() => 'bar')
      const server = createNamespaceServer<Methods>({
        target,
        methods: { foo },
        namespace: 'test',
      }).subscribe()

      return new Promise<void>((done) => {
        const postMessage = jest.fn((msg) => {
          expect(msg).toEqual({
            __tw: true,
            ns: 'test',
            msg: { jsonrpc: '2.0', id: 1, result: 'bar' },
          })
          server.unsubscribe()
          done()
        })
        const message = {
          origin: 'http://test',
          data: { __tw: true, ns: 'test', msg: { jsonrpc: '2.0', method: 'foo', id: 1 } },
          source: { postMessage },
        }

        expect(listeners).toHaveLength(1)
        for (const emit of listeners) {
          emit(message)
        }
      })
    })
  })

  test('client and server using same target', async () => {
    type Methods = {
      foo: { result: string }
    }
    const foo = jest.fn(() => 'bar')

    const server = createNamespaceServer<Methods>({
      target: window,
      methods: { foo },
      namespace: 'test',
    }).subscribe()

    const transport = createPostMessageTransport<
      Wrapped<RPCResponse<Methods, keyof Methods>>,
      Wrapped<RPCRequest<Methods, keyof Methods>>
    >(window, window, { postMessageArguments: ['*'] })
    const client = createNamespaceClient(transport, 'test')

    await expect(client.request('foo')).resolves.toBe('bar')
    server.unsubscribe()
  })
})
