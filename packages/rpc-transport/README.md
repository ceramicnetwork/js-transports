# RPC transport

Bridge between transports and [RPC utilities](https://github.com/ceramicnetwork/js-rpc-utils#rpc-utils)

## Installation

```sh
npm install @ceramicnetwork/rpc-transport
```

## Usage

```ts
import { createClient, serve } from '@ceramicnetwork/rpc-transport'

// Methods type shared between the client and server
type Methods = {
  foo: { result: string }
}

// Using requests and responses subjects here or demonstration purposes only
const requests = new Subject<RPCRequest<Methods, keyof Methods>>()
const responses = new Subject<RPCResponse<Methods, keyof Methods>>()
const clientTransport = new TransportSubject(responses, requests)
const serverTransport = new TransportSubject(requests, responses)

// Start server handling methods on given transport
const server = serve<null, Methods>(serverTransport, null, {
  foo: () => 'bar',
})

class TestClient {
  constructor(transport: TransportSubject) {
    this.client = createClient<Methods>(transport)
  }

  async foo() {
    return await this.client.request('foo')
  }
}

const client = new TestClient()
await client.foo() // 'bar'

// Stop server when done
server.unsubscribe()
```

## Types

### RPCClientTransport

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type RPCClientTransport<Methods extends RPCMethods> = TransportSubject<
  RPCResponse<Methods, keyof Methods>,
  RPCRequest<Methods, keyof Methods>
>
```

### RPCServerTransport

Uses [`RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods), [`RPCRequest`](https://github.com/ceramicnetwork/js-rpc-utils#rpcrequest) and [`RPCResponse`](https://github.com/ceramicnetwork/js-rpc-utils#rpcresponse)

```ts
type RPCClientTransport<Methods extends RPCMethods> = TransportSubject<
  RPCRequest<Methods, keyof Methods>,
  RPCResponse<Methods, keyof Methods>
>
```

## APIs

### createSendRequest()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`transport: RPCClientTransport<Methods>`](#rpcclienttransport)

**Returns** [`SendRequestFunc<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#sendrequestfunc)

### createClient()

**Type parameters**

1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`transport: RPCClientTransport<Methods>`](#rpcclienttransport)

**Returns** [`RPCClient<Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#rpcclient-class)

### createHandlerOperator()

**Type parameters**

1. `Context`
1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. `context: Context`
1. [`methods: HandlerMethods<Context, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods)
1. [`options?: HandlerOptions<Context, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

**Returns** `OperatorFunction<RPCRequest<Methods, keyof Methods>, RPCResponse<Methods, keyof Methods> | null>`

### serve()

**Type parameters**

1. `Context`
1. [`Methods extends RPCMethods`](https://github.com/ceramicnetwork/js-rpc-utils#rpcmethods)

**Arguments**

1. [`transport: RPCServerTransport<Methods>`](#rpcservertransport)
1. `context: Context`
1. [`methods: HandlerMethods<Context, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handlermethods)
1. [`options?: HandlerOptions<Context, Methods>`](https://github.com/ceramicnetwork/js-rpc-utils#handleroptions)

**Returns** [`Subscription`](https://rxjs.dev/api/index/class/Subscription)

## License

Apache-2.0 OR MIT
