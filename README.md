# Portofoliu React Native — Laboratoarele 5–11

Pagină statică (HTML + CSS) cu cele 8 demo-uri GIF. Fără build, fără dependențe.
GIF-urile sunt în `assets/`, iar pagina le încarcă lazy, pe măsură ce derulezi.

## Premiere locală

Deschide `index.html` direct în browser. Pentru un server local:

```bash
npx serve .
# sau
python -m http.server 8000
```

## Publicare pe GitHub Pages

1. Creează un repository **public** pe GitHub, de exemplu `portofoliu-rn`.
2. În folderul `portfolio`:

```bash
git init
git add .
git commit -m "Portofoliu laboratoare 5-11"
git branch -M main
git remote add origin https://github.com/<utilizator>/portofoliu-rn.git
git push -u origin main
```

3. În repository: **Settings → Pages → Deploy from a branch**
   - Branch: `main`
   - Folder: `/ (root)`
   - Save.

4. După ~1 minut, linkul este:

```
https://<utilizator>.github.io/portofoliu-rn/
```

Acesta este linkul care se predă.

## Structură

```
index.html
styles.css
assets/
  lab05-catalog.gif
  lab05-progres.gif
  lab06.gif
  lab07.gif
  lab08.gif
  lab09.gif
  lab10.gif
  lab11.gif
```

## Note

- Fonturile (Fraunces, Inter, JetBrains Mono) sunt încărcate din Google Fonts;
  fără internet pagina folosește fonturile de sistem.
- Laboratoarele 7, 8, 9 și 11 conțin și cadre ilustrative, marcate în pagină,
  pentru funcții disponibile doar pe telefon.
- Nu există date personale sau chei API în pagină.
