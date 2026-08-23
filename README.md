# Personal Vault — Mobile App (Capacitor)

Project này đã được dựng sẵn 100% từ file `Vault.html` gốc — **không đổi 1 dòng
giao diện hay logic nào**, chỉ đóng gói thành app native iOS/Android bằng
Capacitor. Toàn bộ tính năng của bản web (dashboard, tài khoản cá nhân/công
việc/game, ngân hàng, tài sản, dịch vụ, đối tác, subscription, mã hoá
AES‑256‑GCM, khoá PIN, Face ID/Touch ID, auto‑lock, xuất/nhập `.vault`...) đều
được giữ nguyên vì code chạy y hệt file HTML gốc trong WebView.

## Đã làm sẵn cho bạn
- ✅ `www/index.html` = chính xác nội dung `Vault.html`
- ✅ Cấu hình Capacitor (`capacitor.config.json`) — App ID `com.yourname.vault`,
  App name "Personal Vault"
- ✅ Đã thêm platform `android/` và `ios/` (native project đầy đủ)
- ✅ Đã cài & sync plugin sinh trắc học. **Lưu ý quan trọng:** package gốc
  `@capacitor-community/biometric-auth` không còn tồn tại trên npm (đã bị gỡ),
  nên mình đã thay bằng bản kế thừa chính thức **`@aparajita/capacitor-biometric-auth`**
  — cùng API `checkBiometry()` / `authenticate()` nên **không cần sửa JS**, đồng thời
  nâng Capacitor lên bản 7 để tương thích. Nếu không thay, app sẽ crash khi bấm
  Face/Touch ID vì import module không tồn tại.
- ✅ Đã thêm `NSFaceIDUsageDescription` vào `ios/App/App/Info.plist`

## Deploy làm PWA (Add to Home Screen) — miễn phí vĩnh viễn, không cần Mac

Đã có sẵn workflow `.github/workflows/deploy-pwa.yml`, tự động deploy
`www/index.html` lên GitHub Pages mỗi khi bạn push code.

1. Push project lên GitHub như hướng dẫn ở Bước 1 phía trên
2. Vào repo trên GitHub > **Settings > Pages** > mục **Build and deployment**
   > **Source**: chọn **"GitHub Actions"**
3. Vào tab **Actions**, chờ workflow **"Deploy PWA to GitHub Pages"** chạy
   xong (khoảng 30 giây)
4. Trang sẽ có địa chỉ dạng `https://<username>.github.io/<ten-repo>/`
   (xem chính xác ở Settings > Pages sau khi deploy xong)
5. Trên iPhone: mở địa chỉ đó bằng **Safari** (không dùng Chrome — iOS chỉ
   cho "Add to Home Screen" hoạt động đầy đủ qua Safari) → nút **Share** →
   **"Add to Home Screen"**
6. Xong — mở icon trên màn hình chính, dùng như app thật, Face ID hoạt động
   qua WebAuthn, không bao giờ hết hạn, không cần ký lại

Repo nên để **private** cho chắc (Settings > repo > Danger Zone hoặc chọn
private ngay khi tạo repo) — Pages vẫn build và chạy bình thường với repo
private trên tài khoản GitHub free.


Project này đã có sẵn 3 workflow trong `.github/workflows/`, chạy trên máy
macOS ảo miễn phí của GitHub — bạn không cần Mac, không cần Xcode cài local.

### Bước 1 — Đưa project lên GitHub (repo PRIVATE, vì đây là app chứa dữ liệu nhạy cảm)
```bash
cd vault-app
git init
git add .
git commit -m "Personal Vault mobile app"
# Tạo repo private trên github.com trước, rồi:
git remote add origin https://github.com/<username>/<ten-repo>.git
git branch -M main
git push -u origin main
```

### Bước 2 — Build thử ngay (không cần tài khoản Apple Developer)
Ngay khi push, workflow **`iOS - Build (Simulator, unsigned)`** tự chạy
(xem tab **Actions** trên GitHub). Nó build app cho Simulator để xác nhận
project không lỗi — **chưa cài lên iPhone thật được**, chỉ dùng để kiểm tra.
Workflow **`Android - Build APK (debug)`** cũng tự chạy và cho bạn file
`.apk` tải về cài thẳng lên điện thoại Android để test ngay.

### Bước 3 — Cài lên iPhone thật: chọn 1 trong 2 cách dưới, cả 2 đều KHÔNG CẦN MAC

#### 3A. Miễn phí hoàn toàn (không tốn 99 USD/năm) — dùng AltStore
Phù hợp nếu bạn chỉ cài cho chính mình dùng, chưa cần đăng App Store.
1. Tải **AltServer** cho Windows tại https://altstore.io (không cần Mac)
2. Cắm iPhone vào máy Windows lần đầu, cài **AltStore** lên máy qua AltServer,
   đăng nhập bằng Apple ID thường (miễn phí, không cần gói Developer)
