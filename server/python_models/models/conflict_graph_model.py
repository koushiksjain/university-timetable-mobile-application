# python_models/models/conflict_graph_model.py
from typing import Dict, List, Set
import networkx as nx
from ..base.scheduler_interface import SchedulerInterface

class ConflictGraphModel(SchedulerInterface):
    """Timetable scheduler using conflict graph approach"""
    
    def __init__(self):
        self.graph = nx.Graph()
        self.resources = {
            'teachers': set(),
            'rooms': set(),
            'student_groups': set()
        }
    
    def generate_schedule(self, input_data: Dict) -> Dict:
        """Generate schedule using graph coloring approach"""
        self._build_graph(input_data)
        coloring = self._color_graph()
        return self._convert_to_schedule(coloring, input_data)
    
    def _build_graph(self, input_data: Dict):
        """Build conflict graph from input data"""
        # Add all events as nodes
        for event in input_data['events']:
            self.graph.add_node(event['id'], **event)
        
        # Add edges between conflicting events
        for i, event1 in enumerate(input_data['events']):
            for event2 in input_data['events'][i+1:]:
                if self._events_conflict(event1, event2):
                    self.graph.add_edge(event1['id'], event2['id'])
    
    def _events_conflict(self, event1: Dict, event2: Dict) -> bool:
        """Check if two events conflict (can't be scheduled at same time)"""
        # Check teacher conflict
        if event1['teacher'] == event2['teacher']:
            return True
            
        # Check room conflict if specified
        if 'room' in event1 and 'room' in event2 and event1['room'] == event2['room']:
            return True
            
        # Check student group conflict
        if set(event1['student_groups']).intersection(event2['student_groups']):
            return True
            
        return False
    
    def _color_graph(self) -> Dict:
        """Color the graph using greedy algorithm"""
        return nx.coloring.greedy_color(self.graph, strategy='largest_first')
    
    def _convert_to_schedule(self, coloring: Dict, input_data: Dict) -> Dict:
        """Convert graph coloring to timetable schedule"""
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        # Group events by color (timeslot)
        timeslot_events = {}
        for event_id, timeslot in coloring.items():
            if timeslot not in timeslot_events:
                timeslot_events[timeslot] = []
            timeslot_events[timeslot].append(event_id)
        
        # Build schedule structure
        for timeslot, event_ids in timeslot_events.items():
            schedule['timeslots'][timeslot] = []
            for event_id in event_ids:
                event = next(e for e in input_data['events'] if e['id'] == event_id)
                schedule['timeslots'][timeslot].append(event)
                schedule['events'].append(event)
                
                # Track teacher schedules
                if event['teacher'] not in schedule['teachers']:
                    schedule['teachers'][event['teacher']] = []
                schedule['teachers'][event['teacher']].append({
                    'timeslot': timeslot,
                    'event': event
                })
                
                # Track room usage if specified
                if 'room' in event:
                    if event['room'] not in schedule['rooms']:
                        schedule['rooms'][event['room']] = []
                    schedule['rooms'][event['room']].append({
                        'timeslot': timeslot,
                        'event': event
                    })
                
                # Track student group schedules
                for group in event['student_groups']:
                    if group not in schedule['student_groups']:
                        schedule['student_groups'][group] = []
                    schedule['student_groups'][group].append({
                        'timeslot': timeslot,
                        'event': event
                    })
        
        return schedule
    
    def validate_schedule(self, schedule: Dict) -> bool:
        """Validate the generated schedule"""
        # Check for teacher conflicts
        for teacher, assignments in schedule['teachers'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                return False
                
        # Check for room conflicts
        for room, assignments in schedule['rooms'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                return False
                
        # Check for student group conflicts
        for group, assignments in schedule['student_groups'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                return False
                
        return True
    
    def get_conflicts(self, schedule: Dict) -> List[Dict]:
        """Get list of conflicts in the schedule"""
        conflicts = []
        
        # Check teacher conflicts
        for teacher, assignments in schedule['teachers'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                conflicts.append({
                    'type': 'Teacher conflict',
                    'message': f"Teacher {teacher} scheduled for multiple events at times {conflict_times}",
                    'resources': [teacher]
                })
        
        # Check room conflicts
        for room, assignments in schedule['rooms'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                conflicts.append({
                    'type': 'Room conflict',
                    'message': f"Room {room} scheduled for multiple events at times {conflict_times}",
                    'resources': [room]
                })
        
        # Check student group conflicts
        for group, assignments in schedule['student_groups'].items():
            timeslots = [a['timeslot'] for a in assignments]
            if len(timeslots) != len(set(timeslots)):
                conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                conflicts.append({
                    'type': 'Student group conflict',
                    'message': f"Group {group} scheduled for multiple events at times {conflict_times}",
                    'resources': [group]
                })
        
        return conflicts