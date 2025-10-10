// Timeline 和 Card 互動效果
document.addEventListener('DOMContentLoaded', function () {
  // Dry Ice Toggle 功能
  const dryiceToggle = document.getElementById('dryiceToggle');
  const eventCard = document.querySelector('.timeline-card.event');
  const eventIcon = document.querySelector('.timeline-event-icon');
  const statusActive = document.querySelector('.status-text.active');
  const statusInactive = document.querySelector('.status-text.inactive');

  if (dryiceToggle && eventCard && eventIcon) {
    dryiceToggle.addEventListener('change', function () {
      if (this.checked) {
        // 顯示乾冰
        eventCard.style.display = 'flex';
        eventIcon.style.display = 'block';
        statusActive.style.opacity = '1';
        statusInactive.style.opacity = '0.3';
      } else {
        // 隱藏乾冰
        eventCard.style.display = 'none';
        eventIcon.style.display = 'none';
        statusActive.style.opacity = '0.3';
        statusInactive.style.opacity = '1';
      }
    });
  }

  const timelineNodes = document.querySelectorAll('.timeline-node.completed');
  const allCards = document.querySelectorAll(
    '.timeline-card.completed, .timeline-card.event'
  );
  const timelineCards = document.querySelectorAll('.timeline-card.completed');

  // 當滑鼠移到 Timeline 節點時，高亮對應的卡片
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

  // 當滑鼠移到卡片時，放大對應的 Timeline 節點
  timelineCards.forEach((card, index) => {
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

  // 當滑鼠移到乾冰卡片時，放大 Timeline 上的乾冰圖示並切換圖片
  if (eventCard && eventIcon) {
    const eventCardImg = eventCard.querySelector('.card-icon-img');
    const eventIconImg = eventIcon.querySelector('img');

    eventCard.addEventListener('mouseenter', function () {
      eventIcon.classList.add('scale-up');
      // 切換為 hover 圖示
      if (eventCardImg) {
        eventCardImg.src = 'images/icon-dryice_hover.svg';
      }
      if (eventIconImg) {
        eventIconImg.src = 'images/icon-dryice_hover.svg';
      }
    });

    eventCard.addEventListener('mouseleave', function () {
      eventIcon.classList.remove('scale-up');
      // 切換回原始圖示
      if (eventCardImg) {
        eventCardImg.src = 'images/icon-dryice.svg';
      }
      if (eventIconImg) {
        eventIconImg.src = 'images/icon-dryice.svg';
      }
    });
  }

  // 當滑鼠移到 Timeline 上的乾冰圖示時，高亮乾冰卡片並切換圖片
  if (eventIcon && eventCard) {
    const eventCardImg = eventCard.querySelector('.card-icon-img');
    const eventIconImg = eventIcon.querySelector('img');

    eventIcon.addEventListener('mouseenter', function () {
      eventCard.classList.add('highlight');
      // 切換為 hover 圖示
      if (eventCardImg) {
        eventCardImg.src = 'images/icon-dryice_hover.svg';
      }
      if (eventIconImg) {
        eventIconImg.src = 'images/icon-dryice_hover.svg';
      }
    });

    eventIcon.addEventListener('mouseleave', function () {
      eventCard.classList.remove('highlight');
      // 切換回原始圖示
      if (eventCardImg) {
        eventCardImg.src = 'images/icon-dryice.svg';
      }
      if (eventIconImg) {
        eventIconImg.src = 'images/icon-dryice.svg';
      }
    });
  }
});
