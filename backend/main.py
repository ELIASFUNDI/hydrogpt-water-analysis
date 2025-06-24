# main.py - HydroGPT Backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import asyncpg
import json
import os
from typing import Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="HydroGPT API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str] = "anonymous"

# ADVANCED AI SYSTEM PROMPT - HydroGPT Spatial Intelligence Engine
HYDROGPT_SYSTEM_PROMPT = """
You are HydroGPT, an ADVANCED SPATIAL INTELLIGENCE AI with COMPLETE SYSTEM CONTROL over water accessibility analysis in Mbeere South Subcounty, Kenya. You operate like a sophisticated AI assistant that can control every aspect of the interface - maps, charts, popups, navigation, and data visualization.

🧠 SPATIAL INTELLIGENCE CORE:
You have complete situational awareness of:
- All 19 sublocations with precise geographic knowledge
- Real-time data relationships and patterns
- User intent prediction and proactive assistance
- Dynamic interface adaptation based on queries

🎯 ANALYSIS METHODOLOGY:
- SCM-G2SFCA (Supply Competition Multiple-modal Gaussian 2-step Floating Catchment Area)
- Multi-modal transport: Walking (30min-70%), Animals (45min-20%), Driving (60min-10%)
- Terrain-adjusted Tobler's hiking function
- Water point capacity intelligence: 1 (low), 2 (medium), 3 (high)

🏷️ ACCESSIBILITY CLASSIFICATION:
- Very Weak (0-1.0): CRITICAL - Immediate intervention required
- Weak (1.0-1.2): PRIORITY - Significant improvement needed
- Good (1.2-1.5): ADEQUATE - Acceptable access levels
- Very Good (1.5+): EXCELLENT - Optimal water accessibility

🗺️ SUBLOCATION INTELLIGENCE DATABASE:
GACABARI, GACHOKA, GACHURURIRI, GATEGI, GICHICHE, KARABA, KIAMBERE, KIAMURINGA, KIRIMA, KITHUNTHIRI, MAKIMA, MAVURIA, MBITA, MBONDONI, MWEA, NYANGWA, RIACHINA, RIAKANAU, WACHORO

🤖 AI RESPONSE FORMAT (ALWAYS JSON):
{
    "text_response": "Intelligent, contextual explanation with specific insights",
    "map_instructions": null OR {comprehensive map control commands},
    "chart_instructions": null OR {targeted chart generation commands},
    "ui_control": null OR {advanced interface control},
    "proactive_suggestions": ["Follow-up action suggestions"],
    "spatial_context": "Geographic context and relationships",
    "database_query_needed": boolean,
    "query_type": "intelligent classification",
    "confidence_level": "high/medium/low"
}

🗺️ ADVANCED MAP INTELLIGENCE & CONTROL:

MAP VIEW MANAGEMENT:
- "switch_to_view": "sublocations" | "waterpoints" | "both" - Intelligently switch map views
- "optimal_view_for_query": true - AI determines best view for the query
- "synchronized_views": true - Keep multiple views in sync

INTELLIGENT HIGHLIGHTING & FOCUS:
- "highlight_areas": ["AREA1", "AREA2"] - Smart highlighting with visual emphasis
- "highlight_with_animation": true - Add smooth transition animations
- "focus_comparison": {"primary": "AREA1", "secondary": "AREA2"} - Side-by-side comparison
- "highlight_by_criteria": {"category": "Very Weak", "population": ">5000"}

SPATIAL NAVIGATION & ZOOM:
- "zoom_to_location": "SUBLOCATION_NAME" - Intelligent zoom with optimal padding
- "zoom_to_comparison": ["AREA1", "AREA2"] - Frame multiple areas optimally
- "zoom_sequence": ["AREA1", "AREA2", "AREA3"] - Sequential location touring
- "zoom_level": "overview" | "detailed" | "focused" - Context-appropriate zoom

POPUP & INFORMATION CONTROL:
- "show_popup": {"location": "AREA_NAME", "details": "full|summary|custom"}
- "auto_popup_on_highlight": true - Automatically show details when highlighting
- "popup_sequence": ["AREA1", "AREA2"] - Show popups in sequence for comparison
- "interactive_popup": true - Enhanced popup with action buttons

VISUAL ENHANCEMENT & STYLING:
- "accessibility_heatmap": true - Full color-coded accessibility visualization
- "pulse_animation": ["AREA1"] - Draw attention with subtle pulsing
- "glow_effect": {"areas": ["AREA1"], "color": "red|orange|blue"} - Add glow for emphasis
- "overlay_labels": true - Show/hide dynamic labels

FILTERING & DATA DISPLAY:
- "filter_by_category": ["Very Weak", "Weak"] - Smart category filtering
- "filter_by_population": {"min": 1000, "max": 10000} - Population-based filtering
- "show_water_points": {"capacity": [1,2,3], "near_location": "AREA_NAME"}
- "cluster_analysis": true - Show spatial clustering patterns

📊 INTELLIGENT CHART GENERATION & CONTROL:

TARGETED COMPARISON CHARTS:
- "comparison_chart": {
    "areas": ["AREA1", "AREA2"],
    "metrics": ["accessibility", "population", "water_points"],
    "chart_type": "bar|radar|scatter",
    "highlight_differences": true
  }

SMART RANKING VISUALIZATIONS:
- "accessibility_ranking": {
    "order": "asc|desc",
    "limit": number,
    "highlight": ["specific_areas"],
    "show_only": ["AREA1", "AREA2"] // For targeted comparisons
  }

POPULATION IMPACT ANALYSIS:
- "population_impact": {
    "focus_areas": ["AREA1", "AREA2"],
    "show_affected_population": true,
    "breakdown_by_category": true,
    "intervention_priority": true
  }

STATISTICAL INTELLIGENCE:
- "statistical_summary": {
    "focus_areas": ["AREA1", "AREA2"], // Targeted stats for specific areas
    "include": ["avg", "min", "max", "median", "std_dev"],
    "compare_to_average": true
  }

DYNAMIC CHART UPDATES:
- "chart_animation": true - Smooth transitions and updates
- "real_time_filtering": true - Charts update with map interactions
- "drill_down_capability": true - Enable interactive chart exploration

🧠 ADVANCED AI INTELLIGENCE FEATURES:

QUERY UNDERSTANDING & CONTEXT:
- Fuzzy location name matching (handle misspellings, partial names)
- Multi-language support (local names, English variants)
- Context-aware responses (remember conversation history)
- Intent prediction (anticipate follow-up questions)

PROACTIVE ASSISTANCE:
- Suggest related analyses when showing data
- Offer deeper insights automatically
- Recommend actionable interventions
- Provide spatial relationship insights

SPATIAL RELATIONSHIP INTELLIGENCE:
- Understand geographic proximity ("areas near X")
- Recognize spatial patterns ("clustered poor access")
- Identify geographic barriers and opportunities
- Suggest regional planning approaches

USER BEHAVIOR ADAPTATION:
- Learn from interaction patterns
- Adapt response complexity to user expertise
- Personalize visualization preferences
- Provide progressive disclosure of information

🎯 INTELLIGENT DECISION LOGIC:

AUTOMATIC VIEW SELECTION:
- Single location query → "sublocations" view + zoom + popup
- Water infrastructure query → "waterpoints" or "both" view
- Comparison query → "both" view + highlight comparison areas
- Regional analysis → "sublocations" view + filter + heatmap

SMART CHART SELECTION:
- "Compare X and Y" → Show ONLY those two areas in charts
- "Worst areas" → Ranking chart with bottom performers highlighted
- "Population impact" → Population-weighted accessibility analysis
- "Statistics for X" → Targeted statistics for specific area only

CONTEXTUAL RESPONSE GENERATION:
- Provide specific numbers and data points
- Include spatial context and relationships
- Suggest actionable interventions
- Offer follow-up analysis options

🌟 EXAMPLE INTELLIGENT RESPONSES:

Query: "Compare Makima and Karaba water access"
{
    "text_response": "Makima has significantly worse water accessibility (0.968 - Very Weak) compared to Karaba (1.45 - Good). Makima serves 3,245 people with limited access, while Karaba's 2,890 residents have adequate access. Makima needs immediate intervention with 2 additional high-capacity water points recommended.",
    "map_instructions": {
        "switch_to_view": "both",
        "focus_comparison": {"primary": "MAKIMA", "secondary": "KARABA"},
        "show_popup": {"location": "MAKIMA", "details": "full"},
        "highlight_with_animation": true,
        "zoom_to_comparison": ["MAKIMA", "KARABA"]
    },
    "chart_instructions": {
        "comparison_chart": {
            "areas": ["MAKIMA", "KARABA"],
            "metrics": ["accessibility", "population", "water_points"],
            "chart_type": "bar",
            "highlight_differences": true
        }
    },
    "proactive_suggestions": [
        "Would you like to see intervention cost estimates for Makima?",
        "Should I show other areas with similar accessibility issues?",
        "Would you like to analyze transport mode impacts for these areas?"
    ],
    "spatial_context": "Makima and Karaba are neighboring sublocations with contrasting accessibility patterns due to topographic differences and water point distribution.",
    "query_type": "spatial_comparison",
    "confidence_level": "high"
}

Query: "Show me details about Kiambere"
{
    "text_response": "Kiambere has good water accessibility (1.34) serving 4,120 people. It features 5 water points including 2 high-capacity sources. The area maintains adequate access across all transport modes with walking access at 89% efficiency.",
    "map_instructions": {
        "switch_to_view": "both",
        "zoom_to_location": "KIAMBERE",
        "show_popup": {"location": "KIAMBERE", "details": "full"},
        "pulse_animation": ["KIAMBERE"],
        "show_water_points": {"near_location": "KIAMBERE"}
    },
    "chart_instructions": {
        "statistical_summary": {
            "focus_areas": ["KIAMBERE"],
            "include": ["accessibility", "population", "water_points"],
            "compare_to_average": true
        }
    },
    "proactive_suggestions": [
        "Would you like to compare Kiambere with similar-performing areas?",
        "Should I analyze Kiambere's role in regional water security?",
        "Would you like to see optimization opportunities for Kiambere?"
    ],
    "spatial_context": "Kiambere is centrally located with good transport connectivity, making it a regional hub for water access in the northern subcounty area.",
    "query_type": "location_specific_analysis",
    "confidence_level": "high"
}

💡 INTELLIGENCE PRINCIPLES:
- Always be proactive with suggestions
- Provide specific, actionable insights
- Control the interface like a skilled operator
- Anticipate user needs and offer relevant follow-ups
- Show only relevant data for each query
- Use visual enhancements to guide attention
- Maintain spatial context awareness
- Adapt complexity to query sophistication
"""

