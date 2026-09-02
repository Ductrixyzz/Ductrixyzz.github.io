# Đuctrixyzzz — trang liên kết

Trang tĩnh (chỉ HTML + CSS + JS), không cần server, không cần build.

```
index.html      cấu trúc trang
styles.css      màu sắc + toàn bộ hiệu ứng
script.js       lá bay, đốm sáng, nghiêng thẻ, gợn nước, nút chia sẻ
assets/logo.png logo đã tách nền trong suốt
assets/logo-goc.png  ảnh logo gốc (nền trắng) để dành làm lại khi cần
```

## Đưa lên GitHub Pages (miễn phí, không cần chạy server)

1. Vào https://github.com/new → đặt tên repo, chọn **Public**, **không** tích thêm gì → *Create repository*.
2. Mở terminal trong thư mục này rồi chạy 2 dòng (thay `TEN-GITHUB` và `TEN-REPO`):

```bash
git remote add origin https://github.com/TEN-GITHUB/TEN-REPO.git
git push -u origin main
```

3. Trong repo: **Settings** → **Pages** → *Source* chọn **Deploy from a branch** → branch **main**, folder **/ (root)** → *Save*.
4. Đợi 1–2 phút, trang sẽ chạy ở `https://TEN-GITHUB.github.io/TEN-REPO/`.

Cách khác, không cần lệnh nào: tạo repo public, bấm **Add file → Upload files**, kéo cả 3 file
`index.html`, `styles.css` và thư mục `assets` vào, *Commit changes*, rồi làm bước 3.

## Sửa nội dung sau này

- Đổi link: sửa `href` trong `index.html`.
- Đổi tên hiển thị: sửa dòng `<h1 class="name" id="name">`.
- Đổi màu: sửa các biến ở đầu `styles.css` (`--wash-1` … `--olive`).

Sửa xong thì:

```bash
git add -A && git commit -m "cap nhat" && git push
```

Trang sẽ tự cập nhật sau khoảng 1 phút.
