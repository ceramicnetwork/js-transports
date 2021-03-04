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

## API

### TransportSubject class

Extends [RxJS Subject class](https://rxjs.dev/api/index/class/Subject)

**Type parameters**

1. `MsgIn`: the type of the messages coming in from the `source`
1. `MsgOut = MsgIn`: the type of the messages going out to the `sink`

#### new TransportSubject()

**Arguments**

1. [`source: Observable<MsgIn>`](https://rxjs.dev/api/index/class/Observable)
1. [`sink: Observer<MsgOut>`](https://rxjs.dev/api/index/interface/Observer)

#### .next()

**Arguments**

1. `message: MsgOut`

**Returns** `void`

## License

Apache-2.0 OR MIT
