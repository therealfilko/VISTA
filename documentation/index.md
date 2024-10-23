# IT-Konzept Dokumentation

Wichtig: Das IT-Konzept darf/muss als Work-In-Progress Dokument gesehen werden. Im ersten Schritt geht es darum, alle Fragen zu beantworten, mit denen man sich vorab schon beschäftigen kann. Über die Zeit wird das Konzept wachsen und sich verändern!

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