3. Lấy file `.ipa` từ workflow **`iOS - Build (Simulator, unsigned)`** — đổi
   `-sdk iphonesimulator` thành `-sdk iphoneos` và bỏ `CODE_SIGNING_ALLOWED=NO`
   trong file `.github/workflows/ios-simulator-build.yml` để build ra bản
   cho thiết bị thật (chưa ký), rồi dùng AltStore để tự ký + cài qua WiFi
4. Giới hạn: app tự hết hạn sau 7 ngày, cần mở AltServer trên máy tính
   (cùng WiFi với điện thoại) để ký lại — AltServer có thể tự làm nền,
   không cần bạn thao tác gì mỗi lần

#### 3B. Trả 99 USD/năm (Apple bắt buộc để phát hành lâu dài / lên App Store)
**Toàn bộ bước dưới đây làm trên trình duyệt web + dòng lệnh, không đụng đến Mac:**

1. Đăng ký tại https://developer.apple.com/programs/
2. **Tạo Certificate** — dùng OpenSSL (có sẵn nếu cài Git Bash, `winget install OpenSSL`, hoặc WSL trên Windows):
   ```bash
   # Tạo private key + file CSR
   openssl genrsa -out ios_distribution.key 2048
   openssl req -new -key ios_distribution.key \
     -out CertificateSigningRequest.certSigningRequest \
     -subj "/emailAddress=email-cua-ban@gmail.com, CN=Ten Cua Ban, C=VN"
   ```
   Vào **developer.apple.com > Certificates, Identifiers & Profiles > Certificates > "+"**,
   chọn **Apple Distribution**, upload file `.certSigningRequest` vừa tạo, tải file
   `.cer` về, rồi convert sang `.p12` (vẫn bằng OpenSSL):
   ```bash
   openssl x509 -in distribution.cer -inform DER -out distribution.pem -outform PEM
   openssl pkcs12 -export -inkey ios_distribution.key -in distribution.pem \
     -out Certificate.p12 -password pass:MAT_KHAU_TUY_BAN_DAT
   ```
3. **Tạo Provisioning Profile** — thao tác trên web: vào **Identifiers** đăng ký
   App ID `com.yourname.vault` (đổi thành ID của bạn) → **Profiles > "+"** →
   chọn **Ad Hoc** (cài trực tiếp lên vài máy) hoặc **App Store** (nộp TestFlight)
   → chọn App ID + Certificate vừa tạo → tải về file `.mobileprovision`
4. Encode 2 file `.p12` và `.mobileprovision` sang base64:
   ```bash
   base64 -w0 Certificate.p12              # Linux / WSL
   certutil -encode Certificate.p12 cert.b64   # Windows CMD
   # PowerShell: [Convert]::ToBase64String([IO.File]::ReadAllBytes("Certificate.p12"))
   ```
5. Vào repo GitHub > **Settings > Secrets and variables > Actions**, thêm 4 secret:
   `IOS_P12_BASE64`, `IOS_P12_PASSWORD`, `IOS_PROVISION_PROFILE_BASE64`, `IOS_TEAM_ID`
6. Vào tab **Actions** > chọn workflow **`iOS - Build IPA đã ký`** > **Run workflow**
7. Tải file `.ipa` ở phần **Artifacts**, cài qua **Diawi** hoặc **AltStore**,
   hoặc nộp **TestFlight** nếu đổi `method` trong `ios/ExportOptions.plist`
   thành `app-store`

### Không muốn làm 7 bước trên? Dùng Codemagic
Nếu thấy phần ký code (bước 3) rắc rối, **Codemagic** (codemagic.io) làm
toàn bộ việc này qua giao diện kéo-thả, kể cả quản lý certificate/profile
tự động qua "Apple Developer Portal integration" — chỉ cần đăng nhập bằng
Apple ID, không phải tự tay export/base64 gì cả. Free tier đủ dùng cho 1 app
cá nhân.

### Android — build local bình thường, không cần Mac
```bash
npx cap open android
# Trong Android Studio: Build > Generate Signed Bundle/APK
```

### 4. Trước khi phát hành
- Đổi `appId` trong `capacitor.config.json` từ `com.yourname.vault` sang bundle
  ID thật của bạn (vd `com.tenban.vault`), rồi chạy lại `npx cap sync`.
- Đổi icon/splash mặc định nếu muốn (đặt ảnh vào `resources/` rồi dùng
  `npx @capacitor/assets generate`).
- Vì app lưu dữ liệu trong sandbox máy — **xoá app = mất dữ liệu**, nhớ dùng
  chức năng Export `.vault` trong app để backup trước khi gỡ cài đặt.

## Mỗi khi bạn sửa `Vault.html`
```bash
cp Vault.html www/index.html   # hoặc npm run build nếu bạn đặt Vault.html ở thư mục cha
npx cap sync
```
rồi mở lại Xcode/Android Studio để build bản mới — không cần làm lại từ đầu.
