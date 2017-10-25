import Ember from 'ember';

const {
  A,
  computed,
  computed: { not },
  observer,
  Service
} = Ember;

export default Service.extend({
  _pool: computed(() => A()),
  isAnimating: true,
  isNotAnimating: not('isAnimating'),
  /**
   * isAnimatingObserver restarts the requestAnimationFrame render loop
   * when toggled to true.
   */
  isAnimatingObserver: observer('isAnimating', function() {
    if(this.get('isAnimating')) {
      this.flush();
    }
  }),
  init() {
    this.flush();
  },
  flush() {
    window.requestAnimationFrame(() => {
      // when the service is told not to animate, stop the loop entirely
      if(this.get('isNotAnimating') || this.get('isDestroying')) {
        return;
      }

      let currentPool = this.get('_pool');

      this.set('_pool', A());
      currentPool.forEach((fn) => fn());
      this.flush();
    });
  },

  add(fn) {
    this.get('_pool').pushObject(fn);
    return fn;
  },
  remove(fn) {
    this.get('_pool').removeObject(fn);
    return fn;
  }
});
