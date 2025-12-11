import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ executionId: string }> }
) {
  try {
    const { executionId } = await params;

    const kestraUrl = `${process.env.NEXT_PUBLIC_KESTRA_URL}/api/v1/executions/${executionId}`;

    // Status API is protected (Webhook is public, but Status is not)
    // Use the same username/password you use to log into Kestra UI
    const username = process.env.KESTRA_USERNAME || ''; 
    const password = process.env.KESTRA_PASSWORD || ''; 
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const response = await fetch(kestraUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ state: { current: 'STARTING' } });
      }
      throw new Error(`Kestra Status API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Status API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}