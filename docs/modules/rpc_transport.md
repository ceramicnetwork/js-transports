# Module: rpc-transport

```sh
npm install @ceramicnetwork/rpc-transport
```

## Type aliases

### RPCClientTransport

Ƭ **RPCClientTransport**<`Methods`, `Incoming`, `Outgoing`\>: `TransportSubject`<`Incoming`, `Outgoing`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Incoming` | `RPCResponse`<`Methods`, keyof `Methods`\> |
| `Outgoing` | `RPCRequest`<`Methods`, keyof `Methods`\> |

___

### RPCServerTransport

Ƭ **RPCServerTransport**<`Methods`, `Incoming`, `Outgoing`\>: `TransportSubject`<`Incoming`, `Outgoing`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Incoming` | `RPCRequest`<`Methods`, keyof `Methods`\> |
| `Outgoing` | `RPCResponse`<`Methods`, keyof `Methods`\> |

## Functions

### createClient

▸ **createClient**<`Methods`\>(`transport`): `RPCClient`<`Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`RPCClientTransport`](rpc_transport.md#rpcclienttransport)<`Methods`, `RPCResponse`<`Methods`, keyof `Methods`\>, `RPCRequest`<`Methods`, keyof `Methods`\>\> |

#### Returns

`RPCClient`<`Methods`\>

___

### createHandlerOperator

▸ **createHandlerOperator**<`Context`, `Methods`\>(`context`, `methods`, `options?`): `OperatorFunction`<`RPCRequest`<`Methods`, keyof `Methods`\>, `RPCResponse`<`Methods`, keyof `Methods`\> \| ``null``\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | `Context` |
| `Methods` | extends `RPCMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Context` |
| `methods` | `HandlerMethods`<`Context`, `Methods`\> |
| `options?` | `HandlerOptions`<`Context`, `Methods`\> |

#### Returns

`OperatorFunction`<`RPCRequest`<`Methods`, keyof `Methods`\>, `RPCResponse`<`Methods`, keyof `Methods`\> \| ``null``\>

___

### createSendRequest

▸ **createSendRequest**<`Methods`\>(`transport`): `SendRequestFunc`<`Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`RPCClientTransport`](rpc_transport.md#rpcclienttransport)<`Methods`, `RPCResponse`<`Methods`, keyof `Methods`\>, `RPCRequest`<`Methods`, keyof `Methods`\>\> |

#### Returns

`SendRequestFunc`<`Methods`\>

___

### serve

▸ **serve**<`Context`, `Methods`\>(`transport`, `context`, `methods`, `options?`): `Subscription`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | `Context` |
| `Methods` | extends `RPCMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`RPCServerTransport`](rpc_transport.md#rpcservertransport)<`Methods`, `RPCRequest`<`Methods`, keyof `Methods`\>, `RPCResponse`<`Methods`, keyof `Methods`\>\> |
| `context` | `Context` |
| `methods` | `HandlerMethods`<`Context`, `Methods`\> |
| `options?` | `HandlerOptions`<`Context`, `Methods`\> |

#### Returns

`Subscription`
