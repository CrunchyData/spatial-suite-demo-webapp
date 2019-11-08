// @ts-check
import { useLayoutEffect, useRef, useState } from 'react';

/** @type {number | '100%'} */
const cardHeightInitialState = 0;

/**
 * Generates a `style` object for the floating card in a map view
 * @param {string} viewContainerId - ID for the view's "root" element
 * @param {string} cardBodyId - ID for the <CardBody> element inside the card
 */
export default function useViewCardStyles(viewContainerId, cardBodyId) {
  const [cardHeight, setCardHeight] = useState(cardHeightInitialState);

  const refView = useRef(null);
  const refCardBody = useRef(null);

  // After the first render, update the element refs
  useLayoutEffect(
    () => {
      refView.current = document.getElementById(viewContainerId);
      refCardBody.current = document.getElementById(cardBodyId);
    },
    [cardBodyId, viewContainerId],
  );

  // Calculate card height. This should run after every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(
    () => {
      const elView = refView.current;
      const elCardBody = refCardBody.current;
      if (elView && elCardBody) {
        setCardHeight(cardContainerHeight(elView, elCardBody));
      }
    },
  );

  // Create the style object
  const cardStyle = cardHeight ? { height: cardHeight } : undefined;
  if (cardStyle && cardStyle.height === '100%') cardStyle.overflow = 'auto';

  return cardStyle;
}

/**
 * Generates a height style for the card container
 * @param {E} elView
 * @param {E} elCardBody
 * @template {HTMLElement} E
 */
function cardContainerHeight(elView, elCardBody) {
  const viewHeight = elView.offsetHeight;
  const cardBodyHeight = getContentHeight(elCardBody);

  if (cardBodyHeight > viewHeight) return '100%';
  return cardBodyHeight;
}

/**
 * @param {E} element
 * @template {HTMLElement} E
 */
function getContentHeight(element) {
  let height = 0;

  // Add scrollHeights for child nodes
  element.childNodes.forEach(node => {
    if (node instanceof HTMLElement) height += node.scrollHeight;
  });

  // Add the element's padding
  const style = getComputedStyle(element);
  const { paddingBottom, paddingTop } = style;
  if (paddingBottom && paddingTop) {
    const bottom = parseInt(paddingBottom, 10);
    const top = parseInt(paddingTop, 10);
    height += bottom + top;
  }

  return height;
}
