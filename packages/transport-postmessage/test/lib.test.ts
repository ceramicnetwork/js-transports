import { PostMessageTransport } from '../src'

describe('transport-postmessage', () => {
  test('same origin with worker', () => {
    const code = 'onmessage = e => postMessage(e.data + " test")'
    const worker = new Worker(URL.createObjectURL(new Blob([code])))
    const transport = new PostMessageTransport<string>(worker)

    return new Promise<void>((done) => {
      transport.subscribe((msg) => {
        expect(msg).toBe('hello test')
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
        const target = iframe.contentWindow!
        // Inject code in iframe using script tag
        const s = target.document.createElement('script')
        s.innerHTML = code
        target.document.body.appendChild(s)

        // Listen on own window and send on iframe's window
        const transport = new PostMessageTransport<string>(window, target, {
          allowedOrigin: '', // Origin of the iframe messages with JSDOM
          postMessageArguments: ['http://localhost'],
        })
        transport.subscribe((msg) => {
          expect(msg).toBe('hello test')
          done()
        })
        transport.next('hello')
      }
      document.body.appendChild(iframe)
    })
  })
})
