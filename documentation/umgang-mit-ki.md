# Umgang mit KI (Aufgabe 1)

## Inhaltsverzeichnis
1. [Projektbeschreibung](#projektbeschreibung)
2. [Verwendete KI-Tools](#verwendete-ki-tools)
3. [Durchführung](#durchführung)
4. [Reflexion & Analyse](#reflexion--analyse)
5. [Bewertung & Empfehlung](#bewertung--empfehlung)

## Projektbeschreibung
Dieses Projekt ist eine React-basierte Single-Page-Anwendung, die ein Formular mit speziellen Validierungsregeln implementiert. Es wurde im Rahmen eines Kurses zur Exploration von KI-Tools in der Webentwicklung erstellt.

## Verwendete KI-Tools
Für dieses Projekt haben wir Claude 3.5 Sonnet verwendet. Dieses Tool wurde aufgrund seiner Vielseitigkeit und der Fähigkeit, komplexe Codestrukturen zu generieren und zu erklären, ausgewählt.

## Durchführung
### Anwendung des KI-Tools
- Claude 3.5 Sonnet wurde zur Generierung des initialen React-Komponenten-Codes verwendet.
- Das Tool half bei der Implementierung der Yup-Validierungslogik.
- Tailwind CSS-Klassen wurden mit Hilfe von Claude 3.5 Sonnet optimiert und angepasst.

### Verwendete Prompts
Beispiele für verwendete Prompts:
1. "Erstelle eine React-Komponente für ein Formular mit einer Textbox und einem 'Senden'-Button."
2. "Implementiere eine Yup-Validierung für mindestens 8 Zeichen und 1-3 Sonderzeichen, die nicht aufeinander folgen dürfen."
3. "Optimiere diese Tailwind CSS-Klassen für ein responsives Dark-Mode Design."

### Zeitersparnis
Durch den Einsatz von Claude 3.5 Sonnet konnten wir schätzungsweise 3-4 Stunden Entwicklungszeit einsparen, insbesondere bei der komplexen Validierungslogik und dem responsiven Design.

## Reflexion & Analyse
### Qualität des Outputs
- Der generierte Code war größtenteils funktional und gut strukturiert.
- Kleinere manuelle Anpassungen waren bei der Feinabstimmung der Validierungslogik und des Dark-Mode-Toggles notwendig.

### Effizienz
- Besonders hilfreich war Claude 3.5 Sonnet bei der Erstellung der Grundstruktur und der Implementierung der Yup-Validierung.
- Weniger nützlich war es bei projektspezifischen Design-Entscheidungen und der Integration des Dark-Mode.

### Verständlichkeit
- Der generierte Code war gut verständlich und folgte React-Best-Practices.
- Die Erklärungen von Claude 3.5 Sonnet halfen, komplexe Konzepte wie die Yup-Validierung besser zu verstehen.

### Grenzen des Tools
- Claude 3.5 Sonnet hatte anfänglich Schwierigkeiten, die genauen Anforderungen der Sonderzeichen-Validierung umzusetzen.
- Bei der Implementierung des Dark-Mode-Toggles waren mehrere Iterationen und manuelle Anpassungen nötig.

### Verantwortung
- Es ist wichtig, den generierten Code kritisch zu prüfen und zu verstehen, insbesondere bei Sicherheitsaspekten wie der Formularvalidierung.
- Die Nutzung von KI-Tools erfordert ein Bewusstsein für mögliche Voreingenommenheit in den generierten Lösungen.

## Bewertung & Empfehlung
### Empfohlene Anwendungsfälle
- Erstellung von Boilerplate-Code für React-Komponenten
- Implementierung komplexer Validierungslogik
- Schnelles Prototyping von UI-Komponenten und responsivem Design

### Fälle für manuelle Entwicklung
- Feinabstimmung des Designs, insbesondere bei spezifischen Anforderungen wie Dark-Mode
- Implementierung sehr spezifischer Funktionalitäten, die genaue Kenntnis des Projektkontexts erfordern
- Sicherheitskritische Bereiche der Anwendung, die eine gründliche manuelle Überprüfung erfordern

### Abschließende Empfehlung
Claude 3.5 Sonnet hat sich als wertvolles Werkzeug im Entwicklungsprozess erwiesen, insbesondere für die schnelle Erstellung von Grundstrukturen und die Bewältigung komplexer Logik. Es sollte jedoch als Unterstützung und nicht als Ersatz für menschliches Fachwissen betrachtet werden. Entwickler sollten den generierten Code stets kritisch prüfen, anpassen und ihre eigenen Fähigkeiten kontinuierlich verbessern, um die Vorteile von KI-Tools optimal zu nutzen und gleichzeitig qualitativ hochwertige, sichere und maßgeschneiderte Lösungen zu gewährleisten.
