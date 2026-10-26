# Publication setup

- Dedicated GitHub repository: https://github.com/Raja6559/social-content-workspace
- Worker: krelyvo-demo-social-workspace
- Public hostname: https://demo-social-workspace.krelyvo.com
- Static build: bun run build
- Deploy: bun run deploy (uses the pinned local Wrangler and dist assets)
- Production branch: main

## Cloudflare Git connection

Connect this repository to the dedicated Worker under Settings > Builds. Preserve all existing repository selections when granting the Cloudflare GitHub App access; add only social-content-workspace.

Use build command `bun run build`, deploy command `bun run deploy`, root `/` and production branch `main`. Set a plain **Build** variable `BUN_VERSION=1.4.2`. Runtime variables do not affect dependency installation. No application secrets are needed.

The CLI's current authorization can deploy the Worker but does not have Workers Builds API permission. A dashboard connection is required for automatic deployments; do not claim it is connected until a trigger/build is verified.

## Verification

Run the local unit/type/build/browser checks before deployment. For public browser checks:

```powershell
$env:DEMO_BASE_URL='https://demo-social-workspace.krelyvo.com'
bun run e2e
Remove-Item Env:DEMO_BASE_URL
```

Verify the HTTPS HTML response and static assets carry X-Robots-Tag: noindex, nofollow, noarchive, and HTML contains the same robots metadata. Hash views stay inside the one static application. All actions remain in-memory; publishing the demo does not enable AI or account integrations.

Wrangler config explicitly disables workers.dev and version-preview aliases. Existing main website and other demo Workers are not touched.

Public browser verification detected an inherited Cloudflare Analytics beacon injection. The demo alone sets Cache-Control no-transform in its static headers, as documented by Cloudflare, to preserve the approved no-analytics behavior without changing settings for krelyvo.com or other demos.
