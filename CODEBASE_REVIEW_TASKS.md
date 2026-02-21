# Codebase Review: Proposed Fix Tasks

## 1) Typo fix task
**Task:** Fix grammar in README feature text from "within a organization" to "within an organization".

- **Why:** User-facing documentation currently contains a typo/grammar issue.
- **Source:** `README.md` line in the Projects section.
- **Definition of done:** README sentence is corrected and passes markdown linting (if configured).

## 2) Bug fix task
**Task:** Prevent removing the organization owner membership (or transfer ownership first) in member removal flow.

- **Why:** `remove-member` currently deletes membership by `memberId` without guarding against deleting the owner's membership, which can leave the organization in an inconsistent authorization state.
- **Source:** `apps/api/src/http/routes/members/remove-member.ts`.
- **Definition of done:**
  - API returns a 400/403 when attempting to remove owner membership.
  - Non-owner member removal still works.
  - Error message clearly explains that ownership must be transferred first.

## 3) Comment/docs discrepancy task
**Task:** Reconcile RBAC docs with implementation for member self-removal.

- **Why:** README says "Members can leave their own organization", but current permissions for `MEMBER` do not include deleting `User` and route-level logic doesn't provide self-leave exception.
- **Source:**
  - Documentation claim in `README.md` (Conditions section).
  - RBAC implementation in `packages/auth/src/permissions.ts`.
- **Definition of done (choose one path and apply consistently):**
  1. Implement self-leave capability for members and document behavior; **or**
  2. Remove/adjust README claim to match current behavior.

## 4) Test improvement task
**Task:** Add integration tests for member-removal authorization edge cases.

- **Why:** Permission-sensitive behavior in `remove-member` has high regression risk and currently lacks visible route tests in this repository.
- **Suggested cases:**
  - Admin can remove a non-owner member.
  - Admin cannot remove owner membership.
  - Member cannot remove other users.
  - (If self-leave is implemented) member can remove own membership only.
- **Definition of done:** Tests are added to API test suite and fail before/fix after for the targeted behavior.
