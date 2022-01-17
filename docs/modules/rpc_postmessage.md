# Module: rpc-postmessage

```sh
npm install @ceramicnetwork/rpc-postmessage
```

## Type aliases

### HandledPayload

Ƭ **HandledPayload**<`Message`, `Methods`, `K`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Message` | `Message` |
| `Methods` | extends `RPCMethods` |
| `K` | extends keyof `Methods` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | `Message` |
| `request` | `RPCRequest`<`Methods`, `K`\> |
| `response` | `RPCResponse`<`Methods`, `K`\> \| ``null`` |
| `type` | ``"handled"`` |

___

### NamespaceClientTransport

Ƭ **NamespaceClientTransport**<`Methods`, `Namespace`, `Incoming`, `Outgoing`\>: `TransportSubject`<`Incoming`, `Outgoing`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` |
| `Incoming` | `IncomingMessage`<`Wrapped`<`RPCResponse`<`Methods`, keyof `Methods`\>, `Namespace`\>\> |
| `Outgoing` | `Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\> |

___

### NamespaceServerOptions

Ƭ **NamespaceServerOptions**<`Methods`, `Namespace`, `Message`\>: [`ServerOptions`](rpc_postmessage.md#serveroptions)<`Message`, `Methods`\> & { `filter?`: `string` \| `string`[] \| `MessageFilter` ; `namespace`: `Namespace`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` = `string` |
| `Message` | `IncomingMessage`<`Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\>\> |

___

### RequestPayload

Ƭ **RequestPayload**<`Message`, `Methods`, `K`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Message` | `Message` |
| `Methods` | extends `RPCMethods` |
| `K` | extends keyof `Methods` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `message` | `Message` |
| `request` | `RPCRequest`<`Methods`, `K`\> |
| `type` | ``"request"`` |

___

### ServerOptions

Ƭ **ServerOptions**<`Context`, `Methods`\>: `HandlerOptions`<`Context`, `Methods`\> & { `methods`: `HandlerMethods`<`Context`, `Methods`\> ; `target`: `PostMessageTarget`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Context` | `Context` |
| `Methods` | extends `RPCMethods` |

## Functions

### createNamespaceClient

▸ **createNamespaceClient**<`Methods`, `Namespace`\>(`transport`, `namespace`, `options?`): `RPCClient`<`Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`NamespaceClientTransport`](rpc_postmessage.md#namespaceclienttransport)<`Methods`, `Namespace`, `IncomingMessage`<`Wrapped`<`RPCResponse`<`Methods`, keyof `Methods`\>, `Namespace`\>\>, `Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\>\> |
| `namespace` | `Namespace` |
| `options?` | `UnwrapObservableOptions` |

#### Returns

`RPCClient`<`Methods`\>

___

### createNamespaceRequestHandlerOperator

▸ **createNamespaceRequestHandlerOperator**<`Methods`, `Namespace`, `Message`\>(`methods`, `namespace`, `options?`): `OperatorFunction`<`Message`, [`HandledPayload`](rpc_postmessage.md#handledpayload)<`Message`, `Methods`, keyof `Methods`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` = `string` |
| `Message` | `IncomingMessage`<`Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\>\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `methods` | `HandlerMethods`<`Message`, `Methods`\> |
| `namespace` | `Namespace` |
| `options` | `HandlerOptions`<`Message`, `Methods`\> |

#### Returns

`OperatorFunction`<`Message`, [`HandledPayload`](rpc_postmessage.md#handledpayload)<`Message`, `Methods`, keyof `Methods`\>\>

___

### createNamespaceSendRequest

▸ **createNamespaceSendRequest**<`Methods`, `Namespace`\>(`transport`, `namespace`, `options?`): `SendRequestFunc`<`Methods`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`NamespaceClientTransport`](rpc_postmessage.md#namespaceclienttransport)<`Methods`, `Namespace`, `IncomingMessage`<`Wrapped`<`RPCResponse`<`Methods`, keyof `Methods`\>, `Namespace`\>\>, `Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\>\> |
| `namespace` | `Namespace` |
| `options?` | `UnwrapObservableOptions` |

#### Returns

`SendRequestFunc`<`Methods`\>

___

### createNamespaceServer

▸ **createNamespaceServer**<`Methods`, `Namespace`, `Request`\>(`__namedParameters`): `Observable`<[`HandledPayload`](rpc_postmessage.md#handledpayload)<`IncomingMessage`<`Request`\>, `Methods`, keyof `Methods`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |
| `Namespace` | extends `string` = `string` |
| `Request` | `Wrapped`<`RPCRequest`<`Methods`, keyof `Methods`\>, `Namespace`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`NamespaceServerOptions`](rpc_postmessage.md#namespaceserveroptions)<`Methods`, `Namespace`, `IncomingMessage`<`Request`\>\> |

#### Returns

`Observable`<[`HandledPayload`](rpc_postmessage.md#handledpayload)<`IncomingMessage`<`Request`\>, `Methods`, keyof `Methods`\>\>

___

### serve

▸ **serve**<`Methods`\>(`__namedParameters`): `Subscription`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Methods` | extends `RPCMethods` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ServerOptions`](rpc_postmessage.md#serveroptions)<``null``, `Methods`\> |

#### Returns

`Subscription`
