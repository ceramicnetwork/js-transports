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

### ErrorPayload

```ts
type ErrorPayload<Message, Error = any> = {
  type: 'error'
  message: Message
  error: Error
}
```

### RequestPayload

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods) and [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest)

```ts
type RequestPayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'request'
  message: Message
  request: RPCRequest<Methods, K>
}
```

### HandledPayload

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type HandledPayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'handled'
  message: Message
  request: RPCRequest<Methods, K>
  response: RPCResponse<Methods, K> | null
}
```

### ResponsePayload

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type ResponsePayload<Message, Methods extends RPCMethods, K extends keyof Methods> = {
  type: 'response'
  message: Message
  request: RPCRequest<Methods, K>
  response: RPCResponse<Methods, K>
}
```

### OutPayload

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type OutPayload<Message, Methods extends RPCMethods, K extends keyof Methods, Error = any> =
  | ErrorPayload<Message, Error>
  | HandledPayload<Message, Methods, K>
  | ResponsePayload<Message, Methods, K>
```

### ServerOptions

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`HandlerMethods`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods) and [`HandlerOptions`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

```ts
type type ServerOptions<Context, Methods extends RPCMethods> = HandlerOptions<
  Context,
  Methods
> & {
  target: PostMessageTarget
  methods: HandlerMethods<Context, Methods>
}
```

### CrossOriginServerOptions

```ts
export type CrossOriginServerOptions<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
> = ServerOptions<Message, Methods> & {
  namespace: Namespace
  filter?: string | Array<string> | MessageFilter
  sendResponse?: (payload: ResponsePayload<Message, Methods, keyof Methods>) => void
}
```

### WrappedClientTransport

```ts
type WrappedClientTransport<
  Methods extends RPCMethods,
  Namespace extends string,
  Incoming = IncomingMessage<Wrapped<RPCResponse<Methods, keyof Methods>, Namespace>>,
  Outgoing = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
> = TransportSubject<Incoming, Outgoing>
```

## APIs

### serveSameOrigin()

Receives requests and sends responses on the provided `target`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`options: ServerOptions<null, Methods>`](#serveroptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

### createCrossOriginRequestHandlerOperator()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`
1. `Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>`

**Arguments**

1. `methods: HandlerMethods<Message, Methods>`
1. `namespace: Namespace`
1. `options?: HandlerOptions<Message, Methods> = {}`

**Returns** `OperatorFunction<Message, OutPayload<Message, Methods, keyof Methods>>`

### createCrossOriginServer()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`
1. `Request = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>`

**Arguments**

1. [`options: CrossOriginServerOptions<Methods, Namespace, IncomingMessage<Request>>`](#crossoriginserveroptions)

**Returns** `Observable<OutPayload<IncomingMessage<Request>, Methods, keyof Methods>>`

### createCrossOriginSendRequest()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. [`transport: WrappedClientTransport<Methods, Namespace>`](#wrappedclienttransport)
1. `namespace: Namespace`
1. `options?: UnwrapObservableOptions`

**Returns** [`SendRequestFunc<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#sendrequestfunc)

### createCrossOriginClient()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. [`transport: WrappedClientTransport<Methods, Namespace>`](#wrappedclienttransport)
1. `namespace: Namespace`
1. `options?: UnwrapObservableOptions`

**Returns** [`RPCClient<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#rpcclient-class)

## License

Apache-2.0 OR MIT
