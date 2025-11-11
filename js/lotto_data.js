// lotto_data.js
import { i18n } from './ui.js';

function nextDayOfWeek(from, target) {
  const date = new Date(from);
  for (let i = 0; i < 7; i++) {
    if (date.getDay() === target) return new Date(date);
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function computeNextDraws() {
  const today = new Date();
  const lottoMaxDays = [2, 5];
  const lotto649Days = [3, 6];
  const dailyDays = [1, 4];
  const nextMax = lottoMaxDays.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];
  const next649 = lotto649Days.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];
  const nextDaily = dailyDays.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];
  return [
    { name: 'Lotto Max', date: nextMax },
    { name: 'Lotto 6/49', date: next649 },
    { name: 'Daily Grand', date: nextDaily }
  ];
}

export function showNextDrawDialog() {
  const draws = computeNextDraws();
  const next = draws.sort((a, b) => a.date - b.date)[0];
  if (!next) return;

  const host = document.getElementById('dialogHost');
  const lang = localStorage.getItem('lang') || 'en';
  const t = i18n[lang];

  const today = new Date();
  const isToday = next.date.toDateString() === today.toDateString();
  const formattedDate = isToday 
    ? t.today 
    : next.date.toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric' });

  const dlg = document.createElement('div');
  dlg.className = 'dialog-backdrop';
  dlg.innerHTML = `
    <div class='dialog'>
      <strong>${t.next_draw}</strong>
      <div style='margin-top:8px;font-size:18px'>
        ${next.name}<br>${formattedDate}
      </div>
      <div><button id='dlgOk'>${t.ok}</button></div>
    </div>`;
  host.appendChild(dlg);
  document.getElementById('dlgOk').addEventListener('click', () => host.removeChild(dlg));
}
