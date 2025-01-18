# Workflow

## 1. Schritte des Workflows

- **Ideenfindung:**
  - Entwicklung einer Idee und Festlegung, was umgesetzt werden soll.

- **Tool-Recherche:**
  - Auswahl der benötigten Tools und Technologien.
  - Prüfung der Kosten und Machbarkeit.

- **Design-Phase:**
  - Erstellung eines ersten Designs mit Figma zur Visualisierung der Benutzeroberfläche.

- **Backend-Entwicklung:**
  - Entwicklung des Backends, um die Basis für die weitere Entwicklung zu schaffen.

- **Überarbeitung des Designs:**
  - Nach Fertigstellung des Backends wurde das Design nochmals überarbeitet und optimiert.

- **Frontend-Entwicklung:**
  - Parallele Entwicklung des Frontends und Verbindung mit dem Backend über APIs.

- **Unit-Testing-Phase:**
  - Erstellung und Durchführung von Unit-Tests für das Frontend und Backend, um die Basisfunktionalitäten zu überprüfen.

- **Testphase:**
  - Durchführung einer umfassenden Testphase, um Bugs zu identifizieren und Schwachstellen zu finden.

- **Monitoring:**
  - Einrichtung von Monitoring-Tools, um die Stabilität und Funktionalität der Anwendung zu überwachen.

- **Bugfixes:**
  - Behebung kleinerer Fehler, die während der Test- und Entwicklungsphase identifiziert wurden.


## 2. Automatisierungsprozesse

- **Coolify-Installation:**

  1. **Server mieten:**
     - Einen Server für die Bereitstellung gemietet.
     - 4GB Ram, vCPU 2, 40GB SSD Speicher

  2. **Zugriff auf den Server:**
     - Mit SSH auf den gemieteten Server zugegriffen, um die Installation vorzubereiten.

  3. **Automatische Installation von Coolify:**
     - Ausführung des folgenden Befehls zur automatischen Installation:
       ```bash
       curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
       ```

  4. **Coolify starten:**
     - Nach der Installation wurde Coolify über `<SERVER-IP>:8000` geöffnet.

  5. **Registrierung und Einsatzbereit:**
     - Registrierung durchgeführt, womit Coolify einsatzbereit war.

  6. **Deployment in Coolify:**
    1. Ressource erstellen (Public Repo).
    2. Link der Repo angeben (https://github.com/therealfilko/vista).
    3. "Check repo" klicken.
    4. Felder ausfüllen:
       - Buildpack: Docker Compose.
       - Branch: main.
       - Base Directory: `/todo-app/`.
       - Docker Compose Location: `/docker-compose.yml`.
    5. Domains
       - Domains for App: 
       - Domains for Frontend Dev: 
       - Domains for Frontend: https://taskify.pixelding.de:5173
    6. Reload Compose File klicken.
    7. Deploy klicken und warten.

## 3. Versionskontrolle und Branching-Strategien

- **Versionskontrolle:**
  - Verwendung von Git als Versionskontrollsystem.

- **Branching-Strategie:**
  - Jeder Entwickler arbeitet auf einem eigenen Branch, um Änderungen getrennt voneinander durchzuführen.
  - Branches dienen der Isolierung von Feature-Entwicklung oder Bugfixing.

- **Code-Review-Prozess:**
  - Vor dem Merge in den Main Branch wird der Code durch einen anderen Entwickler überprüft (Code Review).
  - Ziel ist es, mögliche Fehler zu identifizieren und die Codequalität sicherzustellen.

- **Merge-Prozess:**
  - Nur fehlerfreie und geprüfte Änderungen dürfen in den Main Branch gemerged werden.

## 4. Monitoring und Feedback

1. **Erstellung eines neuen Projekts in Coolify:**
   - Für das Monitoring wurde ein neues Projekt erstellt.

2. **Hinzufügen der Docker Compose Resource:**
   - Dem Projekt wurde die Ressource "Docker Compose Empty" hinzugefügt.

3. **Installations-YAML-Datei:**
   - Eine Installations-YAML-Datei wurde dem Projekt hinzugefügt, um die benötigten Services und Konfigurationen bereitzustellen.

4. **Installation und Start:**
   - Nach dem Hinzufügen und Installieren der YAML-Datei konnte das Monitoring-System gestartet werden.

## 5. Kommunikation und Zusammenarbeit

- **Ständige Kommunikation:**
  - Die Teammitglieder stehen in kontinuierlichem Austausch, um sicherzustellen, dass alle auf dem gleichen Stand sind.
  - Dies geschieht über Chats oder Meetings.

- **Ticket-System:**
  - Es werden regelmäßige Tickets erstellt, die den Workflow strukturieren und Aufgaben klar definieren (via Jira).

- **Abstimmung von Entscheidungen:**
  - Alle Entscheidungen werden vorab besprochen und gemeinsam im Team abgestimmt.

- **Unterstützung im Team:**
  - Falls jemand auf ein Problem stößt, wird ihm sofort geholfen, um Blockaden zu vermeiden und den Fortschritt sicherzustellen.
