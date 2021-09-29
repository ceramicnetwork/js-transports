import { createClient, createServer } from '../src'

describe('rpc-window', () => {
  test('exports createClient and createServer', () => {
    expect(createClient).toBeDefined()
    expect(createServer).toBeDefined()
  })
})
