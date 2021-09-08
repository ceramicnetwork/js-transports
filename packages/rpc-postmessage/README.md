# postMessage RPC

[RPC utilities](https://github.com/ceramicnetwork/js-rpc-utils#rpc-utils) using [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

## Installation

```sh
npm install @ceramicnetwork/rpc-postmessage
```

## Usage

```ts
import { createNamespaceClient, createNamespaceServer } from '@ceramicnetwork/rpc-postmessage'

type Methods = {
  foo: { result: string }
}

const server = createNamespaceServer<Methods>({
  target: window, // Listens to requests on window
  namespace: 'test',
  methods: { foo: () => 'bar' },
}).subscribe()

// Sends requests and receives responses on window
const transport = createPostMessageTransport(window, window, { postMessageArguments: ['*'] })

const client = createNamespaceClient(transport, 'test')
await client.request('foo') // 'bar'

// Stop server when done
server.unsubscribe()
```

## Types

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

### ServerOptions

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`HandlerMethods`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods) and [`HandlerOptions`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

```ts
type ServerOptions<Context, Methods extends RPCMethods> = HandlerOptions<Context, Methods> & {
  target: PostMessageTarget
  methods: HandlerMethods<Context, Methods>
}
```

### NamespaceServerOptions

```ts
type NamespaceServerOptions<
  Methods extends RPCMethods,
  Namespace extends string = string,
  Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
> = ServerOptions<Message, Methods> & {
  namespace: Namespace
  filter?: string | Array<string> | MessageFilter
}
```

### NamespaceClientTransport

```ts
type NamespaceClientTransport<
  Methods extends RPCMethods,
  Namespace extends string,
  Incoming = IncomingMessage<Wrapped<RPCResponse<Methods, keyof Methods>, Namespace>>,
  Outgoing = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>
> = TransportSubject<Incoming, Outgoing>
```

## APIs

### serve()

Receives requests and sends responses on the provided `target`

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`options: ServerOptions<null, Methods>`](#serveroptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

### createNamespaceRequestHandlerOperator()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`
1. `Message = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>`

**Arguments**

1. `methods: HandlerMethods<Message, Methods>`
1. `namespace: Namespace`
1. `options?: HandlerOptions<Message, Methods> = {}`

**Returns** `OperatorFunction<Message, HandledPayload<Message, Methods, keyof Methods>>`

### createNamespaceServer()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`
1. `Request = Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>`

**Arguments**

1. [`options: NamespaceServerOptions<Methods, Namespace, IncomingMessage<Request>>`](#namespaceserveroptions)

**Returns** `Observable<HandledPayload<IncomingMessage<Request>, Methods, keyof Methods>>`

### createNamespaceSendRequest()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. [`transport: NamespaceClientTransport<Methods, Namespace>`](#namespaceclienttransport)
1. `namespace: Namespace`
1. `options?: UnwrapObservableOptions`

**Returns** [`SendRequestFunc<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#sendrequestfunc)

### createNamespaceClient()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. [`transport: NamespaceClientTransport<Methods, Namespace>`](#namespaceclienttransport)
1. `namespace: Namespace`
1. `options?: UnwrapObservableOptions`

**Returns** [`RPCClient<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#rpcclient-class)

## License

Apache-2.0 OR MIT
