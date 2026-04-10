<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message — Auromax</title>
    <style>
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f4f4f8; margin: 0; padding: 40px 20px; color: #333; }
        .wrapper { max-width: 600px; margin: 0 auto; }
        .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #6c63ff, #00d4ff); padding: 36px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 0.9rem; }
        .body { padding: 36px 40px; }
        .field { margin-bottom: 24px; }
        .field-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6c63ff; margin-bottom: 6px; }
        .field-value { font-size: 1rem; color: #1a1a2e; line-height: 1.6; }
        .message-box { background: #f8f8fc; border-left: 3px solid #6c63ff; border-radius: 0 8px 8px 0; padding: 16px 20px; }
        .divider { border: none; border-top: 1px solid #eee; margin: 28px 0; }
        .footer { background: #f8f8fc; padding: 20px 40px; text-align: center; }
        .footer p { margin: 0; font-size: 0.8rem; color: #999; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 50px; background: rgba(108,99,255,0.1); color: #6c63ff; font-size: 0.8rem; font-weight: 700; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">
        <div class="header">
            <h1>⚡ Auromax Digital</h1>
            <p>New contact form submission</p>
        </div>
        <div class="body">
            <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">{{ $data['first_name'] }} {{ $data['last_name'] }}</div>
            </div>
            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">
                    <a href="mailto:{{ $data['email'] }}" style="color:#6c63ff;">{{ $data['email'] }}</a>
                </div>
            </div>
            <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">
                    <span class="badge">{{ ucfirst($data['subject']) }}</span>
                </div>
            </div>
            <hr class="divider">
            <div class="field">
                <div class="field-label">Message</div>
                <div class="field-value message-box">{{ $data['message'] }}</div>
            </div>
        </div>
        <div class="footer">
            <p>Sent via Auromax Digital contact form &mdash; {{ now()->format('M d, Y \a\t h:i A') }}</p>
        </div>
    </div>
</div>
</body>
</html>
