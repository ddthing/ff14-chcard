import type { GuideCopy } from '../guideContent';
export default {
    "title": "Anleitung für FF14-Karten",
    "eyebrow": "Hilfe zur Kartenerstellung",
    "intro": "Wähle passende Angaben und stimme Bild und Text ab. Kehre danach zum Editor zurück.",
    "contentsLabel": "Inhalt",
    "useCasesTitle": "Zweck festlegen",
    "useCasesIntro": "Diese erfundenen Beispiele zeigen verschiedene Zwecke der verfügbaren Felder.",
    "useCases": [
        {
            "id": "social",
            "title": "Soziale Vorstellung",
            "summary": "Stelle Charakter und Spielstil kurz vor.",
            "fieldsLabel": "Empfohlene Felder",
            "fields": [
                "Name und Welt",
                "Hauptjob und Aktivitäten",
                "Kurze Vorstellung"
            ],
            "exampleLabel": "Erfundenes Beispiel",
            "example": "Ich mag entspannte Dungeons und Housing am Wochenende. Neue Spieler willkommen!",
            "privacy": "Lasse echten Namen, Kontaktdaten und Aufenthaltsorte weg, wenn du sie nicht teilen möchtest."
        },
        {
            "id": "recruitment",
            "title": "Gilden- oder Static-Suche",
            "summary": "Nenne Spielzeiten und gewünschte Gruppe.",
            "fieldsLabel": "Empfohlene Felder",
            "fields": [
                "Welt und Datenzentrum",
                "Haupt- und Nebenjobs",
                "Spielzeit und Vorstellung"
            ],
            "exampleLabel": "Erfundenes Beispiel",
            "example": "Meist nach 21 Uhr KST online. Suche eine geduldige Gruppe zum Lernen.",
            "privacy": "Teile nur nötige Zeitfenster und nutze sichere Community-Kontaktwege."
        },
        {
            "id": "screenshot",
            "title": "Screenshot-Erinnerung",
            "summary": "Stelle Screenshot und Stimmung in den Vordergrund.",
            "fieldsLabel": "Empfohlene Felder",
            "fields": [
                "Hochauflösender Screenshot",
                "Layout und Farbe",
                "Wenige Sticker"
            ],
            "exampleLabel": "Erfundenes Beispiel",
            "example": "Eine Karte mit einem /gpose-Bild als Erinnerung.",
            "privacy": "Prüfe sichtbare Namen anderer Spieler und Chatnachrichten."
        }
    ],
    "sectionLabel": "Gestaltungsschritte",
    "sections": [
        {
            "id": "purpose",
            "title": "Aussage festlegen",
            "intro": "Mehr Angaben machen eine Karte nicht automatisch besser. Entscheide, was auf einen Blick erkennbar sein soll.",
            "points": [
                "Trenne Identität wie Name, Welt und Job von Aktivitäten und Spielzeiten.",
                "Offizielle Profile und Lodestone-Daten werden nicht automatisch kopiert.",
                "Screenshot und Angaben werden im geteilten Bild sichtbar."
            ]
        },
        {
            "id": "screenshot",
            "title": "Screenshot wählen und zuschneiden",
            "intro": "Ein erkennbarer Charakter geht vor Dekoration.",
            "points": [
                "Wähle Gesicht, Ausrüstung oder Silhouette und lasse Platz für den Zuschnitt.",
                "Prüfe den Kontrast von Namen und Symbolen auf hellen und dunklen Bildern.",
                "Eine niedrig aufgelöste Quelle bleibt beim Vergrößern unscharf. Nutze hochauflösende Screenshots.",
                "Prüfe den Ausschnitt nach einem Layoutwechsel erneut."
            ]
        },
        {
            "id": "profile",
            "title": "Profilangaben schreiben",
            "intro": "Beginne mit einem Satz über Aktivitäten, Spielzeiten oder gewünschte Kontakte.",
            "points": [
                "Aktiviere bei abweichendem öffentlichen Namen den entsprechenden Hinweis.",
                "Nenne Welt und Datenzentrum, damit andere dich finden können.",
                "Tags geben einen Überblick; die Vorstellung ergänzt Details.",
                "Vermeide echte Namen, Kontaktdaten und zu genaue persönliche Zeitpläne."
            ]
        },
        {
            "id": "jobs",
            "title": "Jobs und Spielstil zeigen",
            "intro": "Der Hauptjob setzt einen Schwerpunkt; weitere Jobs zeigen deine Aktivitäten.",
            "points": [
                "Wähle einen passenden Hauptjob oder nutze die Liste ohne Hauptjob.",
                "Kampf, Handwerk und Sammeln sind getrennt. Weniger Auswahl bleibt übersichtlicher.",
                "Wenige passende Tags sagen mehr als alle verfügbaren Optionen.",
                "Stufen werden nicht automatisch geprüft. Ergänze bei Bedarf ein Datum."
            ]
        },
        {
            "id": "style",
            "title": "Stil und Dekoration anpassen",
            "intro": "Farben und Sticker ergänzen die Stimmung, ohne Angaben zu verdecken.",
            "points": [
                "Prüfe bei der Schriftwahl auch kleine Beschriftungen.",
                "Prüfe den Kontrast der Akzentfarbe bei Namen, Symbolen und Text.",
                "Platziere Sticker auf freien Flächen, ohne Angaben zu verdecken.",
                "Lege zuerst Layout und Bildausschnitt fest, dann Farben und Sticker."
            ]
        },
        {
            "id": "save",
            "title": "Vor dem Teilen prüfen",
            "intro": "Speichern lädt ein PNG der aktuellen Karte herunter. Prüfe alle sichtbaren Inhalte.",
            "points": [
                "Bei blockiertem Download versuche Chrome, Safari oder Edge statt eines In-App-Browsers.",
                "Gelöschte Websitedaten können Bearbeitungen entfernen. Behalte PNGs und JSON-Sicherungen.",
                "Prüfe Name, Welt, fremde Spielernamen und Chatnachrichten im Screenshot.",
                "Dieses Projekt ist inoffiziell. Spielinhalte, Schriften und Bilder gehören ihren Rechteinhabern."
            ]
        }
    ],
    "referenceTitle": "Unterstützter Umfang",
    "referenceIntro": "Diese Listen nutzen die Daten des Editors und folgen dessen Aktualisierungen.",
    "roleNames": {
        "battle": "Kampfjobs",
        "crafting": "Handwerker",
        "gathering": "Sammler"
    },
    "jobCountLabel": " Jobs",
    "worldScopeTitle": "Welten und Datenzentren",
    "worldScopeIntro": "Koreanische und globale Welten. Kein automatischer Lodestone-Import.",
    "regionCountLabel": " Regionen",
    "dataCenterCountLabel": " Datenzentren",
    "worldCountLabel": " Welten",
    "checklistTitle": "Checkliste vor dem Speichern",
    "checklistIntro": "Diese Liste bleibt in der Sitzung, ohne Serverübertragung oder Konto.",
    "checklist": [
        {
            "id": "image",
            "label": "Bildposition und Größe stimmen."
        },
        {
            "id": "identity",
            "label": "Name und Welt stimmen."
        },
        {
            "id": "job",
            "label": "Hauptjob und Spielstil sind aktuell."
        },
        {
            "id": "privacy",
            "label": "Keine privaten Informationen sichtbar."
        },
        {
            "id": "contrast",
            "label": "Text und Farben haben genug Kontrast."
        },
        {
            "id": "share",
            "label": "Karte bleibt am geplanten Ziel gut lesbar."
        }
    ],
    "createCta": "Zurück zum Editor",
    "exampleNotice": "Die erfundenen Beispiele zeigen mögliche Formulierungen."
,
 "checklistProgress": (completed: number, total: number) => `${completed}/${total} geprüft`
} satisfies GuideCopy;
