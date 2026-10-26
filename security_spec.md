# LIVEON CONNECT — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Admin-Only CMS Mutation Invariant**: Only a verified administrator (`request.auth != null && request.auth.token.email_verified == true && (request.auth.token.email == 'shriyanshsingh7581@gmail.com' || exists(/databases/$(database)/documents/admins/$(request.auth.uid)))`) can create, update, or delete documents in `/siteConfig/{configId}`, `/catalogueProducts/{productId}`, `/mediaItems/{mediaId}`, and `/admins/{adminUid}`.
2. **Strict Schema & Volumetric Invariant**: Every string field is bounded by exact `minLength` and `maxLength` constraints matching `firebase-blueprint.json`. Document IDs must match `^[a-zA-Z0-9_\-]+$` and `<= 128` chars (`isValidId`).
3. **Total Array Guarding**: `CatalogueProduct.technicalSpecs` is bounded to `<= 10` items and `CatalogueProduct.eventTags` is bounded to `<= 4` items with element type validation.
4. **PII Isolation Invariant (`/quoteEnquiries/{enquiryId}`)**: Customer enquiries contain PII (`customerPhone`, `customerEmail`). Reading/listing all enquiries is strictly restricted to `isAdmin()` or the authenticated creator (`resource.data.createdBy == request.auth.uid`). Blanket `isSignedIn()` reads are forbidden.
5. **Temporal & Identity Integrity**: All writes enforce `request.time` on `updatedAt` (and `createdAt` on create), and verify `updatedBy == request.auth.uid` / `createdBy == request.auth.uid`.
6. **Terminal State Locking**: Once a `QuoteEnquiry` reaches `status == 'archived'`, non-admin users cannot mutate it; only `isAdmin()` can override terminal states.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unverified Admin Email Spoof**: `{ auth: { uid: 'attacker', token: { email: 'shriyanshsingh7581@gmail.com', email_verified: false } } }` attempting to write `/siteConfig/main` -> **PERMISSION_DENIED**.
2. **Shadow Field Injection on SiteConfig**: Admin or user sending `{ ...validSiteConfig, isSuperAdmin: true }` to `/siteConfig/main` -> **PERMISSION_DENIED** via `keys().hasOnly(...)`.
3. **ID Poisoning Attack**: Creating `/catalogueProducts/bad$id!with/slashes` or 500-char ID -> **PERMISSION_DENIED** via `isValidId(productId)`.
4. **Price Range Inversion / Negative Price**: Writing `/catalogueProducts/spk-1` with `minPrice: -500` or `maxPrice < minPrice` -> **PERMISSION_DENIED**.
5. **Unbounded Array Exhaustion**: Writing `technicalSpecs` with 50 items to `/catalogueProducts/spk-1` -> **PERMISSION_DENIED** (`size() <= 10`).
6. **PII Blanket Read on `/quoteEnquiries`**: Authenticated non-admin user `uid: 'user_2'` attempting `get` or `list` on an enquiry where `createdBy == 'user_1'` -> **PERMISSION_DENIED**.
7. **Identity Spoofing on Enquiry Creation**: Authenticated user `uid: 'user_1'` creating `/quoteEnquiries/enq-1` with `createdBy: 'victim_uid'` -> **PERMISSION_DENIED**.
8. **Forged Client Timestamp**: Creating or updating any document with `updatedAt: Timestamp.fromMillis(1000000)` instead of `request.time` -> **PERMISSION_DENIED**.
9. **Immortal Field Mutation**: Updating `createdAt` or `createdBy` on `/quoteEnquiries/enq-1` -> **PERMISSION_DENIED**.
10. **Self-Assigned Admin Escalation**: Non-admin user creating `/admins/attacker_uid` -> **PERMISSION_DENIED**.
11. **Value Poisoning on Update**: Updating `/mediaItems/vid-1` with `sortOrder: "not-a-number"` or 1MB `caption` -> **PERMISSION_DENIED** because `isValidMediaItem(incoming())` wraps the entire `allow update` block.
12. **Terminal State Bypass**: Non-admin attempting to update an enquiry whose existing `status == 'archived'` -> **PERMISSION_DENIED**.
