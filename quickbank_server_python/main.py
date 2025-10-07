"""QuickBank demo MCP server for banking operations.

This server exposes tools for checking balances, viewing transactions,
and sending Interac e-transfers through a conversational interface in ChatGPT.
"""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from typing import Any, Dict, List
from datetime import datetime, timedelta

import mcp.types as types
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, ConfigDict, Field

# Mock banking data
MOCK_ACCOUNTS = [
    {
        "id": "checking",
        "name": "Checking Account",
        "accountNumber": "****4521",
        "balance": 3245.67,
        "currency": "CAD",
        "trend": "+2.3%"
    },
    {
        "id": "savings",
        "name": "Savings Account",
        "accountNumber": "****8892",
        "balance": 12890.32,
        "currency": "CAD",
        "trend": "+5.1%"
    }
]

MOCK_TRANSACTIONS = [
    {
        "id": "t1",
        "date": "2025-10-06",
        "description": "Coffee Shop",
        "amount": -5.67,
        "category": "Food & Dining",
        "merchant": "Bean There Cafe",
        "type": "debit"
    },
    {
        "id": "t2",
        "date": "2025-10-06",
        "description": "Salary Deposit",
        "amount": 2450.00,
        "category": "Income",
        "merchant": "ACME Corp",
        "type": "credit"
    },
    {
        "id": "t3",
        "date": "2025-10-05",
        "description": "Grocery Store",
        "amount": -87.42,
        "category": "Groceries",
        "merchant": "FreshMart",
        "type": "debit"
    },
    {
        "id": "t4",
        "date": "2025-10-05",
        "description": "Gas Station",
        "amount": -52.30,
        "category": "Transportation",
        "merchant": "Shell",
        "type": "debit"
    },
    {
        "id": "t5",
        "date": "2025-10-04",
        "description": "Online Shopping",
        "amount": -129.99,
        "category": "Shopping",
        "merchant": "Amazon",
        "type": "debit"
    },
    {
        "id": "t6",
        "date": "2025-10-03",
        "description": "Restaurant",
        "amount": -67.85,
        "category": "Food & Dining",
        "merchant": "The Italian Place",
        "type": "debit"
    },
    {
        "id": "t7",
        "date": "2025-10-02",
        "description": "Interac e-Transfer",
        "amount": -100.00,
        "category": "Transfer",
        "merchant": "To: Sarah Chen",
        "type": "etransfer"
    },
    {
        "id": "t8",
        "date": "2025-10-01",
        "description": "Rent Payment",
        "amount": -1850.00,
        "category": "Housing",
        "merchant": "Property Management",
        "type": "debit"
    }
]

MOCK_CONTACTS = [
    {
        "id": "c1",
        "name": "Sarah Chen",
        "email": "sarah.chen@email.com",
        "avatar": "SC",
        "recent": True
    },
    {
        "id": "c2",
        "name": "Michael Torres",
        "email": "m.torres@email.com",
        "avatar": "MT",
        "recent": True
    },
    {
        "id": "c3",
        "name": "Emma Wilson",
        "email": "emma.w@email.com",
        "avatar": "EW",
        "recent": False
    },
    {
        "id": "c4",
        "name": "James Park",
        "email": "jpark@email.com",
        "avatar": "JP",
        "recent": False
    }
]


@dataclass(frozen=True)
class BankingWidget:
    identifier: str
    title: str
    template_uri: str
    invoking: str
    invoked: str
    html: str
    response_text: str


# Widget definitions - update these URLs after building
widgets: List[BankingWidget] = [
    BankingWidget(
        identifier="check-balance",
        title="Check Account Balance",
        template_uri="ui://widget/banking.html",
        invoking="Retrieving your account balance",
        invoked="Balance retrieved",
        html=(
            "<div id=\"banking-root\"></div>\n"
            "<link rel=\"stylesheet\" href=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-2d2b.css\">\n"
            "<script type=\"module\" src=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-2d2b.js\"></script>"
        ),
        response_text="Here's your current account balance overview.",
    ),
    BankingWidget(
        identifier="view-transactions",
        title="View Recent Transactions",
        template_uri="ui://widget/banking-transactions.html",
        invoking="Loading your recent transactions",
        invoked="Transactions loaded",
        html=(
            "<div id=\"banking-transactions-root\"></div>\n"
            "<link rel=\"stylesheet\" href=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-transactions-2d2b.css\">\n"
            "<script type=\"module\" src=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-transactions-2d2b.js\"></script>"
        ),
        response_text="Here are your recent transactions.",
    ),
    BankingWidget(
        identifier="send-etransfer",
        title="Send Interac e-Transfer",
        template_uri="ui://widget/banking-transfer.html",
        invoking="Preparing transfer form",
        invoked="Transfer form ready",
        html=(
            "<div id=\"banking-transfer-root\"></div>\n"
            "<link rel=\"stylesheet\" href=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-transfer-2d2b.css\">\n"
            "<script type=\"module\" src=\"https://persistent.oaistatic.com/"
            "ecosystem-built-assets/banking-transfer-2d2b.js\"></script>"
        ),
        response_text="You can now send an Interac e-Transfer.",
    ),
]


