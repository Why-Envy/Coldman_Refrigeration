<?php
/**
 * ColdMan Refrigeration request processor.
 *
 * This version works on normal shared hosting without requiring a database.
 * It validates the form submission and appends the request to leads.json.
 * You can later replace the JSON storage section with MySQL or an SMS gateway.
 */

function clean_input($value) {
    return htmlspecialchars(trim((string) $value), ENT_QUOTES, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit();
}

$name = clean_input($_POST['client_name'] ?? '');
$phone = clean_input($_POST['client_phone'] ?? '');
$service = clean_input($_POST['service_type'] ?? '');
$timeline = clean_input($_POST['timeline'] ?? 'Not specified');
$details = clean_input($_POST['details'] ?? '');

$errors = [];
if ($name === '') { $errors[] = 'Full name is required.'; }
if ($phone === '') { $errors[] = 'Phone number is required.'; }
if ($service === '') { $errors[] = 'Service type is required.'; }
if ($details === '') { $errors[] = 'Project details are required.'; }

if (!empty($errors)) {
    http_response_code(422);
    echo '<!doctype html><html><head><meta charset="utf-8"><title>Request Error</title><style>body{font-family:Arial,sans-serif;background:#eaffff;color:#082332;padding:40px}.card{max-width:720px;margin:auto;background:white;padding:28px;border-radius:24px;box-shadow:0 20px 50px rgba(8,35,50,.16)}a{color:#047783;font-weight:700}</style></head><body><div class="card"><h1>Please check your request</h1><ul>';
    foreach ($errors as $error) { echo '<li>' . $error . '</li>'; }
    echo '</ul><a href="contact.html">Return to contact form</a></div></body></html>';
    exit();
}

$lead = [
    'id' => uniqid('CM-', true),
    'created_at' => date('c'),
    'client_name' => $name,
    'client_phone' => $phone,
    'service_type' => $service,
    'timeline' => $timeline,
    'details' => $details,
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$storageFile = __DIR__ . DIRECTORY_SEPARATOR . 'leads.json';
$existing = [];
if (file_exists($storageFile)) {
    $json = file_get_contents($storageFile);
    $decoded = json_decode($json, true);
    if (is_array($decoded)) { $existing = $decoded; }
}
$existing[] = $lead;
file_put_contents($storageFile, json_encode($existing, JSON_PRETTY_PRINT), LOCK_EX);

// Optional email notification. Uncomment and configure when hosted with mail support.
// $to = 'Mr.coldmanrefrigeration@gmail.com';
// $subject = 'New ColdMan Service Request: ' . $service;
// $message = "Name: $name\nPhone: $phone\nService: $service\nTimeline: $timeline\nDetails: $details";
// @mail($to, $subject, $message);

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Request Submitted | ColdMan Refrigeration</title>
    <style>
        body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(120deg,#24c3bc,#ff7c6b);color:#082332;min-height:100vh;display:grid;place-items:center;padding:24px}
        .card{max-width:760px;background:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.6);box-shadow:0 30px 90px rgba(8,35,50,.22);border-radius:30px;padding:34px;text-align:center}
        .icon{width:72px;height:72px;margin:auto;border-radius:24px;background:#047783;color:white;display:grid;place-items:center;font-size:34px}
        h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1;margin:18px 0 10px;letter-spacing:-.06em}
        p{color:#496a74;font-size:1.05rem;line-height:1.6}.actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:22px}
        a{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:14px 20px;text-decoration:none;font-weight:800}.primary{background:#ff6b64;color:white}.ghost{background:#eaffff;color:#047783}
    </style>
</head>
<body>
    <main class="card">
        <div class="icon">✓</div>
        <h1>Request submitted successfully.</h1>
        <p>Thank you, <?php echo $name; ?>. Your <?php echo $service; ?> request has been recorded. ColdMan Refrigeration will contact you on <?php echo $phone; ?>.</p>
        <div class="actions">
            <a class="primary" href="index.html">Return Home</a>
            <a class="ghost" href="contact.html">Submit Another Request</a>
        </div>
    </main>
</body>
</html>
