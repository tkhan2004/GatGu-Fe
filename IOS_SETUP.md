# Chạy Web App trên iOS

## Cách 1: Truy cập qua mạng local (Khuyến nghị)

### Bước 1: Lấy IP của MacBook
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Ví dụ IP: `192.168.1.100`

### Bước 2: Restart dev server
```bash
npm run dev
```

### Bước 3: Truy cập từ iPhone/iPad
1. Đảm bảo iPhone và MacBook cùng mạng WiFi
2. Mở Safari trên iOS
3. Truy cập: `http://YOUR_IP:5173`
   - Ví dụ: `http://192.168.1.100:5173`

### Lưu ý quan trọng:
- ⚠️ **Camera cần HTTPS**: iOS yêu cầu HTTPS để truy cập camera
- Nếu camera không hoạt động, dùng Cách 2 bên dưới

---

## Cách 2: Sử dụng ngrok (Có HTTPS)

### Bước 1: Cài ngrok
```bash
brew install ngrok
```

### Bước 2: Chạy ngrok
```bash
ngrok http 5173
```

### Bước 3: Truy cập URL ngrok
- ngrok sẽ cho bạn URL dạng: `https://xxxx-xxxx.ngrok-free.app`
- Mở URL này trên Safari iOS

### Ưu điểm:
- ✅ Có HTTPS → Camera hoạt động
- ✅ Có thể share cho người khác test
- ✅ Không cần cùng mạng WiFi

---

## Cách 3: Build và deploy lên Vercel/Netlify

### Build production
```bash
npm run build
```

### Deploy lên Vercel
```bash
npm install -g vercel
vercel
```

Sau đó truy cập URL Vercel trên iOS.

---

## Troubleshooting

### Camera không hoạt động trên iOS:
1. Dùng ngrok để có HTTPS
2. Hoặc cấu hình SSL certificate cho Vite (phức tạp hơn)

### Performance chậm trên iOS:
- ONNX trên iOS Safari có thể chậm hơn
- Cân nhắc giảm `SKIP_FRAMES` hoặc input size

### Không kết nối được:
- Check firewall MacBook
- Đảm bảo cùng mạng WiFi
- Thử tắt VPN nếu có
