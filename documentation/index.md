# IT-Konzept Dokumentation

**Wichtig:** Das IT-Konzept darf/muss als Work-In-Progress Dokument gesehen werden. Im ersten Schritt geht es darum, alle Fragen zu beantworten, mit denen man sich vorab schon beschäftigen kann. Über die Zeit wird das Konzept wachsen und sich verändern!

## Anwendung

![App_Dashboard](/images/app_dashboard.png)

- **VISTA TODO**
  - TODO Funktion (erstellen, löschen, bearbeiten)
  - Authentifizierung
    - Vollständiges Login-System mit Email/Passwort
    - Registrierungssystem mit Validierung
    - Responsive Benutzeroberfläche für alle Geräte
    - Moderne UI mit TailwindCSS und DaisyUI
    - Formvalidierung und Fehlerhandling

- **Technologien**
  - Framework: React mit TypeScript für typsichere Entwicklung
  - UI-Design: TailwindCSS für schnelles und responsives Styling
  - Icons: react-icons für konsistente Symbolik
  - HTTP-Client: Axios für API-Kommunikation
  - State-Management: Lokaler Zustand mit React Hooks (useState, useEffect)
  - Formular-Handling: Eigene Formularkomponenten mit Validierung
  - Error-Handling: Zentrale Fehlerbehandlung mit ErrorMessage-Komponente

## Frontend

### Start Page

![Startseite](/images/startseite.png)

#### 1. Zielsetzung
- Die Startseite bietet Nutzern einen ansprechenden Einstieg in die Plattform. Sie informiert über die Hauptfunktionen, Vorteile und Statistiken der Anwendung und animiert durch klare Handlungsaufrufe zur Registrierung oder Anmeldung.
- Das Hauptziel ist es, potenzielle Nutzer von der Plattform zu überzeugen und bestehende Nutzer effizient weiterzuleiten.

#### 2. Architektur & Komponenten
- **Komponentenstruktur:**
  - `Start`: Hauptcontainer, der Header, Hauptinhalt und Footer organisiert.
  - `Logo`: Darstellung des Plattformlogos.
  - `NavLinks`: Navigationsleiste mit Dropdown-Unterstützung.
  - `AuthButtons`: Buttons für Anmelden und Registrieren.
- **State-Verwaltung:**
  - `NavLinks`: Lokale State-Verwaltung zur Steuerung der Dropdown-Menüs.

#### 3. Benutzerinteraktion
- **Navigationsleiste**
  - Dropdown-Menüs für einfache Navigation zu verschiedenen Plattformbereichen.
  - Optisch hervorgehobene Links bei Hover-Interaktionen.
- **Handlungsaufrufe (CTAs):**
  - Prominent platzierte Schaltflächen: „Jetzt starten" (Login) und „Kostenlos registrieren".
- **Abschnittshighlights:**
  - Informationen über Funktionen der Plattform mit Icons.
  - Interaktive Statistiken zur Vertrauensbildung.

#### 4. API-Anbindungen der Startseite
- Die Startseite benötigt keine direkte API-Integration. Die Inhalte sind statisch und kommen aus der Komponentenstruktur. Alle interaktiven Elemente wie Buttons und Links leiten den Nutzer zu den entsprechenden Seiten („Login", „Registrieren", usw.), wo eine API-Integration relevant wird.

#### 5. Struktur des Inhalts
- **Header:**
  - Enthält Logo, Navigationslinks und Authentifizierungsbuttons.
- **Main-Bereich:**
  - **Hero-Sektion:**
    - Haupttitel "Organisiere deine Aufgaben effizient" mit grüner Hervorhebung
    - Untertitel "Steigere deine Produktivität mit Taskify"
    - Prominenter "Jetzt starten" Button
  - **Features-Sektion:** Grid mit drei Karten
    - Einfache Organisation (✓)
    - Ziele erreichen (🎯)
    - Erinnerungen (🔔)
  - **Statistik-Sektion:** Grid mit drei Statistiken (angegebene Zahlen sind nur Platzhalter und dienen nur Vorstellungszwecken)
    - 10k+ Aktive Nutzer
    - 50k+ Erledigte Aufgaben
    - 99% Zufriedene Kunden
  - **Abschluss-Sektion:**
    - "Bereit durchzustarten?" Call-to-Action
    - Buttons für Registrierung und "Mehr erfahren"

