import { TransportSubject } from '@ceramicnetwork/transport-subject'

import { PostMessageTransport } from '../src'

describe('transport-postmessage', () => {
  test('is an instance of TransportSubject', () => {
    const subject = new PostMessageTransport(window, 'localhost')
    expect(subject).toBeInstanceOf(TransportSubject)
  })
})
