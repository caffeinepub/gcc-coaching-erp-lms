# Specification

## Summary
**Goal:** Deploy the app to production and reliably surface the final public https://<canister-id>.icp0.io URL in the deployment output.

**Planned changes:**
- Run a production deployment (not a preview build) and ensure the deployment result prints the final public frontend URL in the exact required format.
- Fix deployment feedback/output so production deployments consistently include the live link line with the .icp0.io URL.

**User-visible outcome:** After a production deployment, the output includes a line that starts with "Your production canister is live at:" followed by an accessible https://<canister-id>.icp0.io URL.
