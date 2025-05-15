# python_models/models/multiagent_model.py
from typing import Dict, List, Set
from ..base.scheduler_interface import SchedulerInterface

class MultiAgentModel(SchedulerInterface):
    """Timetable scheduler using multi-agent approach"""
    
    def __init__(self):
        self.agents = {
            'course_owners': {},
            'timetable': {},
            'mediator': {},
            'students': {},
            'lifelong_learning': {},
            'educational_programs': {},
            'scene': {}
        }
    
    def generate_schedule(self, input_data: Dict) -> Dict:
        """Generate schedule using multi-agent approach"""
        self._initialize_agents(input_data)
        return self._run_negotiation()
    
    def _initialize_agents(self, input_data: Dict):
        """Initialize all agents from input data"""
        # Course Owner Agents (COA)
        for course in input_data.get('courses', []):
            self.agents['course_owners'][course['id']] = {
                'course': course,
                'student_groups': course.get('student_groups', []),
                'teacher': course.get('teacher'),
                'requirements': course.get('requirements', {})
            }
        
        # Timetable Agent (TA)
        self.agents['timetable'] = {
            'courses': input_data.get('courses', []),
            'shared_courses': input_data.get('shared_courses', []),
            'curricula': input_data.get('curricula', []),
            'student_groups': input_data.get('student_groups', []),
            'rooms': input_data.get('rooms', []),
            'teachers': input_data.get('teachers', [])
        }
        
        # Mediator Agent (MA)
        self.agents['mediator'] = {
            'shared_courses': input_data.get('shared_courses', []),
            'university_rooms': input_data.get('university_rooms', [])
        }
        
        # Student Agents (StA)
        for group in input_data.get('student_groups', []):
            self.agents['students'][group['id']] = {
                'group': group,
                'electives': group.get('electives', []),
                'schedule': {}
            }
        
        # Lifelong Learning Program Agent (LLPA)
        self.agents['lifelong_learning'] = {
            'courses': input_data.get('lifelong_courses', []),
            'teachers': input_data.get('lifelong_teachers', []),
            'rooms': input_data.get('lifelong_rooms', [])
        }
        
        # Educational Program Agent (EPA)
        self.agents['educational_programs'] = {
            'programs': input_data.get('programs', []),
            'curricula': input_data.get('curricula', [])
        }
        
        # Scene Agent (SA)
        self.agents['scene'] = {
            'calendar_events': [],
            'rooms': input_data.get('rooms', []),
            'teachers': input_data.get('teachers', []),
            'student_groups': input_data.get('student_groups', [])
        }
    
    def _run_negotiation(self) -> Dict:
        """Run the multi-agent negotiation process"""
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        # Protocol P1: TA receives teaching groups with teachers, preferences
        for course_id, coa in self.agents['course_owners'].items():
            self.agents['timetable']['courses'].append({
                'id': course_id,
                'teacher': coa['teacher'],
                'student_groups': coa['student_groups'],
                'requirements': coa['requirements']
            })
        
        # Protocol P2: MA receives shared courses and resolves conflicts
        shared_schedule = self._schedule_shared_courses()
        schedule = self._merge_schedules(schedule, shared_schedule)
        
        # Protocol P3: COA receives orders for semester courses
        for course_id, coa in self.agents['course_owners'].items():
            if course_id not in [c['id'] for c in shared_schedule['events']]:
                course_schedule = self._schedule_course(coa)
                schedule = self._merge_schedules(schedule, course_schedule)
        
        # Protocol P4: COA receives registration for electives
        for student_id, sta in self.agents['students'].items():
            for elective in sta['electives']:
                elective_schedule = self._schedule_elective(elective, student_id)
                schedule = self._merge_schedules(schedule, elective_schedule)
        
        # Protocol P5: SA receives course activities
        self.agents['scene']['calendar_events'] = schedule['events']
        
        return schedule
    
    def _schedule_shared_courses(self) -> Dict:
        """Schedule shared courses using mediator agent"""
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        for course in self.agents['mediator']['shared_courses']:
            # Find available timeslot with required room
            scheduled = False
            for timeslot in range(40):  # Assuming 40 timeslots (5 days * 8 hours)
                room_available = self._check_room_available(
                    course.get('required_room'), 
                    timeslot, 
                    schedule
                )
                
                teacher_available = self._check_teacher_available(
                    course['teacher'],
                    timeslot,
                    schedule
                )
                
                groups_available = all(
                    self._check_group_available(group, timeslot, schedule)
                    for group in course['student_groups']
                )
                
                if room_available and teacher_available and groups_available:
                    # Schedule the course
                    event = {
                        'id': f"{course['id']}_{timeslot}",
                        'name': course['name'],
                        'type': 'shared',
                        'teacher': course['teacher'],
                        'student_groups': course['student_groups'],
                        'timeslot': timeslot
                    }
                    if 'required_room' in course:
                        event['room'] = course['required_room']
                    
                    schedule['events'].append(event)
                    if timeslot not in schedule['timeslots']:
                        schedule['timeslots'][timeslot] = []
                    schedule['timeslots'][timeslot].append(event)
                    
                    # Update teacher schedule
                    if course['teacher'] not in schedule['teachers']:
                        schedule['teachers'][course['teacher']] = []
                    schedule['teachers'][course['teacher']].append({
                        'timeslot': timeslot,
                        'event': event
                    })
                    
                    # Update room schedule if specified
                    if 'room' in event:
                        if event['room'] not in schedule['rooms']:
                            schedule['rooms'][event['room']] = []
                        schedule['rooms'][event['room']].append({
                            'timeslot': timeslot,
                            'event': event
                        })
                    
                    # Update student group schedules
                    for group in course['student_groups']:
                        if group not in schedule['student_groups']:
                            schedule['student_groups'][group] = []
                        schedule['student_groups'][group].append({
                            'timeslot': timeslot,
                            'event': event
                        })
                    
                    scheduled = True
                    break
            
            if not scheduled:
                print(f"Warning: Could not schedule shared course {course['id']}")
        
        return schedule
    
    def _schedule_course(self, course: Dict) -> Dict:
        """Schedule a regular course using course owner agent"""
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        # Simple scheduling - just find first available timeslot
        for timeslot in range(40):  # Assuming 40 timeslots (5 days * 8 hours)
            teacher_available = self._check_teacher_available(
                course['teacher'],
                timeslot,
                schedule
            )
            
            groups_available = all(
                self._check_group_available(group, timeslot, schedule)
                for group in course['student_groups']
            )
            
            if teacher_available and groups_available:
                # Schedule the course
                event = {
                    'id': f"{course['course']['id']}_{timeslot}",
                    'name': course['course']['name'],
                    'type': 'regular',
                    'teacher': course['teacher'],
                    'student_groups': course['student_groups'],
                    'timeslot': timeslot
                }
                
                schedule['events'].append(event)
                if timeslot not in schedule['timeslots']:
                    schedule['timeslots'][timeslot] = []
                schedule['timeslots'][timeslot].append(event)
                
                # Update teacher schedule
                if course['teacher'] not in schedule['teachers']:
                    schedule['teachers'][course['teacher']] = []
                schedule['teachers'][course['teacher']].append({
                    'timeslot': timeslot,
                    'event': event
                })
                
                # Update student group schedules
                for group in course['student_groups']:
                    if group not in schedule['student_groups']:
                        schedule['student_groups'][group] = []
                    schedule['student_groups'][group].append({
                        'timeslot': timeslot,
                        'event': event
                    })
                
                break
        
        return schedule
    
    def _schedule_elective(self, elective: Dict, student_id: str) -> Dict:
        """Schedule an elective course for a student"""
        schedule = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {},
            'students': {}
        }
        
        # Find the student group
        group_id = None
        for group in self.agents['students'].values():
            if student_id == group['group']['id']:
                group_id = student_id
                break
        
        if not group_id:
            return schedule
        
        # Simple scheduling - just find first available timeslot
        for timeslot in range(40):  # Assuming 40 timeslots (5 days * 8 hours)
            teacher_available = self._check_teacher_available(
                elective['teacher'],
                timeslot,
                schedule
            )
            
            group_available = self._check_group_available(group_id, timeslot, schedule)
            
            if teacher_available and group_available:
                # Schedule the elective
                event = {
                    'id': f"{elective['id']}_{timeslot}",
                    'name': elective['name'],
                    'type': 'elective',
                    'teacher': elective['teacher'],
                    'student_groups': [group_id],
                    'timeslot': timeslot
                }
                
                schedule['events'].append(event)
                if timeslot not in schedule['timeslots']:
                    schedule['timeslots'][timeslot] = []
                schedule['timeslots'][timeslot].append(event)
                
                # Update teacher schedule
                if elective['teacher'] not in schedule['teachers']:
                    schedule['teachers'][elective['teacher']] = []
                schedule['teachers'][elective['teacher']].append({
                    'timeslot': timeslot,
                    'event': event
                })
                
                # Update student group schedule
                if group_id not in schedule['student_groups']:
                    schedule['student_groups'][group_id] = []
                schedule['student_groups'][group_id].append({
                    'timeslot': timeslot,
                    'event': event
                })
                
                # Update individual student schedule
                if student_id not in schedule['students']:
                    schedule['students'][student_id] = []
                schedule['students'][student_id].append({
                    'timeslot': timeslot,
                    'event': event
                })
                
                break
        
        return schedule
    
    def _check_room_available(self, room_id: str, timeslot: int, schedule: Dict) -> bool:
        """Check if a room is available at given timeslot"""
        if not room_id:
            return True
            
        if room_id in schedule['rooms']:
            for assignment in schedule['rooms'][room_id]:
                if assignment['timeslot'] == timeslot:
                    return False
        return True
    
    def _check_teacher_available(self, teacher_id: str, timeslot: int, schedule: Dict) -> bool:
        """Check if a teacher is available at given timeslot"""
        if teacher_id in schedule['teachers']:
            for assignment in schedule['teachers'][teacher_id]:
                if assignment['timeslot'] == timeslot:
                    return False
        return True
    
    def _check_group_available(self, group_id: str, timeslot: int, schedule: Dict) -> bool:
        """Check if a student group is available at given timeslot"""
        if group_id in schedule['student_groups']:
            for assignment in schedule['student_groups'][group_id]:
                if assignment['timeslot'] == timeslot:
                    return False
        return True
    
    def _merge_schedules(self, schedule1: Dict, schedule2: Dict) -> Dict:
        """Merge two schedules together"""
        merged = {
            'timeslots': {},
            'events': [],
            'teachers': {},
            'rooms': {},
            'student_groups': {}
        }
        
        # Merge timeslots
        for timeslot, events in schedule1['timeslots'].items():
            merged['timeslots'][timeslot] = events.copy()
        for timeslot, events in schedule2['timeslots'].items():
            if timeslot in merged['timeslots']:
                merged['timeslots'][timeslot].extend(events)
            else:
                merged['timeslots'][timeslot] = events.copy()
        
        # Merge events
        merged['events'] = schedule1['events'] + schedule2['events']
        
        # Merge teachers
        for teacher, assignments in schedule1['teachers'].items():
            merged['teachers'][teacher] = assignments.copy()
        for teacher, assignments in schedule2['teachers'].items():
            if teacher in merged['teachers']:
                merged['teachers'][teacher].extend(assignments)
            else:
                merged['teachers'][teacher] = assignments.copy()
        
        # Merge rooms
        for room, assignments in schedule1['rooms'].items():
            merged['rooms'][room] = assignments.copy()
        for room, assignments in schedule2['rooms'].items():
            if room in merged['rooms']:
                merged['rooms'][room].extend(assignments)
            else:
                merged['rooms'][room] = assignments.copy()
        
        # Merge student groups
        for group, assignments in schedule1['student_groups'].items():
            merged['student_groups'][group] = assignments.copy()
        for group, assignments in schedule2['student_groups'].items():
            if group in merged['student_groups']:
                merged['student_groups'][group].extend(assignments)
            else:
                merged['student_groups'][group] = assignments.copy()
        
        return merged
    
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