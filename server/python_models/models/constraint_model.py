# python_models/models/constraint_model.py
from typing import Dict, List, Set
from ..base.scheduler_interface import SchedulerInterface

class ConstraintModel(SchedulerInterface):
    """Timetable scheduler using constraint satisfaction approach"""
    
    def __init__(self):
        self.variables = []
        self.domains = {}
        self.constraints = []
    
    def generate_schedule(self, input_data: Dict) -> Dict:
        """Generate schedule using constraint satisfaction"""
        self._setup_problem(input_data)
        solution = self._solve_csp()
        return self._convert_to_schedule(solution, input_data)
    
    def _setup_problem(self, input_data: Dict):
        """Setup the CSP problem from input data"""
        # Define variables (events)
        self.variables = [event['id'] for event in input_data['events']]
        
        # Define domains (possible timeslots for each event)
        self.domains = {var: list(range(input_data['num_timeslots'])) for var in self.variables}
        
        # Define constraints
        self.constraints = []
        
        # Add teacher constraints
        teacher_events = {}
        for event in input_data['events']:
            if event['teacher'] not in teacher_events:
                teacher_events[event['teacher']] = []
            teacher_events[event['teacher']].append(event['id'])
        
        for teacher, events in teacher_events.items():
            for i, event1 in enumerate(events):
                for event2 in events[i+1:]:
                    self.constraints.append((event1, event2, 'diff'))
        
        # Add room constraints (if rooms are specified)
        room_events = {}
        for event in input_data['events']:
            if 'room' in event:
                if event['room'] not in room_events:
                    room_events[event['room']] = []
                room_events[event['room']].append(event['id'])
        
        for room, events in room_events.items():
            for i, event1 in enumerate(events):
                for event2 in events[i+1:]:
                    self.constraints.append((event1, event2, 'diff'))
        
        # Add student group constraints
        group_events = {}
        for event in input_data['events']:
            for group in event['student_groups']:
                if group not in group_events:
                    group_events[group] = []
                group_events[group].append(event['id'])
        
        for group, events in group_events.items():
            for i, event1 in enumerate(events):
                for event2 in events[i+1:]:
                    self.constraints.append((event1, event2, 'diff'))
    
    def _solve_csp(self) -> Dict:
        """Solve the CSP using backtracking"""
        assignment = {}
        return self._backtrack(assignment)
    
    def _backtrack(self, assignment: Dict) -> Dict:
        """Backtracking algorithm for CSP"""
        if len(assignment) == len(self.variables):
            return assignment
            
        var = self._select_unassigned_variable(assignment)
        for value in self._order_domain_values(var, assignment):
            if self._is_consistent(var, value, assignment):
                assignment[var] = value
                result = self._backtrack(assignment)
                if result is not None:
                    return result
                del assignment[var]
        return None
    
    def _select_unassigned_variable(self, assignment: Dict) -> str:
        """Select next unassigned variable (MRV heuristic)"""
        unassigned = [v for v in self.variables if v not in assignment]
        return min(unassigned, key=lambda v: len(self.domains[v]))
    
    def _order_domain_values(self, var: str, assignment: Dict) -> List[int]:
        """Order domain values (least constraining value heuristic)"""
        return sorted(self.domains[var])
    
    def _is_consistent(self, var: str, value: int, assignment: Dict) -> bool:
        """Check if assignment is consistent with constraints"""
        for (var1, var2, constraint) in self.constraints:
            if var1 == var or var2 == var:
                other_var = var1 if var2 == var else var2
                if other_var in assignment:
                    if constraint == 'diff' and assignment[other_var] == value:
                        return False
        return True
    
    def _convert_to_schedule(self, solution: Dict, input_data: Dict) -> Dict:
        """Convert CSP solution to timetable schedule"""
        if solution is None:
            return {'error': 'No solution found'}
            
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        # Group events by timeslot
        for event_id, timeslot in solution.items():
            if timeslot not in schedule['timeslots']:
                schedule['timeslots'][timeslot] = []
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
        if 'error' in schedule:
            return False
            
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
        if 'error' in schedule:
            return [{'type': 'No solution', 'message': schedule['error'], 'resources': []}]
            
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