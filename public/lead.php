<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    exit;
}

$bot_token = '8778679367:AAHzAsbzsV34Zt3YRXq4Cbn6W9rLH66n-PI';
$chat_id   = '5930269100';

$name    = isset($data['name'])    ? trim($data['name'])    : '';
$phone   = isset($data['phone'])   ? trim($data['phone'])   : '';
$address = isset($data['address']) ? trim($data['address']) : '';
$type    = isset($data['type'])    ? trim($data['type'])    : 'contact';

$text  = "🔔 <b>Новая заявка с сайта uf66.ru</b>\n\n";
$text .= "👤 Имя: " . ($name ?: '—') . "\n";
$text .= "📞 Телефон: <b>" . ($phone ?: '—') . "</b>\n";
if ($address) {
    $text .= "📍 Адрес: " . $address . "\n";
}
$text .= "📋 Тип: " . $type . "\n";
$text .= "\n🕐 " . date('d.m.Y H:i', time() + 5 * 3600); // UTC+5 Екатеринбург

$url = "https://api.telegram.org/bot{$bot_token}/sendMessage";

$payload = json_encode([
    'chat_id'    => $chat_id,
    'text'       => $text,
    'parse_mode' => 'HTML',
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$result = curl_exec($ch);
$error  = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Telegram send failed']);
    exit;
}

$tg = json_decode($result, true);
if (!$tg || !$tg['ok']) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Telegram API error']);
    exit;
}

echo json_encode(['status' => 'success', 'message' => 'Lead received']);
