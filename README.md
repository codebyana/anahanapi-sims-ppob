# Getting Started with Create SIMS PPOB



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


## User Registration API

POST https://take-home-test-api.nutech-integrasi.com/registration

```json
{
  "email": "demo1@example.com",
  "first_name": "Ana",
  "last_name": "Hanapi",
  "password": "password123"
}
```
Respon Berhasil
```json
{
    "status": 0,
    "message": "Registrasi berhasil silahkan login",
    "data": null
}
``` 

Respon Gagal
```json
{
    "status": 102,
    "message": "Parameter password harus di isi",
    "data": null
}
```

Jika Registrasi Berhasil masuk ke website [ TEXT ] Lalu input data sesuai data yang sudah di registration