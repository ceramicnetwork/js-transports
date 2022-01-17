import { jest } from '@jest/globals'
import { Observable, Subject } from 'rxjs'
import { count } from 'rxjs/operators'

import {
  TransportSubject,
  type Wrapped,
  createWrap,
  createUnwrap,
  createWrapper,
  createWrapObserver,
  createUnwrapOperator,
  createWrappedTransport,
  createNamespacedTransport,
} from '../src'

const emptyObserver = {
  next: () => {
    // noop
  },
}

describe('TransportSubject', () => {
  test('is an instance of Subject', () => {
    const subject = new TransportSubject(new Observable(), emptyObserver)
    expect(subject).toBeInstanceOf(Subject)
  })

  test('subscribes to the source observable', () => {
    const source = new Observable((subscriber) => {
      subscriber.next('one')
      subscriber.next('two')
      subscriber.next('three')
      subscriber.complete()
    })
    const subject = new TransportSubject(source, emptyObserver)

    return new Promise<void>((resolve) => {
      const countFromSource = subject.pipe(count())
      countFromSource.subscribe((eventsCount) => {
        expect(eventsCount).toBe(3)
      })
      countFromSource.subscribe((eventsCount) => {
        expect(eventsCount).toBe(3)
        resolve()
      })
    })
  })

  test('pushes to the sink observer', () => {
    return new Promise<void>((resolve) => {
      const subject = new TransportSubject(new Observable(), {
        next: (msg) => {
          expect(msg).toBe('test')
          resolve()
        },
      })
      subject.next('test')
    })
  })
})

describe('createWrap', () => {
  test('return the function that wraps the message', () => {
    const msg = { foo: 'bar' }
    const wrap = createWrap('foo')
    const wrapped = wrap(msg)
    expect(wrapped).toEqual({ __tw: true, ns: 'foo', msg })
  })
})

describe('createUnwrap', () => {
  const unwrap = createUnwrap<{ foo: string }>('foo')

  test('return the function that unwraps the message', () => {
    const msg = { foo: 'bar' }
    const wrapped = { __tw: true, ns: 'foo', msg }
    expect(unwrap(wrapped)).toEqual(msg)
  })

  test('throws an error if enveloppe check does not pass', () => {
    expect(() => unwrap({ whatever: 'test' })).toThrow('Input is not a wrapped message')
  })

  test('throws an error if the namespace is not a string', () => {
    expect(() => unwrap({ __tw: true, ns: 1 })).toThrow(
      'Invalid namespace type for wrapped message: expected a string, got number'
    )
  })

  test('throws an error if the namespace is not the expected one', () => {
    expect(() => unwrap({ __tw: true, ns: 'bar' })).toThrow(
      'Invalid namespace for wrapped message: expected foo, got bar'
    )
  })
})

describe('createWrapper', () => {
  test('wraps and unwraps', () => {
    const msg = { foo: 'bar' }
    const wrapper = createWrapper('foo')
    const wrapped = wrapper.wrap(msg)
    expect(wrapped).toEqual({ __tw: true, ns: 'foo', msg })
    expect(wrapper.unwrap(wrapped)).toEqual(msg)
  })
})

describe('createUnwrapOperator', () => {
  const unwrap = createUnwrap('bar')

  test('subscribes to the source observable', () => {
    const source = new Observable((subscriber) => {
      subscriber.next({ __tw: true, ns: 'bar', msg: 'one' })
    })
    const unwrapped = source.pipe(createUnwrapOperator(unwrap))

    return new Promise<void>((resolve) => {
      unwrapped.subscribe((msg) => {
        expect(msg).toBe('one')
        resolve()
      })
    })
  })

  describe('invalid input handling', () => {
    test('ignores them by default', () => {
      const source = new Observable((subscriber) => {
        subscriber.next({ __tw: true, ns: 'test', msg: 'one' })
        subscriber.next({ __tw: true, ns: 'bar', msg: 'two' })
      })

      const onInvalidInput = jest.fn()
      const unwrapped = source.pipe(createUnwrapOperator(unwrap, { onInvalidInput }))

      return new Promise<void>((resolve) => {
        unwrapped.subscribe((msg) => {
          expect(onInvalidInput).toBeCalledWith(
            { __tw: true, ns: 'test', msg: 'one' },
            new Error('Invalid namespace for wrapped message: expected bar, got test')
          )
          expect(msg).toBe('two')
          resolve()
        })
      })
    })

    test('throws if throwWhenInvalid is set', () => {
      const source = new Observable((subscriber) => {
        subscriber.next({ __tw: true, ns: 'test', msg: 'one' })
        subscriber.next({ __tw: true, ns: 'bar', msg: 'two' })
      })

      const onInvalidInput = jest.fn()
      const unwrapped = source.pipe(
        createUnwrapOperator(unwrap, {
          throwWhenInvalid: true,
          onInvalidInput,
        })
      )

      return new Promise<void>((resolve) => {
        unwrapped.subscribe({
          error(err) {
            expect(onInvalidInput).not.toBeCalled()
            expect((err as Error).message).toBe(
              'Invalid namespace for wrapped message: expected bar, got test'
            )
            resolve()
          },
        })
      })
    })
  })
})

describe('createWrapObserver', () => {
  test('pushes to the sink observer', () => {
    return new Promise<void>((resolve) => {
      const next = (msg: unknown) => {
        expect(msg).toEqual({ __tw: true, ns: 'bar', msg: 'hello' })
        resolve()
      }
      const wrapped = createWrapObserver({ next }, createWrap('bar'))
      wrapped.next('hello')
    })
  })
})

describe('createWrappedTransport', () => {
  const wrapper = createWrapper('bar')

  test('subscribes to the source observable', () => {
    const source = new Observable((subscriber) => {
      subscriber.next({ __tw: true, ns: 'bar', msg: 'one' })
    })
    const subject = new TransportSubject(source, emptyObserver)
    const wrapped = createWrappedTransport(subject, wrapper)

    return new Promise<void>((resolve) => {
      wrapped.subscribe((msg) => {
        expect(msg).toBe('one')
        resolve()
      })
    })
  })

  test('pushes to the sink observer', () => {
    return new Promise<void>((resolve) => {
      const next = (msg: unknown) => {
        expect(msg).toEqual({ __tw: true, ns: 'bar', msg: 'hello' })
        resolve()
      }
      const subject = new TransportSubject(new Observable(), { next })
      const wrapped = createWrappedTransport(subject, wrapper)
      wrapped.next('hello')
    })
  })
})

describe('createNamespacedTransport', () => {
  test('subscribes to the source observable', () => {
    const source = new Observable<Wrapped<string>>((subscriber) => {
      subscriber.next({ __tw: true, ns: 'test', msg: 'one' })
    })
    const subject = new TransportSubject(source, emptyObserver)

    const wrapped = createNamespacedTransport(subject, 'test')
    return new Promise<void>((resolve) => {
      wrapped.subscribe((msg) => {
        expect(msg).toBe('one')
        resolve()
      })
    })
  })

  test('pushes to the sink observer', () => {
    return new Promise<void>((resolve) => {
      const next = (msg: Wrapped<string>) => {
        expect(msg).toEqual({ __tw: true, ns: 'test', msg: 'hello' })
        resolve()
      }
      const subject = new TransportSubject<Wrapped<string>>(new Observable(), { next })
      const wrapped = createNamespacedTransport(subject, 'test')
      wrapped.next('hello')
    })
  })
})
