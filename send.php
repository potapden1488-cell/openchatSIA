<?php
// send.php - отправка email на openchatsia@gmail.com
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Твоя почта
$to = "openchatsia@gmail.com";

// Получаем данные
$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');
$type = $data['type'] ?? 'waitlist';

if (empty($email)) {
    echo json_encode(['success' => false, 'error' => 'Email не указан']);
    exit;
}

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Неверный формат email']);
    exit;
}

// Формируем письмо
if ($type === 'question') {
    $subject = "💬 Новый вопрос от пользователя openSIA";
    $body = "📧 От: $email\n\n📝 Вопрос:\n$message\n\n---\nОтправлено с сайта openSIA";
} else {
    $subject = "🔔 Новый подписчик openSIA";
    $body = "📧 Email: $email\n\n✅ Хочет получить уведомление о запуске!\n\n---\nОтправлено с сайта openSIA";
}

// Заголовки
$headers = "From: openchatsia@gmail.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

// Отправка
$success = mail($to, $subject, $body, $headers);

if ($success) {
    // Сохраняем в файл для статистики
    $logFile = 'subscribers.txt';
    $logEntry = date('Y-m-d H:i:s') . " | $email | $type\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
    
    echo json_encode(['success' => true, 'message' => 'Отправлено! Спасибо!']);
} else {
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки. Попробуйте позже.']);
}
?>