# python_models/base/output_parser.py
import json
from typing import Dict, List

class OutputParser:
    """Class for parsing and formatting scheduler output"""
    
    @staticmethod
    def parse_to_json(schedule: Dict) -> str:
        """Convert schedule dictionary to JSON string"""
        return json.dumps(schedule, indent=2)
    
    @staticmethod
    def parse_conflicts(conflicts: List[Dict]) -> str:
        """Format conflicts into readable string"""
        if not conflicts:
            return "No conflicts found"
            
        conflict_str = "Found conflicts:\n"
        for i, conflict in enumerate(conflicts, 1):
            conflict_str += f"{i}. {conflict['type']}: {conflict['message']}\n"
            conflict_str += f"   Involved: {conflict['resources']}\n"
        return conflict_str
    
    @staticmethod
    def format_schedule_summary(schedule: Dict) -> str:
        """Create human-readable summary of schedule"""
        summary = f"Schedule Summary:\n"
        summary += f"- Total events scheduled: {len(schedule['events'])}\n"
        summary += f"- Rooms utilized: {len(schedule['rooms'])}\n"
        summary += f"- Teachers scheduled: {len(schedule['teachers'])}\n"
        summary += f"- Student groups covered: {len(schedule['student_groups'])}\n"
        return summary