MIME_TYPE = "text/html+skybridge"

WIDGETS_BY_ID: Dict[str, BankingWidget] = {widget.identifier: widget for widget in widgets}
WIDGETS_BY_URI: Dict[str, BankingWidget] = {widget.template_uri: widget for widget in widgets}


# Input schemas for each tool
class CheckBalanceInput(BaseModel):
    """Schema for check-balance tool."""
    account_id: str | None = Field(
        None,
        alias="accountId",
        description="Optional account ID to check. If not provided, shows all accounts."
    )
    model_config = ConfigDict(populate_by_name=True, extra="forbid")


class ViewTransactionsInput(BaseModel):
    """Schema for view-transactions tool."""
    account_id: str | None = Field(
        None,
        alias="accountId",
        description="Optional account ID to filter transactions."
    )
    limit: int = Field(
        10,
        description="Number of recent transactions to return."
    )
    model_config = ConfigDict(populate_by_name=True, extra="forbid")


class SendETransferInput(BaseModel):
    """Schema for send-etransfer tool."""
    recipient_name: str | None = Field(
        None,
        alias="recipientName",
        description="Name of the recipient"
    )
    recipient_email: str | None = Field(
        None,
        alias="recipientEmail",
        description="Email address of the recipient"
    )
    amount: float | None = Field(
        None,
        description="Amount to transfer in CAD"
    )
    model_config = ConfigDict(populate_by_name=True, extra="forbid")


mcp = FastMCP(
    name="quickbank-python",
    sse_path="/mcp",
    message_path="/mcp/messages",
    stateless_http=True,
)


def _tool_meta(widget: BankingWidget) -> Dict[str, Any]:
    return {
        "openai/outputTemplate": widget.template_uri,
        "openai/toolInvocation/invoking": widget.invoking,
        "openai/toolInvocation/invoked": widget.invoked,
        "openai/widgetAccessible": True,
        "openai/resultCanProduceWidget": True,
        "annotations": {
            "destructiveHint": False,
            "openWorldHint": False,
            "readOnlyHint": True,
        }
    }


def _embedded_widget_resource(widget: BankingWidget) -> types.EmbeddedResource:
    return types.EmbeddedResource(
        type="resource",
        resource=types.TextResourceContents(
            uri=widget.template_uri,
            mimeType=MIME_TYPE,
            text=widget.html,
            title=widget.title,
        ),
    )


@mcp._mcp_server.list_tools()
async def _list_tools() -> List[types.Tool]:
    return [
        types.Tool(
            name="check-balance",
            title="Check Account Balance",
            description="Check your account balance and view account overview",
            inputSchema={
                "type": "object",
                "properties": {
                    "accountId": {
                        "type": "string",
                        "description": "Optional account ID to check specific account"
                    }
                },
                "additionalProperties": False,
            },
            _meta=_tool_meta(WIDGETS_BY_ID["check-balance"]),
        ),
        types.Tool(
            name="view-transactions",
            title="View Recent Transactions",
            description="View your recent transaction history",
            inputSchema={
                "type": "object",
                "properties": {
                    "accountId": {
                        "type": "string",
                        "description": "Optional account ID to filter transactions"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Number of transactions to show (default: 10)",
                        "default": 10
                    }
                },
                "additionalProperties": False,
            },
            _meta=_tool_meta(WIDGETS_BY_ID["view-transactions"]),
        ),
        types.Tool(
            name="send-etransfer",
            title="Send Interac e-Transfer",
            description="Send money to someone via Interac e-Transfer",
            inputSchema={
                "type": "object",
                "properties": {
                    "recipientName": {
                        "type": "string",
                        "description": "Name of the recipient"
                    },
                    "recipientEmail": {
                        "type": "string",
                        "description": "Email address of the recipient"
                    },
                    "amount": {
                        "type": "number",
                        "description": "Amount to transfer in CAD"
                    }
                },
                "additionalProperties": False,
            },
            _meta=_tool_meta(WIDGETS_BY_ID["send-etransfer"]),
        ),
    ]


@mcp._mcp_server.list_resources()
async def _list_resources() -> List[types.Resource]:
    return [
        types.Resource(
            name=widget.title,
            title=widget.title,
            uri=widget.template_uri,
            description=f"{widget.title} widget markup",
            mimeType=MIME_TYPE,
            _meta=_tool_meta(widget),
        )
        for widget in widgets
    ]


@mcp._mcp_server.list_resource_templates()
async def _list_resource_templates() -> List[types.ResourceTemplate]:
    return [
        types.ResourceTemplate(
            name=widget.title,
            title=widget.title,
            uriTemplate=widget.template_uri,
            description=f"{widget.title} widget markup",
            mimeType=MIME_TYPE,
            _meta=_tool_meta(widget),
        )
        for widget in widgets
    ]


