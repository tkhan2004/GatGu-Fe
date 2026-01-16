# Sử dụng iPhone làm Webcam cho MacBook

## Phương pháp 1: Continuity Camera (macOS Ventura+)

### Yêu cầu:
- ✅ macOS Ventura (13.0) trở lên
- ✅ iOS 16 trở lên  
- ✅ Cùng Apple ID
- ✅ Bluetooth và WiFi đã bật

### Cách sử dụng:
1. Đặt iPhone gần MacBook
2. Vào trang `/monitoring` trên web app
3. Khi browser hỏi quyền camera, chọn **"iPhone của [Tên]"**
4. iPhone sẽ tự động kích hoạt camera

### Troubleshooting:
- Nếu không thấy iPhone: Restart cả 2 thiết bị
- Kiểm tra Settings > General > AirPlay & Handoff > Continuity Camera (bật)

---

## Phương pháp 2: Ứng dụng bên thứ 3

### Cài đặt EpocCam (Miễn phí)

#### Trên iPhone:
1. Tải **EpocCam** từ App Store
2. Mở app và để sẵn

#### Trên MacBook:
1. Tải **EpocCam Drivers**: https://www.elgato.com/us/en/s/downloads
2. Cài đặt driver
3. Restart MacBook
4. Vào web app → Chọn "EpocCam" trong danh sách camera

### Ưu điểm EpocCam:
- ✅ Hoạt động trên macOS cũ hơn
- ✅ Nhiều tùy chọn (resolution, orientation)
- ✅ Có thể dùng qua USB hoặc WiFi

---

## Phương pháp 3: Camo (Cao cấp nhất)

### Cài đặt Camo:
1. Tải Camo trên iPhone (App Store)
2. Tải Camo trên Mac: https://reincubate.com/camo/
3. Kết nối qua USB hoặc WiFi
4. Chọn "Camo" trong browser

### Ưu điểm:
- ✅ Chất lượng camera tốt nhất
- ✅ Nhiều filter và effects
- ✅ Ổn định hơn

---

## Kiểm tra camera đã kết nối:

Mở Terminal và chạy:
```bash
system_profiler SPCameraDataType
```

Bạn sẽ thấy danh sách camera available.

---

## Lưu ý quan trọng:

⚠️ **Performance**: Camera iPhone qua WiFi có thể có độ trễ cao hơn
⚠️ **Battery**: iPhone sẽ hao pin nhanh, nên cắm sạc
⚠️ **Stability**: Kết nối USB ổn định hơn WiFi

---

## Nếu vẫn không hoạt động:

Thử update code để list tất cả camera:

```javascript
// Test camera devices
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log('Available cameras:');
    devices.filter(d => d.kind === 'videoinput').forEach(d => {
      console.log(`- ${d.label} (${d.deviceId})`);
    });
  });
```

Paste vào Console của browser để xem danh sách camera.
