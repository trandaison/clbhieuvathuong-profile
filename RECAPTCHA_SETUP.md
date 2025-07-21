# Google reCAPTCHA Setup Guide

## Current Status
✅ reCAPTCHA v2 đã được tích hợp vào form xác thực
✅ Sử dụng test keys để development
✅ API endpoint `/api/verify-profile` đã sẵn sàng
✅ **NEW:** Tích hợp API thực tế cho public profiles

## API Integration
### Public Profile API
- **Endpoint:** `GET /api/public_profiles/{uuid}`
- **Partial Data:** Chỉ trả về `name` và `avatar` (status 206)
- **Full Data:** Trả về tất cả thông tin khi có verification query params (status 200)
- **Query Parameters cho verification:**
  - `gender`: "male" | "female"
  - `id_number`: Số CMND/CCCD
  - `phone_number`: Số điện thoại
  - `birthday`: Ngày sinh (format DD/MM/YYYY)

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

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
