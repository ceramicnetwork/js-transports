# Module: rpc-window

```sh
npm install @ceramicnetwork/rpc-window
```

## Type aliases

### ClientOptions

Ƭ **ClientOptions**: `UnwrapObservableOptions` & `PostMessageTransportOptions`

___

### IncomingRequest

Ƭ **IncomingRequest**<`Methods`, `Namespace`\>: `IncomingMessage`<`Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string``string` |

___

### ServerPayload

Ƭ **ServerPayload**<`Methods`, `Namespace`\>: `HandledPayload`<[`IncomingRequest`](rpc_window.md#incomingrequest)<`Methods`, `Namespace`\>, `Methods`, keyof `Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` |

## Functions

### createClient

▸ **createClient**<`Methods`, `Namespace`\>(`namespace`, `target?`, `options?`): `RPCClient`<`Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `Namespace` |
| `target` | `Window` |
| `options` | [`ClientOptions`](rpc_window.md#clientoptions) |

#### Returns

`RPCClient`<`Methods`\>

___

### createServer

▸ **createServer**<`Methods`, `Namespace`\>(`namespace`, `methods`, `target?`): `Observable`<[`ServerPayload`](rpc_window.md#serverpayload)<`Methods`, `Namespace`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `Namespace` |
| `methods` | `HandlerMethods`<[`IncomingRequest`](rpc_window.md#incomingrequest)<`Methods`, `Namespace`\>, `Methods`\> |
| `target` | `Window` |

#### Returns

`Observable`<[`ServerPayload`](rpc_window.md#serverpayload)<`Methods`, `Namespace`\>\>
