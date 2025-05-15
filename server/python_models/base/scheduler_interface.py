# python_models/base/scheduler_interface.py
from abc import ABC, abstractmethod
from typing import Dict, List, Optional

class SchedulerInterface(ABC):
    """Abstract base class for all timetable schedulers"""
    
    @abstractmethod
    def generate_schedule(self, input_data: Dict) -> Dict:
        """Generate timetable schedule from input data"""
        pass
    
    @abstractmethod
    def validate_schedule(self, schedule: Dict) -> bool:
        """Validate generated schedule meets constraints"""
        pass

    @abstractmethod
    def get_conflicts(self, schedule: Dict) -> List[Dict]:
        """Get list of conflicts in the schedule"""
        pass