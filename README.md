# Mejavi Skin+

Source code website resmi Mejavi Skin+.

## Live website

https://mejaviskinc.github.io/mejavi-skin/

## Deployment

Frontend dideploy otomatis melalui GitHub Actions dari branch `main`.

Backend data, stok, tracking, admin content, dan customer-service endpoint menggunakan Supabase project `system warehouse`. Source Edge Function yang dipakai website disimpan di folder `supabase/functions/` agar perubahan backend tetap terdokumentasi di GitHub.

Sebelum deploy, workflow menjalankan validasi link/asset dan pengecekan syntax JavaScript.
