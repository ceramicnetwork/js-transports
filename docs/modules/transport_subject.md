# Module: transport-subject

```sh
npm install @ceramicnetwork/transport-subject
```

## Classes

- [TransportSubject](../classes/transport_subject.TransportSubject.md)

## Type aliases

### UnwrapObservableOptions

Ƭ **UnwrapObservableOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `throwWhenInvalid?` | `boolean` |
| `onInvalidInput?` | (`input`: `unknown`, `error`: `Error`) => `void` |

___

### Wrapped

Ƭ **Wrapped**<`Message`, `Namespace`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Message` | `Message` |
| `Namespace` | extends `string``string` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `__tw` | ``true`` |
| `msg` | `Message` |
| `ns` | `Namespace` |

___

### Wrapper

Ƭ **Wrapper**<`MsgIn`, `MsgOut`, `WrappedOut`\>: `Object`

#### Type parameters

| Name |
| :------ |
| `MsgIn` |
| `MsgOut` |
| `WrappedOut` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `unwrap` | (`input`: `any`) => `MsgIn` |
| `wrap` | (`msg`: `MsgOut`) => `WrappedOut` |

## Functions

### createNamespacedTransport

▸ **createNamespacedTransport**<`MsgIn`, `MsgOut`, `Namespace`\>(`transport`, `namespace`, `options?`): [`TransportSubject`](../classes/transport_subject.TransportSubject.md)<`MsgIn`, `MsgOut`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgIn` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`TransportSubject`](../classes/transport_subject.TransportSubject.md)<[`Wrapped`](transport_subject.md#wrapped)<`MsgIn`, `Namespace`\>, [`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>\> |
| `namespace` | `Namespace` |
| `options?` | [`UnwrapObservableOptions`](transport_subject.md#unwrapobservableoptions) |

#### Returns

[`TransportSubject`](../classes/transport_subject.TransportSubject.md)<`MsgIn`, `MsgOut`\>

___

### createUnwrap

▸ **createUnwrap**<`MsgIn`, `Namespace`\>(`namespace`): (`input`: `any`) => `MsgIn`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `Namespace` |

#### Returns

`fn`

▸ (`input`): `MsgIn`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any` |

##### Returns

`MsgIn`

___

### createUnwrapOperator

▸ **createUnwrapOperator**<`WrappedIn`, `MsgIn`\>(`unwrap`, `options?`): `OperatorFunction`<`WrappedIn`, `MsgIn`\>

#### Type parameters

| Name |
| :------ |
| `WrappedIn` |
| `MsgIn` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `unwrap` | (`input`: `any`) => `MsgIn` |
| `options` | [`UnwrapObservableOptions`](transport_subject.md#unwrapobservableoptions) |

#### Returns

`OperatorFunction`<`WrappedIn`, `MsgIn`\>

___

### createWrap

▸ **createWrap**<`MsgOut`, `Namespace`\>(`namespace`): (`msg`: `MsgOut`) => [`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgOut` | `MsgOut` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `Namespace` |

#### Returns

`fn`

▸ (`msg`): [`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `MsgOut` |

##### Returns

[`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>

___

### createWrapObserver

▸ **createWrapObserver**<`MsgOut`, `WrappedOut`\>(`observer`, `wrap`): `NextObserver`<`MsgOut`\>

#### Type parameters

| Name |
| :------ |
| `MsgOut` |
| `WrappedOut` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `observer` | `NextObserver`<`WrappedOut`\> |
| `wrap` | (`msg`: `MsgOut`) => `WrappedOut` |

#### Returns

`NextObserver`<`MsgOut`\>

___

### createWrappedTransport

▸ **createWrappedTransport**<`MsgIn`, `MsgOut`, `WrappedIn`, `WrappedOut`\>(`transport`, `__namedParameters`, `options?`): [`TransportSubject`](../classes/transport_subject.TransportSubject.md)<`MsgIn`, `MsgOut`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgOut` |
| `WrappedIn` | `WrappedIn` |
| `WrappedOut` | `WrappedIn` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`TransportSubject`](../classes/transport_subject.TransportSubject.md)<`WrappedIn`, `WrappedOut`\> |
| `__namedParameters` | [`Wrapper`](transport_subject.md#wrapper)<`MsgIn`, `MsgOut`, `WrappedOut`\> |
| `options` | [`UnwrapObservableOptions`](transport_subject.md#unwrapobservableoptions) |

#### Returns

[`TransportSubject`](../classes/transport_subject.TransportSubject.md)<`MsgIn`, `MsgOut`\>

___

### createWrapper

▸ **createWrapper**<`MsgIn`, `MsgOut`, `Namespace`\>(`namespace`): [`Wrapper`](transport_subject.md#wrapper)<`MsgIn`, `MsgOut`, [`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `MsgIn` | `MsgIn` |
| `MsgOut` | `MsgIn` |
| `Namespace` | extends `string``string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `namespace` | `Namespace` |

#### Returns

[`Wrapper`](transport_subject.md#wrapper)<`MsgIn`, `MsgOut`, [`Wrapped`](transport_subject.md#wrapped)<`MsgOut`, `Namespace`\>\>
