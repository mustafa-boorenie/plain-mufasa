# CLAUDE.md - AI Assistant Guide for Plain Jane Lite Theme

## Project Overview

**Plain Jane Lite** is a premium Shopify Liquid theme (v2.0.0) developed by OPENSPACES for luxury/fashion e-commerce stores.

- **Type**: Shopify Liquid Theme (no build step required)
- **Author**: OPENSPACES (openspaces.design)
- **Support**: info@openspaces.design

## Directory Structure

```
plain-mufasa/
├── assets/           # Static assets (JS, CSS, fonts, images)
├── config/           # Theme configuration
│   ├── settings_schema.json    # Settings definition (DO NOT EDIT settings_data.json)
│   └── settings_data.json      # Active settings (gitignored, store-specific)
├── layout/           # Main theme wrapper
│   └── theme.liquid            # Root HTML template
├── locales/          # Internationalization (en, fr, es)
├── sections/         # Reusable UI components with schemas
├── snippets/         # Liquid includes/utilities
└── templates/        # Page-type templates
```

## Development Workflow

### No Build Step Required
This is a pure Shopify Liquid theme - changes are server-rendered by Shopify.

### Development Options
1. **Shopify Theme Editor**: Direct edits in Shopify Admin
2. **Shopify CLI**: `shopify theme dev` for local development
3. **Direct file editing**: Changes sync automatically when connected

### Key Commands (with Shopify CLI)
```bash
shopify theme dev           # Start local development server
shopify theme push          # Push changes to store
shopify theme pull          # Pull latest from store
shopify theme check         # Lint Liquid files
```

### Git Workflow
- `config/settings_data.json` is gitignored (contains store-specific settings)
- Only `config/settings_schema.json` should be version controlled
- Commits from Shopify sync appear as "Update from Shopify for theme..."

## Code Conventions

### Liquid Templating Patterns

**Section + Schema Pattern**: Each section file contains HTML + JSON schema:
```liquid
<!-- Section HTML -->
<div class="my-component">
  {{ settings.my_setting }}
</div>

{% schema %}
{
  "name": "My Section",
  "settings": [
    { "type": "text", "id": "my_setting", "label": "Setting Label" }
  ]
}
{% endschema %}
```

**Settings Access**: Use `settings.setting_id` for global theme settings:
```liquid
{% if settings.show_announcement_bar %}
  <div style="color: {{ settings.announcement_text_color }};">
    {{ settings.announcement_text }}
  </div>
{% endif %}
```

**Template-Conditional Logic**: Common pattern for per-page styling:
```liquid
{% case template.name %}
  {% when 'index' %}
    {# Home page specific logic #}
  {% when 'collection' %}
    {# Collection page logic #}
  {% else %}
    {# Default logic #}
{% endcase %}
```

### File Naming Conventions
- **Kebab-case**: `music-player.js`, `email-modal.liquid`
- **Private snippets**: Prefix with `__` (e.g., `__default-head.liquid`)
- **Settings keys**: Snake_case with prefixes (e.g., `footer_background_color`)

### JavaScript Conventions
- Vanilla JS (no frameworks)
- Event-driven with `addEventListener`
- Use `requestAnimationFrame` for animations
- Scripts loaded at end of `<body>` in `theme.liquid`

### CSS Conventions
- Inline styles via Liquid settings: `style="color: {{ settings.color }};"`
- CSS custom properties defined in `:root` in `theme.liquid`
- Key variables: `--font_body`, `--font_header`

## Key Files Reference

| File | Purpose |
|------|---------|
| `layout/theme.liquid` | Root HTML wrapper, font loading, global scripts |
| `templates/index.liquid` | Homepage/enter screen |
| `templates/collection.liquid` | Shop/collection pages |
| `templates/product.json` | Product page sections config |
| `snippets/__default-head.liquid` | Default `<head>` content |
| `config/settings_schema.json` | All customizable theme settings |
| `assets/plain-jane-2.js` | Main JS bundle (minified) |
| `assets/music-player.js` | Audio player functionality |

