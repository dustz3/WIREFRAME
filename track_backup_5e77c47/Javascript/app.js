const statusContent = document.getElementById('statusContent');
const timeline = document.getElementById('timeline');
const trackingForm = document.getElementById('tracking-form');
const trackingInput = document.getElementById('trackingNo');

const DATA_ENDPOINT = 'data/mock-tracking.json';

const STATUS_MESSAGES = {
  idle: '隢撓?亥蕭頩斤楊?誑????啁???,
  loading: '甇??亥岷鞎其辣???隢???..',
  notFound: '?亦甇方蕭頩斤楊??蝝??隢Ⅱ隤楊??行迤蝣箝?,
  error: '???急??⊥?雿輻嚗???閰行??舐窗摰Ｘ?鈭箏??,
};

function renderStatus(statusData) {
  statusContent.innerHTML = '';

  if (!statusData) {
    statusContent.innerHTML = `<p class="status-placeholder">${STATUS_MESSAGES.idle}</p>`;
    return;
  }

  const { currentStatus, updatedAt, eta, location } = statusData;

  const statusItems = [
    { label: '?桀????, value: currentStatus || '?? },
    { label: '?敺??, value: updatedAt || '?? },
    { label: '?桀?雿蔭', value: location || '?? },
    { label: '???菟?', value: eta || '?? },
  ];

  statusItems.forEach(({ label, value }) => {
    const row = document.createElement('div');
    row.className = 'status-item';
    row.innerHTML = `
      <span class="status-label">${label}</span>
      <span class="status-value">${value}</span>
    `;
    statusContent.appendChild(row);
  });
}

function renderTimeline(events) {
  timeline.innerHTML = '';

  if (!events || events.length === 0) {
    timeline.innerHTML = '<li class="timeline-placeholder">撠????/li>';
    return;
  }

  events
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach((event) => {
      const item = document.createElement('li');
      item.innerHTML = `
        <div class="timeline-step">${event.status}</div>
        <div class="timeline-meta">${event.timestamp}嚚?{event.location}</div>
        ${event.note ? `<div class="timeline-note">${event.note}</div>` : ''}
      `;
      timeline.appendChild(item);
    });
}

async function fetchTrackingData(trackingNo) {
  try {
    const response = await fetch(DATA_ENDPOINT);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    return data[trackingNo] || null;
  } catch (error) {
    console.error('Fetch tracking data failed:', error);
    return 'error';
  }
}

async function handleTracking(trackingNo) {
  statusContent.innerHTML = `<p class="status-placeholder">${STATUS_MESSAGES.loading}</p>`;
  timeline.innerHTML = '';

  const result = await fetchTrackingData(trackingNo);

  if (result === 'error') {
    statusContent.innerHTML = `<p class="status-placeholder">${STATUS_MESSAGES.error}</p>`;
    timeline.innerHTML =
      '<li class="timeline-placeholder">蝔?閰行??舐窗摰Ｘ?鈭箏??/li>';
    return;
  }

  if (!result) {
    statusContent.innerHTML = `<p class="status-placeholder">${STATUS_MESSAGES.notFound}</p>`;
    timeline.innerHTML = '<li class="timeline-placeholder">??/li>';
    return;
  }

  renderStatus(result.statusSummary);
  renderTimeline(result.events);
}

trackingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const trackingNo = trackingInput.value.trim().toUpperCase();

  if (!trackingNo) return;

  handleTracking(trackingNo);
  const url = new URL(window.location);
  url.searchParams.set('no', trackingNo);
  window.history.replaceState({}, '', url);
});

function initFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const trackingNo = params.get('no');

  if (trackingNo) {
    trackingInput.value = trackingNo;
    handleTracking(trackingNo);
  } else {
    renderStatus(null);
    renderTimeline([]);
  }
}

document.addEventListener('DOMContentLoaded', initFromQuery);

