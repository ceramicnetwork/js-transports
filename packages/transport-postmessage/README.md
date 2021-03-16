# postMessage transport

Transport using [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

## Installation

```sh
npm install @ceramicnetwork/transport-postmessage
```

## Usage

### Same origin with a Web Worker

```ts
import { createPostMessageTransport } from '@ceramicnetwork/transport-postmessage'

const worker = new Worker('worker.js')
const transport = createPostMessageTransport<string>(worker)

transport.subscribe((msg) => {
  console.log(msg)
})
transport.next('test')
```

### Cross-origin between Window and frame

```ts
import { createPostMessageTransport } from '@ceramicnetwork/transport-postmessage'

const iframe = document.getElementById('iframe')
const transport = createPostMessageTransport<string>(window, iframe, {
  filter: 'http://iframe.localhost', // Origin of the iframe messages are received from
  postMessageArguments: ['http://window.localhost'], // Origin of the window sending messages
})

transport.subscribe((msg) => {
  console.log(msg)
})
transport.next('test')
```

## Types and interfaces

### PostMessageEventMap

```ts
interface PostMessageEventMap {
  message: MessageEvent
  messageerror: MessageEvent
}
```

### PostMessageTarget

```ts
interface PostMessageTarget extends EventTarget {
  onmessage: ((this: any, ev: MessageEvent) => any) | null
  onmessageerror: ((this: any, ev: MessageEvent) => any) | null
  postMessage(...args: Array<any>): void
  addEventListener<K extends keyof PostMessageEventMap>(
    type: K,
    listener: (this: any, ev: PostMessageEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof PostMessageEventMap>(
    type: K,
    listener: (this: any, ev: PostMessageEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void
}
```

### MessageFilter

```ts
type MessageFilter = (event: MessageEvent) => boolean
```

### IncomingMessage

```ts
interface IncomingMessage<Data = any> extends MessageEvent {
  readonly data: Data
}
```

### PostMessageTransportOptions

```ts
type PostMessageTransportOptions = {
  filter?: string | Array<string> | MessageFilter
  postMessageArguments?: Array<any>
}
```

## API

### createOriginFilter()

**Type parameters**

1. `Event extends MessageEvent`

**Arguments**

1. `allowedOrigin: string | Array<string>`

**Returns** `(event: Event) => boolean`

### createMessageObservable()

**Type parameters**

1. `MessageData = any`

**Arguments**

1. [`target: PostMessageTarget`](#postmessagetarget)
1. `originOrFilter?: string | Array<string> | MessageFilter`

**Returns** [`Observable<IncomingMessage<Data>>`](https://rxjs.dev/api/index/class/Observable)

### createPostMessageObserver()

**Type parameters**

1. `MessageData = any`

**Arguments**

1. [`target: PostMessageTarget`](#postmessagetarget)
1. `...args: Array<any>`

**Returns** [`Observer<MessageData>`](https://rxjs.dev/api/index/interface/Observer)

### createPostMessageTransport

Combines [`createMessageObservable()`](#createmessageobservable) and [`createPostMessageObserver()`](#createpostmessageobserver) in a `TransportSubject`

**Type parameters**

1. `MsgIn`: the type of the messages coming in from the `from` target
1. `MsgOut = MsgIn`: the type of the messages going out to the `to` target

**Arguments**

1. [`from: PostMessageTarget`](#postmessagetarget)
1. [`to: PostMessageTarget = from`](#postmessagetarget)
1. [`options?: PostMessageTransportOptions = {}`](#postmessagetransportoptions)

**Returns** `TransportSubject<IncomingMessage<MsgIn>, MsgOut>`

## License

Apache-2.0 OR MIT
