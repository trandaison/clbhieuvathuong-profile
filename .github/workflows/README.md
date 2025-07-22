# GitHub Actions Manual Deployment

Workflow này thực hiện deploy production manual theo yêu cầu.

## 🔐 Setup Required

### 1. Tạo SSH Private Key Secret

⚠️ **Quan trọng**: SSH key phải được setup đúng cách để tránh lỗi authentication.

**Step-by-step setup**:

1. **Tạo SSH key pair (nếu chưa có)**:
   ```bash
   # Tạo SSH key mới
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/deploy_key -C "github-actions-deploy"
   
   # Hiển thị public key
   cat ~/.ssh/deploy_key.pub
   ```

2. **Copy public key lên server**:
   ```bash
   # Method 1: Sử dụng ssh-copy-id
   ssh-copy-id -i ~/.ssh/deploy_key.pub root@45.77.38.146
   
   # Method 2: Manual copy
   ssh root@45.77.38.146
   mkdir -p ~/.ssh
   echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Test SSH connection**:
   ```bash
   ssh -i ~/.ssh/deploy_key root@45.77.38.146
   ```

4. **Thêm private key vào GitHub Secrets**:
   - Đi tới repository GitHub → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `SSH_PRIVATE_KEY`
   - Value: Copy toàn bộ nội dung file private key:
   ```bash
   cat ~/.ssh/deploy_key  # Copy toàn bộ output
   ```

5. **Test SSH trong GitHub Actions**:
   - Chạy workflow **"Test SSH Connection"** để verify setup

**Lưu ý**: Đảm bảo copy đúng format private key bao gồm header và footer:
```
-----BEGIN OPENSSH PRIVATE KEY-----
[content here]
-----END OPENSSH PRIVATE KEY-----
```

## 🚀 Cách sử dụng Manual Deploy

### Chạy Manual Deploy:

1. Đi tới GitHub repository → **Actions** tab
2. Chọn workflow **"Manual Deploy to Production"**
3. Click **"Run workflow"**
4. Chọn deployment type:
   - **`full_deploy`**: Pull code mới + build + deploy (mặc định)
   - **`restart_only`**: Chỉ restart containers (nhanh)
   - **`force_rebuild`**: Build lại hoàn toàn không dùng cache
5. Click **"Run workflow"**

## 📋 Các bước thực hiện

Workflow sẽ thực hiện theo đúng yêu cầu:

1. **SSH vào server** `root@45.77.38.146`
2. **Di chuyển đến thư mục** `/root/rails_apps/clbhieuvathuong-profile`
3. **Clone/Pull code**:
   - Nếu chưa có source: Clone repository
   - Nếu đã có source: Pull latest changes
4. **Deploy ứng dụng**:
   - Build Docker image
   - Start containers trên port 3030
   - Health check tự động
5. **Done and exit** ✅

## 🎯 Kết quả

Sau khi deploy thành công:

- **Application URL**: http://45.77.38.146:3030
- **Health Check**: http://45.77.38.146:3030/api/health
- **Logs**: `docker-compose logs -f`

## 📝 Server Requirements

Đảm bảo server đã cài đặt:

- ✅ **Docker** và **Docker Compose**
- ✅ **Git**
- ✅ **SSH key** đã setup
- ✅ **Port 3030** đã được mở

## 🐛 Troubleshooting

### ❌ SSH Authentication Error
```
ssh: handshake failed: ssh: unable to authenticate, attempted methods [none publickey], no supported methods remain
```

**Nguyên nhân**: SSH private key không đúng hoặc chưa được setup đúng cách.

**Cách fix**:

1. **Kiểm tra SSH key trên máy local**:
   ```bash
   # Test SSH connection từ máy local
   ssh root@45.77.38.146
   
   # Nếu được, copy private key
   cat ~/.ssh/id_rsa  # Copy toàn bộ nội dung
   ```

2. **Tạo SSH key mới nếu chưa có**:
   ```bash
   # Tạo SSH key pair mới
   ssh-keygen -t rsa -b 4096 -C "deploy-key"
   
   # Copy public key lên server
   ssh-copy-id root@45.77.38.146
   
   # Hoặc manual copy
   cat ~/.ssh/id_rsa.pub
   # Paste vào server: /root/.ssh/authorized_keys
   ```

3. **Cập nhật GitHub Secret**:
   - Đi tới GitHub repo → Settings → Secrets and variables → Actions
   - Edit `SSH_PRIVATE_KEY` secret
   - Paste toàn bộ nội dung file `~/.ssh/id_rsa` (bao gồm cả header/footer)
   - Format đúng:
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [key content here]
   -----END OPENSSH PRIVATE KEY-----
   ```

4. **Kiểm tra trên server**:
   ```bash
   # SSH vào server
   ssh root@45.77.38.146
   
   # Kiểm tra authorized_keys
   cat ~/.ssh/authorized_keys
   
   # Kiểm tra permissions
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

### Nếu deployment fail:

```bash
# SSH vào server để debug
ssh root@45.77.38.146

# Kiểm tra logs
cd /root/rails_apps/clbhieuvathuong-profile
docker-compose logs --tail=100

# Kiểm tra container status
docker-compose ps

# Restart manual nếu cần
docker-compose restart
```

### Kiểm tra health:

```bash
# Test health endpoint
curl http://localhost:3030/api/health
curl http://45.77.38.146:3030/api/health
```

## 🔄 Deployment Types Explained

### `full_deploy` (Default)
- Pull latest code
- Build Docker image với cache
- Deploy containers
- **Thời gian**: ~2-3 phút

### `restart_only`
- Chỉ restart containers hiện tại
- Không pull code mới
- **Thời gian**: ~30 giây
- **Dùng khi**: Restart nhanh, fix memory issues

### `force_rebuild`
- Pull latest code  
- Build Docker image hoàn toàn mới (no cache)
- Deploy containers
- **Thời gian**: ~5-7 phút
- **Dùng khi**: Có vấn đề với Docker cache, dependencies thay đổi

## ✨ Best Practices

1. **Development flow**:
   ```
   Code changes → Test locally → Push to GitHub → Manual deploy
   ```

2. **Emergency restart**:
   ```
   Use "restart_only" for quick fixes
   ```

3. **Major updates**:
   ```
   Use "force_rebuild" for dependency updates
   ```