class HydroGPTService:
    def __init__(self):
        self.claude_client = None
        self.db_pool = None
        
    async def init_claude(self):
        """Initialize Claude API client"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if api_key:
            self.claude_client = anthropic.Anthropic(api_key=api_key)
            print("✅ Claude API initialized successfully")
        else:
            print("❌ ANTHROPIC_API_KEY not found in environment variables")
    
    async def init_db(self):
        """Initialize database connection pool"""
        try:
            database_url = os.getenv("DATABASE_URL")
            if not database_url:
                print("❌ DATABASE_URL environment variable not set")
                return
            self.db_pool = await asyncpg.create_pool(database_url)
            print("✅ Database connected successfully")
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
    
    async def get_context_data(self, query: str) -> str:
        """Get comprehensive database context for intelligent AI responses"""
        if not self.db_pool:
            return "Database not connected"
            
        try:
            async with self.db_pool.acquire() as conn:
                # Comprehensive sublocation data with new classification
                sublocation_data = await conn.fetch("""
                    SELECT 
                        sublocation_name,
                        avg_combined_accessibility,
                        total_population,
                        CASE 
                            WHEN avg_combined_accessibility < 1.0 THEN 'Very Weak'
                            WHEN avg_combined_accessibility < 1.2 THEN 'Weak'  
                            WHEN avg_combined_accessibility < 1.5 THEN 'Good'
                            ELSE 'Very Good'
                        END as accessibility_category,
                        water_points_count,
                        high_capacity_water_points,
                        medium_capacity_water_points,
                        low_capacity_water_points
                    FROM sublocation_statistics 
                    ORDER BY avg_combined_accessibility ASC
                """)
                
                # Statistical summary
                stats = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_sublocations,
                        AVG(avg_combined_accessibility) as avg_accessibility,
                        MIN(avg_combined_accessibility) as min_accessibility,
                        MAX(avg_combined_accessibility) as max_accessibility,
                        SUM(total_population) as total_population,
                        SUM(water_points_count) as total_water_points
                    FROM sublocation_statistics
                """)
                
                # Category distribution
                categories = await conn.fetch("""
                    SELECT 
                        CASE 
                            WHEN avg_combined_accessibility < 1.0 THEN 'Very Weak'
                            WHEN avg_combined_accessibility < 1.2 THEN 'Weak'  
                            WHEN avg_combined_accessibility < 1.5 THEN 'Good'
                            ELSE 'Very Good'
                        END as category,
                        COUNT(*) as count,
                        SUM(total_population) as population
                    FROM sublocation_statistics
                    GROUP BY 1
                    ORDER BY MIN(avg_combined_accessibility)
                """)
                
                # Build comprehensive context
                context = f"""
REAL-TIME DATABASE CONTEXT (Mbeere South Subcounty):

OVERVIEW STATISTICS:
- Total sublocations: {stats['total_sublocations']}
- Total population: {stats['total_population']:,} people
- Total water points: {stats['total_water_points']}
- Average accessibility score: {stats['avg_accessibility']:.3f}
- Accessibility range: {stats['min_accessibility']:.3f} to {stats['max_accessibility']:.3f}

CATEGORY DISTRIBUTION:
"""
                for cat in categories:
                    context += f"- {cat['category']}: {cat['count']} areas, {cat['population']:,} people\n"
                
                context += "\nDETAILED SUBLOCATION DATA:\n"
                for area in sublocation_data:
                    context += f"- {area['sublocation_name']}: {area['avg_combined_accessibility']:.3f} ({area['accessibility_category']}) | Pop: {area['total_population']:,} | Water points: {area['water_points_count']}\n"
                
                # Identify worst and best areas
                worst_areas = [area for area in sublocation_data if area['accessibility_category'] in ['Very Weak', 'Weak']][:3]
                best_areas = [area for area in sublocation_data if area['accessibility_category'] == 'Very Good'][-3:]
                
                context += f"\nPRIORITY INTERVENTION AREAS (Worst 3):\n"
                for area in worst_areas:
                    context += f"- {area['sublocation_name']}: {area['avg_combined_accessibility']:.3f} ({area['accessibility_category']}) - {area['total_population']:,} people affected\n"
                
                context += f"\nTOP PERFORMING AREAS (Best 3):\n"
                for area in best_areas:
                    context += f"- {area['sublocation_name']}: {area['avg_combined_accessibility']:.3f} ({area['accessibility_category']}) - {area['total_population']:,} people well-served\n"
                
                return context
                
        except Exception as e:
            return f"Error getting context: {e}"
    
    async def process_query(self, user_query: str) -> Dict[str, Any]:
        """Main query processing pipeline"""
        
        # Get context data
        context_data = await self.get_context_data(user_query)
        
        # If no Claude API, return simple response
        if not self.claude_client:
            return {
                "text_response": f"HydroGPT received your query: '{user_query}'. Claude API not configured, but I can see your data context: {context_data}",
                "map_instructions": None,
                "chart_instructions": None,
                "timestamp": datetime.now().isoformat()
            }
        
        # Send to Claude API
        try:
            full_prompt = f"""
{HYDROGPT_SYSTEM_PROMPT}

CURRENT DATA CONTEXT:
{context_data}

USER QUERY: {user_query}

Respond with JSON containing text_response and appropriate map_instructions/chart_instructions based on the query type.
"""
            
            response = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1500,
                messages=[{"role": "user", "content": full_prompt}]
            )
            
            # Parse JSON response
            try:
                llm_response = json.loads(response.content[0].text)
                llm_response["timestamp"] = datetime.now().isoformat()
                return llm_response
            except json.JSONDecodeError:
                # If LLM doesn't return valid JSON, wrap the response
                return {
                    "text_response": response.content[0].text,
                    "map_instructions": None,
                    "chart_instructions": None,
                    "timestamp": datetime.now().isoformat()
                }
            
        except Exception as e:
            return {
                "text_response": f"Error processing query with Claude API: {e}",
                "map_instructions": None,
                "chart_instructions": None,
                "timestamp": datetime.now().isoformat()
            }

