// @flow

import { assert } from 'chai';
import getScrollbarSize from 'dom-helpers/util/scrollbarSize';
import createModalManager from './modalManager';

describe('internal/modalManager', () => {
  let modalManager;

  before(() => {
    modalManager = createModalManager();
  });

  it('should be an object', () => {
    assert.strictEqual(typeof modalManager, 'object');
  });

  it('should add a modal only once', () => {
    const modal = {};
    const modalManager2 = createModalManager();
    const idx = modalManager2.add(modal);
    assert.strictEqual(modalManager2.add(modal), idx);
    modalManager2.remove(modal);
  });

  describe('managing modals', () => {
    let modal1;
    let modal2;
    let modal3;

    before(() => {
      modal1 = {};
      modal2 = {};
      modal3 = {};
    });

    it('should add modal1', () => {
      const idx = modalManager.add(modal1);
      assert.strictEqual(idx, 0, 'should be the first modal');
      assert.strictEqual(modalManager.isTopModal(modal1), true, 'should be the top modal');
    });

    it('should add modal2', () => {
      const idx = modalManager.add(modal2);
      assert.strictEqual(idx, 1, 'should be the second modal');
      assert.strictEqual(modalManager.isTopModal(modal2), true, 'should be the top modal');
    });

    it('should add modal3', () => {
      const idx = modalManager.add(modal3);
      assert.strictEqual(idx, 2, 'should be the third modal');
      assert.strictEqual(modalManager.isTopModal(modal3), true, 'should be the top modal');
    });

    it('should remove modal2', () => {
      const idx = modalManager.remove(modal2);
      assert.strictEqual(idx, 1, 'should be the second modal');
    });

    it('should add modal2', () => {
      const idx = modalManager.add(modal2);
      assert.strictEqual(idx, 2, 'should be the "third" modal');
      assert.strictEqual(modalManager.isTopModal(modal2), true, 'modal2 should be the top modal');
      assert.strictEqual(
        modalManager.isTopModal(modal3),
        false,
        'modal3 should not be the top modal',
      );
    });

    it('should remove modal3', () => {
      const idx = modalManager.remove(modal3);
      assert.strictEqual(idx, 1, 'should be the "second" modal');
    });

    it('should remove modal2', () => {
      const idx = modalManager.remove(modal2);
      assert.strictEqual(idx, 1, 'should be the "second" modal');
      assert.strictEqual(modalManager.isTopModal(modal1), true, 'modal1 should be the top modal');
    });

    it('should remove modal1', () => {
      const idx = modalManager.remove(modal1);
      assert.strictEqual(idx, 0, 'should be the "first" modal');
    });

    it('should not do anything', () => {
      const idx = modalManager.remove({ nonExisting: true });
      assert.strictEqual(idx, -1, 'should not find the non existing modal');
    });
  });

  describe('scroll', () => {
    let fixedNode;

    beforeEach(() => {
      fixedNode = document.createElement('div');
      fixedNode.classList.add('mui-fixed');
      fixedNode.style.padding = '14px';
      window.document.body.appendChild(fixedNode);
      window.innerWidth += 1; // simulate a scrollbar
    });

    afterEach(() => {
      window.document.body.removeChild(fixedNode);
    });

    it('should handle the scroll', () => {
      const modal = {};
      modalManager.add(modal);
      assert.strictEqual(window.document.body.style.overflow, 'hidden');
      assert.strictEqual(window.document.body.style.paddingRight, `${getScrollbarSize()}px`);
      assert.strictEqual(fixedNode.style.paddingRight, `${14 + getScrollbarSize()}px`);
      modalManager.remove(modal);
      assert.strictEqual(window.document.body.style.overflow, '');
      assert.strictEqual(window.document.body.style.paddingRight, '0px');
      assert.strictEqual(fixedNode.style.paddingRight, '14px');
    });
  });
});
