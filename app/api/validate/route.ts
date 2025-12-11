import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    // -------------------------------------------------------------------------
    // 🔗 KESTRA WEBHOOK URL
    // Format: /api/v1/executions/webhook/{namespace}/{flowId}/{key}
    // -------------------------------------------------------------------------
    const NAMESPACE = process.env.NEXT_PUBLIC_KESTRA_NAMESPACE;
    const FLOW_ID = process.env.NEXT_PUBLIC_KESTRA_FLOW_ID;
    const SECRET_KEY = process.env.NEXT_PUBLIC_KESTRA_SECRET_KEY;
    
    const kestraUrl = `${process.env.NEXT_PUBLIC_KESTRA_URL}/api/v1/executions/webhook/${NAMESPACE}/${FLOW_ID}/${SECRET_KEY}`;

    const response = await fetch(kestraUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Kestra Webhooks expect the inputs directly in the body
      body: JSON.stringify({ idea: idea }) 
    });

    if (!response.ok) {
      throw new Error(`Kestra Webhook Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Webhook returns the full Execution object. We just need the ID.
    return NextResponse.json({ executionId: data.id });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to trigger startup validator" }, 
      { status: 500 }
    );
  }
}