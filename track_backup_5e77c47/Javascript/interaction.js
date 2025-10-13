// Timeline ??Card 鈭???
document.addEventListener('DOMContentLoaded', function () {
  const timelineNodes = document.querySelectorAll('.timeline-node.completed');
  const allCards = document.querySelectorAll(
    '.timeline-card.completed, .timeline-card.event'
  );
  const timelineCards = document.querySelectorAll('.timeline-card.completed');
  const eventCard = document.querySelector('.timeline-card.event');
  const eventIcon = document.querySelector('.timeline-event-icon');

  // ?嗆?曌宏??Timeline 蝭暺?嚗?鈭桀????∠?
  timelineNodes.forEach((node, index) => {
    node.addEventListener('mouseenter', function () {
      if (allCards[index]) {
        allCards[index].classList.add('highlight');
      }
    });

    node.addEventListener('mouseleave', function () {
      if (allCards[index]) {
        allCards[index].classList.remove('highlight');
      }
    });
  });

  // ?嗆?曌宏?啣??嚗憭批??? Timeline 蝭暺?  timelineCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function () {
      if (timelineNodes[index]) {
        timelineNodes[index].classList.add('scale-up');
      }
    });

    card.addEventListener('mouseleave', function () {
      if (timelineNodes[index]) {
        timelineNodes[index].classList.remove('scale-up');
      }
    });
  });

  // ?嗆?曌宏?唬嗾?啣??嚗憭?Timeline 銝?銋曉?內
  if (eventCard && eventIcon) {
    eventCard.addEventListener('mouseenter', function () {
      eventIcon.classList.add('scale-up');
    });

    eventCard.addEventListener('mouseleave', function () {
      eventIcon.classList.remove('scale-up');
    });
  }

  // ?嗆?曌宏??Timeline 銝?銋曉?內??擃漁銋曉?∠?
  if (eventIcon && eventCard) {
    eventIcon.addEventListener('mouseenter', function () {
      eventCard.classList.add('highlight');
    });

    eventIcon.addEventListener('mouseleave', function () {
      eventCard.classList.remove('highlight');
    });
  }
});
