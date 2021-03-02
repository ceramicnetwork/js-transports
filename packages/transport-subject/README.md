# TransportSubject

## Installation

```sh
npm install @ceramicnetwork/transport-subject
```

## Usage

```ts
import { TransportSubject } from '@ceramicnetwork/transport-subject'
import { Subscriber, interval } from 'rxjs'
import { map } from 'rxjs'

type Message = { type: string }

class MyTransport extends TransportSubject<Message> {
  constructor(time = 1000) {
    const source = interval(time).map(() => ({ type: 'ping' }))
    const sink = new Subscriber((message) => {
      console.log('send message', message)
    })
    super(source, sink)
  }
}

const transport = new MyTransport()
transport.subscribe((message) => {
  console.log('received message', message)
})
transport.next({ type: 'pong' })
```

## License

Apache-2.0 OR MIT
