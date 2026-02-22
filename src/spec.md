# Specification

## Summary
**Goal:** Fix Vortex AI response display, replace gym locator with zip code search, and clean up unnecessary form fields.

**Planned changes:**
- Parse Vortex AI responses to display only clean conversational text without code blocks or technical artifacts
- Replace Gym Buddy Locator with zip code/city name search system (no geolocation or maps)
- Remove all unnecessary and empty form fields across client, trainer, and admin dashboards
- Update VortexMessage component to properly format and display parsed AI responses

**User-visible outcome:** Users will see clean, readable AI chat responses, can search for gyms by entering their zip code or city name, and encounter streamlined forms with only relevant fields.
