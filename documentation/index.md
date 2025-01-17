# IT-Konzept Dokumentation

Wichtig: Das IT-Konzept darf/muss als Work-In-Progress Dokument gesehen werden. Im ersten Schritt geht es darum, alle Fragen zu beantworten, mit denen man sich vorab schon beschäftigen kann. Über die Zeit wird das Konzept wachsen und sich verändern!

## Anwendung

- **VISTA TODO**
  - TODO Funktion (erstellen, löschen, bearbeiten)
  - Authentifizierung (Demo User)

- **Technologien**
  - Framework: React mit TypeScript für typsichere Entwicklung.
  - UI-Design: TailwindCSS für schnelles und responsives Styling.
  - Icons: react-icons für konsistente Symbolik.
  - HTTP-Client: Axios für API-Kommunikation.
  - State-Management: Lokaler Zustand mit React Hooks (useState, useEffect).

- **Frontend**
    
  **Start Page**
    - **1. Zielsetzung**
      - Die Startseite bietet Nutzern einen ansprechenden Einstieg in die Plattform. Sie informiert über die Hauptfunktionen, Vorteile und Statistiken der Anwendung und animiert durch klare Handlungsaufrufe zur Registrierung oder Anmeldung. Das Hauptziel ist es, potenzielle Nutzer von der Plattform zu überzeugen und bestehende Nutzer effizient weiterzuleiten.

    - **2. Architektur & Komponenten**
      - Komponentenstruktur: 
        - Start: Hauptcontainer, der Header, Hauptinhalt und Footer organisiert.
        - Logo: Darstellung des Plattformlogos.
        - NavLinks: Navigationsleiste mit Dropdown-Unterstützung.
        - AuthButtons: Buttons für Anmelden und Registrieren.
      - State-Verwaltung: 
        - NavLinks: Lokale State-Verwaltung zur Steuerung der Dropdown-Menüs.

    - **3. Benutzerinteraktion**
      - Navigationsleiste
        - Dropdown-Menüs für einfache Navigation zu verschiedenen Plattformbereichen.
        - Optisch hervorgehobene Links bei Hover-Interaktionen.
      - Handlungsaufrufe (CTAs):
        - Prominent platzierte Schaltflächen: „Jetzt starten“ (Login) und „Kostenlos registrieren“
      - Abschnittshighlights:
        - Informationen über Funktionen der Plattform („Einfache Organisation“, „Ziele erreichen“, „Erinnerungen“).
        - Statistiken (z. B. Nutzerzahlen, abgeschlossene Aufgaben) zur Vertrauensbildung.

    - **4. API-Anbindungen des Startseite**
      - Die Startseite benötigt keine direkte API-Integration. Die Inhalte sind statisch und kommen aus der Komponentenstruktur. Alle interaktiven Elemente wie Buttons und Links leiten den Nutzer zu den entsprechenden Seiten („Login“, „Registrieren“, usw.), wo eine API-Integration relevant wird.

    - **5. Struktur des Inhalts**
      - Header:
        - Enthält Logo, Navigationslinks und Authentifizierungsbuttons.
      - Main-Bereich:
        - Hero-Sektion: Begrüßung mit Titel, Untertitel und prominentem Handlungsaufruf.
        - Funktionalitätsabschnitt: Kurzbeschreibung der wichtigsten Vorteile der Plattform.
        - Statistiken: Vertrauensbildende Zahlen und Fakten zur Plattform.
        - Abschluss-Sektion: Handlungsaufruf zur Registrierung oder Informationseinholung.

  **Registierung:**
    - **1. Zielsetzung**
      - Die Registrierungsseite bietet neuen Nutzern die Möglichkeit, ein Konto auf der Plattform zu erstellen. Sie umfasst Eingabefelder für Vorname, Nachname, Geburtsdatum, E-Mail-Adresse und Passwort. Die Seite stellt sicher, dass die Daten valide eingegeben werden und leitet die Nutzer bei erfolgreicher Registrierung zur Login-Seite weiter.

    - **2. Architektur & Komponenten**
      - Komponentenstruktur: 
        - Register: Hauptcontainer, organisiert Header und Hauptinhalt.
        - Logo: Darstellung des Plattformlogos im Header.
        - RegisterForm: Formularkomponente mit Eingabefeldern für Nutzerdaten, Fehleranzeige und Registrierungsbutton.
      - State-Verwaltung: 
        - RegisterForm:
          - Lokale States zur Verwaltung der Eingaben: email, password, first_name, last_name, date_of_birth.
          - error zur Anzeige von Fehlermeldungen.
          - isLoading zur Steuerung der Ladeanzeige während der API-Anfrage.

    - **3. Benutzerinteraktion**
      - Registrierungsprozess:
        - Nutzer füllen die Felder für Vorname, Nachname, Geburtsdatum, E-Mail und Passwort aus.
        - Bei Klick auf den Button "Registrieren" wird eine API-Anfrage an den Registrierungs-Endpoint gesendet.
        - Erfolgreiche Registrierung leitet den Nutzer zur Login-Seite weiter.
        - Fehler (z. B. ungültige Daten oder Serverprobleme) werden dem Nutzer angezeigt.
      - Zusatzoptionen::
        - "Du hast bereits ein Konto?"-Link leitet Nutzer zur Login-Seite weiter.

    - **4. API-Anbindungen des Startseite**
      - Registrierungs-Endpoint:
        - POST /register:
          - Sendet die Nutzerdaten (Vorname, Nachname, Geburtsdatum, E-Mail, Passwort) zur Erstellung eines neuen Kontos.
          - Erfolgreiche Antwort (HTTP 201) leitet den Nutzer zur Login-Seite weiter.
      - Fehlerbehandlung:
        - Bei fehlenden oder ungültigen Eingaben wird eine Fehlermeldung angezeigt.
        - Netzwerkfehler oder serverseitige Probleme führen zu allgemeinen Fehlermeldungen.
      
    - **5. Struktur des Inhalts**
      - Header:
        - Beinhaltet das Logo zur Markendarstellung.
      - Main-Bereich:
        - Linke Hälfte:
          - Vorteilsdarstellung: Highlights wie "Kostenlos starten", "Sicher & Verschlüsselt", "Schnell & Einfach".
          - Community-Statistiken: Vertrauen durch Nutzerbewertungen und -zahlen.
        - Rechte Hälfte:
          - Titel und Begrüßungstext.
          - Eingabefelder für Vorname, Nachname, Geburtsdatum, E-Mail-Adresse und Passwort.
          - Button zur Registrierung.

  **Login Page:**
    - **1. Zielsetzung**
      - Die Login-Seite bietet Nutzern eine intuitive Möglichkeit, sich auf der Plattform anzumelden. Sie umfasst Eingabemöglichkeiten für E-Mail und Passwort, einen Button zum Login sowie weitere Optionen wie "Passwort vergessen". Ziel ist es, eine reibungslose und sichere Anmeldung zu gewährleisten.

    - **2. Architektur & Komponenten**
      - Komponentenstruktur: 
        - Login: Hauptcontainer, organisiert Header und Hauptinhalt.
        - Logo: Darstellung des Plattformlogos im Header.
        - LoginForm: Formularkomponente mit Eingabefeldern für E-Mail und Passwort, Fehleranzeige und Login-Button.
      - State-Verwaltung: 
        - LoginForm: Verwendet lokale States (email, password, error, isLoading) für Eingabedaten und UI-Zustand.

    - **3. Benutzerinteraktion**
      - Login-Prozess:
        - Nutzer geben E-Mail und Passwort ein.
        - Ein Button sendet die Daten an die Authentifizierungs-API.
        - Bei erfolgreicher Anmeldung wird der Nutzer auf das Dashboard weitergeleitet.
        - Fehler (z. B. falsche Anmeldedaten) werden mit einer Fehlermeldung angezeigt.
      - Optionen:
        - Link für "Passwort vergessen", der zur Seite für das Zurücksetzen des Passworts führt.
        - Checkbox "Angemeldet bleiben" für persistente Sitzungen.

    - **4. API-Anbindungen des Startseite**
      - Login-Endpoint:
        - POST /api/auth/login: Authentifiziert Nutzer mit E-Mail und Passwort. Bei Erfolg wird ein Token für die Sitzung erstellt.
      - Fehlerbehandlung:
        - Bei ungültigen Zugangsdaten wird ein Fehler angezeigt.
        - Unvorhergesehene Fehler werden mit einer allgemeinen Fehlermeldung behandelt.
      - Redirect-Logik:
        - Nach erfolgreichem Login wird der Nutzer zur zuvor besuchten Seite (oder standardmäßig zum Dashboard) weitergeleitet.
      
    - **5. Struktur des Inhalts**
      - Header:
        - Beinhaltet das Logo zur Markendarstellung.
      - Main-Bereich:
        - Linke Hälfte:
          - Titel und Begrüßungstext.
          - Eingabefelder für E-Mail und Passwort.
          - Button zum Anmelden.
          - Zusätzliche Optionen wie "Passwort vergessen" und Checkbox "Angemeldet bleiben".
        - Rechte Hälfte (auf größeren Bildschirmen sichtbar):
          - Vorteile der Plattform (z. B. Aufgaben organisieren, Fortschritt tracken).
          - Kundenbewertungen zur Vertrauensbildung.

  **Dashboard:** 
    - **1. Architektur & Komponenten**
      - Das Dashboard dient zur Verwaltung von Aufgaben in einer Kanban-ähnlichen Ansicht. Es ermöglicht Nutzern, Aufgaben zwischen Spalten zu verschieben, neue     Aufgaben zu erstellen, bestehende Aufgaben zu bearbeiten und Fortschritte visuell zu verfolgen. 

    - **2. Architektur & Komponenten**
      - Komponentenstruktur: 
        - Dashboard: Hauptansicht mit zentralem Zustand für Spalten und Aufgaben.
        - TaskColumn: Darstellung von Aufgaben innerhalb einer Spalte mit Aktionen wie Hinzufügen, Bearbeiten, Löschen und Verschieben.
        - ProgressBar: Visualisierung des Aufgabenfortschritts (To-Do, In-Progress, Done).
        - TaskModal: Modaler Dialog zur Bearbeitung und Erstellung von Aufgaben.
        - ConfirmationModal: Modaler Dialog zur Bestätigung von Löschvorgängen.
      - State-Verwaltung: 
        - Aufgaben und Spalten werden im Dashboard-State verwaltet und durch Props an die Komponenten übergeben.
        - Lokale Änderungen werden direkt über API-Endpunkte synchronisiert.

    - **3. Benutzerinteraktion**
      - Task-Erstellung und Task-Bearbeitung
        - Nutzer können Aufgaben mit Details wie Titel, Beschreibung, Kategorie, Bearbeiter und Deadline erstellen oder bearbeiten.
        - Modale Fenster erleichtern die Eingabe und Bearbeitung.
      - Spalteninteraktion
        - Aufgaben können durch Drag-and-Drop oder Auswahl in andere Spalten verschoben werden.
        - Fortschritte werden automatisch aktualisiert.
      - Fortschrittsanzeige:
        - Die ProgressBar zeigt die prozentuale Verteilung der Aufgaben in den drei Spalten (To-Do, In-Progress, Done).

    - **4. API-Anbindungen des Dashboards**
      - Basis-URL: http://localhost:8080
      - Endpoints: 
        - GET /api/columns: Lädt die Spalten mit ihren zugehörigen Aufgaben.
        - POST /api/todos: Erstellt eine neue Aufgabe.
        - PUT /api/todos/{id}: Aktualisiert eine bestehende Aufgabe.
        - PATCH /api/todos/{id}/done: Ändert den Status einer Aufgabe (erledigt/nicht erledigt).
        - DELETE /api/todos/{id}: Löscht eine Aufgabe.
        - PUT /api/todos/{id}/position: Aktualisiert die Position einer Aufgabe innerhalb oder zwischen Spalten.
      - Fehlerbehandlung: 
        - Unautorisierte Anfragen (HTTP 401) führen zur Weiterleitung auf die Login-Seite.
        - Fehler werden im Frontend geloggt und ggf. dem Nutzer mit einer Fehlermeldung angezeigt.

