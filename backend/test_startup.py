#!/usr/bin/env python3
"""
Test HydroGPT startup and database connection
"""
import asyncio
import os
from main import HydroGPTService

async def test_startup():
    """Test the startup process"""
    print("🚀 Testing HydroGPT Startup")
    print("=" * 40)
    
    # Create service
    service = HydroGPTService()
    
    # Test Claude initialization
    print("\n🤖 Testing Claude API...")
    await service.init_claude()
    
    # Test database initialization
    print("\n🗄️  Testing Database Connection...")
    await service.init_db()
    
    # Test database query
    if service.db_pool:
        print("\n📊 Testing Database Query...")
        try:
            context = await service.get_context_data("test query")
            print("✅ Database query successful!")
            print("Context data preview:")
            print(context[:200] + "..." if len(context) > 200 else context)
        except Exception as e:
            print(f"❌ Database query failed: {e}")
    else:
        print("❌ No database connection to test")
    
    # Close connection
    if service.db_pool:
        await service.db_pool.close()
        print("\n🔒 Database connection closed")

if __name__ == "__main__":
    asyncio.run(test_startup())