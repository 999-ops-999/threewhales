// dialog.js — диалог ближайших розыгрышей всех трёх лотерей

const i18nDialog = {
    fr: {
        next_lottery_draws: 'Prochains tirages',
        today: "Aujourd'hui",
        ok: 'OK',
        names: {
            lotto_max: 'Lotto Max',
            lotto_649: 'Lotto 6/49',
            daily_grand: 'Grande Vie'
        }
    },
    en: {
        next_lottery_draws: 'Next Lottery Draws',
        today: 'Today',
        ok: 'OK',
        names: {
            lotto_max: 'Lotto Max',
            lotto_649: 'Lotto 6/49',
            daily_grand: 'Daily Grand'
        }
    }
};

// --- вычисление ближайшего дня недели ---
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
    const draws = [];

    const lottoMaxDays = [2, 5]; // Tue, Fri
    const nextMax = lottoMaxDays.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];

    const lotto649Days = [3, 6]; // Wed, Sat
    const next649 = lotto649Days.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];

    const dailyDays = [1, 4]; // Mon, Thu
    const nextDaily = dailyDays.map(d => nextDayOfWeek(today, d)).sort((a, b) => a - b)[0];

    draws.push({ id: 'lotto_max', img: 'img/lotto_max.webp', date: nextMax });
    draws.push({ id: 'lotto_649', img: 'img/l6_49.webp', date: next649 });
    draws.push({ id: 'daily_grand', img: 'img/daily_grand.webp', date: nextDaily });

    return draws.sort((a, b) => a.date - b.date);
}

function formatLocalDate(d, lang) {
    return d.toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric' });
}

// --- запуск при загрузке страницы ---
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('dialogShown')) return;

    const lang = localStorage.getItem('lang') || 'en';
    const t = i18nDialog[lang];
    const draws = computeNextDraws();
    if (!draws.length) return;

    const today = new Date();
    const host = document.getElementById('dialogHost');
    if (!host) return;

    const dlg = document.createElement('div');
    dlg.className = 'dialog-backdrop';

    // строим список розыгрышей
    const rows = draws.map(draw => {
        const name = t.names[draw.id];
        const isToday = draw.date.toDateString() === today.toDateString();
        const dateLabel = isToday ? t.today : formatLocalDate(draw.date, lang);
        return `
      <div class="draw-row">
        <img src="${draw.img}" alt="${name}" class="draw-icon" />
        <div class="draw-info">
          <strong>${name}</strong><br>
          <span class="draw-date">${dateLabel}</span>
        </div>
      </div>
    `;
    }).join('');

    dlg.innerHTML = `
    <div class="dialog">
      <h3>${t.next_lottery_draws}</h3>
      <div class="draw-list">${rows}</div>
      <button id="dlgOk">${t.ok}</button>
    </div>
  `;
    host.appendChild(dlg);

    document.getElementById('dlgOk').addEventListener('click', () => dlg.remove());
    sessionStorage.setItem('dialogShown', 'true');
});
