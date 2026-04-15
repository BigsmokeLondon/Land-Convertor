# Google Maps Platform Pricing Estimate (2026)

**Target Usage:** ~1,000 calls per month  
**Status:** Estimated Cost is **$0.00 / month**

## Summary of Costs
As of the March 1, 2025 pricing update, Google Maps Platform has moved to a SKU-specific "Free Tier" model. Since your estimated volume is 1,000 calls per month, you fall well within the free thresholds for all essential mapping services.

| Service | SKU | Category | Free Monthly Cap | Estimated Volume | Monthly Cost |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Interactive Map** | Dynamic Maps | Essentials | 10,000 loads | 1,000 | **$0.00** |
| **Location Search** | Geocoding | Essentials | 10,000 calls | ~100 | **$0.00** |
| **Autocomplete** | Places Autocomplete | Essentials | 10,000 calls | ~200 | **$0.00** |
| **Static Snippets** | Static Maps | Essentials | 10,000 loads | ~100 | **$0.00** |

---

## ⚠️ Important Requirements
To switch to Google Maps, you must complete the following steps:
1. **Google Cloud Account**: Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. **Billing Account**: You **MUST** attach a valid credit card or payment method to the project. Even though the bill will be $0.00, the API will not work without a linked billing account.
3. **API Keys**: You will need to generate an API key and restrict it to your specific domain (for your PWA) or package name (for your Desktop app) to prevent unauthorized use.

## Comparison: Leaflet vs. Google Maps
| Feature | Leaflet (Current) | Google Maps (Proposed) |
| :--- | :--- | :--- |
| **Cost** | 100% Free | Free up to 10k loads/mo |
| **Satellite Detail** | Good (ESRI/ArcGIS) | Superior (Google Satellite) |
| **Ease of Use** | Open Source / Flexible | Proprietary / Integrated |
| **Setup** | No account required | Requires Google Cloud Account |

## Growth Projection
If your app grows beyond 10,000 loads per month:
- **Rate**: ~$7.00 per 1,000 maps loads (Dynamic Maps).
- **Controls**: You can set **Daily Quotas** in the Google Cloud Console to ensure you never accidentally exceed the free tier and get charged.

---
*Generated based on Google Maps Platform Pricing update (March 2025).*
