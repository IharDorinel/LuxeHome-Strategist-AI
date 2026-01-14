
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, ChatMessage, HomeRequirements, Visualization } from './types';
import { createChat, generateImage } from './geminiService';
import { ChatPanel } from './components/ChatPanel';
import { VisualPanel } from './components/VisualPanel';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Welcome to your architectural journey. I am your strategist. Together, we will uncover not just a floor plan, but the backdrop for the life you’ve always envisioned. Tell me, what does "coming home" mean for you?',
        timestamp: Date.now()
      }
    ],
    requirements: {},
    visualizations: [],
    status: 'discovery',
    isGenerating: false
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current) return;

    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setState(prev => ({ ...prev, messages: [...prev.messages, userMsg] }));
    setIsProcessing(true);

    try {
      const result = await chatRef.current.sendMessage({ message: text });
      let responseText = result.text;
      
      // Handle tool calls
      if (result.candidates?.[0]?.content?.parts) {
        for (const part of result.candidates[0].content.parts) {
          if (part.functionCall) {
            const { name, args } = part.functionCall;

            if (name === 'update_requirements') {
              const newReqs = { ...state.requirements, ...args };
              setState(prev => ({ 
                ...prev, 
                requirements: newReqs,
                status: prev.status === 'discovery' ? 'briefing' : prev.status
              }));
              
              // We need to send tool response back
              await chatRef.current.sendMessage({
                message: "Requirements updated successfully."
              });
            }

            if (name === 'generate_visualization') {
              const prompt = args.architectural_prompt;
              setState(prev => ({ ...prev, isGenerating: true, status: 'generating' }));
              
              try {
                const url = await generateImage(prompt);
                const viz: Visualization = {
                  id: Date.now().toString(),
                  url,
                  prompt,
                  timestamp: Date.now()
                };
                setState(prev => ({
                  ...prev,
                  visualizations: [viz, ...prev.visualizations],
                  isGenerating: false,
                  status: 'visualized'
                }));
                
                // Inform the model that generation is complete
                const feedbackResponse = await chatRef.current.sendMessage({
                  message: "The visualization has been successfully generated and shown to the user."
                });
                responseText = feedbackResponse.text;
              } catch (err) {
                console.error("Image generation failed", err);
                setState(prev => ({ ...prev, isGenerating: false }));
              }
            }
          }
        }
      }

      // Add assistant message (the actual text response)
      if (responseText) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: Date.now()
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, assistantMsg] }));
      }
    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but my architectural systems encountered a brief interruption. Shall we continue our discussion about your vision?",
        timestamp: Date.now()
      };
      setState(prev => ({ ...prev, messages: [...prev.messages, errorMsg] }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      <div className="w-full md:w-[450px] lg:w-[550px] shrink-0 h-full">
        <ChatPanel 
          messages={state.messages} 
          onSendMessage={handleSendMessage} 
          isProcessing={isProcessing} 
        />
      </div>
      <div className="hidden md:block flex-1 h-full bg-slate-900">
        <VisualPanel 
          status={state.status} 
          requirements={state.requirements} 
          visualizations={state.visualizations}
          isGenerating={state.isGenerating}
        />
      </div>
    </div>
  );
};

export default App;
