import {$} from '@core/dom';
import {Emmiter} from '../../core/Emmiter';
import {StoreSubscriber} from '../../core/StoreSubscriber';
import {changeDate} from '@/redux/actions';
import {preventDefault} from '../../core/utils';

export class Excel {
  constructor(options) {
    this.components = options.components || [];
    this.store = options.store;
    this.emitter = new Emmiter();
    this.subscriber = new StoreSubscriber(this.store);
  }
  getRoot() {
    const $root = $.create('div', 'excel');
    const componentOptions = {
      emitter: this.emitter,
      store: this.store,
    };
    this.components = this.components.map((Component) => {
      const $el = $.create('div', Component.className);
      const component = new Component($el, componentOptions);
      $el.html(component.toHTML());
      $root.append($el);
      return component;
    });
    return $root;
  }
  init() {
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', preventDefault);
    }
    this.store.dispatch(changeDate());
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach((component) => component.init());
  }
  destroy() {
    this.subscriber.unsubcribeFromStore;
    this.components.forEach((component) => component.destroy());
    document.removeEventListener('contextmenu', preventDefault);
  }
}
