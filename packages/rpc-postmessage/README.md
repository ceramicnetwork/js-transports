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

const server = serveCrossOrigin<Methods>(window, {
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

### HandledMessage

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type HandledMessage<Methods extends RPCMethods> = {
  message: MessageEvent
  response: RPCResponse<Methods, keyof Methods> | null
}
```

### ServerOptions

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`HandlerMethods`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods) and [`HandlerOptions`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

```ts
type ServerOptions<Methods extends RPCMethods> = HandlerOptions<MessageEvent, Methods> & {
  methods: HandlerMethods<MessageEvent, Methods>
}
```

### ServeCrossOriginOptions

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`HandlerMethods`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods) and [`HandlerOptions`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

```ts
type ServeCrossOriginOptions<Methods extends RPCMethods> = HandlerOptions<MessageEvent, Methods> & {
  methods: HandlerMethods<MessageEvent, Methods>
  ownOrigin: string
  allowedOrigin?: string | Array<string>
}
```

## APIs

### serveCrossOrigin()

Receives requests and sends responses back to the received `message.source`, optionally filtering incoming requests `message.origin`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. `target: PostMessageTarget`
1. [`options: ServeCrossOriginOptions<Methods>`](#servecrossoriginoptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

### serveSameOrigin()

Receives requests and sends responses on the provided `target`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. `target: PostMessageTarget`
1. [`options: ServerOptions<null, Methods>`](#serveroptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

## License

Apache-2.0 OR MIT