# Initialize service
hydrogpt_service = HydroGPTService()

@app.on_event("startup")
async def startup_event():
    await hydrogpt_service.init_claude()
    await hydrogpt_service.init_db()

@app.get("/")
async def root():
    return {
        "message": "HydroGPT API is running", 
        "version": "1.0.0",
        "status": "ready",
        "database_connected": hydrogpt_service.db_pool is not None,
        "claude_configured": hydrogpt_service.claude_client is not None,
        "endpoints": [
            "/api/query - Process natural language queries",
            "/api/default-map-data - Get sublocation map data",
            "/docs - API documentation"
        ]
    }

@app.get("/health")
async def health_check():
    """Simple health check endpoint for Railway"""
    return {"status": "healthy", "service": "HydroGPT"}

@app.post("/api/query")
async def process_query(request: QueryRequest):
    """Process user query and return response with text, map, and chart instructions"""
    try:
        response = await hydrogpt_service.process_query(request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/default-map-data")
async def get_default_map_data():
    """Get initial map data - sublocations with accessibility colors"""
    if not hydrogpt_service.db_pool:
        return {"error": "Database not connected"}
    
    try:
        async with hydrogpt_service.db_pool.acquire() as conn:
            # Get all 19 unique sublocations using slname field with avg_combined_accessibility
            sublocations = await conn.fetch("""
                SELECT 
                    s.slname as sublocation_name,
                    COALESCE(AVG(ss.avg_combined_accessibility), 0) as accessibility_score,
                    COALESCE(AVG(ss.total_population), 0) as total_population,
                    CASE 
                        WHEN AVG(ss.avg_combined_accessibility) IS NULL THEN 'Unknown'
                        WHEN AVG(ss.avg_combined_accessibility) < 1.0 THEN 'Very Weak'
                        WHEN AVG(ss.avg_combined_accessibility) < 1.2 THEN 'Weak'  
                        WHEN AVG(ss.avg_combined_accessibility) < 1.5 THEN 'Good'
                        ELSE 'Very Good'
                    END as accessibility_category,
                    ST_AsGeoJSON(ST_Transform(ST_Union(s.geom), 4326)) as geometry
                FROM sublocations s
                LEFT JOIN sublocation_statistics ss ON s.slname = ss.sublocation_name
                WHERE s.geom IS NOT NULL AND s.slname IS NOT NULL
                GROUP BY s.slname
                ORDER BY s.slname
            """)
        
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": row['sublocation_name'],
                        "accessibility": float(row['accessibility_score']),
                        "category": row['accessibility_category'],
                        "population": int(row['total_population'])
                    },
                    "geometry": json.loads(row['geometry'])
                }
                for row in sublocations
            ]
        }
    except Exception as e:
        return {"error": f"Database query failed: {e}"}

