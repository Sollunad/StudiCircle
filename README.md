# StudiCircle

## Wichtige Links

- [Sprint- und Product-Backlog](https://docs.google.com/spreadsheets/d/1YCvQa_m60D70OW_NKOWodGU-s6tj3FHdgRDIcPds1GU/)
- [Übersicht 1. Sprint](https://drive.google.com/file/d/1ujw161Y97WQo8EW02hdNSwXAGiTV3paX/view?usp=sharing)
- [bisher erstellte Mockups](https://drive.google.com/drive/folders/1L52qtxCDA95i3iDvHFCivjW2H9l7jyGI)

## Git Guideline

### Branches

- “master” für POs
- “develop” -> Lauffähige Entwicklungsversion, hier werden fertige User Stories zur Abnahme vorgestellt
- "team/Teamname -> Entwicklungsbranch für jedes Team
- “story/SC-EPIC-###” -> Pro User Story einen Branch, falls nötig
(zum Beispiel story/SC-CORE-002)

### Workflow

#### Entwicklung im Team

1. Für neue Story einen neuen Branch anlegen.
2. Alles für diese Story auf diesen Branch committen.
3. Nach Abschluss der Story auf Teambranch mergen.
4. Story-Branch löschen.

oder

1. Direkt auf Teambranch committen, je nach Bedarf.

#### Teamübergreifend

1. Nach Abschluss eines Arbeitspakets, wenn Version lauffähig, Pull Request vom Teambranch nach develop erstellen (auf GitHub).
2. Pull Request von jemand anderem reviewen und bestätigen lassen. Evtl. als Reviewer Kommentare dazu schreiben, falls alles ok ist, den Pull Request akzeptieren.
3. Pull Request mergen.

## Rahmenbedingungen

- Datenbanken sind zu implementieren
- Testumgebungen sind zu implementieren
- Designs von neuen Seiten sind zu entwerfen und mit dem PO abzustimmen

## Corporate Design
Farbcodes
grün: 

## Erstes Aufsetzen der Ionic Grundlage

```git clone https://github.com/Sollunad/StudiCircle.git```

Node.js installieren

```
npm install -g ionic
npm install -g cordova
cd StudiCircle/StudiCircle
npm i
(opt.) ionic build
ionic serve
```






