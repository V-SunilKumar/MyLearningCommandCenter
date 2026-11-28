# Logo asset sources — Dashboard V1.4

> Historical V1.4 source record. The `*-user.svg` filenames in the table below are legacy aliases; byte-identical copies were moved out of the active vendor folder during the 2026-11-28 safe cleanup. Use `LOGO-ASSET-MAP.md` for current runtime filenames. Archived copies remain under `backups/cleanup-archive/2026-11-28/duplicate-assets/`.

The following eight SVG files were supplied by the project owner and integrated as local assets. They are stored in `assets/images/vendors/` and loaded locally by the dashboard (no external logo CDN request is needed for these eight cards).

| Dashboard technology | Local asset |
|---|---|
| Oracle Database | `oracle-user.svg` |
| MySQL | `mysql-user.svg` |
| Microsoft SQL Server | `sqlserver-user.svg` |
| AWS | `aws-user.svg` |
| Microsoft Azure | `azure-user.svg` |
| Oracle Cloud Infrastructure | `oracle-cloud-user.svg` |
| PowerShell | `powershell-user.svg` |
| Python | `python-user.svg` |

The supplied artwork was retained. Two presentation-only adjustments were made:
- AWS dark navy wordmark changed to white so it remains legible on the dark dashboard card; the orange smile remains unchanged.
- Oracle Cloud SVG intrinsic dimensions were enlarged proportionally so the small original mark can render at a useful card size.

The remaining technology cards continue using the project's existing local SVG assets or existing logo fallback behavior.

**Licensing note:** These files were supplied by the project owner. Their embedded comments/metadata were preserved where possible. Confirm the applicable brand and third-party asset permissions before redistributing the public repository. Product names and logos remain the property of their respective owners.

## Current asset map and cleanup note (2026-11-28)

The active dashboard asset mapping is documented in `LOGO-ASSET-MAP.md` and configured in `assets/js/dashboard.js`. The following legacy `*-user.svg` aliases were byte-for-byte duplicates of the active assets and have been moved (not deleted) to `backups/cleanup-archive/2026-11-28/duplicate-assets/assets/images/vendors/`:

- `azure-user.svg` → `azure-mark.svg`
- `oracle-user.svg` → `oracle-wordmark.svg`
- `powershell-user.svg` → `powershell-mark.svg`
- `python-user.svg` → `python-mark.svg`
- `sqlserver-user.svg` → `sqlserver-wordmark.svg`

The original files are preserved in the cleanup archive. This historical document is retained for provenance; use `LOGO-ASSET-MAP.md` for the active dashboard mapping.
