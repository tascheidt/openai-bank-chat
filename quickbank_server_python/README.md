# QuickBank MCP Server

A demo banking MCP server that provides conversational banking features through ChatGPT.

## Features

- **Check Balance** - View account balances and trends
- **View Transactions** - Browse recent transaction history with filtering
- **Send e-Transfer** - Send money via Interac e-Transfer to contacts

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Build the widget assets (from the root directory):
```bash
pnpm run build
```

3. Start the server:
```bash
uvicorn quickbank_server_python.main:app --port 8000 --reload
```

The server will be available at `http://localhost:8000/mcp`

## Testing in ChatGPT

1. Enable [developer mode](https://platform.openai.com/docs/guides/developer-mode) in ChatGPT
2. Use ngrok to expose your local server:
   ```bash
   ngrok http 8000
   ```
3. Add the ngrok URL to ChatGPT in Settings > Connectors
   - Example: `https://your-ngrok-url.ngrok-free.app/mcp`

## Usage Examples

Try these prompts in ChatGPT:
- "Show me my account balance"
- "What are my recent transactions?"
- "I need to send $50 to Sarah"
- "Send an e-transfer to sarah.chen@email.com for $100"

## Future Expansion

This server is designed to be extended with:
- Financial advice and planning tools
- Retirement savings calculators
- Tax optimization suggestions
- Spending analysis and budgeting
- Investment tracking

## Data

Currently uses mock data for demonstration. In production, you would:
1. Connect to your banking API
2. Implement proper authentication
3. Add security measures (encryption, 2FA, etc.)
4. Follow financial regulations and compliance requirements

