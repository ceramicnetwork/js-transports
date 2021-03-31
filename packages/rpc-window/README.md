# window RPC

[RPC utilities](https://github.com/ceramicnetwork/js-rpc-utils#rpc-utils) using [browser windows](https://developer.mozilla.org/en-US/docs/Web/API/Window)

## Installation

```sh
npm install @ceramicnetwork/rpc-window
```

## Usage

### Server

```ts
import { createServer } from '@ceramicnetwork/rpc-window'

type Methods = {
  foo: { result: string }
}

const methods = { foo: () => 'bar' }
const server = createServer<Methods>('test', methods).subscribe()

// Stop server when done
server.unsubscribe()
```

### Client

```ts
import { createClient } from '@ceramicnetwork/rpc-window'

type Methods = {
  foo: { result: string }
}

// Client is in a frame and the server is listening on the parent window
const client = createClient<Methods>('test', window.parent)
await client.request('foo') // 'bar'
```

## Types

### ClientOptions

Uses `UnwrapObservableOptions` from `@ceramicnetwork/transport-subject` and `PostMessageTransportOptions` from `@ceramicnetwork/transport-postmessage`

```ts
type ClientOptions = UnwrapObservableOptions & PostMessageTransportOptions
```

### IncomingRequest

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest), `IncomingMessage` from `@ceramicnetwork/transport-postmessage` and `Wrapped` from `@ceramicnetwork/transport-subject`

```ts
type IncomingRequest<
  Methods extends RPCMethods,
  Namespace extends string = string
> = IncomingMessage<Wrapped<RPCRequest<Methods, keyof Methods>, Namespace>>
```

### ServerPayload

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), `HandledPayload` from `@ceramicnetwork/rpc-postmessage` and [`IncomingRequest`](#incomingrequest)

```ts
type ServerPayload<Methods extends RPCMethods, Namespace extends string> = HandledPayload<
  IncomingRequest<Methods, Namespace>,
  Methods,
  keyof Methods
>
```

## APIs

### createServer()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. `namespace: Namespace`
1. `methods: HandlerMethods<IncomingRequest<Methods, Namespace>, Methods>`
1. `target?: Window = window`

**Returns** [`Observable<ServerPayload<Methods, Namespace>>`](#serverpayload)

### createClient()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)
1. `Namespace extends string = string`

**Arguments**

1. `namespace: Namespace`
1. `target?: Window = window`
1. [`options?: ClientOptions`](#clientoptions)

**Returns** [`RPCClient<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#rpcclient-class)

## License

Apache-2.0 OR MIT
