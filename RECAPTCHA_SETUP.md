# Google reCAPTCHA Setup Guide

## Current Status
✅ reCAPTCHA v2 đã được tích hợp vào form xác thực
✅ Sử dụng test keys để development
✅ API endpoint `/api/verify-profile` đã sẵn sàng

## Development Keys (Hiện tại)
- Site Key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` (Google test key)
- Secret Key: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe` (Google test key)

## Production Setup

### Bước 1: Đăng ký reCAPTCHA
1. Truy cập: https://www.google.com/recaptcha/admin/create
2. Chọn reCAPTCHA v2
3. Thêm domain: `yourdomain.com`
4. Lấy Site Key và Secret Key

### Bước 2: Cập nhật Environment Variables
```bash
# .env.local (Production)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_actual_site_key
RECAPTCHA_SECRET_KEY=your_actual_secret_key
```

### Bước 3: Deploy
- Site Key: Sử dụng trong frontend (public)
- Secret Key: Chỉ sử dụng trong API routes (private)

## Features Implemented

### Frontend Protection
- ✅ reCAPTCHA widget trước khi submit form
- ✅ Button bị disable cho đến khi hoàn thành captcha
- ✅ Auto reset captcha khi verification fails
- ✅ Validation error cho missing captcha

### Backend Verification
- ✅ API route `/api/verify-profile`
- ✅ Server-side captcha verification với Google
- ✅ Error handling cho captcha failures
- ✅ Rate limiting protection

### Security Benefits
- 🔒 Ngăn chặn bot crawl data
- 🔒 Ngăn chặn automated attacks
- 🔒 Bảo vệ khỏi spam submissions
- 🔒 Verification token chỉ dùng 1 lần

## Testing
1. Điền form với thông tin hợp lệ
2. Hoàn thành reCAPTCHA
3. Submit form
4. Với test keys: tất cả captcha sẽ pass

## Notes
- Test keys hoạt động trên localhost
- Production cần real keys từ Google Console
- reCAPTCHA v2 có độ tin cậy cao và UX tốt
- API route có thể mở rộng thêm rate limiting
