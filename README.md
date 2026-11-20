# DBA & Cloud Learning Command Center

GitHub-ready baseline of the locked dashboard design.

## Included
- Locked dark dashboard layout
- Databases: Oracle, PostgreSQL, MySQL, SQL Server, MongoDB
- Cloud: AWS, Azure, GCP, Oracle Cloud, Docker, Kubernetes
- OS / Automation / Tools: Linux, Shell Scripting, PowerShell, Python, Git, Terraform, Ansible, Jenkins
- Uploaded profile image at `assets/profile/sunil.png`
- Oracle roadmap page wired to `data/oracle-roadmap.json`

## Deploy dashboard first
Upload the extracted repository contents to GitHub. The dashboard works immediately, while Oracle shows 418 topics once `data/oracle-roadmap.json` is present.

## Add the Oracle roadmap second
Copy the final `oracle-roadmap.json` from the approved complete roadmap package into `data/oracle-roadmap.json`, commit, and push.

## Local test
Run a small HTTP server from the repository root because the roadmap uses `fetch()`:

```bash
python -m http.server 8080
```

Then browse to `http://localhost:8080`.
