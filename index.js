require("dotenv").config();
const express = require("express");
const { Telegraf, Markup, session } = require("telegraf");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const { TEACHERS, STUDENTS, SECRET_CHANNEL_ID } = require("./config");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

// === ФАЙЛ ДЛЯ ХРАНЕНИЯ БАЛЛОВ ===
const SCORES_FILE = "./data/scores.json";

// === ЧТЕНИЕ БАЛЛОВ ===
function loadScores() {
  if (!fs.existsSync(SCORES_FILE)) return {};
  return JSON.parse(fs.readFileSync(SCORES_FILE));
}

// === СОХРАНЕНИЕ БАЛЛОВ ===
function saveScores(data) {
  const dir = path.dirname(SCORES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2));
}

// === ЦВЕТ В ЗАВИСИМОСТИ ОТ ПОВЕДЕНИЯ ===
function getColor(score) {
  if (score === 0) return "🟢 Примерное поведение";
  if (score <= 5) return "🟡 Плохое поведение";
  return "🔴 Очень плохое поведение";
}

// === ПРОВЕРКА НА ПРЕПОДАВАТЕЛЯ ===
function isTeacher(ctx) {
  const username = `@${ctx.from.username || ""}`;
  return TEACHERS.includes(username);
}

// === КОМАНДА /start ===
bot.start((ctx) => {
  if (!isTeacher(ctx)) return ctx.reply("❌ Вы не являетесь преподавателем!");
  ctx.session = {};
  ctx.reply(
    `Здравствуйте! 👋 Этот бот предназначен для учёта штрафных баллов учеников.\n
Вы можете использовать его только как преподаватель.\n
Чтобы начать, нажмите кнопку «➕ Добавить штраф».`,
    Markup.keyboard([["➕ Добавить штраф"]]).resize()
  );
});

// === ДОБАВЛЕНИЕ ШТРАФА ===
bot.hears("➕ Добавить штраф", (ctx) => {
  if (!isTeacher(ctx)) return ctx.reply("❌ Вы не являетесь преподавателем!");
  if (!ctx.session) ctx.session = {};
  ctx.reply(
    "❓ Какой тип штрафа хотите добавить?",
    Markup.inlineKeyboard([
      [Markup.button.callback("⚠️ Плохое поведение (1 балл)", "type_bad")],
      [Markup.button.callback("🚨 Очень плохое поведение (3 балла)", "type_verybad")],
    ])
  );
});

// === ВЫБОР ТИПА ШТРАФА ===
bot.action(/type_(.+)/, (ctx) => {
  if (!ctx.session) ctx.session = {};
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

// === ВЫБОР КЛАССА ===
bot.action(/class_(.+)/, (ctx) => {
  if (!ctx.session) ctx.session = {};
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

// === ВЫБОР УЧЕНИКА ===
bot.action(/student_(.+)/, async (ctx) => {
  const student = ctx.match[1];
  const { type, className } = ctx.session;

  if (!type || !className)
    return ctx.reply("❌ Сначала выберите тип штрафа и класс!");

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

// === ✅ ПОДТВЕРЖДЕНИЕ ===
bot.action("confirm_add", async (ctx) => {
  const { type, className, student } = ctx.session || {};
  if (!type || !className || !student) return;

  const scores = loadScores();
  if (!scores[className]) scores[className] = {};
  scores[className][student] = (scores[className][student] || 0) + type;
  saveScores(scores);

  const total = scores[className][student];
  const teacher = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

  const message = `✅ ${student} из класса ${className} получил ${type} штрафных балл(ов).\n\nВсего: ${total} (${getColor(total)})\n👨‍🏫 Добавил: ${teacher}`;

  await ctx.editMessageText(message);

  try {
    await bot.telegram.sendMessage(SECRET_CHANNEL_ID, message);
  } catch (err) {
    console.error("❌ Ошибка при отправке в канал:", err);
  }

  ctx.session = {};
  await ctx.reply(
    "➕ Добавить ещё один штраф?",
    Markup.keyboard([["➕ Добавить штраф"]]).resize()
  );
  ctx.answerCbQuery("✅ Подтверждено!");
});

// === ❌ ОТМЕНА ===
bot.action("cancel_add", async (ctx) => {
  ctx.session = {};
  await ctx.editMessageText("❌ Добавление штрафа отменено.");
  await ctx.reply(
    "Хотите добавить другой штраф?",
    Markup.keyboard([["➕ Добавить штраф"]]).resize()
  );
  ctx.answerCbQuery("Отменено");
});

// === ЕЖЕДНЕВНЫЙ ОТЧЁТ ===
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

// === EXPRESS SERVER (WEBHOOK) ===
app.get("/", (req, res) => {
  res.send("🤖 Union Shikoyat Bot работает стабильно!");
});

app.use(express.json());
app.use(bot.webhookCallback(`/webhook/${process.env.BOT_TOKEN}`));

// === УСТАНОВКА WEBHOOK ===
const WEBHOOK_URL = `https://union-shikoyat-bot.onrender.com/webhook/${process.env.BOT_TOKEN}`;
bot.telegram.setWebhook(WEBHOOK_URL);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web-сервер запущен на порту ${PORT}`);
});
