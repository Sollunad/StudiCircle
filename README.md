# StudiCircle

## Wichtige Links

[Sprint- und Product-Backlog](https://docs.google.com/spreadsheets/d/1YCvQa_m60D70OW_NKOWodGU-s6tj3FHdgRDIcPds1GU/)

## Git Guideline

### Branches

- “master” für POs
- “develop” -> Lauffähige Entwicklungsversion, hier werden fertige User Stories zur Abnahme vorgestellt
- “story/SC-EPIC-###” -> Pro User Story einen Branch
(zum Beispiel story/SC-CORE-002)

### Workflow

1. Für jede neue Story einen neuen Branch anlegen.
2. Alles für diese Story auf diesen Branch committen.
3. Nach Abschluss der Story Pull Request nach develop erstellen (auf GitHub).
4. Pull Request von jemandem reviewen und bestätigen lassen. Evtl. als Reviewer Kommentare dazu schreiben, falls alles ok ist, den Pull Request akzeptieren.
5. Pull Request mergen.
6. Branch löschen.

## Rahmenbedingungen

Datenbanken sind zu implementieren
Testumgebungen sind zu implementieren
Designs von neuen Seiten sind zu entwerfen und mit dem PO abzustimmen

## Corporate Design
Farbcodes
grün: 

## Erstes Aufsetzen der Ionic Grundlage

1. Git Repo klonen
2. Node.js installieren
3. Ionic und Cordova global installieren mit:
    npm install -g ionic
    npm install -g cordova
4. Im StudiCircle Ordner vom Git Repo:
    npm install
    ionic serve (wenn das nicht geht, vorher ionic build)






