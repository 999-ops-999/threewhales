import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";

function nextDrawDate(lastDate, daysOfWeek) {
  const from = new Date(lastDate);
  const nextDates = daysOfWeek.map(d => {
    const date = new Date(from);
    while (date.getDay() !== d) date.setDate(date.getDate() + 1);
    return date;
  });
  return nextDates.sort((a,b)=>a-b)[0];
}

export async function fetchLottoMax() {
  const url = "https://ontariolotterylive.com/lotto-max-numbers";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const dateStr = $(".centred .date").text().trim();
  const lastDrawDate = new Date(dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1"));

  const balls = $(".centred .resultBall.ball")
    .map((i, el) => Number($(el).text()))
    .get();
  const bonus = Number($(".centred .bonus-ball").text());
  const jackpot = $(".jackpot.red").first().text().trim();
  const nextDraw = nextDrawDate(lastDrawDate, [2, 5]); // Tue, Fri

  return {
    last_draw_date: lastDrawDate.toDateString(),
    next_draw_date: nextDraw.toDateString(),
    jackpot,
    last_numbers: balls,
    bonus
  };
}

// запуск отдельно
(async () => {
  const data = await fetchLottoMax();
  fs.writeFileSync("lottoMax.json", JSON.stringify(data, null, 2));
})();
