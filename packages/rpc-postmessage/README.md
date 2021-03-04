# postMessage RPC

[RPC utilities](https://github.com/ceramicnetwork/js-rpc-utils#rpc-utils) using [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

## Installation

```sh
npm install @ceramicnetwork/rpc-postmessage
```

## Usage

```ts
import { serveCrossOrigin } from '@ceramicnetwork/rpc-postmessage'

type Methods = {
  foo: { result: string }
}

const server = serveCrossOrigin<Methods>({
  target: window, // EventTarget receiving message events
  allowedOrigin: ['https://foo.bar', 'http://localhost'], // Allow messages from these origins
  ownOrigin: 'http://localhost', // Server messages will be sent using this origin
  methods: {
    foo: () => 'bar',
  },
})

// Stop server when done
server.unsubscribe()
```

## Types

### ServeCrossOriginOptions

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`HandlerMethods`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods) and [`HandlerOptions`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

```ts
type ServeCrossOriginOptions<Methods extends RPCMethods> = HandlerOptions<MessageEvent, Methods> & {
  target: PostMessageTarget
  methods: HandlerMethods<MessageEvent, Methods>
  allowedOrigin: string | Array<string>
  ownOrigin: string
}
```

## APIs

### serve()

Receives requests and sends responses to the same `target`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. `target: PostMessageTarget`
1. [`methods: HandlerMethods<null, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods)
1. [`options?: HandlerOptions<null, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

### serveCrossOrigin()

Receives requests on the provided `target` and sends responses back to the received `message.source`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`options: ServeCrossOriginOptions<Methods>`](#servercrossoriginoptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

## License

Apache-2.0 OR MIT