## Systemkomponenten

### Hardware
**Anbieter** Hetzner
- **Cloud-Instanz (CX22)**
  - 2 vCPU
  - 4 GB RAM
  - 40 GB NVMe SSD
  - 20 TB Traffic

### Software
- **GitHub Actions**: Für Continuous Integration (CI) und Continuous Deployment (CD) wird GitHub Actions verwendet. Es automatisiert den Build- und Testprozess bei jedem Commit.
- **Coolify**: Coolify wird für die einfache Bereitstellung der Webanwendung auf der Cloud-Instanz genutzt, um eine problemlose Verwaltung der Infrastruktur sicherzustellen.

### Quellsysteme
- **GitHub**: Versionsverwaltung der Quellcodes und zentrale Plattform für die Zusammenarbeit im Team.

### Ausgangsschnittstellen
- TBD (abhängig von der Art der Webanwendung)

### Zielsysteme und Schnittstellen
- Die Cloud-Instanz dient als Zielsystem für die Bereitstellung der Webanwendung und den Betrieb von CI/CD-Prozessen.

## Netzwerkkonzept
- **Bandbreite**: 20 TB pro Monat
- **Anteile intern/extern**: Die Anwendung wird extern gehostet und ist über das Internet zugänglich.

### Was wird benötigt?
- **IP-Adressen**: Eine öffentliche IPv4-Adresse wird für den Zugriff auf die Webanwendung genutzt.
- **Ports**: Firewallfreischaltungen für benötigte Ports (z.B. HTTP/S, SSH).
- **Platz im Technikraum**: Nicht notwendig, da Cloud-Lösung.
- **Cloud-Bedarf**: Cloud-Hosting wird genutzt, daher kein lokaler Platzbedarf.
- **Autarke Anteile**: Keine, da zentraler Betrieb über Cloud.

