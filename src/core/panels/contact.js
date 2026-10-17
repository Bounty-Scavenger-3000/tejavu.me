// CONTACT panel: the cheque form.
// Fills in today's date and swaps the form for the success state on submit.
// The form does not send anything yet. It needs a real endpoint (Formspree ID in the
// form's action) and a submit handler that posts to it.

export function initContact({ formId = 'chequeForm', okId = 'chequeOK', dateId = 'chequeDate' } = {}) {
  const dateEl = document.getElementById(dateId);
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById(formId).style.display = 'none';
      document.getElementById(okId).style.display = 'block';
    });
  }
}