### Registrierung

![Registrierung](/images/registrierung.png)

#### 1. Zielsetzung
- Die Registrierungsseite bietet neuen Nutzern die Möglichkeit, ein Konto auf der Plattform zu erstellen. Sie umfasst Eingabefelder für Vorname, Nachname, Geburtsdatum, E-Mail-Adresse und Passwort. Die Seite stellt sicher, dass die Daten valide eingegeben werden und leitet die Nutzer bei erfolgreicher Registrierung zur Login-Seite weiter.

#### 2. Architektur & Komponenten
- **Komponentenstruktur:**
  - `Register`: Hauptcontainer, organisiert Header und Hauptinhalt.
  - `Logo`: Darstellung des Plattformlogos im Header.
  - `RegisterForm`: Formularkomponente mit Eingabefeldern für Nutzerdaten, Fehleranzeige und Registrierungsbutton.
- **State-Verwaltung:**
  - `RegisterForm`:
    - Lokale States zur Verwaltung der Eingaben: `email`, `password`, `first_name`, `last_name`, `date_of_birth`.
    - `error` zur Anzeige von Fehlermeldungen.
    - `isLoading` zur Steuerung der Ladeanzeige während der API-Anfrage.

#### 3. Benutzerinteraktion
- **Registrierungsprozess:**
  - Nutzer füllen die Felder für Vorname, Nachname, Geburtsdatum, E-Mail und Passwort aus.
  - Bei Klick auf den Button "Registrieren" wird eine API-Anfrage an den Registrierungs-Endpoint gesendet.
  - Erfolgreiche Registrierung leitet den Nutzer zur Login-Seite weiter.
  - Fehler werden dem Nutzer angezeigt.
- **Zusatzoptionen:**
  - Social Sign-up über Google und GitHub (nicht funktional)
  - "Du hast bereits ein Konto?"-Link zur Login-Seite

#### 4. API-Anbindungen der Registrierungsseite
- **Registrierungs-Endpoint:**
  - `POST /register`
    - Sendet die Nutzerdaten (Vorname, Nachname, Geburtsdatum, E-Mail, Passwort) zur Erstellung eines neuen Kontos.
    - Erfolgreiche Antwort (HTTP 201) leitet den Nutzer zur Login-Seite weiter.
- **Fehlerbehandlung:**
  - Bei fehlenden oder ungültigen Eingaben wird eine Fehlermeldung angezeigt.
  - Netzwerkfehler oder serverseitige Probleme führen zu allgemeinen Fehlermeldungen.

#### 5. Struktur des Inhalts
- **Header:**
  - Beinhaltet das Logo zur Markendarstellung.
- **Main-Bereich:**
  - **Linke Hälfte:** (auf größeren Bildschirmen)
    - Vorteilsdarstellung mit Icons:
      - "Kostenlos starten" (🎯)
      - "Sicher & Verschlüsselt" (🔒)
      - "Schnell & Einfach" (⚡)
    - Community-Box mit Nutzerprofilen und 4.9/5 Sterne-Bewertung
  - **Rechte Hälfte:**
    - Titel "Erstelle dein Konto" und Begrüßungstext
    - Registrierungsformular mit allen Eingabefeldern
    - Social Sign-up Optionen (Google, GitHub)
    - Link zur Login-Seite

### Login Page

![Login](/images/login_ausgefuellt.png)

#### 1. Zielsetzung
- Die Login-Seite bietet Nutzern eine intuitive Möglichkeit, sich auf der Plattform anzumelden. Sie umfasst Eingabemöglichkeiten für E-Mail und Passwort, einen Button zum Login sowie weitere Optionen wie "Passwort vergessen". Ziel ist es, eine reibungslose und sichere Anmeldung zu gewährleisten.

