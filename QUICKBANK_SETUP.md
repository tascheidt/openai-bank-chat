# QuickBank Banking Demo - Complete Setup Guide

This guide walks you through setting up and testing the QuickBank banking demo app for ChatGPT.

## 🎯 What You'll Get

A fully functional banking interface in ChatGPT that allows users to:
- **Check account balances** with visual cards showing trends
- **View recent transactions** with categorization and filtering
- **Send Interac e-Transfers** through an interactive form

## 📋 Prerequisites

- Node.js 18+ and pnpm (for building the UI widgets)
- Python 3.10+ (for the MCP server)
- ngrok or similar tunneling tool (for testing with ChatGPT)
- ChatGPT with developer mode enabled

## 🚀 Quick Start

### Step 1: Build the Widget Assets

From the repository root:

```bash
# Install dependencies (if not already done)
pnpm install

# Build all widgets including the banking ones
pnpm run build
```

This creates hashed assets in the `assets/` directory:
- `banking-{hash}.html/css/js`
- `banking-transactions-{hash}.html/css/js`
- `banking-transfer-{hash}.html/css/js`

### Step 2: Set Up Python Environment

```bash
# Create a virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r quickbank_server_python/requirements.txt
```

### Step 3: Start the MCP Server

```bash
# From the repository root, with venv activated
uvicorn quickbank_server_python.main:app --port 8000 --reload
```

The server will start at `http://localhost:8000`

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 4: Expose Locally with ngrok

In a new terminal:

```bash
ngrok http 8000
```

Copy the forwarding URL (e.g., `https://browny-multistriate-milagro.ngrok-free.dev`)

### Step 5: Add to ChatGPT

1. Open ChatGPT and enable [developer mode](https://platform.openai.com/docs/guides/developer-mode)
2. Go to **Settings > Connectors**
3. Add a new connector with your ngrok URL + `/mcp`:
   ```
   browny-multistriate-milagro.ngrok-free.dev/mcp
   ```
4. Save and activate the connector

## 💬 Try It Out

Once connected, try these prompts in ChatGPT:

### Check Balance
- "Show me my account balance"
- "How much money do I have?"
- "What's in my checking account?"

### View Transactions
- "Show my recent transactions"
- "What did I spend money on recently?"
- "Show me my last 10 transactions"

### Send Money
- "I need to send money to Sarah"
- "Send $50 to sarah.chen@email.com"
- "Transfer $100 to Michael Torres"

## 🏗️ Architecture

### Components Created

```
quickbank_server_python/
├── main.py              # MCP server with 3 banking tools
├── requirements.txt     # Python dependencies
└── README.md           # Server-specific documentation

src/
├── banking/
│   ├── index.jsx       # Balance card widget
│   └── data.json       # Mock data
├── banking-transactions/
│   └── index.jsx       # Transaction list widget
└── banking-transfer/
    └── index.jsx       # e-Transfer form widget
```

### Tools Exposed

1. **`check-balance`** - Shows account overview with balances and trends
2. **`view-transactions`** - Displays recent transactions with filtering
3. **`send-etransfer`** - Interactive form for sending Interac e-Transfers

### Data Flow

```
User prompt in ChatGPT
    ↓
Model selects appropriate tool
    ↓
MCP server processes request
    ↓
Returns:
  - Text content (for model understanding)
  - Structured data (JSON)
  - Widget metadata (for rendering)
    ↓
ChatGPT renders beautiful UI widget
```

## 🎨 Widget Features

### Balance Widget
- Shows total balance across all accounts
- Individual account cards with trends
- Gradient background with modern design
- Quick action buttons

### Transactions Widget
- Grouped by date (Today, Yesterday, etc.)
- Category icons and colors
- Filter chips (All, Income, Expenses)
- Responsive scrollable list

### Transfer Widget
- Three-step flow: Form → Confirm → Success
- Contact selection with avatars
- Amount input with currency formatting
- Account selection dropdown
- Optional message field

## 🔧 Customization

### Updating Mock Data

Edit `/src/banking/data.json` to change:
- Account balances and names
- Transaction history
- Contact list

After editing, rebuild:
```bash
pnpm run build
```

### Styling

All widgets use:
- Tailwind CSS for styling
- Lucide React for icons
- Gradient backgrounds for visual appeal
- Dark mode support

### Adding New Tools

To add new banking features:

1. Add a new widget in `src/your-feature/index.jsx`
2. Add the widget name to `build-all.mts` targets array
3. Add a new tool definition in `quickbank_server_python/main.py`
4. Implement the handler in `_call_tool_request()`
5. Rebuild with `pnpm run build`

## 🔐 Production Considerations

**⚠️ This is a demo with mock data.** For production:

1. **Security**
   - Implement proper authentication (OAuth 2.0)
   - Use HTTPS everywhere
   - Add 2FA for transfers
   - Encrypt sensitive data

2. **Banking API Integration**
   - Replace mock data with real banking API calls
   - Implement proper error handling
   - Add transaction rate limiting
   - Follow PCI-DSS compliance

3. **Features to Add**
   - Transaction confirmation emails
   - Security questions for transfers
   - Transaction receipts
   - Account statements
   - Budget tracking
   - Financial advice tools

## 🐛 Troubleshooting

### Server won't start
- Check Python version: `python3 --version` (needs 3.10+)
- Verify dependencies: `pip list`
- Check port 8000 isn't in use: `lsof -i :8000`

### Widgets not showing
- Verify build completed: check `assets/` directory for `-2d2b` files
- Check ngrok is running: visit the ngrok URL in browser
- Verify connector URL in ChatGPT includes `/mcp` path

### Assets not loading
- Ensure the hash in `main.py` matches the build output
- Check CORS is enabled (should be automatic)
- Verify asset URLs are accessible

### ChatGPT not calling tools
- Check developer mode is enabled
- Verify connector status in Settings
- Try rephrasing your prompt
- Check server logs for errors

## 📚 Next Steps

### Expand Functionality
- Add retirement savings calculator
- Implement tax optimization advice
- Create spending analysis dashboard
- Add investment portfolio tracking
- Build budget management tools

### Improve UI
- Add animations and transitions
- Implement data visualization (charts)
- Add more interactive elements
- Create custom themes

### Production Deployment
- Deploy to cloud (AWS, GCP, Azure)
- Set up proper authentication
- Integrate with real banking APIs
- Add monitoring and logging
- Implement rate limiting

## 📖 Resources

- [Apps SDK Documentation](https://platform.openai.com/docs/guides/apps-sdk)
- [MCP Specification](https://modelcontextprotocol.io/)
- [FastMCP Documentation](https://github.com/jlowin/fastmcp)
- [Developer Mode Guide](https://platform.openai.com/docs/guides/developer-mode)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for errors
3. Test the MCP endpoint directly in your browser
4. Verify your ChatGPT connector configuration

---

**Built with ❤️ using OpenAI Apps SDK and MCP**