## Theme Settings Categories

The theme has extensive customization via `config/settings_schema.json`:

1. **Announcement Bar** - Scrolling text, per-page colors
2. **Music Player** - Custom audio with disk cover
3. **Typography** - 5 font families (header, body, nav, button, countdown)
4. **Enter Screen Layout** - Homepage menu positioning
5. **Clock Settings** - Timezone picker (80+ timezones)
6. **Scrollbar Settings** - Custom scrollbar styling
7. **Logo** - Per-page logo configuration
8. **Shop Layout** - Grid columns (1-6), gaps, product hover
9. **Password Page** - Two style variants
10. **Footer Settings** - Colors, visibility, sizing
11. **Email Popup** - Modal signup configuration
12. **SEO Settings** - Favicon, rich snippets
13. **Search Page** - Results styling
14. **Cart Settings** - Upper/middle/lower sections
15. **Misc. Settings** - Animations, lazy loading

## External Dependencies

### CDN Libraries
- **FontAwesome 6.3.0** - Icons
- **Google Fonts** - Inconsolata, Inter, Inter Tight
- **Webfont.js** - Font loader

### APIs
- **worldtimeapi.org** - Dynamic timezone conversion for clock display

### Shopify APIs
- `shop.money_format` - Currency formatting
- `product`, `collection` - Commerce data objects
- Liquid filters: `img_url`, `font_face`, `color_modify`, `asset_url`

## Important Patterns & Gotchas

### Settings Access
```liquid
{# Global settings (from settings_schema.json) #}
{{ settings.footer_background_color }}

{# Section settings (from section schema) #}
{{ section.settings.heading }}

{# Block settings (within section blocks) #}
{{ block.settings.text }}
```

### Asset URLs
Always use Shopify filters for asset paths:
```liquid
{{ 'music-player.js' | asset_url }}
{{ 'logo.png' | asset_url }}
{{ product.featured_image | img_url: '500x' }}
```

### Conditional Footer Rendering
Footer visibility is controlled at multiple levels in `theme.liquid:98-113`:
- `settings.hide_footer_on_all_pages` - Global toggle
- `settings.show_footer_on_home` - Homepage specific
- `settings.show_footer_on_collection` - Collection specific
- Password pages never show footer

### Font Loading
Custom fonts are loaded via `@font-face` in `theme.liquid:11-55` with fallbacks:
- Check `enable_custom_X_font` setting
- If true: use `custom_X_font` URL
- If false: use Shopify `font_picker` value

### Responsive Design
Settings often have desktop/mobile variants:
```liquid
{{ settings.footer_text_size }}        {# Desktop #}
{{ settings.footer_text_size_mobile }} {# Mobile #}
```

## Common Tasks

### Adding a New Section
1. Create file in `sections/` with `.liquid` extension
2. Add HTML content and `{% schema %}` block
3. Reference in templates via `{% section 'section-name' %}`

### Adding New Theme Settings
1. Edit `config/settings_schema.json`
2. Add setting object to appropriate category
3. Access via `{{ settings.your_setting_id }}`

### Adding JavaScript
1. Add `.js` file to `assets/`
2. Include in `theme.liquid` or specific template:
   ```liquid
   <script src="{{ 'your-script.js' | asset_url }}"></script>
   ```

### Adding CSS
1. Add to existing stylesheet in `assets/` or create new one
2. Include in `__default-head.liquid`:
   ```liquid
   {{ 'your-styles.css' | asset_url | stylesheet_tag }}
   ```

## Testing Considerations

- Test across templates: index, collection, product, page, blog, article
- Verify mobile responsiveness (check `mobile-layout` settings)
- Test with announcement bar on/off
- Verify timezone display with different `settings.timezone` values
- Check footer visibility settings per page type