#### 2. Architektur & Komponenten
- **Komponentenstruktur:**
  - `Login`: Hauptcontainer, organisiert Header und Hauptinhalt.
  - `Logo`: Darstellung des Plattformlogos im Header.
  - `LoginForm`: Formularkomponente mit Eingabefeldern für E-Mail und Passwort, Fehleranzeige und Login-Button.
- **State-Verwaltung:**
  - `LoginForm`: Verwendet lokale States (`email`, `password`, `error`, `isLoading`) für Eingabedaten und UI-Zustand.

#### 3. Benutzerinteraktion
- **Login-Prozess:**
  - Nutzer geben E-Mail und Passwort ein.
  - Ein Button sendet die Daten an die Authentifizierungs-API.
  - Bei erfolgreicher Anmeldung wird der Nutzer auf das Dashboard weitergeleitet.
  - Fehler werden mit einer Fehlermeldung angezeigt.
- **Optionen:**
  - Social Login über Google und GitHub (nicht funktional)
  - Link für "Passwort vergessen" (nicht funktional)
  - Checkbox "Angemeldet bleiben" (nicht funktional)

#### 4. API-Anbindungen der Login-Seite
- **Login-Endpoint:**
  - `POST /api/auth/login`: Authentifiziert Nutzer mit E-Mail und Passwort. Bei Erfolg wird ein Token für die Sitzung erstellt.
- **Fehlerbehandlung:**
  - Bei ungültigen Zugangsdaten wird ein Fehler angezeigt. ("Invalid credentials")
  - Unvorhergesehene Fehler werden mit einer allgemeinen Fehlermeldung behandelt.
- **Redirect-Logik:**
  - Nach erfolgreichem Login wird der Nutzer zum Dashboard weitergeleitet.

#### 5. Struktur des Inhalts
- **Header:**
  - Beinhaltet das Logo zur Markendarstellung.
- **Main-Bereich:**
  - **Rechte Hälfte:**
    - Anmeldeformular mit Email und Passwort
    - Checkbox "Angemeldet bleiben"
    - Social Login Optionen (Google, GitHub)
    - "Du hast noch kein Konto?" Link zur Registrierung
  - **Linke Hälfte:** (auf größeren Bildschirmen)
    - Vorteile-Sektion mit drei Features (✓)
    - Kundenbewertungen mit Profilbild und 5-Sterne-Rating

### Dashboard

![Dashboard](/images/dashboard.png)

#### 1. Architektur & Komponenten
- Das Dashboard dient zur Verwaltung von Aufgaben in einer Kanban-ähnlichen Ansicht. Es ermöglicht Nutzern, Aufgaben zwischen Spalten zu verschieben, neue Aufgaben zu erstellen, bestehende Aufgaben zu bearbeiten und Fortschritte visuell zu verfolgen.

#### 2. Architektur & Komponenten
- **Komponentenstruktur:**
  - `Dashboard`: Hauptansicht mit zentralem Zustand für Spalten und Aufgaben.
  - `TaskColumn`: Darstellung von Aufgaben innerhalb einer Spalte mit Aktionen wie Hinzufügen, Bearbeiten, Löschen und Verschieben.
  - `ProgressBar`: Visualisierung des Aufgabenfortschritts (To-Do, In-Progress, Done).
  - `TaskModal`: Modaler Dialog zur Bearbeitung und Erstellung von Aufgaben.
  - `ConfirmationModal`: Modaler Dialog zur Bestätigung von Löschvorgängen.
- **State-Verwaltung:**
  - Aufgaben und Spalten werden im Dashboard-State verwaltet und durch Props an die Komponenten übergeben.
  - Lokale Änderungen werden direkt über API-Endpunkte synchronisiert.

#### 3. Benutzerinteraktion
- **Task-Erstellung und Task-Bearbeitung:**
  - Nutzer können Aufgaben mit Details wie Titel, Beschreibung, Kategorie, Bearbeiter und Deadline erstellen oder bearbeiten.
  - Modale Fenster erleichtern die Eingabe und Bearbeitung.
