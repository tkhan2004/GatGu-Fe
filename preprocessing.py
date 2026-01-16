import cv2
import numpy as np

class ImagePreprocessor:
    def __init__(self):
        """
        Khởi tạo bộ tiền xử lý ảnh tối ưu (Optimized Preprocessor).
        Ưu tiên tốc độ xử lý (Low Latency).
        """
        # Kernel làm sắc nét ảnh (Sharpening Kernel)
        # Giữ nguyên vì phép nhân ma trận nhỏ này rất nhanh (được vector hóa bởi OpenCV)
        self.sharpen_kernel = np.array([[0, -1, 0], 
                                        [-1, 5, -1], 
                                        [0, -1, 0]])
        
        self.current_mode = "NORMAL"
        
        # Cache cho Gamma LUT
        self.cached_gamma = None
        self.cached_lut = None

    def _get_gamma_lut(self, gamma):
        """
        Tạo bảng tra (LUT) cho Gamma Correction động.
        CÓ CACHING: Chỉ tính lại nếu giá trị gamma thay đổi.
        """
        # Nếu gamma giống lần trước -> Trả về cache ngay
        if self.cached_gamma == gamma and self.cached_lut is not None:
            return self.cached_lut

        # Nếu khác -> Tính toán lại và lưu vào cache
        inv_gamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** inv_gamma) * 255
                          for i in np.arange(0, 256)]).astype("uint8")
        
        self.cached_gamma = gamma
        self.cached_lut = table
        return table

    def analyze_lighting(self, frame):
        """
        TỐI ƯU: Resize ảnh về kích thước nhỏ (64x64) trước khi tính toán.
        Tăng tốc độ gấp ~100 lần so với tính trên full HD.
        """
        small_frame = cv2.resize(frame, (64, 64))
        gray = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
        brightness = np.mean(gray)
        return brightness

    def apply_gamma_correction(self, image, gamma):
        """Hiệu chỉnh Gamma (Rất nhanh nhờ LUT)."""
        lut = self._get_gamma_lut(gamma)
        return cv2.LUT(image, lut)

    def apply_gaussian_blur(self, image):
        """
        THAY THẾ: Bilateral Filter -> Gaussian Blur.
        Nhanh hơn rất nhiều, đủ tốt để khử nhiễu camera thường.
        """
        return cv2.GaussianBlur(image, (5, 5), 0)

    def apply_clahe(self, image, clip_limit=2.0):
        """
        CLAHE: Chỉ dùng khi thực sự cần thiết vì tốn kém tài nguyên.
        """
        # Chuyển đổi màu tốn CPU, nhưng cần thiết cho CLAHE chuẩn
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        final = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        return final

    def apply_sharpening(self, image):
        """Làm sắc nét ảnh."""
        return cv2.filter2D(image, -1, self.sharpen_kernel)

    def process(self, frame):
        """
        Pipeline xử lý tối ưu.
        """
        # 1. Phân tích độ sáng (Nhanh)
        brightness = self.analyze_lighting(frame)
        
        # Mặc định: KHÔNG copy frame nếu không cần thiết để tiết kiệm memory
        # Nhưng vì OpenCV thường sửa in-place, nên an toàn nhất vẫn là process trên bản copy hoặc chính nó nếu luồng cho phép.
        # Ở đây ta giả định `frame` đầu vào có thể bị thay đổi.
        
        processed = frame

        if brightness < 60: 
            # --- CHẾ ĐỘ TỐI (DARK) ---
            self.current_mode = "DARK/TUNNEL"
            
            # Gamma + GaussianBlur (Nhanh)
            processed = self.apply_gamma_correction(processed, gamma=2.0)
            processed = self.apply_gaussian_blur(processed)
            
            # CLAHE: Chỉ bật ở chế độ này vì nó quan trọng để nhìn rõ trong tối
            processed = self.apply_clahe(processed, clip_limit=3.0)
            
        elif brightness > 180:
            # --- CHẾ ĐỘ CHÓI (GLARE) ---
            self.current_mode = "BRIGHT/GLARE"
            
            # Giảm sáng nhanh
            processed = self.apply_gamma_correction(processed, gamma=0.6)
            
            # Blur nhẹ để giảm nhiễu hạt do cháy sáng
            processed = self.apply_gaussian_blur(processed)
             # Có thể skip CLAHE ở đây nếu muốn siêu nhanh, nhưng giữ lại clip thấp để cân bằng bóng đổ
            processed = self.apply_clahe(processed, clip_limit=1.5)
            
        else:
            # --- CHẾ ĐỘ BÌNH THƯỜNG ---
            self.current_mode = "NORMAL"
            
            # SIÊU TỐI ƯU: Nếu điều kiện tốt, TRẢ VỀ LUÔN ảnh gốc (hoặc chỉ làm nét nhẹ)
            # Bỏ qua hoàn toàn các bước convert màu/gamma không cần thiết.
            # Chỉ làm nét 1 chút cho AI dễ bât cạnh
            processed = self.apply_sharpening(processed)
            
            return processed, self.current_mode

        # Các chế độ đặc biệt (Dark/Bright) mới chạy xuống đây
        processed = self.apply_sharpening(processed)
        return processed, self.current_mode