## Betriebskonzept
- **Hardware – Wartungsbedarf**: Die Wartung der Cloud-Instanz wird über den Anbieter abgewickelt.
- **Betriebssystem**: TBD, je nach Wahl der Entwicklungsumgebung und Anforderungen der Webanwendung (z.B. Ubuntu Server).
- **Updateverfahren**:
  - Automatische Updates für Betriebssystem und Software, falls durch den Cloud-Anbieter unterstützt.
  - Manuelle Updates durch das Team, falls erforderlich (z.B. Security-Patches).
- **Softwarepflege**: Regelmäßige Updates und Patches über GitHub Actions und Coolify.
- **Notfallkonzeption**:
  - Datensicherung durch Snapshots oder Backups der Cloud-Instanz.
  - Logs für Fehleranalyse und Wiederherstellung.

## Support
- **Entry Point für Incidents**: Ticketsystem oder direkter Kontakt via GitHub Issues.
- **Supportzeit**: In der Projektphase wird das Team fortlaufend Support bieten.
- **Reaktionszeit**: Je nach Art der Vorfälle.
- **Wiederherstellungszeit**: Abhängig von der Schwere des Problems und der eingesetzten Backup-Lösungen.
- **Wartungszugang erforderlich?**: Ja, für regelmäßige Wartung und Updates.

## Bedienoberflächen
- **Systemvoraussetzungen**: Abhängig von der zu entwickelnden Webanwendung.
- **Nutzer- und Berechtigungskonzept**: TBD (z.B. Admin- und Benutzerrollen in der Webanwendung, je nach Bedarf).

---

*Diese Liste ist ein Ausgangspunkt und wird im Laufe des Projekts erweitert.*
