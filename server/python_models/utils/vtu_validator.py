# python_models/utils/vtu_validator.py
from typing import Dict, List
import json

class VTUValidator:
    """Validator for VTU (University Timetabling) schema compliance"""
    
    @staticmethod
    def validate_input_schema(input_data: Dict) -> Dict:
        """
        Validate input data against VTU schema
        Returns dict with 'valid' bool and 'errors' list
        """
        errors = []
        
        # Check required top-level fields
        required_fields = ['events', 'teachers', 'student_groups', 'rooms']
        for field in required_fields:
            if field not in input_data:
                errors.append(f"Missing required field: {field}")
        
        # Validate events
        if 'events' in input_data:
            for i, event in enumerate(input_data['events']):
                if 'id' not in event:
                    errors.append(f"Event at index {i} missing 'id'")
                if 'name' not in event:
                    errors.append(f"Event at index {i} missing 'name'")
                if 'teacher' not in event:
                    errors.append(f"Event at index {i} missing 'teacher'")
                if 'student_groups' not in event:
                    errors.append(f"Event at index {i} missing 'student_groups'")
                elif not isinstance(event['student_groups'], list):
                    errors.append(f"Event {event.get('id', str(i))} student_groups should be a list")
        
        # Validate teachers
        if 'teachers' in input_data:
            for i, teacher in enumerate(input_data['teachers']):
                if 'id' not in teacher:
                    errors.append(f"Teacher at index {i} missing 'id'")
                if 'name' not in teacher:
                    errors.append(f"Teacher at index {i} missing 'name'")
        
        # Validate student groups
        if 'student_groups' in input_data:
            for i, group in enumerate(input_data['student_groups']):
                if 'id' not in group:
                    errors.append(f"Student group at index {i} missing 'id'")
                if 'name' not in group:
                    errors.append(f"Student group at index {i} missing 'name'")
        
        # Validate rooms
        if 'rooms' in input_data:
            for i, room in enumerate(input_data['rooms']):
                if 'id' not in room:
                    errors.append(f"Room at index {i} missing 'id'")
                if 'name' not in room:
                    errors.append(f"Room at index {i} missing 'name'")
                if 'capacity' not in room:
                    errors.append(f"Room at index {i} missing 'capacity'")
                elif not isinstance(room['capacity'], int):
                    errors.append(f"Room {room.get('id', str(i))} capacity should be integer")
                if 'equipment' not in room:
                    errors.append(f"Room at index {i} missing 'equipment'")
                elif not isinstance(room['equipment'], list):
                    errors.append(f"Room {room.get('id', str(i))} equipment should be list")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def validate_schedule(schedule: Dict) -> Dict:
        """
        Validate generated schedule against VTU schema
        Returns dict with 'valid' bool and 'errors' list
        """
        errors = []
        
        # Check required top-level fields
        required_fields = ['timeslots', 'events', 'teachers', 'rooms', 'student_groups']
        for field in required_fields:
            if field not in schedule:
                errors.append(f"Missing required field in schedule: {field}")
        
        # Validate timeslots
        if 'timeslots' in schedule:
            if not isinstance(schedule['timeslots'], dict):
                errors.append("Timeslots should be a dictionary")
            else:
                for timeslot, events in schedule['timeslots'].items():
                    if not isinstance(events, list):
                        errors.append(f"Timeslot {timeslot} events should be a list")
        
        # Validate events
        if 'events' in schedule:
            if not isinstance(schedule['events'], list):
                errors.append("Events should be a list")
        
        # Validate teacher assignments
        if 'teachers' in schedule:
            if not isinstance(schedule['teachers'], dict):
                errors.append("Teachers assignments should be a dictionary")
        
        # Validate room assignments
        if 'rooms' in schedule:
            if not isinstance(schedule['rooms'], dict):
                errors.append("Rooms assignments should be a dictionary")
        
        # Validate student group assignments
        if 'student_groups' in schedule:
            if not isinstance(schedule['student_groups'], dict):
                errors.append("Student groups assignments should be a dictionary")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    @staticmethod
    def check_for_conflicts(schedule: Dict) -> Dict:
        """
        Check for scheduling conflicts in the generated schedule
        Returns dict with 'conflicts_found' bool and 'conflicts' list
        """
        conflicts = []
        
        # Check teacher conflicts
        if 'teachers' in schedule:
            for teacher, assignments in schedule['teachers'].items():
                timeslots = [a['timeslot'] for a in assignments]
                if len(timeslots) != len(set(timeslots)):
                    conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                    conflicts.append({
                        'type': 'teacher',
                        'resource': teacher,
                        'timeslots': conflict_times,
                        'message': f"Teacher {teacher} has multiple assignments at times {conflict_times}"
                    })
        
        # Check room conflicts
        if 'rooms' in schedule:
            for room, assignments in schedule['rooms'].items():
                timeslots = [a['timeslot'] for a in assignments]
                if len(timeslots) != len(set(timeslots)):
                    conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                    conflicts.append({
                        'type': 'room',
                        'resource': room,
                        'timeslots': conflict_times,
                        'message': f"Room {room} has multiple assignments at times {conflict_times}"
                    })
        
        # Check student group conflicts
        if 'student_groups' in schedule:
            for group, assignments in schedule['student_groups'].items():
                timeslots = [a['timeslot'] for a in assignments]
                if len(timeslots) != len(set(timeslots)):
                    conflict_times = [t for t in timeslots if timeslots.count(t) > 1]
                    conflicts.append({
                        'type': 'student_group',
                        'resource': group,
                        'timeslots': conflict_times,
                        'message': f"Student group {group} has multiple assignments at times {conflict_times}"
                    })
        
        return {
            'conflicts_found': len(conflicts) > 0,
            'conflicts': conflicts
        }