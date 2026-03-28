import dotenv from 'dotenv';
dotenv.config();

const testTelegram = async () => {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  console.log('Token:', BOT_TOKEN ? 'Present' : 'Missing');
  console.log('Chat ID:', CHAT_ID ? 'Present' : 'Missing');

  const message = "🔍 Тестовое сообщение с сайта";

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      }),
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Успех! Сообщение отправлено.');
    } else {
      console.error('❌ Ошибка Telegram API:', data);
    }
  } catch (err) {
    console.error('💥 Ошибка сети:', err);
  }
};

testTelegram();
