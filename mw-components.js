/* MW UI Kit – Components JS
 *
 * A handful of small, framework‑agnostic scripts to bring
 * interactivity to MW UI Kit components. It handles modal toggling,
 * accordion expansion, and tab switching. The behaviours are
 * namespace‑aware, so they work for both frontend and backend
 * components.
 */

(function () {
  // Helper to toggle visibility of modals
  function toggleModal(targetSelector, show) {
    var modal = document.querySelector(targetSelector);
    if (!modal) return;
    if (show) {
      modal.classList.remove('mwui-front-hidden', 'mwui-backend-hidden');
    } else {
      modal.classList.add('mwui-front-hidden', 'mwui-backend-hidden');
    }
  }

  // Event delegation
  document.addEventListener('click', function (event) {
    var trigger;

    // Modal open triggers: elements with data-mw-modal-target
    trigger = event.target.closest('[data-mw-modal-target]');
    if (trigger) {
      var target = trigger.getAttribute('data-mw-modal-target');
      if (target) {
        toggleModal(target, true);
      }
      return;
    }

    // Modal close triggers: elements with data-mw-modal-close or overlay click
    trigger = event.target.closest('[data-mw-modal-close]');
    if (trigger) {
      var modalEl = trigger.closest('.mwui-front-modal, .mwui-backend-modal');
      if (modalEl) {
        toggleModal('#' + modalEl.id, false);
      }
      return;
    }

    // Clicking outside modal content should close the modal
    if (
      event.target.classList.contains('mwui-front-modal') ||
      event.target.classList.contains('mwui-backend-modal')
    ) {
      toggleModal('#' + event.target.id, false);
      return;
    }

    // Accordion headers
    trigger = event.target.closest(
      '.mwui-front-accordion-header, .mwui-backend-accordion-header'
    );
    if (trigger) {
      var item = trigger.parentElement;
      if (item) {
        var panel = item.querySelector(
          '.mwui-front-accordion-panel, .mwui-backend-accordion-panel'
        );
        if (panel) {
          var visible = panel.style.display === 'block';
          panel.style.display = visible ? 'none' : 'block';
        }
      }
      return;
    }

    // Tabs
    trigger = event.target.closest('.mwui-front-tab, .mwui-backend-tab');
    if (trigger && !trigger.classList.contains('active')) {
      var tabContainer = trigger.parentElement;
      if (tabContainer) {
        // Determine namespace and construct selector for tab contents
        var namespace = trigger.classList.contains('mwui-front-tab')
          ? 'mwui-front'
          : 'mwui-backend';
        var tabs = tabContainer.querySelectorAll('.' + namespace + '-tab');
        var contents = tabContainer.parentElement.querySelectorAll(
          '.' + namespace + '-tab-content'
        );

        tabs.forEach(function (tab) {
          tab.classList.remove('active');
        });
        contents.forEach(function (content) {
          content.classList.remove('active');
        });
        trigger.classList.add('active');
        var targetId = trigger.getAttribute('data-mw-tab-target');
        if (targetId) {
          var targetContent = tabContainer.parentElement.querySelector(
            '#' + targetId
          );
          if (targetContent) {
            targetContent.classList.add('active');
          }
        }
      }
    }
  });
})();
