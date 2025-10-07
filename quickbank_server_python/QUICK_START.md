# QuickBank Quick Start 🚀

## Start the Server

```bash
# From repo root
source .venv/bin/activate
uvicorn quickbank_server_python.main:app --port 8000 --reload
```

## Expose with ngrok

```bash
ngrok http 8000
```

## Add to ChatGPT

Settings > Connectors > Add connector:
```
https://YOUR-NGROK-URL.ngrok-free.app/mcp
```

## Try These Prompts

✅ "Show me my account balance"  
✅ "What are my recent transactions?"  
✅ "Send $50 to Sarah Chen"  
✅ "How much did I spend on food this week?"  
✅ "Transfer money to sarah.chen@email.com"  

## Tools Available

| Tool | Description |
|------|-------------|
| `check-balance` | View account balances and trends |
| `view-transactions` | Browse recent transaction history |
| `send-etransfer` | Send money via Interac e-Transfer |

## Mock Data

- **Checking**: $3,245.67 CAD
- **Savings**: $12,890.32 CAD
- **Contacts**: Sarah Chen, Michael Torres, Emma Wilson, James Park
- **Transactions**: 8 recent transactions with various categories

## File Locations

- Server: `quickbank_server_python/main.py`
- Widgets: `src/banking*/index.jsx`
- Mock Data: `src/banking/data.json`
- Full Guide: `QUICKBANK_SETUP.md`

---

**Need help?** Check `QUICKBANK_SETUP.md` for full documentation.

