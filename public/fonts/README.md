# Lato fonts

The following unmodified Lato 2.015 webfonts come from `lato-font@3.0.0`:

- `lato-medium.woff2`: 500 (Medium)
- `lato-bold.woff2`: 700 (Bold)
- `lato-heavy.woff2`: 800 (Heavy)

Source archive: https://registry.npmjs.org/lato-font/-/lato-font-3.0.0.tgz
Font project: https://www.latofonts.com/
License: [SIL Open Font License 1.1](OFL-Lato.txt).

These files include Latin and Cyrillic glyphs. Each is registered as a separate
weight of `LatoLocal` in `src/styles/fonts.css`, alongside the existing 400, 600,
and 900 faces. Keep separate font files for separate weights: assigning a range
of weights to a static font does not create intermediate outlines.
