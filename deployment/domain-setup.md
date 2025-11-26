# Domain Setup Guide

## 1. Purchase Domain
- Register domain at Namecheap, GoDaddy, or Cloudflare
- Recommended: henmo-ai.com

## 2. Cloudflare Setup
1. Add site to Cloudflare
2. Update nameservers at domain registrar
3. Configure DNS records:

```
Type    Name    Content                     Proxy
A       @       vercel-ip-address          ✅
CNAME   www     henmo-ai.com               ✅
CNAME   api     henmo-ai-api.railway.app   ✅
CNAME   cdn     cloudfront-domain          ✅
```

## 3. SSL Configuration
- Enable "Always Use HTTPS" in Cloudflare
- Set SSL/TLS encryption mode to "Full (strict)"
- Enable HSTS

## 4. Vercel Domain Setup
```bash
vercel domains add henmo-ai.com
vercel domains add www.henmo-ai.com
```

## 5. Railway Custom Domain
1. Go to Railway project settings
2. Add custom domain: api.henmo-ai.com
3. Update DNS CNAME record

## 6. Performance Optimization
- Enable Cloudflare caching rules
- Configure page rules for static assets
- Enable Brotli compression
- Set up Web Analytics

## 7. Security Headers
Already configured in:
- `next.config.js` for frontend
- `vercel.json` for Vercel
- `netlify.toml` for Netlify