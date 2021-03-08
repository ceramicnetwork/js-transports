import type { PostMessageTarget } from '@ceramicnetwork/transport-postmessage'

import { serveCrossOrigin, serveSameOrigin } from '../src'

describe('rpc-postmessage', () => {
  test('serveCrossOrigin with allowedOrigin', () => {
    const listeners: Array<(event: any) => void> = []
    const targetServer = ({
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
    const server = serveCrossOrigin<Methods>(targetServer, {
      allowedOrigin: 'http://test',
      ownOrigin: 'http://localhost',
      methods: { foo },
    })

    return new Promise<void>((done) => {
      const postMessage = jest.fn((msg) => {
        expect(msg).toEqual({ jsonrpc: '2.0', id: 1, result: 'bar' })
        server.unsubscribe()
        done()
      })
      const message = {
        origin: 'http://test',
        data: { jsonrpc: '2.0', method: 'foo', id: 1 },
        source: { postMessage },
      }

      expect(listeners).toHaveLength(1)
      for (const emit of listeners) {
        emit(message)
      }
    })
  })

  test('serveCrossOrigin without allowedOrigin', () => {
    const listeners: Array<(event: any) => void> = []
    const targetServer = ({
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
    const server = serveCrossOrigin<Methods>(targetServer, {
      ownOrigin: 'http://localhost',
      methods: { foo },
    })

    return new Promise<void>((done) => {
      const postMessage = jest.fn((msg) => {
        expect(msg).toEqual({ jsonrpc: '2.0', id: 1, result: 'bar' })
        server.unsubscribe()
        done()
      })
      const message = {
        origin: 'http://test',
        data: { jsonrpc: '2.0', method: 'foo', id: 1 },
        source: { postMessage },
      }

      expect(listeners).toHaveLength(1)
      for (const emit of listeners) {
        emit(message)
      }
    })
  })

  test('serveSameOrigin', () => {
    type Methods = {
      foo: { result: string }
    }

    return new Promise<void>((done) => {
      const listeners: Array<(event: any) => void> = []

      const foo = jest.fn(() => 'bar')
      const server = serveSameOrigin<Methods>(
        ({
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
        { methods: { foo } }
      )

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
