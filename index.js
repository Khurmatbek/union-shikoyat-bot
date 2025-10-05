require("dotenv").config();
const { Telegraf, Markup, session } = require("telegraf");
const fs = require("fs");
const cron = require("node-cron");
const path = require("path");
const express = require("express");
const { TEACHERS, STUDENTS, SECRET_CHANNEL_ID } = require("./config");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const SCORES_FILE = "./data/scores.json";

// === Функции ===
function loadScores() {
  if (!fs.existsSync(SCORES_FILE)) return {};
  return JSON.parse(fs.readFileSync(SCORES_FILE));
}

function saveScores(data) {
  const dir = path.dirname(SCORES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2));
}

function getColor(score) {
  if (score === 0) return "🟢 Примерное поведение";
  if (score <= 5) return "🟡 Плохое поведение";
  return "🔴 Очень плохое поведение";
}

function isTeacher(ctx) {
  const username = `@${ctx.from.username || ""}`;
  return TEACHERS.includes(username);
}

// === RESET (только при необходимости) ===
if (process.env.RESET_SCORES === "true") {
  const scores = {};
  for (const [className, students] of Object.entries(STUDENTS)) {
    scores[className] = {};
    for (const student of students) {
      scores[className][student] = 0;
    }
  }
  fs.mkdirSync("./data", { recursive: true });
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  console.log("🔁 Все баллы сброшены до 0 (RESET_SCORES=true)");
} else {
  console.log("⚙️ RESET_SCORES=false — данные не изменены");
}

// === /start ===
bot.start((ctx) => {
  if (!isTeacher(ctx)) return ctx.reply("❌ Вы не являетесь преподавателем!");
  ctx.session = {};
  ctx.reply(
    `Здравствуйте! Этот бот предназначен для учёта штрафных баллов учеников.\n\nЧтобы начать, нажмите кнопку «➕ Добавить штраф».`,
    Markup.keyboard([["➕ Добавить штраф"]]).resize()
  );
});

// === Добавить штраф ===
bot.hears("➕ Добавить штраф", (ctx) => {
  if (!isTeacher(ctx)) return ctx.reply("❌ Вы не являетесь преподавателем!");
  ctx.reply(
    "❓ Какой тип штрафа хотите добавить?",
    Markup.inlineKeyboard([
      [Markup.button.callback("⚠️ Плохое поведение (1 балл)", "type_bad")],
      [Markup.button.callback("🚨 Очень плохое поведение (3 балла)", "type_verybad")],
    ])
  );
});

// === Выбор типа штрафа ===
bot.action(/type_(.+)/, (ctx) => {
  const type = ctx.match[1];
  ctx.session.type = type === "bad" ? 1 : 3;

  ctx.editMessageText(
    "📚 Выберите класс:",
    Markup.inlineKeyboard(
      Object.keys(STUDENTS).map((c) => [Markup.button.callback(c, `class_${c}`)])
    )
  );
  ctx.answerCbQuery();
});

// === Выбор класса ===
bot.action(/class_(.+)/, (ctx) => {
  const className = ctx.match[1];
  ctx.session.className = className;

  ctx.editMessageText(
    `👨‍🎓 Выберите ученика (${className}):`,
    Markup.inlineKeyboard(
      STUDENTS[className].map((s) => [Markup.button.callback(s, `student_${s}`)])
    )
  );
  ctx.answerCbQuery();
});

// === Выбор ученика ===
bot.action(/student_(.+)/, async (ctx) => {
  const student = ctx.match[1];
  const { type, className } = ctx.session;

  ctx.session.student = student;

  const scoreTypeText = type === 1 ? "⚠️ Плохое (1 балл)" : "🚨 Очень плохое (3 балла)";
  const confirmText = `Подтвердите действие:\n\n📚 Класс: ${className}\n👨‍🎓 Ученик: ${student}\n🏷️ Тип штрафа: ${scoreTypeText}`;

  await ctx.editMessageText(
    confirmText,
    Markup.inlineKeyboard([
      [Markup.button.callback("✅ Подтвердить", "confirm_add")],
      [Markup.button.callback("❌ Отменить", "cancel_add")],
    ])
  );
  ctx.answerCbQuery();
});

// === Подтверждение ===
bot.action("confirm_add", async (ctx) => {
  const { type, className, student } = ctx.session || {};
  if (!type || !className || !student) return;

  const scores = loadScores();
  if (!scores[className]) scores[className] = {};
  scores[className][student] = (scores[className][student] || 0) + type;
  saveScores(scores);

  const total = scores[className][student];
  const teacher = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const message = `✅ ${student} из класса ${className} получил ${type} штрафных балл(ов).\nВсего: ${total} (${getColor(total)})\n👨‍🏫 Добавил: ${teacher}`;

  await ctx.editMessageText(message);
  try {
    await bot.telegram.sendMessage(SECRET_CHANNEL_ID, message);
  } catch (err) {
    console.error("❌ Ошибка при отправке в канал:", err);
  }

  ctx.session = {};
  await ctx.reply("➕ Добавить ещё один штраф?", Markup.keyboard([["➕ Добавить штраф"]]).resize());
  ctx.answerCbQuery("✅ Подтверждено!");
});

// === Отмена ===
bot.action("cancel_add", async (ctx) => {
  ctx.session = {};
  await ctx.editMessageText("❌ Добавление штрафа отменено.");
  await ctx.reply("Хотите добавить другой штраф?", Markup.keyboard([["➕ Добавить штраф"]]).resize());
  ctx.answerCbQuery("Отменено");
});

// === Ежедневный отчёт ===
cron.schedule("59 23 * * *", async () => {
  const scores = loadScores();
  if (Object.keys(scores).length === 0) return;

  let report = "📊 Ежедневный отчёт (итог по всем классам):\n\n";
  for (const [className, students] of Object.entries(scores)) {
    report += `📚 ${className}:\n`;
    for (const [name, score] of Object.entries(students)) {
      report += `   ${name} — ${score} балл(ов) (${getColor(score)})\n`;
    }
    report += "\n";
  }

  try {
    await bot.telegram.sendMessage(SECRET_CHANNEL_ID, report);
  } catch (err) {
    console.error("❌ Ошибка при отправке отчёта:", err);
  }
});

// === Express server (Render ping) ===
const app = express();
app.get("/", (req, res) => res.send("🤖 Бот работает стабильно (Render + polling)"));
app.listen(process.env.PORT || 3000, () => console.log("🌐 Web-сервер запущен"));

bot.launch();
console.log("🤖 Бот запущен и работает...");
