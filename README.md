# Transports monorepo

Libraries to implement communication transports using [RxJS](https://rxjs.dev/) and JSON-RPC APIs.

## Libraries

| Name                                                                       | Version                                                                                                                                                       | Description                                                                                   |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [`@ceramicnetwork/rpc-postmessage`](/packages/rpc-postmessage)             | [![npm version](https://img.shields.io/npm/v/@ceramicnetwork/rpc-postmessage.svg)](https://www.npmjs.com/package/@ceramicnetwork/rpc-postmessage)             | RPC over [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)   |
| [`@ceramicnetwork/rpc-transport`](/packages/rpc-transport)                 | [![npm version](https://img.shields.io/npm/v/@ceramicnetwork/rpc-transport.svg)](https://www.npmjs.com/package/@ceramicnetwork/rpc-transport)                 | Bridge between transports and [RPC utilities](https://github.com/ceramicnetwork/js-rpc-utils) |
| [`@ceramicnetwork/rpc-window`](/packages/rpc-window)                       | [![npm version](https://img.shields.io/npm/v/@ceramicnetwork/rpc-window.svg)](https://www.npmjs.com/package/@ceramicnetwork/rpc-window)                       | RPC using [browser windows](https://developer.mozilla.org/en-US/docs/Web/API/Window)          |
| [`@ceramicnetwork/transport-postmessage`](/packages/transport-postmessage) | [![npm version](https://img.shields.io/npm/v/@ceramicnetwork/transport-postmessage.svg)](https://www.npmjs.com/package/@ceramicnetwork/transport-postmessage) | [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) transport  |
| [`@ceramicnetwork/transport-subject`](/packages/transport-subject)         | [![npm version](https://img.shields.io/npm/v/@ceramicnetwork/transport-subject.svg)](https://www.npmjs.com/package/@ceramicnetwork/transport-subject)         | Generic transport interface as a [RxJS Subject](https://rxjs.dev/api/index/class/Subject)     |

## Maintainers

- Paul Le Cam ([@paullecam](http://github.com/paullecam))

## License

Dual licensed under [MIT](LICENSE-MIT) and [Apache 2](LICENSE-APACHE)
