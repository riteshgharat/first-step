import { useState, useRef, useCallback } from 'react';

// 1. Define Types for Kestra's API Structure
interface KestraTaskOutput {
  textOutput?: string;
  content?: string;
  // We allow other keys because Kestra outputs can vary
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

// 2. Define Types for your UI Results
export interface AgentResults {
  detective?: string;
  cfo?: string;
  skeptic?: string;
  strategist?: string;
  oracle?: string;
  memo?: string;
}

export function useKestra() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AgentResults>({});
  const [executionId, setExecutionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startValidation = useCallback(async (idea: string) => {
    setLoading(true);
    setResults({});
    setStatus('STARTING');

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error('Failed to start validation');

      const { executionId } = await res.json();
      setExecutionId(executionId);

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(async () => {
        try {
          const poll = await fetch(`/api/status/${executionId}`);
          
          // 3. Apply the Type here
          const data: KestraExecutionResponse = await poll.json();

          setStatus(data.state?.current);

          const newResults: AgentResults = {};

          // 4. Loop with the correct type (KestraTaskRun) instead of 'any'
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

          setResults((prev) => ({ ...prev, ...newResults }));

          if (['SUCCESS', 'FAILED', 'KILLED', 'WARNING'].includes(data.state?.current)) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setLoading(false);
          }

        } catch (err) {
          console.error("Polling Error:", err);
        }
      }, 1000);

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