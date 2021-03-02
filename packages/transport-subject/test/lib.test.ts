import { Observable, Subject, Subscriber } from 'rxjs'
import { count } from 'rxjs/operators'

import { TransportSubject } from '../src'

describe('transport-subject', () => {
  test('is an instance of Subject', () => {
    const subject = new TransportSubject(new Observable(), new Subscriber())
    expect(subject).toBeInstanceOf(Subject)
  })

  test('subscribes to the source observable', () => {
    const source = new Observable((subscriber) => {
      subscriber.next('one')
      subscriber.next('two')
      subscriber.next('three')
    })
    const subject = new TransportSubject(source, new Subscriber())

    const countFromSource = subject.pipe(count())
    countFromSource.subscribe((eventsCount) => {
      expect(eventsCount).toBe(3)
    })
    countFromSource.subscribe((eventsCount) => {
      expect(eventsCount).toBe(3)
    })
  })

  test('pushes to the sing observer', () => {
    return new Promise<void>((resolve) => {
      const sink = new Subscriber((msg) => {
        expect(msg).toBe('test')
        resolve()
      })
      const subject = new TransportSubject(new Observable(), sink)
      subject.next('test')
    })
  })
})