- **Spalteninteraktion:**
  - Aufgaben können durch Drag-and-Drop oder Auswahl in andere Spalten verschoben werden.
  - Fortschritte werden automatisch aktualisiert.
- **Fortschrittsanzeige:**
  - Die ProgressBar zeigt die prozentuale Verteilung der Aufgaben in den drei Spalten (To-Do, In-Progress, Done).

#### 4. API-Anbindungen des Dashboards
- **Basis-URL:** http://localhost:8080
- **Endpoints:**
  - `GET /api/columns`: Lädt die Spalten mit ihren zugehörigen Aufgaben.
  - `POST /api/todos`: Erstellt eine neue Aufgabe.
  - `PUT /api/todos/{id}`: Aktualisiert eine bestehende Aufgabe.
  - `PATCH /api/todos/{id}/done`: Ändert den Status einer Aufgabe (erledigt/nicht erledigt).
  - `DELETE /api/todos/{id}`: Löscht eine Aufgabe.
  - `PUT /api/todos/{id}/position`: Aktualisiert die Position einer Aufgabe innerhalb oder zwischen Spalten.
- **Fehlerbehandlung:**
  - Unautorisierte Anfragen (HTTP 401) führen zur Weiterleitung auf die Login-Seite.
  - Fehler werden im Frontend geloggt und ggf. dem Nutzer mit einer Fehlermeldung angezeigt.

## Teststrategie

### Manuelle Tests

#### Zielsetzung
- Identifizierung von Bugs und Fehlern im System durch manuelle Überprüfung der Anwendung.

#### Durchführung
- Manuelles Testen aller Hauptfunktionen, einschließlich:
  - Registrierung und Login.
  - Erstellen, Bearbeiten, Löschen und Verschieben von Aufgaben im Dashboard.
  - Navigation zwischen Seiten und Interaktionen mit UI-Elementen.
- Überprüfung der Benutzerfreundlichkeit und Funktionalität der Plattform unter realen Bedingungen.

#### Ergebnisse
- Sicherstellung, dass alle kritischen Funktionen wie erwartet arbeiten.

### UnitTests

#### Zielsetzung
- Validierung der korrekten Funktionsweise einzelner Komponenten im System.

#### Durchführung
- Schreiben und Ausführen von Unit-Tests für spezifische Komponenten, wie z. B.:
  - `TaskColumn`: Überprüfung der korrekten Darstellung und Funktionalität von Aufgaben in einer Spalte.
  - `ProgressBar`: Sicherstellung der richtigen Berechnung und Anzeige von Fortschrittswerten.
- Nutzung von Testframeworks wie Jest oder React Testing Library für die Implementierung.

#### Ergebnisse
- Abdeckung einzelner, isolierter Funktionen, um Fehler in den zugrunde liegenden Logiken frühzeitig zu erkennen.

### Einschränkungen
- Die Teststrategie hat einen starken Fokus auf manuelle Tests.
- Automatisierte Tests sind derzeit auf wenige Unit-Tests beschränkt.
- Es fehlen automatisierte Integrationstests und End-to-End-Tests zur umfassenden Systemvalidierung.

### Weiterentwicklung
- Geplante Ausweitung der Teststrategie:
  - Einführung von automatisierten Tests für kritische Workflows, z. B. Registrierung und Aufgabenmanagement.
  - Ergänzung von End-to-End-Tests mit Tools wie Cypress, um das Systemverhalten ganzheitlich zu prüfen.
  - Aufbau einer Testpipeline im CI/CD-Prozess, um Regressionen frühzeitig zu erkennen.

## Zielgruppenanalyse

### Benutzerprofile
- Es wird ein normaler Nutzer-Account erwartet.
- Jeder Nutzer hat Zugriff auf sein eigenes Board, weshalb derzeit kein Admin-Account notwendig ist.

### Anforderungen
- Die Plattform muss sicherstellen, dass jeder Nutzer nur Zugriff auf seine eigenen Daten hat.
- Eine klare und intuitive Benutzeroberfläche ist entscheidend, um den Fokus auf individuelle Aufgaben und Boards zu legen.

