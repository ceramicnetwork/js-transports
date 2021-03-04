import type { PostMessageTarget } from '@ceramicnetwork/transport-postmessage'

import { serveCrossOrigin } from '../src'

describe('rpc-postmessage', () => {
  test.todo('serve in worker')

  test('serveCrossOrigin', () => {
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
    const server = serveCrossOrigin<Methods>({
      target: targetServer,
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
})
