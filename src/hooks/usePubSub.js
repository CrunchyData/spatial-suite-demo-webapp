// @ts-check
import { useState } from 'react';

export default function usePubSub() {
  const [pubSub] = useState(PubSub);
  return pubSub;
}

/**
 * A simple pub/sub implementation
 *
 * @example
 * // Create a new PubSub instance
 * const pubSub = PubSub();
 *
 * // Create a reaction for our subscription
 * function reaction() {
 *   console.log('hippo');
 * }
 *
 * // pubSub.subscribe will return an unsubscribe function.
 * // We'll reference it to end our subscription.
 * const unsubscribe = pubSub.subscribe('crunchy', reaction);
 *
 * pubSub.publish('crunchy');
 * // (console logs "hippo")
 *
 * unsubscribe();
 *
 * pubSub.publish('crunchy');
 * // (nothing happens)
 *
 * @example
 * // We can also publish a message
 *
 * const pubSub = PubSub();
 *
 * function logSomething(message) {
 *   console.log(message);
 * }
 *
 * const unsubscribe = pubSub.subscribe('log', logSomething);
 *
 * pubSub.publish('log', 'foo');
 * // (console logs "foo")
 */
function PubSub() {
  const oneToMany = OneToMany();

  /**
   * Subscribes to a "channel" by storing a callback.
   * The callback will be called when a message is published to the channel.
   * @param {string} channel
   * @param {function(): void} callback
   */
  function subscribe(channel, callback) {
    const set = oneToMany.getOrCreateSet(channel);
    set.add(callback);

    return function unsubscribe() {
      set.delete(callback);
      if (set.size === 0) {
        oneToMany.deleteSet(channel);
      }
    };
  }

  /**
   * Publishes a message to subscribers
   * @param {string} channel
   * @param {any} [payload]
   */
  function publish(channel, payload) {
    const set = oneToMany.getSet(channel);
    if (set) {
      set.forEach(callback => callback(payload));
    } else {
      // eslint-disable-next-line no-console
      console.warn(`No subscribers to channel: ${channel}`);
    }
  }

  return { publish, subscribe };
}

function OneToMany() {
  /**
   * Maps strings to Sets of callbacks
   * @type {Map<string, Set<function(...any): void>>}
   */
  const map = new Map();

  /** @param {string} key */
  function getSet(key) {
    return map.get(key);
  }

  /** @param {string} key */
  function getOrCreateSet(key) {
    // Get the set
    let set = map.get(key);

    // If no Set found, create one and store it in the Map
    if (!set) {
      set = new Set();
      map.set(key, set);
    }

    return set;
  }

  /**
   * Deletes a Set
   * @param {string} key
   */
  function deleteSet(key) {
    map.delete(key);
  }

  return { deleteSet, getOrCreateSet, getSet };
}
