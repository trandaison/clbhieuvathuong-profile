# API Integration Test Guide

## Testing the Blood Donation Profile System

### Architecture Overview
- **Frontend**: Next.js client components
- **Backend Integration**: Server Actions (no CORS issues)
- **API**: External API on localhost:8000
- **Security**: Google reCAPTCHA v2 + server-side verification
- **Data Integration**: Full API integration with real donation histories, statistics, and top donors

### 1. Test với UUID hợp lệ

Thử truy cập: `http://localhost:3000/public-profile/2vjAQjqy` (hoặc UUID có sẵn trong API)

**Expected behavior:**
- Hiển thị form verification với name và avatar từ API (partial data)
- User điền thông tin verification
- Server action gọi API với verification data
- Sau khi verification thành công → hiển thị full profile với:
  * **Real donation histories** từ API field `histories[]` với place names
  * **Real statistics** từ API field `statistics` (current_rank, total_donations, etc.)
  * **Real top donors** từ API field `statistics.top_donors[]` với ngày hiến máu gần nhất
  * **Smart type mapping**: `platelets` → "Hiến tiểu cầu", auto blood type conversion
  * **Graceful fallbacks**: Mock data nếu API fields không có

### 2. Test với UUID không tồn tại

Thử truy cập: `http://localhost:3000/public-profile/invalid-uuid`

**Expected behavior:**
- Hiển thị trang 404 Not Found

### 3. Server Actions Flow

#### Server-side API calls (no CORS):
- `fetchPublicProfileAction()`: Gọi API để lấy profile data
- `verifyProfileAction()`: Verify reCAPTCHA + gọi API với full verification data

#### Frontend → Server Action → External API:
```
Client Component → Server Action → API localhost:8000
(No CORS issues because server-to-server call)
```

#### New API Fields Integrated:
- **histories[]**: Real donation records với dates, places, donation_type, platelet_count
- **statistics**: current_rank, total_donations, total_donors_count, same_blood_type_count
- **statistics.top_donors[]**: Real top donors với donation_count, blood_type, last_donation_date
- **Smart mapping**:
  - `donation_type: "platelets"` → "Hiến tiểu cầu"
  - `blood_type: "o_pos"` → "O+"
  - `place.name` → Location display
- **Note**: `top_donors.rank` không được sử dụng vì không chính xác (thay bằng array index + 1)

### 4. Test reCAPTCHA Integration

1. Mở form verification
2. Điền thông tin đúng theo API requirements
3. Complete reCAPTCHA (với test keys, tất cả sẽ pass)
4. Submit form → Server action verify cả API data và reCAPTCHA

### 5. Environment Variables cần thiết

```bash
# .env.local
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

**Note**: API_BASE_URL không có `NEXT_PUBLIC_` prefix vì chỉ dùng server-side

### 6. Production Deployment Checklist

- [ ] Thay thế `NEXT_PUBLIC_API_BASE_URL` với production API URL
- [ ] Thay thế reCAPTCHA test keys với production keys
- [ ] Cấu hình domain cho reCAPTCHA trong Google Console
- [ ] Test thoroughly trên production environment

### 7. Troubleshooting

**Lỗi 404 cho UUID hợp lệ:**
- Kiểm tra API server có chạy không
- Kiểm tra `NEXT_PUBLIC_API_BASE_URL` đúng chưa

**reCAPTCHA không load:**
- Kiểm tra `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- Kiểm tra network có block Google services không

**Verification luôn fail:**
- Kiểm tra format birthday (DD/MM/YYYY)
- Kiểm tra gender value ("male" hoặc "female")
- Kiểm tra API response có chính xác không
