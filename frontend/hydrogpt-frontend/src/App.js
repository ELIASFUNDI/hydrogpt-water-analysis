import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [mapData, setMapData] = useState(null);
  const [waterPointsData, setWaterPointsData] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      message: '🌊 Hello, I am HydroGPT!\n\nI am your intelligent water accessibility analysis assistant for Mbeere South Subcounty. I provide comprehensive insights using advanced SCM-G2SFCA methodology to help water planning agencies and decision-makers optimize water resource management.\n\nTry asking:\n• "Which areas have the worst water access?"\n• "Show me accessibility statistics"\n• "What is SCM-G2SFCA methodology?"\n• "Compare different sublocations"\n• "Generate accessibility reports"\n\nWhat would you like to know?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [mapInstructions, setMapInstructions] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [spatialContext, setSpatialContext] = useState(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (chatMessages.length > 1) {
      scrollToBottom();
    } else {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [chatMessages]);

  useEffect(() => {
    loadMapData();
    loadWaterPoints();
  }, []);

  const loadMapData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/default-map-data`);
      setMapData(response.data);
      console.log('✅ Map data loaded:', response.data.features?.length, 'sublocations');
    } catch (error) {
      console.error('❌ Map data error:', error);
      setChatMessages(prev => [...prev, {
        type: 'bot',
        message: '⚠️ Connection Error: Unable to load water accessibility data.\n\nPlease check:\n• Backend server is running\n• Database connection is active\n• Network connectivity is stable\n\nContact your system administrator if the problem persists.',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const loadWaterPoints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/water-points`);
      setWaterPointsData(response.data);
      console.log('✅ Water points loaded:', response.data.features?.length, 'points');
    } catch (error) {
      console.error('❌ Water points error:', error);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    
    const userMessage = {
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    setTimeout(() => scrollToBottom(), 50);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/query`, {
        query: message.trim(),
        user_id: 'hydrogpt_user'
      });

      const result = response.data;

      const botMessage = {
        type: 'bot',
        message: result.text_response,
        timestamp: result.timestamp || new Date().toISOString(),
        confidence: result.confidence_level || 'medium',
        spatial_context: result.spatial_context
      };
      setChatMessages(prev => [...prev, botMessage]);

      // Handle AI-controlled map and chart instructions
      if (result.map_instructions) {
        console.log('🗺️ Received map instructions from backend:', result.map_instructions);
        handleMapInstructions(result.map_instructions);
      } else {
        console.log('❌ No map instructions received from backend');
      }
      
      if (result.chart_instructions) {
        handleChartInstructions(result.chart_instructions);
      }

      // Extract proactive suggestions from AI response
      if (result.proactive_suggestions) {
        setAiSuggestions(result.proactive_suggestions);
      }

      // Extract and display spatial context
      if (result.spatial_context) {
        setSpatialContext(result.spatial_context);
      }

      // Show confidence level in UI (for transparency)
      if (result.confidence_level === 'low') {
        console.log('AI has low confidence in this response');
      }
      
      // Fallback: Generate chart for certain keywords if no explicit instructions
      if (!result.chart_instructions && (
          message.toLowerCase().includes('worst') || 
          message.toLowerCase().includes('statistics') || 
          message.toLowerCase().includes('ranking') ||
          message.toLowerCase().includes('compare') ||
          message.toLowerCase().includes('chart') ||
          message.toLowerCase().includes('areas'))) {
        generateChart();
      }

    } catch (error) {
      console.error('❌ Query error:', error);
      const errorMessage = {
        type: 'bot',
        message: '🚫 Analysis Error: I encountered an issue processing your water accessibility query.\n\nThis could be due to:\n• Temporary server overload\n• Database connectivity issues\n• Complex query processing\n\nPlease try rephrasing your question or try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleMapInstructions = (instructions) => {
    console.log('🗺️ Processing Advanced AI Map Instructions:', instructions);
    
    setMapInstructions(instructions);
    
    if (instructions.proactive_suggestions) {
      console.log('AI suggestions:', instructions.proactive_suggestions);
      setAiSuggestions(instructions.proactive_suggestions);
    }
    
    if (instructions.spatial_context) {
      console.log('Spatial context:', instructions.spatial_context);
      setSpatialContext(instructions.spatial_context);
    }
  };

  const handleChartInstructions = (instructions) => {
    console.log('AI Chart Intelligence Processing:', instructions);
    
    // Enhanced AI-driven chart generation
    if (instructions.comparison_chart) {
      generateAIChart('targeted_comparison', instructions.comparison_chart);
    } else if (instructions.accessibility_ranking) {
      generateAIChart('smart_ranking', instructions.accessibility_ranking);
    } else if (instructions.statistical_summary) {
      generateAIChart('focused_statistics', instructions.statistical_summary);
    } else if (instructions.population_impact) {
      generateAIChart('population_analysis', instructions.population_impact);
    } else if (instructions.category_distribution) {
      generateAIChart('category_breakdown', instructions.category_distribution);
    } else {
      generateChart('ranking');
    }
  };

  // AI-powered chart generation
  const generateAIChart = (chartType, config = {}) => {
    console.log('AI Generating Chart:', chartType, 'with config:', config);
    
    if (!mapData || !mapData.features) return;
    
    const features = mapData.features;
    const uniqueAreas = [];
    const seenNames = new Set();
    
    // Get unique sublocations
    features.forEach(feature => {
      if (!seenNames.has(feature.properties.name)) {
        uniqueAreas.push({
          name: feature.properties.name,
          accessibility: feature.properties.accessibility,
          population: feature.properties.population,
          category: feature.properties.category
        });
        seenNames.add(feature.properties.name);
      }
    });
    
    switch (chartType) {
      case 'targeted_comparison':
        generateTargetedComparison(uniqueAreas, config);
        break;
      case 'smart_ranking':
        generateSmartRanking(uniqueAreas, config);
        break;
      case 'focused_statistics':
        generateFocusedStatistics(uniqueAreas, config);
        break;
      case 'population_analysis':
        generatePopulationAnalysis(uniqueAreas, config);
        break;
      case 'category_breakdown':
        generateCategoryBreakdown(uniqueAreas, config);
        break;
      default:
        generateChart('ranking');
    }
  };

  // AI-powered targeted comparison (shows ONLY the areas being compared)
  const generateTargetedComparison = (allAreas, config) => {
    console.log('AI Targeted Comparison:', config);
    
    const { areas } = config;
    
    // Filter to show ONLY the compared areas
    const targetAreas = allAreas.filter(area => 
      areas.some(targetName => 
        area.name.toLowerCase().includes(targetName.toLowerCase()) ||
        targetName.toLowerCase().includes(area.name.toLowerCase())
      )
    );
    
    if (targetAreas.length === 0) return;
    
    // Calculate average for comparison context
    const avgAccessibility = allAreas.reduce((sum, area) => sum + area.accessibility, 0) / allAreas.length;
    
    const comparisonData = targetAreas.map(area => ({
      name: area.name,
      accessibility: area.accessibility,
      population: area.population,
      category: area.category,
      vs_average: area.accessibility - avgAccessibility,
      is_better: area.accessibility > avgAccessibility
    }));
    
    setChartData({
      data: comparisonData,
      title: `AI Comparison: ${areas.join(' vs ')}`,
      type: 'targeted_comparison',
      metadata: {
        average: avgAccessibility,
        total_areas: allAreas.length
      }
    });
  };

  // AI-powered smart ranking
  const generateSmartRanking = (allAreas, config) => {
    console.log('AI Smart Ranking:', config);
    
    const { order = 'asc', limit, show_only } = config;
    
    let dataToShow = allAreas;
    
    // If show_only is specified, filter to only those areas
    if (show_only && show_only.length > 0) {
      dataToShow = allAreas.filter(area => 
        show_only.some(targetName => 
          area.name.toLowerCase().includes(targetName.toLowerCase()) ||
          targetName.toLowerCase().includes(area.name.toLowerCase())
        )
      );
    }
    
    // Sort data
    const sortedData = dataToShow.sort((a, b) => 
      order === 'asc' ? a.accessibility - b.accessibility : b.accessibility - a.accessibility
    );
    
    // Apply limit if specified
    const finalData = limit ? sortedData.slice(0, limit) : sortedData;
    
    const title = show_only && show_only.length > 0 
      ? `AI Focused Ranking: ${show_only.join(', ')}`
      : `AI Smart Ranking (${order === 'asc' ? 'Worst to Best' : 'Best to Worst'})`;
    
    setChartData({
      data: finalData,
      title,
      type: 'smart_ranking',
      metadata: {
        order,
        total_filtered: dataToShow.length,
        total_areas: allAreas.length
      }
    });
  };

  const generateFocusedStatistics = (allAreas, config) => {
    const { focus_areas } = config;
    
    let targetAreas = allAreas;
    
    if (focus_areas && focus_areas.length > 0) {
      targetAreas = allAreas.filter(area => 
        focus_areas.some(targetName => 
          area.name.toLowerCase().includes(targetName.toLowerCase()) ||
          targetName.toLowerCase().includes(area.name.toLowerCase())
        )
      );
    }
    
    const title = focus_areas && focus_areas.length > 0 
      ? `AI Statistics: ${focus_areas.join(', ')}`
      : 'AI Statistical Analysis';
    
    setChartData({
      data: targetAreas,
      title,
      type: 'focused_statistics'
    });
  };

  const generatePopulationAnalysis = (allAreas, config) => {
    const categoryData = {};
    allAreas.forEach(area => {
      if (!categoryData[area.category]) {
        categoryData[area.category] = { count: 0, population: 0 };
      }
      categoryData[area.category].count++;
      categoryData[area.category].population += area.population;
    });
    
    const totalPopulation = allAreas.reduce((sum, area) => sum + area.population, 0);
    
    const analysisData = Object.entries(categoryData).map(([category, data]) => ({
      name: category,
      count: data.count,
      population: data.population,
      percentage: ((data.population / totalPopulation) * 100).toFixed(1)
    }));
    
    setChartData({
      data: analysisData,
      title: 'AI Population Impact Analysis',
      type: 'population_analysis'
    });
  };

  const generateCategoryBreakdown = (allAreas, config) => {
    const categoryData = {};
    let totalPop = 0;
    
    allAreas.forEach(area => {
      if (!categoryData[area.category]) {
        categoryData[area.category] = { count: 0, population: 0 };
      }
      categoryData[area.category].count++;
      categoryData[area.category].population += area.population;
      totalPop += area.population;
    });
    
    const chartDataItems = Object.entries(categoryData).map(([category, data]) => ({
      name: category,
      count: data.count,
      population: data.population,
      percentage: ((data.population / totalPop) * 100).toFixed(1)
    }));
    
    setChartData({
      data: chartDataItems,
      title: 'AI Category Distribution',
      type: 'category_breakdown'
    });
  };

  const generateChart = (type = 'ranking', config = {}) => {
    if (!mapData || !mapData.features) return;
    
    const features = mapData.features;
    const uniqueAreas = [];
    const seenNames = new Set();
    
    features.forEach(feature => {
      if (!seenNames.has(feature.properties.name)) {
        uniqueAreas.push({
          name: feature.properties.name,
          accessibility: feature.properties.accessibility,
          population: feature.properties.population,
          category: feature.properties.category
        });
        seenNames.add(feature.properties.name);
      }
    });
    
    if (type === 'ranking') {
      const sortedData = uniqueAreas.sort((a, b) => a.accessibility - b.accessibility);
      setChartData({
        data: sortedData,
        title: 'Water Accessibility Rankings (All Areas)',
        type: 'ranking'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const formatMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < message.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getColorByCategory = (category) => {
    switch (category) {
      case 'Very Weak': return '#ff0000';
      case 'Weak': return '#ff8800';
      case 'Good': return '#88ccff';
      case 'Very Good': return '#0066cc';
      default: return '#cccccc';
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>HydroGPT - Water Accessibility Analysis</h1>
        <p>Mbeere South Subcounty, Kenya | Advanced SCM-G2SFCA Methodology | Professional Edition v1.0</p>
      </header>

      <div className="main-container">
        {/* MAP SECTION - Left Panel */}
        <div className="left-panel">
          <div className="map-container">
            <h2>Interactive Map</h2>
            <MapLayerTabs 
              mapData={mapData} 
              waterPointsData={waterPointsData}
              mapInstructions={mapInstructions}
            />
          </div>
        </div>

        {/* CHART SECTION - Middle Panel */}
        <div className="middle-panel">
          <div className="chart-container">
            <h3>Data Visualization</h3>
            <div className="chart-content">
              {chartData ? (
                <div className="chart-display">
                  <h4>{chartData.title}</h4>
                  
                  {/* AI METADATA DISPLAY */}
                  {chartData.metadata && (
                    <div className="ai-chart-metadata" style={{
                      background: '#f0f8ff', 
                      padding: '10px', 
                      margin: '10px 0', 
                      borderRadius: '5px',
                      fontSize: '0.9em',
                      borderLeft: '4px solid #0066cc'
                    }}>
                      <strong>AI Analysis:</strong> 
                      {chartData.metadata.total_areas && (
                        <span> Showing {chartData.data.length} of {chartData.metadata.total_areas} total areas</span>
                      )}
                    </div>
                  )}

                  <div className="chart-bars">
                    {chartData.data.map((item, index) => (
                      <div key={index} className="chart-bar-item">
                        <div className="bar-info">
                          <span className="bar-name">{item.name}</span>
                          <span className="bar-value">
                            {item.accessibility ? item.accessibility.toFixed(3) : item.percentage + '%'}
                          </span>
                        </div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{
                              width: item.accessibility 
                                ? `${(item.accessibility / 2.5) * 100}%`
                                : `${item.percentage}%`,
                              backgroundColor: (() => {
                                const category = item.category || item.name;
                                switch (category) {
                                  case 'Very Weak': return '#ff0000';
                                  case 'Weak': return '#ff8800';
                                  case 'Good': return '#88ccff';
                                  case 'Very Good': return '#0066cc';
                                  default: return '#cccccc';
                                }
                              })()
                            }}
                          ></div>
                        </div>
                        <div className="bar-details">
                          {item.population && `Population: ${item.population.toLocaleString()}`}
                          {item.category && ` | ${item.category}`}
                          {item.count && ` | ${item.count} areas`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="chart-placeholder">
                  Charts appear when you ask for statistics
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHAT SECTION - Right Panel */}
        <div className="right-panel">
          <div className="chat-container">
            <div className="chat-header">
              <h3>HydroGPT Assistant</h3>
            </div>

            <div className="messages-container" ref={messagesContainerRef}>
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.type}`}>
                  <div className="message-content">
                    {message.type === 'bot' && <strong>HydroGPT:</strong>}
                    {message.type === 'user' && <strong>You:</strong>}
                    <br />
                    {formatMessage(message.message)}
                    
                    {message.type === 'bot' && message.spatial_context && (
                      <div style={{
                        marginTop: '10px',
                        padding: '8px',
                        background: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: '5px',
                        fontSize: '0.85em',
                        borderLeft: '3px solid #4caf50'
                      }}>
                        <strong>Context:</strong> {message.spatial_context}
                      </div>
                    )}
                  </div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {isLoading && (
                <div className="message bot">
                  <div className="message-content">
                    <strong>HydroGPT:</strong><br />
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                    Analyzing your query...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="input-form">
              <div className="input-container">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about water accessibility... (Press Enter to send)"
                  disabled={isLoading}
                  className="message-input"
                  maxLength={500}
                  autoComplete="off"
                  aria-label="Enter your water accessibility question"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue.trim()}
                  className="send-button"
                  aria-label={isLoading ? "Processing query..." : "Send message"}
                  title={isLoading ? "Processing query..." : "Send message (Enter)"}
                >
                  {isLoading ? 'Loading...' : 'Send'}
                </button>
              </div>
              {inputValue.length > 400 && (
                <div className="character-counter">
                  {inputValue.length}/500 characters
                </div>
              )}
            </form>

            {/* AI PROACTIVE SUGGESTIONS PANEL */}
            {aiSuggestions && aiSuggestions.length > 0 && (
              <div className="ai-suggestions-panel" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '15px',
                borderRadius: '10px',
                margin: '15px 0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '0.95em'}}>
                  AI Suggestions - What would you like to explore next?
                </h4>
                <div className="suggestion-buttons" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      disabled={isLoading}
                      className="suggestion-button"
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.85em',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setAiSuggestions([])}
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    border: 'none',
                    fontSize: '0.8em',
                    cursor: 'pointer',
                    marginTop: '10px',
                    float: 'right'
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* SPATIAL CONTEXT PANEL */}
            {spatialContext && (
              <div className="spatial-context-panel" style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                margin: '10px 0',
                fontSize: '0.9em',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <strong>Geographic Context:</strong>
                    <div style={{marginTop: '5px', opacity: 0.9}}>
                      {spatialContext}
                    </div>
                  </div>
                  <button
                    onClick={() => setSpatialContext(null)}
                    style={{
                      background: 'transparent',
                      color: 'rgba(255,255,255,0.8)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <div className="footer-content">
          <span>© 2024 HydroGPT | Water Resource Intelligence Platform</span>
          <span>Powered by Advanced GIS Analytics & AI</span>
        </div>
      </footer>
    </div>
  );
}

// MAP LAYER TABS COMPONENT
const MapLayerTabs = ({ mapData, waterPointsData, mapInstructions }) => {
  const [activeTab, setActiveTab] = React.useState('sublocations');
  const [showSublocations, setShowSublocations] = React.useState(true);
  const [showWaterPoints, setShowWaterPoints] = React.useState(false);
  const [shouldFitBounds, setShouldFitBounds] = React.useState(false);

  // AI-CONTROLLED VIEW SWITCHING
  React.useEffect(() => {
    if (mapInstructions) {
      // Always switch to "both" view for AI-controlled map interactions
      let targetView = 'both';
      
      // Allow AI to override if specifically requested
      if (mapInstructions.switch_to_view) {
        targetView = mapInstructions.switch_to_view;
      }
      
      console.log('AI is switching map view to:', targetView);
      
      setTimeout(() => {
        handleTabChange(targetView);
      }, 300);
    }
  }, [mapInstructions]);

  const handleTabChange = (tab) => {
    console.log('Tab change requested:', tab);
    setActiveTab(tab);
    
    if (tab === 'sublocations') {
      setShowSublocations(true);
      setShowWaterPoints(false);
    } else if (tab === 'waterpoints') {
      setShowSublocations(true);
      setShowWaterPoints(true);
    } else if (tab === 'both') {
      setShowSublocations(true);
      setShowWaterPoints(true);
    }
    
    setTimeout(() => {
      setShouldFitBounds(true);
      setTimeout(() => setShouldFitBounds(false), 1000);
    }, 200);
  };

  const toggleSublocations = () => {
    setShowSublocations(!showSublocations);
  };

  const toggleWaterPoints = () => {
    setShowWaterPoints(!showWaterPoints);
  };

  return (
    <div className="map-layer-container">
      <div className="map-tabs">
        <button 
          className={`tab-button ${activeTab === 'sublocations' ? 'active' : ''}`}
          onClick={() => handleTabChange('sublocations')}
        >
          Sublocations
        </button>
        <button 
          className={`tab-button ${activeTab === 'waterpoints' ? 'active' : ''}`}
          onClick={() => handleTabChange('waterpoints')}
        >
          Water Points
        </button>
        <button 
          className={`tab-button ${activeTab === 'both' ? 'active' : ''}`}
          onClick={() => handleTabChange('both')}
        >
          Both
        </button>
      </div>
      
      {activeTab === 'both' && (
        <div className="layer-toggles">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={showSublocations} 
              onChange={toggleSublocations}
              className="toggle-checkbox"
            />
            <span className="toggle-text">Sublocations</span>
          </label>
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={showWaterPoints} 
              onChange={toggleWaterPoints}
              className="toggle-checkbox"
            />
            <span className="toggle-text">Water Points</span>
          </label>
        </div>
      )}
      
      <InteractiveMap 
        mapData={showSublocations ? mapData : null}
        waterPointsData={showWaterPoints ? waterPointsData : null}
        activeTab={activeTab}
        mapInstructions={mapInstructions}
        shouldFitBounds={shouldFitBounds}
      />
    </div>
  );
};

// INTERACTIVE MAP COMPONENT
const InteractiveMap = ({ mapData, waterPointsData, activeTab, mapInstructions, shouldFitBounds }) => {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const highlightedLayersRef = React.useRef([]);
  const openPopupsRef = React.useRef([]);

  // Handle AI map instructions for intelligent highlighting and zooming
  React.useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !mapInstructions) return;
    
    console.log('🤖 Processing AI Map Instructions:', mapInstructions);
    
    // Clear previous highlights and popups
    clearHighlights();
    
    // Add delay to ensure map is fully loaded before applying highlights
    setTimeout(() => {
      // Handle highlighting and zooming based on AI instructions
      if (mapInstructions.highlight_areas || mapInstructions.zoom_to_location || mapInstructions.focus_comparison || mapInstructions.pulse_animation) {
        handleIntelligentMapControl(mapInstructions);
      }
    }, 1000); // 1 second delay to ensure map is ready
  }, [mapInstructions, mapData]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearHighlights = () => {
    // Remove previous highlighted layers
    highlightedLayersRef.current.forEach(layer => {
      if (mapInstanceRef.current.hasLayer(layer)) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });
    highlightedLayersRef.current = [];
    
    // Close previous popups
    openPopupsRef.current.forEach(popup => {
      mapInstanceRef.current.closePopup(popup);
    });
    openPopupsRef.current = [];
  };

  const handleIntelligentMapControl = (instructions) => {
    if (!mapData || !mapData.features) return;
    
    let targetAreas = [];
    
    // Extract target areas from different instruction types
    if (instructions.highlight_areas) {
      targetAreas = [...instructions.highlight_areas];
    }
    
    if (instructions.zoom_to_location) {
      if (!targetAreas.includes(instructions.zoom_to_location)) {
        targetAreas.push(instructions.zoom_to_location);
      }
    }
    
    if (instructions.focus_comparison) {
      if (!targetAreas.includes(instructions.focus_comparison.primary)) {
        targetAreas.push(instructions.focus_comparison.primary);
      }
      if (!targetAreas.includes(instructions.focus_comparison.secondary)) {
        targetAreas.push(instructions.focus_comparison.secondary);
      }
    }
    
    if (instructions.pulse_animation) {
      instructions.pulse_animation.forEach(area => {
        if (!targetAreas.includes(area)) {
          targetAreas.push(area);
        }
      });
    }
    
    if (targetAreas.length === 0) return;
    
    console.log('🎯 Target areas for highlighting:', targetAreas);
    
    // Find matching features
    console.log('🔍 Available sublocations:', mapData.features.map(f => f.properties.name));
    
    const matchingFeatures = mapData.features.filter(feature => {
      const sublocationName = feature.properties.name.toUpperCase();
      const isMatch = targetAreas.some(targetName => 
        sublocationName.includes(targetName.toUpperCase()) || 
        targetName.toUpperCase().includes(sublocationName)
      );
      
      if (isMatch) {
        console.log(`✅ Match found: ${feature.properties.name} matches target area`);
      }
      
      return isMatch;
    });
    
    console.log('✅ Found matching features:', matchingFeatures.length);
    
    if (matchingFeatures.length === 0) {
      console.log('❌ No matching features found. Available areas:', mapData.features.map(f => f.properties.name));
      console.log('❌ Target areas we are looking for:', targetAreas);
    }
    
    if (matchingFeatures.length === 0) return;
    
    // Add thick light green highlights
    const highlightLayers = matchingFeatures.map(feature => {
      const highlightLayer = window.L.geoJSON(feature, {
        style: {
          color: '#00ff88', // Thick light green
          weight: 6,
          opacity: 1,
          fillOpacity: 0.15,
          fillColor: '#00ff88'
        },
        pane: 'overlayPane' // Ensure it appears on top
      });
      
      highlightLayer.setZIndex(1000); // High z-index
      mapInstanceRef.current.addLayer(highlightLayer);
      return highlightLayer;
    });
    
    highlightedLayersRef.current = highlightLayers;
    
    // Auto-show popups for highlighted areas
    if (instructions.show_popup !== false) { // Default to true unless explicitly false
      matchingFeatures.forEach(feature => {
        const props = feature.properties;
        const center = getFeatureCenter(feature);
        
        const popup = window.L.popup({
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
          className: 'ai-controlled-popup'
        })
        .setLatLng(center)
        .setContent(`
          <div style="font-family: Arial, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #333; border-bottom: 2px solid #00ff88;">${props.name}</h3>
            <p><strong>🎯 AI Analysis Target</strong></p>
            <p><strong>Accessibility Score:</strong> ${props.accessibility.toFixed(3)}</p>
            <p><strong>Category:</strong> <span style="color: ${props.category === 'Very Weak' ? '#ff0000' : props.category === 'Weak' ? '#ff8800' : props.category === 'Good' ? '#88ccff' : props.category === 'Very Good' ? '#0066cc' : '#cccccc'};">${props.category}</span></p>
            <p><strong>Population:</strong> ${props.population.toLocaleString()}</p>
          </div>
        `)
        .openOn(mapInstanceRef.current);
        
        openPopupsRef.current.push(popup);
      });
    }
    
    // Smart zooming logic
    setTimeout(() => {
      if (matchingFeatures.length === 1) {
        // Single area - zoom to it with padding
        const bounds = window.L.geoJSON(matchingFeatures[0]).getBounds();
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 14 
        });
      } else if (matchingFeatures.length <= 18) {
        // Multiple areas - check if they can be grouped
        const allBounds = window.L.latLngBounds();
        matchingFeatures.forEach(feature => {
          const featureBounds = window.L.geoJSON(feature).getBounds();
          allBounds.extend(featureBounds);
        });
        
        // Calculate if areas are clustered or scattered
        const boundsSize = allBounds.getNorthEast().distanceTo(allBounds.getSouthWest());
        const mapBounds = window.L.geoJSON(mapData).getBounds();
        const fullMapSize = mapBounds.getNorthEast().distanceTo(mapBounds.getSouthWest());
        
        if (boundsSize < fullMapSize * 0.7) {
          // Areas are clustered - zoom to fit them
          mapInstanceRef.current.fitBounds(allBounds, { 
            padding: [30, 30],
            maxZoom: 13 
          });
        } else {
          // Areas are scattered - show full map
          mapInstanceRef.current.fitBounds(mapBounds, { 
            padding: [20, 20],
            minZoom: 10,
            maxZoom: 12 
          });
        }
      }
    }, 500); // Small delay to ensure layers are added
  };

  const getFeatureCenter = (feature) => {
    if (feature.geometry.type === 'Polygon') {
      const coordinates = feature.geometry.coordinates[0];
      let lat = 0, lng = 0;
      coordinates.forEach(coord => {
        lng += coord[0];
        lat += coord[1];
      });
      return [lat / coordinates.length, lng / coordinates.length];
    } else if (feature.geometry.type === 'MultiPolygon') {
      const firstPolygon = feature.geometry.coordinates[0][0];
      let lat = 0, lng = 0;
      firstPolygon.forEach(coord => {
        lng += coord[0];
        lat += coord[1];
      });
      return [lat / firstPolygon.length, lng / firstPolygon.length];
    }
    return [0, 0];
  };

  React.useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapInstanceRef.current && mapRef.current && window.L) {
        console.log('Initializing map...');
        mapInstanceRef.current = window.L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([-0.7, 37.6], 10);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);
        
        console.log('Map initialized, updating data...');
        updateMapData();
      }
    };

    const updateMapData = () => {
      if (!mapInstanceRef.current || !window.L) {
        return;
      }
      
      console.log('Updating map data:', { 
        mapData: !!mapData, 
        waterPointsData: !!waterPointsData,
        mapDataFeatures: mapData?.features?.length,
        waterPointFeatures: waterPointsData?.features?.length
      });

      // Clear existing layers but preserve AI highlights
      mapInstanceRef.current.eachLayer((layer) => {
        if ((layer instanceof window.L.GeoJSON || layer instanceof window.L.CircleMarker) && 
            !highlightedLayersRef.current.includes(layer)) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add sublocation boundaries
      if (mapData && mapData.features) {
        const getColor = (category) => {
          switch (category) {
            case 'Very Weak': return '#ff0000';
            case 'Weak': return '#ff8800';
            case 'Good': return '#88ccff';
            case 'Very Good': return '#0066cc';
            default: return '#cccccc';
          }
        };

        const style = (feature) => {
          if (activeTab === 'waterpoints') {
            return {
              fillColor: 'transparent',
              weight: 2,
              opacity: 1,
              color: '#000000',
              fillOpacity: 0
            };
          } else {
            return {
              fillColor: getColor(feature.properties.category),
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            };
          }
        };

        const onEachFeature = (feature, layer) => {
          const props = feature.properties;
          layer.bindPopup(`
            <div style="font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 10px 0; color: #333;">${props.name}</h3>
              <p><strong>Accessibility Score:</strong> ${props.accessibility.toFixed(3)}</p>
              <p><strong>Category:</strong> <span style="color: ${getColor(props.category)};">${props.category}</span></p>
              <p><strong>Population:</strong> ${props.population.toLocaleString()}</p>
            </div>
          `);

          layer.on('mouseover', function() {
            layer.setStyle({
              weight: 4,
              color: '#ffff00',
              fillOpacity: 0.9
            });
          });

          layer.on('mouseout', function() {
            layer.setStyle(style(feature));
          });
        };

        const geoJsonLayer = window.L.geoJSON(mapData, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(mapInstanceRef.current);

        // Add sublocation name labels to all views
        geoJsonLayer.eachLayer((layer) => {
          const feature = layer.feature;
          const name = feature.properties.name;
          const bounds = layer.getBounds();
          const center = bounds.getCenter();
          
          // Create permanent label for each sublocation
          window.L.marker(center, {
            icon: window.L.divIcon({
              className: 'sublocation-label-marker',
              html: `<div style="
                background: rgba(255,255,255,0.95);
                color: #000;
                border: 1px solid #333;
                border-radius: 4px;
                padding: 2px 6px;
                font-size: 9px;
                font-weight: bold;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                white-space: nowrap;
                font-family: Arial, sans-serif;
                pointer-events: none;
              ">${name}</div>`,
              iconSize: [name.length * 6 + 16, 16],
              iconAnchor: [name.length * 3 + 8, 8]
            }),
            zIndexOffset: 1000
          }).addTo(mapInstanceRef.current);
        });

        // Only auto-fit bounds if we don't have active AI highlights
        if (highlightedLayersRef.current.length === 0) {
          mapInstanceRef.current.fitBounds(geoJsonLayer.getBounds(), { 
            padding: [20, 20],
            minZoom: 10,
            maxZoom: 15
          });
        }

        // Add legend
        const existingLegend = document.querySelector('.leaflet-legend');
        if (existingLegend) {
          existingLegend.remove();
        }
        
        const legend = window.L.control({ position: 'bottomright' });
        legend.onAdd = function() {
          const div = window.L.DomUtil.create('div', 'leaflet-legend');
          div.style.background = 'white';
          div.style.padding = '10px';
          div.style.border = '2px solid #ccc';
          div.style.borderRadius = '5px';
          
          let legendContent = '';
          
          if (mapData && (activeTab === 'sublocations' || activeTab === 'both')) {
            legendContent += `
              <h4 style="margin: 0 0 8px 0;">Water Accessibility</h4>
              <div><span style="background:#ff0000;width:15px;height:15px;display:inline-block;margin-right:5px;"></span>Very Weak (0-1.0)</div>
              <div><span style="background:#ff8800;width:15px;height:15px;display:inline-block;margin-right:5px;"></span>Weak (1.0-1.2)</div>
              <div><span style="background:#88ccff;width:15px;height:15px;display:inline-block;margin-right:5px;"></span>Good (1.2-1.5)</div>
              <div><span style="background:#0066cc;width:15px;height:15px;display:inline-block;margin-right:5px;"></span>Very Good (1.5+)</div>
            `;
          }
          
          if (waterPointsData && (activeTab === 'waterpoints' || activeTab === 'both')) {
            if (legendContent) legendContent += '<br>';
            legendContent += `
              <h4 style="margin: 8px 0 8px 0;">Water Points</h4>
              <div><span style="background:#0066cc;width:15px;height:15px;display:inline-block;margin-right:5px;border-radius:50%;"></span>High Capacity (3)</div>
              <div><span style="background:#ffaa00;width:15px;height:15px;display:inline-block;margin-right:5px;border-radius:50%;"></span>Medium Capacity (2)</div>
              <div><span style="background:#ff0000;width:15px;height:15px;display:inline-block;margin-right:5px;border-radius:50%;"></span>Low Capacity (1)</div>
            `;
          }
          
          div.innerHTML = legendContent;
          return div;
        };
        legend.addTo(mapInstanceRef.current);
      }

      // Add water points
      if (waterPointsData && waterPointsData.features) {
        waterPointsData.features.forEach(feature => {
          const coords = feature.geometry.coordinates;
          const props = feature.properties;
          
          const getWaterPointColor = (capacity) => {
            switch(capacity) {
              case 3: return '#0066cc';
              case 2: return '#ffaa00';
              case 1: return '#ff0000';
              default: return '#666666';
            }
          };

          const marker = window.L.circleMarker([coords[1], coords[0]], {
            radius: 4 + (props.capacity_score * 2),
            fillColor: getWaterPointColor(props.capacity_score),
            color: 'white',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstanceRef.current);

          marker.bindPopup(`
            <div style="font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0;">Water Point</h4>
              <p><strong>Source:</strong> ${props.water_source || 'Unknown'}</p>
              <p><strong>Capacity Score:</strong> ${props.capacity_score}/3</p>
              <p><strong>Status:</strong> ${props.status || 'Unknown'}</p>
            </div>
          `);
        });
      }
    };

    loadLeaflet();
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapData, waterPointsData, activeTab]);

  if (!mapData && !waterPointsData) {
    return (
      <div className="map-placeholder">
        Loading map data...
        <br />
        <small>Connecting to backend at {API_BASE_URL}</small>
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <div className="map-info-bar">
        {mapData && (
          <span className="map-status">
            {mapData.features?.length || 0} sublocations
          </span>
        )}
        {waterPointsData && (
          <span className="water-points-status">
            {waterPointsData.features?.length || 0} water points
          </span>
        )}
      </div>
      <div ref={mapRef} className="leaflet-map" />
    </div>
  );
};

export default App;