@app.get("/api/debug/tables")
async def debug_tables():
    """Debug endpoint to check database tables"""
    if not hydrogpt_service.db_pool:
        return {"error": "Database not connected"}
    
    try:
        async with hydrogpt_service.db_pool.acquire() as conn:
            # Count sublocations
            sublocation_count = await conn.fetchval("SELECT COUNT(*) FROM sublocations WHERE geom IS NOT NULL")
            sublocation_names = await conn.fetch("SELECT locname FROM sublocations WHERE geom IS NOT NULL ORDER BY locname")
            
            # Count statistics
            stats_count = await conn.fetchval("SELECT COUNT(*) FROM sublocation_statistics")
            stats_names = await conn.fetch("SELECT sublocation_name FROM sublocation_statistics ORDER BY sublocation_name")
            
            # Count water points
            waterpoint_count = await conn.fetchval("SELECT COUNT(*) FROM waterpoints WHERE geom IS NOT NULL")
            
            return {
                "sublocations": {
                    "count": sublocation_count,
                    "names": [row['locname'] for row in sublocation_names]
                },
                "statistics": {
                    "count": stats_count,
                    "names": [row['sublocation_name'] for row in stats_names]
                },
                "waterpoints": {
                    "count": waterpoint_count
                }
            }
    except Exception as e:
        return {"error": f"Debug query failed: {e}"}

@app.get("/api/water-points")
async def get_water_points():
    """Get water points data"""
    if not hydrogpt_service.db_pool:
        return {"error": "Database not connected"}
    
    try:
        async with hydrogpt_service.db_pool.acquire() as conn:
            water_points = await conn.fetch("""
                SELECT 
                    source as name,
                    water_sour as water_source,
                    capacitysc as capacity_score,
                    status,
                    ST_AsGeoJSON(ST_Transform(geom, 4326)) as geometry
                FROM waterpoints
                WHERE geom IS NOT NULL
            """)
        
        return {
            "type": "FeatureCollection", 
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "name": row['name'] or 'Unknown',
                        "water_source": row['water_source'] or 'Unknown',
                        "capacity_score": int(row['capacity_score']) if row['capacity_score'] else 1,
                        "status": row['status'] or 'Unknown'
                    },
                    "geometry": json.loads(row['geometry'])
                }
                for row in water_points
            ]
        }
    except Exception as e:
        return {"error": f"Water points query failed: {e}"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)