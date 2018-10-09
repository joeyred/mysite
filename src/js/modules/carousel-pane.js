// 'use strict';
// !function() {
// class CarouselPane extends Gingabulous.Pane {
//   constructor(element, inheritedOptions) {
//     super(element, inheritedOptions);
//     this.debug = new Gingabulous.Debug('CarouselPane');
//   }
//   activate() {
//     this.element.classList.remove(this.classes.frozen, this.classes.fixed);
//     this._setWindowScrollPosition();
//   }
//   deactivate() {
//     this._storeScrollPosition();
//     this.element.classList.add(
//       this.classes.frozen,
//       this.classes.fixed,
//       this.classes.active
//     );
//     this._setScrollPositionWhenFixed();
//   }
// }
//
// class CarouselPanes extends Gingabulous.Pane {
//   constructor(element, inheritedOptions) {
//     super(element, inheritedOptions);
//     this.debug = new Gingabulous.Debug('CarouselPanes');
//     this.carousel = this.element.querySelector('[data-carousel-panes]');
//     this.titleBar = this.element.querySelector('.pane-carousel-title-bar');
//     this.activePane = 'center';
//     this.paneToActivate = '';
//     this.panes = {
//       left: new CarouselPane(this.element.querySelector('.carousel-left'), inheritedOptions),
//       center: new CarouselPane(this.element.querySelector('.carousel-center'), inheritedOptions),
//       right: new CarouselPane(this.element.querySelector('.carousel-right'), inheritedOptions)
//     };
//     this._events();
//   }
//   _goToPane(pane) {
//     let translate;
//     if (pane === 'left') {
//       translate = 'translateX(0)';
//       this.paneToActivate = 'left';
//     }
//     if (pane === 'center') {
//       translate = '';
//       this.paneToActivate = 'center';
//     }
//     if (pane === 'right') {
//       translate = 'translateX(-200%)';
//       this.paneToActivate = 'right';
//     }
//     this.panes[this.activePane].deactivate();
//     this.carousel.style.transform = translate;
//     this.titleBar.style.transform = translate;
//     this.panes[this.paneToActivate].activate();
//     this.activePane = this.paneToActivate;
//   }
//   _events() {
//     let attr = 'data-panes-nav';
//     this.element.addEventListener('click', (event) => {
//       if (event.target.hasAttribute(attr)) {
//         this._goToPane(event.target.getAttribute(attr));
//         // let attrValue = event.target.getAttribute(attr);
//         // if (attrValue === 'left') {
//         //   this._goToPane('left');
//         //   this.debug.message('left movement triggered');
//         // }
//         // if (attrValue === 'center') {
//         //   this._goToPane('center');
//         //   this.debug.message('center movement triggered');
//         // }
//         // if (attrValue === 'right') {
//         //   this._goToPane('right');
//         //   this.debug.message('right movement triggered');
//         // }
//       }
//     });
//   }
// }
// Gingabulous.registerModule(CarouselPanes, 'CarouselPanes');
// }();