async def _handle_read_resource(req: types.ReadResourceRequest) -> types.ServerResult:
    widget = WIDGETS_BY_URI.get(str(req.params.uri))
    if widget is None:
        return types.ServerResult(
            types.ReadResourceResult(
                contents=[],
                _meta={"error": f"Unknown resource: {req.params.uri}"},
            )
        )

    contents = [
        types.TextResourceContents(
            uri=widget.template_uri,
            mimeType=MIME_TYPE,
            text=widget.html,
            _meta=_tool_meta(widget),
        )
    ]

    return types.ServerResult(types.ReadResourceResult(contents=contents))


async def _call_tool_request(req: types.CallToolRequest) -> types.ServerResult:
    tool_name = req.params.name
    arguments = req.params.arguments or {}

    # Handle check-balance
    if tool_name == "check-balance":
        widget = WIDGETS_BY_ID["check-balance"]
        total_balance = sum(acc["balance"] for acc in MOCK_ACCOUNTS)
        
        structured_content = {
            "accounts": MOCK_ACCOUNTS,
            "totalBalance": total_balance
        }
        
        response_text = (
            f"Your total balance across all accounts is ${total_balance:,.2f} CAD. "
            f"Checking account: ${MOCK_ACCOUNTS[0]['balance']:,.2f}, "
            f"Savings account: ${MOCK_ACCOUNTS[1]['balance']:,.2f}."
        )
        
        widget_resource = _embedded_widget_resource(widget)
        meta: Dict[str, Any] = {
            "openai.com/widget": widget_resource.model_dump(mode="json"),
            "openai/outputTemplate": widget.template_uri,
            "openai/toolInvocation/invoking": widget.invoking,
            "openai/toolInvocation/invoked": widget.invoked,
            "openai/widgetAccessible": True,
            "openai/resultCanProduceWidget": True,
        }
        
        return types.ServerResult(
            types.CallToolResult(
                content=[
                    types.TextContent(
                        type="text",
                        text=response_text,
                    )
                ],
                structuredContent=structured_content,
                _meta=meta,
            )
        )

    # Handle view-transactions
    elif tool_name == "view-transactions":
        widget = WIDGETS_BY_ID["view-transactions"]
        limit = arguments.get("limit", 10)
        transactions = MOCK_TRANSACTIONS[:limit]
        
        structured_content = {
            "transactions": transactions,
            "accountName": "All Accounts"
        }
        
        response_text = (
            f"Here are your {len(transactions)} most recent transactions. "
            f"Your last transaction was {transactions[0]['merchant']} "
            f"for ${abs(transactions[0]['amount']):.2f}."
        )
        
        widget_resource = _embedded_widget_resource(widget)
        meta: Dict[str, Any] = {
            "openai.com/widget": widget_resource.model_dump(mode="json"),
            "openai/outputTemplate": widget.template_uri,
            "openai/toolInvocation/invoking": widget.invoking,
            "openai/toolInvocation/invoked": widget.invoked,
            "openai/widgetAccessible": True,
            "openai/resultCanProduceWidget": True,
        }
        
        return types.ServerResult(
            types.CallToolResult(
                content=[
                    types.TextContent(
                        type="text",
                        text=response_text,
                    )
                ],
                structuredContent=structured_content,
                _meta=meta,
            )
        )

    # Handle send-etransfer
    elif tool_name == "send-etransfer":
        widget = WIDGETS_BY_ID["send-etransfer"]
        
        structured_content = {
            "contacts": MOCK_CONTACTS,
            "accounts": MOCK_ACCOUNTS,
            "preselectedContact": None,
            "preselectedAmount": arguments.get("amount")
        }
        
        # Try to match recipient to a contact
        recipient_email = arguments.get("recipientEmail")
        if recipient_email:
            for contact in MOCK_CONTACTS:
                if contact["email"].lower() == recipient_email.lower():
                    structured_content["preselectedContact"] = contact
                    break
        
        response_text = "Ready to send an Interac e-Transfer. Please review and confirm the details."
        
        widget_resource = _embedded_widget_resource(widget)
        meta: Dict[str, Any] = {
            "openai.com/widget": widget_resource.model_dump(mode="json"),
            "openai/outputTemplate": widget.template_uri,
            "openai/toolInvocation/invoking": widget.invoking,
            "openai/toolInvocation/invoked": widget.invoked,
            "openai/widgetAccessible": True,
            "openai/resultCanProduceWidget": True,
        }
        
        return types.ServerResult(
            types.CallToolResult(
                content=[
                    types.TextContent(
                        type="text",
                        text=response_text,
                    )
                ],
                structuredContent=structured_content,
                _meta=meta,
            )
        )

    # Unknown tool
    return types.ServerResult(
        types.CallToolResult(
            content=[
                types.TextContent(
                    type="text",
                    text=f"Unknown tool: {tool_name}",
                )
            ],
            isError=True,
        )
    )


mcp._mcp_server.request_handlers[types.CallToolRequest] = _call_tool_request
mcp._mcp_server.request_handlers[types.ReadResourceRequest] = _handle_read_resource


app = mcp.streamable_http_app()

try:
    from starlette.middleware.cors import CORSMiddleware

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=False,
    )
except Exception:
    pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("quickbank_server_python.main:app", host="0.0.0.0", port=8000, reload=True)

