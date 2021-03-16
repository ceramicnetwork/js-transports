import { TransportSubject } from '@ceramicnetwork/transport-subject'
import type { PostMessageTarget } from '@ceramicnetwork/transport-postmessage'
import { Subject, Subscriber } from 'rxjs'

import { createCrossOriginClient, createCrossOriginServer, serveSameOrigin } from '../src'

describe('cross-origin', () => {
  describe('createCrossOriginClient', () => {
    test('handles namespace', async () => {
      const onInvalidInput = jest.fn()
      const source = new Subject()

      const send = jest.fn((req) => {
        expect(req).toEqual({
          __tw: true,
          ns: 'foo',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          msg: { jsonrpc: '2.0', id: expect.any(String), method: 'foo', params: undefined },
        })

        source.next({
          data: { __tw: true, ns: 'test', msg: { jsonrpc: '2.0', id: 1, result: 'foo' } },
        })
        source.next({})
        source.next({
          // eslint-disable-next-line
          data: { __tw: true, ns: 'foo', msg: { jsonrpc: '2.0', id: req.msg.id, result: true } },
        })
      })
      const sink = new Subscriber(send)

      const transport = new TransportSubject(source, sink)
      const client = createCrossOriginClient(transport as any, 'foo', { onInvalidInput })

      await expect(client.request('foo')).resolves.toBe(true)
      expect(send).toBeCalled()
      expect(onInvalidInput).toBeCalledTimes(2)
    })
  })

  describe('createCrossOriginServer', () => {
    test('with origin filter', () => {
      const listeners: Array<(event: any) => void> = []
      const target = ({
        addEventListener: jest.fn((type, listener) => {
          expect(type).toBe('message')
          listeners.push(listener)
        }),
        removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
      } as unknown) as PostMessageTarget

      type Methods = {
        foo: { result: string }
      }
      const foo = jest.fn(() => 'bar')
      const server = createCrossOriginServer<Methods>({
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
      const listeners: Array<(event: any) => void> = []
      const target = ({
        addEventListener: jest.fn((type, listener) => {
          expect(type).toBe('message')
          listeners.push(listener)
        }),
        removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
      } as unknown) as PostMessageTarget

      type Methods = {
        foo: { result: string }
      }
      const foo = jest.fn(() => 'bar')
      const server = createCrossOriginServer<Methods>({
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
})

describe('same origin', () => {
  test('serveSameOrigin', () => {
    type Methods = {
      foo: { result: string }
    }

    return new Promise<void>((done) => {
      const listeners: Array<(event: any) => void> = []

      const foo = jest.fn(() => 'bar')
      const server = serveSameOrigin<Methods>({
        target: ({
          addEventListener: jest.fn((type, listener) => {
            expect(type).toBe('message')
            listeners.push(listener)
          }),
          removeEventListener: jest.fn(), // Need to be here for RxJS fromEvent detection
          postMessage: jest.fn((msg) => {
            expect(msg).toEqual({ jsonrpc: '2.0', id: 1, result: 'bar' })
            server.unsubscribe()
            done()
          }),
        } as unknown) as PostMessageTarget,
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
