# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
**Luồng Dữ Liệu Chi Tiết: Chức năng Thêm Mới Dữ Liệu Nền**
- Giai đoạn 1: Tương tác người dùng (UI Layer - React & Ant Design)
1. Nhập liệu: Admin mở Modal "Thêm ngành mới", chọn trường trực thuộc (từ danh sách đã được Redux nạp sẵn), nhập "Mã ngành" và "Tên ngành".
2. Xác thực (Validation): Khi nhấn "Lưu", form của Ant Design (form.validateFields()) sẽ kiểm tra các quy tắc (rules) như không được để trống.
3. Kích hoạt sự kiện (Dispatch): Nếu dữ liệu hợp lệ, Component gọi hàm dispatch(createMajor(values)).
- Giai đoạn 2: Xử lý State & Gọi API (Redux Toolkit & Axios Layer)
4. Trạng thái Pending: Redux Toolkit (thông qua createAsyncThunk) tự động phát ra một action pending. State loading được bật lên true. Giao diện hiển thị hiệu ứng xoay (spinner) trên nút Lưu để block thao tác click liên tục.
5. Đóng gói Request: Thunk gọi Axios instance. Axios Interceptor tự động lấy JWT Token từ localStorage đính kèm vào Header (Authorization: Bearer <token>).
6. Gửi Request: Axios gửi một HTTP POST Request mang theo payload chứa thông tin ngành học tới endpoint của Backend (VD: http://localhost:5000/api/majors).
- Giai đoạn 3: Xử lý nghiệp vụ Backend (Node.js & MySQL Layer - Phần của Đức)
7. Tiếp nhận & Xác thực: Express Router nhận request. Middleware xác thực Token kiểm tra quyền Admin.
8. Tương tác DB: Controller sử dụng SQL Query hoặc ORM để chèn dữ liệu (Insert) vào bảng nganh trong cơ sở dữ liệu MySQL.
9. Trả về Response: Cơ sở dữ liệu sinh ra một ID thực tế. Backend đóng gói ID này cùng với dữ liệu gốc, trả về Frontend một HTTP Response với status code 201 Created dạng JSON.
- Giai đoạn 4: Cập nhật State toàn cục (Redux Reducers Layer)
10. Trạng thái Fulfilled: Axios nhận được Response thành công và truyền dữ liệu cho Thunk. Thunk phát ra action fulfilled.
11. Đồng bộ State: extraReducers trong majorSlice bắt được action này. Nó lấy payload (object ngành học mới có chứa ID thực) và đẩy (push) vào mảng majors trong Redux Store. Trạng thái loading được set lại thành false.
(Lưu ý: Nếu API lỗi, thunk phát ra action rejected, Redux lưu thông báo lỗi và UI sẽ hiển thị Toast báo lỗi).
Giai đoạn 5: Re-render Giao diện (React Reactivity)
12. Cập nhật UI: Component MajorManagement đang "lắng nghe" mảng majors thông qua hook useAppSelector. Khi Redux Store thay đổi, React tự động kích hoạt quá trình Re-render.
13. Kết thúc: Bảng dữ liệu (Table) xuất hiện thêm dòng ngành học mới. Mã lệnh setIsModalOpen(false) chạy, Modal đóng lại và một Toast message màu xanh "Thêm mới thành công!" hiện lên.

**Luồng Dữ Liệu: Dashboard Thống Kê (Data Aggregation Flow)**
Khác với luồng CRUD từng thực thể, Dashboard là nơi tổng hợp dữ liệu (Aggregation). Luồng đi như sau:
- Khởi tạo (Mounting): Khi trang Dashboard load (useEffect), nó đồng loạt dispatch nhiều action: fetchSchools(), fetchMajors(), fetchApplications().
- Nạp Store (Hydration): Các requests chạy song song. Khi thành công, Redux Store sẽ ngập tràn dữ liệu thô (mảng trường, mảng hồ sơ).
- Chuyển đổi dữ liệu (Data Transformation): Bên trong component Dashboard, các thuật toán Javascript (như .filter, .map, .length) chạy để bóc tách dữ liệu thô thành các mảng số liệu thống kê cụ thể (VD: Tính số lượng hồ sơ có trạng thái pending).
- Kết xuất Biểu đồ (Rendering): Các mảng số liệu này được truyền vào cấu hình option của ECharts. Thư viện ECharts đọc cấu hình và vẽ lên canvas đồ họa biểu đồ cột và tròn tương ứng.

## Applications Review (Quản lý Hồ sơ)

Giao diện quản trị đã bổ sung trang `Duyệt Hồ sơ` cho phép:
- Liệt kê hồ sơ đã nộp với phân trang và sắp xếp.
- Xem chi tiết hồ sơ trong modal.
- Duyệt hoặc từ chối hồ sơ (yêu cầu quyền `canReviewApplications` hoặc vai trò `admin/manager/staff`).

API liên quan: `GET /api/applications`, `PUT /api/applications/:id/status`.

