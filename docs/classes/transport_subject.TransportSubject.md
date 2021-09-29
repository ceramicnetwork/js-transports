# Class: TransportSubject<MsgIn, MsgOut\>

[transport-subject](../modules/transport_subject.md).TransportSubject

## Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgIn` |

## Hierarchy

- `Subject`<`MsgIn`\>

  ↳ **`TransportSubject`**

## Constructors

### constructor

• **new TransportSubject**<`MsgIn`, `MsgOut`\>(`source`, `sink`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgIn` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `Observable`<`MsgIn`\> |
| `sink` | `PartialObserver`<`MsgOut`\> |

#### Overrides

Subject&lt;MsgIn\&gt;.constructor

## Properties

### \_sink

• **\_sink**: `PartialObserver`<`MsgOut`\>

___

### \_source

• **\_source**: `Observable`<`MsgIn`\>

## Methods

### \_subscribe

▸ **_subscribe**(`observer`): `Subscription`

#### Parameters

| Name | Type |
| :------ | :------ |
| `observer` | `PartialObserver`<`MsgIn`\> |

#### Returns

`Subscription`

___

### complete

▸ **complete**(): `void`

#### Returns

`void`

#### Overrides

Subject.complete

___

### error

▸ **error**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Overrides

Subject.error

___

### next

▸ **next**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `MsgOut` |

#### Returns

`void`

#### Overrides

Subject.next
