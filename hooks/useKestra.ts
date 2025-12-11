import { useState, useRef, useCallback } from 'react';

// --- Types ---
interface KestraTaskOutput {
  textOutput?: string;
  content?: string;
  [key: string]: unknown;
}

interface KestraTaskRun {
  id: string;
  taskId: string;
  outputs?: KestraTaskOutput;
  state: {
    current: string;
  };
}

interface KestraExecutionResponse {
  id: string;
  state: {
    current: string;
  };
  taskRunList?: KestraTaskRun[];
}

export interface AgentResults {
  detective?: string;
  cfo?: string;
  skeptic?: string;
  strategist?: string;
  oracle?: string;
  memo?: string;
}

// --- Hook ---
export function useKestra() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AgentResults>({});
  const [executionId, setExecutionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startValidation = useCallback(async (idea: string) => {
    // Reset State
    setLoading(true);
    setResults({});
    setStatus('STARTING');

    try {
      // 1. Call Next.js API (which calls Kestra Webhook)
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error('Failed to start validation flow');

      const { executionId } = await res.json();
      setExecutionId(executionId);

      // 2. Start Polling Logic
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(async () => {
        try {
          // Poll the Status API
          const poll = await fetch(`/api/status/${executionId}`);
          if (!poll.ok) return;

          const data: KestraExecutionResponse = await poll.json();
          setStatus(data.state?.current);

          // 3. Extract Agent Outputs
          const newResults: AgentResults = {};

          data.taskRunList?.forEach((task: KestraTaskRun) => {
            const outputText = task.outputs?.textOutput || task.outputs?.content;

            if (outputText) {
              switch (task.taskId) {
                case 'detective_agent':
                  newResults.detective = outputText;
                  break;
                case 'cfo_agent':
                  newResults.cfo = outputText;
                  break;
                case 'skeptic_agent':
                  newResults.skeptic = outputText;
                  break;
                case 'strategist_agent':
                  newResults.strategist = outputText;
                  break;
                case 'oracle_agent':
                  newResults.oracle = outputText;
                  break;
                case 'investment_memo':
                  newResults.memo = outputText;
                  break;
              }
            }
          });

          // Update UI results
          setResults((prev) => ({ ...prev, ...newResults }));

          // 4. Stop Polling if Finished
          if (['SUCCESS', 'FAILED', 'KILLED', 'WARNING'].includes(data.state?.current)) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setLoading(false);
          }

        } catch (err) {
          console.error("Polling Error:", err);
        }
      }, 1000); // Check every 1 second

    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('ERROR');
      setLoading(false);
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  return { startValidation, stopPolling, status, loading, results, executionId };
}