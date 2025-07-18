/**
 * Utility to detect if hydration mismatches are caused by browser extensions
 */
export function isBrowserExtensionAttribute(attributeName: string): boolean {
  const extensionPatterns = [
    /^data-redeviation-/, // AdBlock/uBlock extensions
    /^data-adblock/,
    /^data-extension/,
    /^extension-/,
    /^__extension/,
    /^data-lastpass/,
    /^data-1password/,
    /^data-bitwarden/,
    /^data-dashlane/,
    /^data-keeper/,
    /^data-chrome-extension/,
    /^data-firefox-extension/,
    /^grammarly-/,
    /^data-grammarly/,
  ];

  return extensionPatterns.some(pattern => pattern.test(attributeName));
}

/**
 * Clean up browser extension attributes from an element
 */
export function cleanExtensionAttributes(element: Element): void {
  if (!element || typeof element.removeAttribute !== 'function') return;

  const attributes = Array.from(element.attributes);

  attributes.forEach(attr => {
    if (isBrowserExtensionAttribute(attr.name)) {
      element.removeAttribute(attr.name);
    }
  });
}

/**
 * Observer to clean up extension attributes as they're added
 */
export function setupExtensionAttributeObserver(): MutationObserver | null {
  if (typeof window === 'undefined' || !window.MutationObserver) {
    return null;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        const attributeName = mutation.attributeName;
        if (attributeName && isBrowserExtensionAttribute(attributeName)) {
          mutation.target.removeAttribute(attributeName);
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: undefined, // Observe all attributes
  });

  return observer;
}
