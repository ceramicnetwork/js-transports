# Module: transport-postmessage

```sh
npm install @ceramicnetwork/transport-postmessage
```

## Interfaces

- [IncomingMessage](../interfaces/transport_postmessage.IncomingMessage.md)
- [PostMessageEventMap](../interfaces/transport_postmessage.PostMessageEventMap.md)
- [PostMessageTarget](../interfaces/transport_postmessage.PostMessageTarget.md)

## Type aliases

### MessageFilter

Ƭ **MessageFilter**: (`event`: `MessageEvent`) => `boolean`

#### Type declaration

▸ (`event`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `MessageEvent` |

##### Returns

`boolean`

___

### PostMessageTransportOptions

Ƭ **PostMessageTransportOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filter?` | `string` \| `string`[] \| [`MessageFilter`](transport_postmessage.md#messagefilter) |
| `postMessageArguments?` | `unknown`[] |

## Functions

### createMessageObservable

▸ **createMessageObservable**<`MessageData`\>(`target`, `originOrFilter?`): `Observable`<[`IncomingMessage`](../interfaces/transport_postmessage.IncomingMessage.md)<`MessageData`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PostMessageTarget`](../interfaces/transport_postmessage.PostMessageTarget.md) |
| `originOrFilter?` | `string` \| `string`[] \| [`MessageFilter`](transport_postmessage.md#messagefilter) |

#### Returns

`Observable`<[`IncomingMessage`](../interfaces/transport_postmessage.IncomingMessage.md)<`MessageData`\>\>

___

### createOriginFilter

▸ **createOriginFilter**<`Event`\>(`allowedOrigin`): (`event`: `Event`) => `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Event` | extends `MessageEvent`<`any`, `Event`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `allowedOrigin` | `string` \| `string`[] |

#### Returns

`fn`

▸ (`event`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

##### Returns

`boolean`

___

### createPostMessageObserver

▸ **createPostMessageObserver**<`MessageData`\>(`target`, ...`args`): `NextObserver`<`MessageData`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MessageData` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`PostMessageTarget`](../interfaces/transport_postmessage.PostMessageTarget.md) |
| `...args` | `unknown`[] |

#### Returns

`NextObserver`<`MessageData`\>

___

### createPostMessageTransport

▸ **createPostMessageTransport**<`MsgIn`, `MsgOut`\>(`from`, `to?`, `options?`): `TransportSubject`<[`IncomingMessage`](../interfaces/transport_postmessage.IncomingMessage.md)<`MsgIn`\>, `MsgOut`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgIn` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `from` | [`PostMessageTarget`](../interfaces/transport_postmessage.PostMessageTarget.md) | `undefined` |
| `to` | [`PostMessageTarget`](../interfaces/transport_postmessage.PostMessageTarget.md) | `from` |
| `options` | [`PostMessageTransportOptions`](transport_postmessage.md#postmessagetransportoptions) | `{}` |

#### Returns

`TransportSubject`<[`IncomingMessage`](../interfaces/transport_postmessage.IncomingMessage.md)<`MsgIn`\>, `MsgOut`\>
