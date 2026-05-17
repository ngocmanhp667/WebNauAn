# WebNauAn

Cau truc du an sau khi sap xep:

```text
WebNauAn/
|-- frontend/
|-- backend/
|   |-- database/
|   |-- src/
|   |-- .env.example
|   |-- package.json
|   |-- package-lock.json
|   |-- server.js
|-- postman_collection.json
|-- .gitignore
|-- README.md
```

## 1) Cai dat dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## 2) Cau hinh moi truong backend

Sao chep file mau va dien gia tri phu hop:

```bash
cd backend
copy .env.example .env
```

Neu dung PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
```

## 3) Chay du an

### Chay backend (port API)

```bash
cd backend
npm run dev
```

### Chay frontend

```bash
cd frontend
npm run dev
```

## 4) Test API

- Su dung file `postman_collection.json` tai thu muc goc de import vao Postman.