## Systemkomponenten

### Hardware

![Server](/images/server.png)

#### Anbieter: Hetzner
- **Cloud-Instanz (CX22):**
  - 2 vCPU
  - 4 GB RAM
  - 40 GB NVMe SSD
  - 20 TB Traffic

### Software
- **GitHub Actions:** Für Continuous Integration (CI) und Continuous Deployment (CD) wird GitHub Actions verwendet. Es automatisiert den Build- und Testprozess bei jedem Commit.
- **Coolify:** Coolify wird für die einfache Bereitstellung der Webanwendung auf der Cloud-Instanz genutzt, um eine problemlose Verwaltung der Infrastruktur sicherzustellen.

![Coolify](/images/coolify_dashboard.png)

### Quellsysteme
- **GitHub:** Versionsverwaltung der Quellcodes und zentrale Plattform für die Zusammenarbeit im Team.

### Ausgangsschnittstellen
- TBD (abhängig von der Art der Webanwendung)

### Zielsysteme und Schnittstellen
- Die Cloud-Instanz dient als Zielsystem für die Bereitstellung der Webanwendung und den Betrieb von CI/CD-Prozessen.

## Netzwerkkonzept

- **Bandbreite:** 20 TB pro Monat
- **Anteile intern/extern:** Die Anwendung wird extern gehostet und ist über das Internet zugänglich.

### Was wird benötigt?
- **IP-Adressen:** Eine öffentliche IPv4-Adresse wird für den Zugriff auf die Webanwendung genutzt.
- **Ports:** Firewallfreischaltungen für benötigte Ports (z. B. HTTP/S, SSH).
- **Platz im Technikraum:** Nicht notwendig, da Cloud-Lösung.
- **Cloud-Bedarf:** Cloud-Hosting wird genutzt, daher kein lokaler Platzbedarf.
- **Autarke Anteile:** Keine, da zentraler Betrieb über Cloud.

## Betriebskonzept

- **Hardware – Wartungsbedarf:** Die Wartung der Cloud-Instanz wird über den Anbieter abgewickelt.
- **Betriebssystem:** TBD, je nach Wahl der Entwicklungsumgebung und Anforderungen der Webanwendung (z. B. Ubuntu Server).
- **Updateverfahren:**
  - Automatische Updates für Betriebssystem und Software, falls durch den Cloud-Anbieter unterstützt.
  - Manuelle Updates durch das Team, falls erforderlich (z. B. Security-Patches).
- **Softwarepflege:** Regelmäßige Updates und Patches über GitHub Actions und Coolify.
- **Notfallkonzeption:**
  - Datensicherung durch Snapshots oder Backups der Cloud-Instanz.
  - Logs für Fehleranalyse und Wiederherstellung.

## Sicherheit

- **SSL-Anbindung:**
  - Die Plattform nutzt eine SSL-Verschlüsselung, um eine sichere Übertragung sensibler Daten wie Passwörter und persönliche Informationen zu gewährleisten.
  - Alle Daten werden verschlüsselt übertragen, um Datenschutz und Datensicherheit zu gewährleisten.

## Support

- **Entry Point für Incidents:** Ticketsystem oder direkter Kontakt via GitHub Issues.
- **Supportzeit:** In der Projektphase wird das Team fortlaufend Support bieten.
- **Reaktionszeit:** Je nach Art der Vorfälle.
- **Wiederherstellungszeit:** Abhängig von der Schwere des Problems und der eingesetzten Backup-Lösungen.
- **Wartungszugang erforderlich?** Ja, für regelmäßige Wartung und Updates.

## Bedienoberflächen

- **Systemvoraussetzungen:** Abhängig von der zu entwickelnden Webanwendung.
- **Nutzer- und Berechtigungskonzept:** TBD (z. B. Admin- und Benutzerrollen in der Webanwendung, je nach Bedarf).

---

*Diese Liste ist ein Ausgangspunkt und wird im Laufe des Projekts erweitert.*
