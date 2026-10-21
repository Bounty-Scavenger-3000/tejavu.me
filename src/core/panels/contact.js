// CONTACT panel: the cheque form.
// There is no backend. Submitting opens the visitor's mail app with a message to the address
// in the form's data-to attribute, prefilled from the cheque, then swaps the form for the
// confirmation state.

export function initContact({ formId = 'chequeForm', okId = 'chequeOK', dateId = 'chequeDate' } = {}) {
  const dateEl = document.getElementById(dateId);
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = 'Message from ' + data.get('from');
    const body = data.get('memo') + '\n\n' + data.get('from') + '\n' + data.get('email');
    window.location.href = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.style.display = 'none';
    document.getElementById(okId).style.display = 'block';
  });
}
