# Changelog

All notable changes to the Bushsong project will be documented in this file.

## [1.1.0] - 2026-05-10

### Added
- Integrated `framer-motion` for premium micro-animations and scroll-reveal effects.
- Created `PageContent` client component to handle landing page animations.
- Added CSS Modules for `Header`, `AddToCartButton`, `Layout`, and `Page` components.
- Introduced richer color palette including Charcoal Green and Gold accents.

### Changed
- **Major UI Revamp:** Migrated entire styling architecture from Tailwind utility classes to Vanilla CSS Modules for better long-term flexibility.
- Refactored `Header` with springy navigation and cart animations.
- Enhanced `AddToCartButton` with tactile feedback and dynamic loading states.
- Improved `Hero` section with glassmorphism and entrance animations.
- Updated `Gallery` with 3D-tilt-inspired hover effects on product cards.

### Fixed
- Resolved ESLint `any` type errors in API routes.
- Fixed outdated Stripe `apiVersion` compatibility issues.
- Fixed `no-var` ESLint error in Prisma client initialization.

## [1.0.0] - 2026-05-02
- Initial release of the Bushsong artisan marketplace.
- Product seeding and basic e-commerce functionality.
