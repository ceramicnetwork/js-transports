import {
  createOriginFilter,
  createMessageObservable,
  createPostMessageObserver,
  createPostMessageTransport,
} from '../src'
import type { PostMessageTarget } from '../src'

describe('createOriginFilter', () => {
  test('with a single origin', () => {
    const filter = createOriginFilter('foo')
    expect(filter({ origin: 'foo' } as MessageEvent)).toBe(true)
    expect(filter({ origin: 'bar' } as MessageEvent)).toBe(false)
  })

  test('with multiple origins', () => {
    const filter = createOriginFilter(['foo', 'bar'])
    expect(filter({ origin: 'foo' } as MessageEvent)).toBe(true)
    expect(filter({ origin: 'bar' } as MessageEvent)).toBe(true)
    expect(filter({ origin: 'baz' } as MessageEvent)).toBe(false)
  })
})

describe('createMessageObservable', () => {
  test('with a single origin', () => {
    const source = createMessageObservable(
      {
        addEventListener(type: string, push: (event: any) => void) {
          if (type === 'message') {
            push({ origin: 'bar', data: 'one' })
            push({ origin: 'foo', data: 'two' })
          }
        },
        removeEventListener(_type: string, _listener: any) {
          // Only used to pass RxJS check
        },
      } as PostMessageTarget,
      'foo'
    )
    return new Promise<void>((resolve) => {
      source.subscribe((event) => {
        expect(event).toEqual({ origin: 'foo', data: 'two' })
        resolve()
      })
    })
  })

  test('with multiple origins', () => {
    const source = createMessageObservable(
      {
        addEventListener(type: string, push: (event: any) => void) {
          if (type === 'message') {
            push({ origin: 'bar', data: 'one' })
            push({ origin: 'baz', data: 'two' })
            push({ origin: 'foo', data: 'three' })
          }
        },
        removeEventListener(_type: string, _listener: any) {
          // Only used to pass RxJS check
        },
      } as PostMessageTarget,
      ['foo', 'bar']
    )
    return new Promise<void>((resolve) => {
      let gotFirst = false
      source.subscribe((event) => {
        if (gotFirst) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(event).toEqual({ origin: 'foo', data: 'three' })
          resolve()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(event).toEqual({ origin: 'bar', data: 'one' })
          gotFirst = true
        }
      })
    })
  })

  test('with a custom filter', () => {
    const source = createMessageObservable(
      {
        addEventListener(type: string, push: (event: any) => void) {
          if (type === 'message') {
            push({ origin: 'bar', data: 'one' })
            push({ origin: 'baz', data: 'two' })
            push({ origin: 'foo', data: 'three' })
          }
        },
        removeEventListener(_type: string, _listener: any) {
          // Only used to pass RxJS check
        },
      } as PostMessageTarget,
      (event: { origin: string; data: string }) => ['one', 'three'].includes(event.data)
    )
    return new Promise<void>((resolve) => {
      let gotFirst = false
      source.subscribe((event) => {
        if (gotFirst) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(event).toEqual({ origin: 'foo', data: 'three' })
          resolve()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(event).toEqual({ origin: 'bar', data: 'one' })
          gotFirst = true
        }
      })
    })
  })
})

describe('createPostMessageObserver', () => {
  test('with no extra argument', () => {
    const postMessage = jest.fn()
    const observer = createPostMessageObserver({ postMessage } as any)
    observer.next('foo')
    expect(postMessage).toBeCalledWith('foo')
    observer.next(null)
    observer.next('bar')
    expect(postMessage).toBeCalledTimes(2)
  })

  test('with extra arguments', () => {
    const postMessage = jest.fn()
    const observer = createPostMessageObserver({ postMessage } as any, 'one', 'two')
    observer.next('foo')
    expect(postMessage).toBeCalledWith('foo', 'one', 'two')
  })
})

describe('createPostMessageTransport', () => {
  test('same origin with worker', () => {
    const code = 'onmessage = e => postMessage(e.data + " test")'
    const worker = new Worker(URL.createObjectURL(new Blob([code])))
    const transport = createPostMessageTransport<string>(worker)

    return new Promise<void>((done) => {
      transport.subscribe((msg) => {
        expect(msg.data).toBe('hello test')
        done()
      })
      transport.next('hello')
    })
  })

  test('cross-origin with iframe', () => {
    const code = `
      onmessage = e => {
        window.parent.postMessage(e.data + " test", 'http://localhost');
      };
    `
    const iframe = document.createElement('iframe')
    iframe.src = 'about:blank'

    return new Promise<void>((done) => {
      iframe.onload = () => {
        // iframe.contentWindow will be available once loaded
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const target = iframe.contentWindow!
        // Inject code in iframe using script tag
        const s = target.document.createElement('script')
        s.innerHTML = code
        target.document.body.appendChild(s)

        // Listen on own window and send on iframe's window
        const transport = createPostMessageTransport<string>(window, target, {
          postMessageArguments: ['http://localhost'],
        })
        transport.subscribe((msg) => {
          expect(msg.data).toBe('hello test')
          done()
        })
        transport.next('hello')
      }
      document.body.appendChild(iframe)
    })
  })
})
