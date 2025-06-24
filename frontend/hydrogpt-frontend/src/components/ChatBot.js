import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ messages, onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleQuickQuery = (query) => {
    if (!isLoading) {
      onSendMessage(query);
    }
  };

  const quickQueries = [
    "Which areas have the worst water access?",
    "Show me overall accessibility statistics",
    "Compare Mbeti South and Karaba",
    "How many people need better water access?",
    "What is SCM-G2SFCA methodology?"
  ];

  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 HydroGPT Assistant</h2>
        <p>Ask questions about water accessibility</p>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {formatMessage(message.message)}
            </div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              Analyzing your query...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-queries">
        <p>Quick queries:</p>
        <div className="quick-query-buttons">
          {quickQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuery(query)}
              disabled={isLoading}
              className="quick-query-btn"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about water accessibility..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;